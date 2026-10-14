import { readFileSync } from "node:fs";
import { BisibilityClient } from "@bisibility/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, expect, it, vi } from "vitest";
import { createBisibilityMcpServer } from "../src/index.js";
import { exportRankHistoryInputSchema } from "../src/schemas.js";

const fixture: Record<string, unknown> = JSON.parse(
  readFileSync(new URL("./fixtures/rank-history-report.json", import.meta.url), "utf8"),
);
const project = "prj_abcdefghijklmnopqrstuvwx";
const keyword = "kw_abcdefghijklmnopqrstuvwx";
afterEach(() => vi.unstubAllEnvs());

it.each([{}, { version: "1", stream: "observations", basis: "recorded_at", aggregation: "none" }])(
  "retains the legacy envelope with authoritative v1 defaults %j",
  async (options) => {
    vi.stubEnv("BISIBILITY_PROJECT_ID", "");
    const requests: { url: URL; method: string | undefined }[] = [];
    const sdk = new BisibilityClient({
      apiKey: "bsb_key_test_transport_fixture",
      baseUrl: "https://api.example.com/api/v1",
      maxRetries: 0,
      fetch: async (input, init) => {
        const url = new URL(String(input));
        if (url.pathname.endsWith("/capabilities"))
          return Response.json({ data: [], apiVersions: ["v1"] });
        requests.push({ url, method: init?.method });
        return Response.json(fixture.legacy);
      },
    });
    const server = createBisibilityMcpServer({
      client: sdk,
      readOnly: true,
      toolsets: ["rank-history"],
    });
    const client = new Client({ name: "legacy-export-fixture", version: "1" });
    const [a, b] = InMemoryTransport.createLinkedPair();
    await server.connect(b);
    await client.connect(a);
    try {
      const result = await client.callTool({
        name: "export_rank_history",
        arguments: { project_id: project, ...options },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual(fixture.legacy);
      expect(requests).toHaveLength(1);
      expect(requests[0]?.method).toBe("GET");
      expect(requests[0]?.url.pathname).toBe(`/api/v1/projects/${project}/exports/rank-history`);
      expect(Object.fromEntries(requests[0]?.url.searchParams ?? [])).toEqual({
        format: "json",
        ...options,
      });
    } finally {
      await client.close();
      await server.close();
    }
  },
);

it.each(["observations", "recorded", "attempts", "full_attempts"])(
  "serves and transports the actual %s record/quality envelope",
  async (stream) => {
    vi.stubEnv("BISIBILITY_PROJECT_ID", "");
    const requests: URL[] = [];
    const sdk = new BisibilityClient({
      apiKey: "bsb_key_test_transport_fixture",
      baseUrl: "https://api.example.com/api/v1",
      maxRetries: 0,
      fetch: async (input, init) => {
        expect(init?.method).toBe("GET");
        const url = new URL(String(input));
        if (url.pathname.endsWith("/capabilities"))
          return new Response(JSON.stringify({ data: [], apiVersions: ["v1"] }));
        requests.push(url);
        return new Response(JSON.stringify(fixture[stream]));
      },
    });
    const server = createBisibilityMcpServer({
      client: sdk,
      readOnly: true,
      toolsets: ["rank-history"],
    });
    const client = new Client({ name: "transport-fixture", version: "1" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);
    try {
      const listed = await client.listTools();
      const tool = listed.tools.find((item) => item.name.endsWith("export_rank_history"));
      if (!tool) throw new Error("Export tool is not served");
      expect(tool.inputSchema.properties).toMatchObject({
        version: { enum: ["1", "2"] },
        cursor: { maxLength: 8192 },
      });
      const result = await client.callTool({
        name: tool.name,
        arguments: {
          project_id: project,
          version: "2",
          stream: stream.includes("attempts") ? "attempts" : "observations",
          basis: stream === "observations" ? "observed_at" : "recorded_at",
          aggregation: "none",
          from: "1970-01-01T00:00:00Z",
          to: "2026-10-12T12:00:00Z",
          range: "all",
          ...(stream === "full_attempts" ? {} : { keyword_ids: [keyword] }),
          limit: stream === "attempts" ? 1 : 200,
        },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual(fixture[stream]);
      expect(requests).toHaveLength(1);
      expect(Object.fromEntries(requests[0]?.searchParams ?? [])).toMatchObject({
        version: "2",
        aggregation: "none",
        basis: stream === "observations" ? "observed_at" : "recorded_at",
        from: "1970-01-01T00:00:00Z",
        to: "2026-10-12T12:00:00Z",
        ...(stream === "full_attempts" ? {} : { keyword_id: keyword }),
        limit: stream === "attempts" ? "1" : "200",
      });
    } finally {
      try {
        await client.close();
      } finally {
        await server.close();
      }
    }
  },
);

it("refuses unsupported version/scope/window combinations before any SDK or provider request", () => {
  for (const value of [
    { version: "2", cursor: "x".repeat(8193) },
    { version: "2", granularity: "weekly" },
    { version: "2", stream: "attempts", basis: "observed_at" },
    { version: "1", from: "1970-01-01T00:00:00Z", to: "2026-01-02T00:00:00Z" },
    { version: "2", from: "2026-01-02T00:00:00Z" },
    { version: "2", keyword_ids: [keyword, keyword] },
    { project_id: keyword },
  ])
    expect(() => exportRankHistoryInputSchema.parse({ project_id: project, ...value })).toThrow();
  expect(
    exportRankHistoryInputSchema.parse({
      project_id: project,
      cursor: "opaque+/.".repeat(512),
      version: "2",
    }).cursor,
  ).toBe("opaque+/.".repeat(512));
});

it("serves all actual signed pages with exact selection, original run IDs and nested DTOs", async () => {
  vi.stubEnv("BISIBILITY_PROJECT_ID", "");
  const pages = fixture.attempt_pages;
  if (!Array.isArray(pages)) throw new Error("Missing actual signed pages");
  let index = 0;
  const requests: URL[] = [];
  const sdk = new BisibilityClient({
    apiKey: "bsb_key_test_transport_fixture",
    baseUrl: "https://api.example.com/api/v1",
    maxRetries: 0,
    fetch: async (input) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/capabilities")) return new Response(JSON.stringify({ data: [] }));
      requests.push(url);
      return new Response(JSON.stringify(pages[index++]));
    },
  });
  const server = createBisibilityMcpServer({
    client: sdk,
    readOnly: true,
    toolsets: ["rank-history"],
  });
  const client = new Client({ name: "transport-fixture", version: "1" });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(b);
  await client.connect(a);
  try {
    const tool = (await client.listTools()).tools.find((item) =>
      item.name.endsWith("export_rank_history"),
    );
    if (!tool) throw new Error("Export tool missing");
    for (const [index, page] of pages.entries()) {
      const result = await client.callTool({
        name: tool.name,
        arguments: {
          project_id: project,
          version: "2",
          stream: "attempts",
          basis: "recorded_at",
          aggregation: "none",
          range: "all",
          from: "1970-01-01T00:00:00Z",
          to: "2026-10-12T12:00:00Z",
          keyword_ids: [keyword],
          limit: 1,
          ...(index > 0 ? { cursor: pages[index - 1].meta.next_cursor } : {}),
        },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual(page);
    }
    expect(requests).toHaveLength(pages.length);
    expect(requests.slice(1).map((url) => url.searchParams.get("cursor"))).toEqual(
      pages.slice(0, -1).map((page) => page.meta.next_cursor),
    );
    for (const url of requests)
      expect(Object.fromEntries(url.searchParams)).toMatchObject({
        version: "2",
        stream: "attempts",
        basis: "recorded_at",
        range: "all",
        from: "1970-01-01T00:00:00Z",
        to: "2026-10-12T12:00:00Z",
        keyword_id: keyword,
        limit: "1",
      });
  } finally {
    try {
      await client.close();
    } finally {
      await server.close();
    }
  }
});
