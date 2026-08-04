#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createBisibilityClientFromEnv } from "./config.js";
import { createBisibilityMcpServer } from "./server.js";

export async function runStdioServer() {
  const client = createBisibilityClientFromEnv();
  const server = createBisibilityMcpServer({ client });

  await server.connect(new StdioServerTransport());
}

function startupFailureReason(error: unknown) {
  if (!(error instanceof Error)) {
    return "unexpected_failure";
  }

  if (error.message === "BISIBILITY_API_KEY is required to run the bisibility MCP server.") {
    return "missing_api_key";
  }
  if (error.message.startsWith("Invalid API credential from BISIBILITY_API_KEY:")) {
    return "invalid_api_credential";
  }
  if (error.message === "BISIBILITY_BASE_URL cannot be empty.") {
    return "empty_base_url";
  }
  if (error.message === "BISIBILITY_PROJECT_ID must be a prj_ public ID v3.") {
    return "invalid_project_id";
  }
  if (error.message.startsWith("Unknown BISIBILITY_MCP_TOOLSETS value")) {
    return "invalid_toolsets";
  }

  return "initialization_error";
}

try {
  await runStdioServer();
} catch (error: unknown) {
  console.error(
    `bisibility MCP server failed to start (${startupFailureReason(error)}). Check the MCP environment configuration.`,
  );
  process.exit(1);
}
