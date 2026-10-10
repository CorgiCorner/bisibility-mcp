import { readFileSync } from "node:fs";
import { BisibilityClient } from "@bisibility/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { expect, it } from "vitest";
import { createBisibilityMcpServer } from "../src/index.js";

const fixture = JSON.parse(readFileSync("test/fixtures/response-compatibility.json", "utf8"));

it("preserves application responses through the real SDK and tools/call transport", async () => {
  let body: unknown;
  let status = 200;
  const sdk = new BisibilityClient({
    apiKey: "bsb_key_test_fixture",
    baseUrl: "https://example.com/api/v1",
    fetch: async (input) => {
      const capabilities = String(input).endsWith("/capabilities");
      return new Response(JSON.stringify(capabilities ? { apiVersions: ["v1"], data: [] } : body), {
        status: capabilities ? 200 : status,
        headers: { "content-type": "application/json" },
      });
    },
  });
  const server = createBisibilityMcpServer({
    client: sdk,
    readOnly: false,
    toolsets: ["keywords", "checks", "backlinks"],
  });
  const client = new Client({ name: "response-evidence-test", version: "0.0.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  try {
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    for (const source of [
      fixture.full_backlinks,
      fixture.partial_backlinks,
      fixture.page_backlinks,
    ]) {
      body = source.body;
      const result = await client.callTool({
        name: "analyze_backlinks",
        arguments: { project_id: "prj_a00000000000000000000000", target: "example.com" },
      });
      expect(result.isError).not.toBe(true);
      expect(result.structuredContent).toEqual(source.body);
    }
    for (const observation of fixture.ranks) {
      for (const [name, source, args] of [
        ["get_keyword", observation.keyword, { keyword_id: observation.keyword.id }],
        ["get_rank_check_result", observation.check, { check_id: observation.check.id }],
      ] as const) {
        body = source;
        const result = await client.callTool({ name, arguments: args });
        expect(result.isError).not.toBe(true);
        expect(result.structuredContent).toEqual(source);
      }
    }
    body = fixture.failed_keyword;
    expect(
      (
        await client.callTool({
          name: "get_keyword",
          arguments: { keyword_id: fixture.failed_keyword.id },
        })
      ).structuredContent,
    ).toEqual(fixture.failed_keyword);
    body = fixture.unobserved_keyword;
    expect(
      (
        await client.callTool({
          name: "get_keyword",
          arguments: { keyword_id: fixture.unobserved_keyword.id },
        })
      ).structuredContent,
    ).toEqual(fixture.unobserved_keyword);
    body = fixture.failed_summary.body;
    status = fixture.failed_summary.status;
    const failed = await client.callTool({
      name: "analyze_backlinks",
      arguments: { project_id: "prj_a00000000000000000000000", target: "example.com" },
    });
    expect(failed.isError).toBe(true);
    expect(failed.structuredContent).toMatchObject({
      error: { status: 500, problem: { details: fixture.failed_summary.body.details } },
    });
    expect(failed.structuredContent).not.toHaveProperty("data");
  } finally {
    await client.close();
    await server.close();
  }
});
