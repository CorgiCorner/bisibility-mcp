import { readFileSync } from "node:fs";
import { BisibilityClient } from "@bisibility/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { expect, it } from "vitest";
import { createBisibilityMcpServer } from "../src/index.js";
const run = JSON.parse(
  readFileSync(new URL("./fixtures/rank-check-run.json", import.meta.url), "utf8"),
);
it("reads unlaunched outcomes through retained SDK GETs in read-only MCP sessions", async () => {
  const requests: URL[] = [];
  const sdk = new BisibilityClient({
    apiKey: "bsb_key_test_transport_fixture",
    baseUrl: "https://api.example.com/api/v1",
    maxRetries: 0,
    fetch: async (input, init) => {
      expect(init?.method ?? "GET").toBe("GET");
      const url = new URL(String(input));
      if (url.pathname.endsWith("/capabilities"))
        return new Response(JSON.stringify({ data: [], apiVersions: ["v1"] }));
      requests.push(url);
      return new Response(
        JSON.stringify(
          url.pathname.endsWith(run.id)
            ? run
            : { data: [run], meta: { next_cursor: "opaque+cursor/=" } },
        ),
      );
    },
  });
  const server = createBisibilityMcpServer({
    client: sdk,
    readOnly: true,
    toolsets: ["rank-history"],
  });
  const client = new Client({ name: "retained-run-test", version: "1" });
  const [a, b] = InMemoryTransport.createLinkedPair();
  await server.connect(a);
  await client.connect(b);
  try {
    const tools = (await client.listTools()).tools;
    for (const name of ["list_rank_check_runs", "get_rank_check_run"]) {
      const tool = tools.find((t) => t.name.endsWith(name));
      if (!tool) throw new Error("retained run tool missing");
      expect(tool.annotations?.readOnlyHint).toBe(true);
      const result = await client.callTool({
        name: tool.name,
        arguments: {
          project_id: run.project_id,
          ...(name === "get_rank_check_run"
            ? { run_id: run.id }
            : { segment: "planned", cursor: "opaque+cursor/=" }),
        },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual(
        name === "get_rank_check_run"
          ? run
          : { data: [run], meta: { next_cursor: "opaque+cursor/=" } },
      );
    }
    expect(requests).toHaveLength(2);
    expect(requests[0]?.searchParams.get("cursor")).toBe("opaque+cursor/=");
    expect(requests[1]?.pathname).toContain(run.id);
  } finally {
    await client.close();
    await server.close();
  }
});
