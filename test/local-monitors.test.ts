import { readFileSync } from "node:fs";
import { BisibilityClient } from "@bisibility/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterEach, expect, it, vi } from "vitest";
import { createBisibilityMcpServer } from "../src/index.js";
const fixture: Record<string, unknown> = JSON.parse(
  readFileSync(new URL("./fixtures/local-monitor-transport.json", import.meta.url), "utf8"),
);
const project = "prj_abcdefghijklmnopqrstuvwx";
const monitor = "lmn_abcdefghijklmnopqrstuvwx";
const run = "lmr_abcdefghijklmnopqrstuvwx";
const point = "lmt_aaaaaaaaaaaaaaaaaaaaaaa0";
afterEach(() => vi.unstubAllEnvs());
it("serves all five authoritative Local schemas and retains every real server field through the SDK", async () => {
  vi.stubEnv("BISIBILITY_PROJECT_ID", "");
  const requests: URL[] = [];
  let body: unknown;
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
      return new Response(JSON.stringify(body));
    },
  });
  const server = createBisibilityMcpServer({
    client: sdk,
    readOnly: true,
    toolsets: ["rank-history"],
  });
  const client = new Client({ name: "local-transport", version: "1" });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(b);
  await client.connect(a);
  try {
    const listed = (await client.listTools()).tools;
    const cases = [
      ["list_local_monitor_runs", "history"],
      ["get_local_monitor_run_results", "result"],
      ["list_local_monitor_point_listings", "listings"],
      ["list_local_monitor_point_history", "point_history"],
      ["export_local_monitor_run", "export_json"],
    ] as const;
    for (const [name, key] of cases) {
      const tool = listed.find((t) => t.name.endsWith(name));
      if (!tool) throw new Error("Local tool missing");
      expect(tool.annotations).toMatchObject({ readOnlyHint: true, openWorldHint: false });
      if (key === "history" || key === "point_history")
        expect(tool.inputSchema.properties).toMatchObject({
          cursor: { minLength: 1, maxLength: 8000 },
          from: { format: "date-time" },
          to: { format: "date-time" },
        });
      body = fixture[key];
      const result = await client.callTool({
        name: tool.name,
        arguments: {
          project_id: project,
          monitor_id: monitor,
          ...(key === "history" ? {} : { run_id: run }),
          ...(key === "listings" || key === "point_history" ? { target_id: point } : {}),
          as_of: "2026-10-12T12:00:00.000Z",
          ...(key === "history" || key === "point_history"
            ? {
                cursor: "c".repeat(8000),
                from: "2026-10-12T00:00:00.000Z",
                to: "2026-10-12T12:00:00.000Z",
              }
            : {}),
        },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual(body);
    }
    expect(requests).toHaveLength(5);
    const byPath = new Map(requests.map((request) => [request.pathname, request]));
    const monitorPath = `/api/v1/projects/${project}/local-monitors/${monitor}`;
    const runHistory = byPath.get(`${monitorPath}/runs`);
    const pointHistory = byPath.get(`${monitorPath}/runs/${run}/points/${point}/history`);
    const exported = byPath.get(`${monitorPath}/runs/${run}/export`);
    expect(runHistory?.searchParams.get("cursor")).toHaveLength(8000);
    expect(pointHistory?.searchParams.get("cursor")).toHaveLength(8000);
    for (const request of requests)
      expect(request.searchParams.get("as_of")).toBe("2026-10-12T12:00:00.000Z");
    for (const request of [runHistory, pointHistory]) {
      expect(request?.searchParams.get("from")).toBe("2026-10-12T00:00:00.000Z");
      expect(request?.searchParams.get("to")).toBe("2026-10-12T12:00:00.000Z");
    }
    expect(exported?.searchParams.get("format")).toBe("json");
    expect(exported?.searchParams.get("version")).toBe("1");
    const history = listed.find((t) => t.name.endsWith("list_local_monitor_runs"));
    if (!history) throw new Error("Missing history tool");
    for (const cursor of ["", "x".repeat(8001)])
      expect(
        (
          await client.callTool({
            name: history.name,
            arguments: { project_id: project, monitor_id: monitor, cursor },
          })
        ).isError,
      ).toBe(true);
    expect(requests).toHaveLength(5);
    const future = JSON.parse(JSON.stringify(fixture.result));
    future.data.points[0].freshness = "future_freshness";
    future.data.points[0].zoom = 5.5;
    future.data.freshness_policy.basis = "future_policy";
    body = future;
    const resultTool = listed.find((tool) => tool.name.endsWith("get_local_monitor_run_results"));
    if (!resultTool) throw new Error("Missing results tool");
    const futureResult = await client.callTool({
      name: resultTool.name,
      arguments: {
        project_id: project,
        monitor_id: monitor,
        run_id: run,
      },
    });
    expect(futureResult.isError).not.toBe(true);
    expect(futureResult.structuredContent).toEqual(future);
    expect(requests).toHaveLength(6);
  } finally {
    try {
      await client.close();
    } finally {
      await server.close();
    }
  }
});
