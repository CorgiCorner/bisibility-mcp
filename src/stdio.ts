#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createBisibilityClientFromEnv } from "./config.js";
import { createBisibilityMcpServer } from "./server.js";

export async function runStdioServer() {
  const client = createBisibilityClientFromEnv();
  const server = createBisibilityMcpServer({ client });

  await server.connect(new StdioServerTransport());
}

try {
  await runStdioServer();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Bisibility MCP server failed to start: ${message}`);
  process.exit(1);
}
