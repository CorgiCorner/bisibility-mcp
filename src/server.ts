import type { BisibilityClient } from "@bisibility/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { registerBisibilityTools } from "./tools.js";

export interface CreateBisibilityMcpServerOptions {
  client: BisibilityClient;
  name?: string;
  version?: string;
}

export function createBisibilityMcpServer(options: CreateBisibilityMcpServerOptions) {
  const server = new McpServer({
    name: options.name ?? SERVER_NAME,
    version: options.version ?? SERVER_VERSION,
  });

  registerBisibilityTools(server, { client: options.client });

  return server;
}
