import { BisibilityClient } from "@bisibility/sdk";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it, vi } from "vitest";
import { getCostEstimateInputSchema } from "../src/schemas.js";
import { registerBisibilityTools } from "../src/tools.js";

function harness(data: unknown = {}) {
  const requests: URL[] = [];
  const fetch = vi.fn<typeof globalThis.fetch>(async (input) => {
    const url = new URL(String(input));
    if (url.pathname.endsWith("/capabilities")) {
      return Response.json({ apiVersions: ["v1"], data: [] });
    }
    requests.push(url);
    return Response.json({ data });
  });
  type Handler = (input: unknown) => Promise<{
    isError?: boolean;
    structuredContent?: unknown;
  }>;
  const tools = new Map<string, Handler>();
  const server = {
    registerTool: (name: string, _config: unknown, handler: Handler) => tools.set(name, handler),
  };
  registerBisibilityTools(server as unknown as McpServer, {
    client: new BisibilityClient({ baseUrl: "https://api.example.com/api/v1", fetch }),
    readOnly: true,
    toolsets: ["providers"],
  });
  const call = tools.get("get_cost_estimate");
  if (!call) throw new Error("Expected the cost estimate tool");
  const request = () => {
    const first = requests[0];
    if (!first) throw new Error("Expected a cost estimate request");
    return first;
  };
  return { call, request, requests };
}

describe("cost estimate transport", () => {
  it.each([10, 20, 50, 100])(
    "passes depth %s and custom cadence through the real SDK",
    async (depth) => {
      const data = { monthly_cost_cents: 120, result_pages_per_run: 12 };
      const { call, request } = harness(data);
      const result = await call({
        cron_expression: "0 7 * * 1",
        depth,
        frequency: "custom_cron",
        keywords: 12,
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual({ data });
      expect(Object.fromEntries(request().searchParams)).toEqual({
        cron_expression: "0 7 * * 1",
        depth: String(depth),
        frequency: "custom_cron",
        keywords: "12",
      });
    },
  );

  it.each(["manual", "paused"])(
    "accepts %s without inventing a monthly cost",
    async (frequency) => {
      const data = { monthly_cost_cents: 0, runs_per_month: 0 };
      const { call, request } = harness(data);
      expect((await call({ frequency, keywords: 12 })).structuredContent).toEqual({ data });
      expect(request().searchParams.get("frequency")).toBe(frequency);
    },
  );

  it.each([undefined, "", "invalid cron"])(
    "preserves unknown estimates for cron %s",
    async (cron) => {
      const data = { monthly_cost_cents: null, runs_per_month: null };
      const { call, request } = harness(data);
      expect(
        (await call({ cron_expression: cron, frequency: "custom_cron", keywords: 12 }))
          .structuredContent,
      ).toEqual({ data });
      expect(request().searchParams.get("cron_expression")).toBe(cron ?? null);
    },
  );

  it.each([0, 11, 101, 10.5, "20"])(
    "rejects unsupported depth %s before requesting",
    async (depth) => {
      const { call, requests } = harness();
      expect((await call({ depth, keywords: 12 })).isError).toBe(true);
      expect(requests).toHaveLength(0);
    },
  );

  it("keeps defaults server-owned and bounds custom cadence text", () => {
    expect(getCostEstimateInputSchema.parse({ keywords: 12 })).toEqual({ keywords: 12 });
    expect(() =>
      getCostEstimateInputSchema.parse({ cron_expression: "x".repeat(121), keywords: 12 }),
    ).toThrow();
    expect(
      getCostEstimateInputSchema.parse({ cron_expression: "  0 7 * * 1  ", keywords: 12 }),
    ).toMatchObject({ cron_expression: "0 7 * * 1" });
  });
});
