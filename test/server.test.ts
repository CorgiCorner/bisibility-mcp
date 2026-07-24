import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { describe, expect, it, vi } from "vitest";

import { SERVER_NAME, SERVER_VERSION, createBisibilityMcpServer } from "../src/index.js";

function serverMetadata(server: McpServer): { name?: string; version?: string } {
  // The MCP SDK keeps registered identity on the private `_serverInfo` field of
  // the underlying Server; there is no public accessor, so read it directly.
  return (server.server as unknown as { _serverInfo: { name?: string; version?: string } })
    ._serverInfo;
}

function clientMock() {
  return {
    addKeywords: vi.fn(),
    bulkUpdateKeywords: vi.fn(),
    deleteKeyword: vi.fn(),
    getCapabilities: vi.fn(),
    getHealth: vi.fn(),
    getKeyword: vi.fn(),
    getProject: vi.fn(),
    getRankCheckResult: vi.fn(),
    listKeywords: vi.fn(),
    listProjects: vi.fn(),
    listRankChecks: vi.fn(),
    runRankCheck: vi.fn(),
    setKeywordTargetUrl: vi.fn(),
    updateKeyword: vi.fn(),
  };
}

describe("createBisibilityMcpServer", () => {
  it("creates an official MCP server instance with the provided metadata", () => {
    const server = createBisibilityMcpServer({
      client: clientMock() as never,
      name: "bisibility-test",
      version: "0.0.0-test",
    });

    expect(server).toBeInstanceOf(McpServer);
    expect(serverMetadata(server)).toMatchObject({
      name: "bisibility-test",
      version: "0.0.0-test",
    });
  });

  it("uses default server metadata", () => {
    const server = createBisibilityMcpServer({
      client: clientMock() as never,
    });

    expect(server).toBeInstanceOf(McpServer);
    expect(serverMetadata(server)).toMatchObject({
      name: SERVER_NAME,
      version: SERVER_VERSION,
    });
  });
});
