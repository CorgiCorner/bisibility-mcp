import type { BisibilityClient } from "@bisibility/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { type BisibilityMcpToolset, readBisibilityMcpToolConfig } from "./config.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { registerBisibilityTools } from "./tools.js";

export interface CreateBisibilityMcpServerOptions {
  client: BisibilityClient;
  name?: string;
  readOnly?: boolean;
  toolsets?: readonly BisibilityMcpToolset[];
  version?: string;
}

export function createBisibilityMcpServer(options: CreateBisibilityMcpServerOptions) {
  const envConfig =
    options.readOnly === undefined || options.toolsets === undefined
      ? readBisibilityMcpToolConfig()
      : undefined;
  const server = new McpServer({
    name: options.name ?? SERVER_NAME,
    version: options.version ?? SERVER_VERSION,
  });
  const toolsets = options.toolsets ?? envConfig?.toolsets;

  registerBisibilityTools(server, {
    client: options.client,
    readOnly: options.readOnly ?? envConfig?.readOnly ?? false,
    ...(toolsets ? { toolsets } : {}),
  });

  return server;
}
