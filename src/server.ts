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
  const hasDefaultProject = Boolean(process.env.BISIBILITY_PROJECT_ID?.trim());
  const instructions = [
    "Bisibility MCP lets you inspect and manage SEO tracking projects, rankings, alerts, webhooks, and integrations.",
    // Conditional on purpose. An unconditional "call list_projects first" made both
    // models resolve the project even when the prompt already named one, costing accuracy on
    // tasks that were previously correct.
    "Most tools are project-scoped and accept a project_id. If you do not already have a project id, call list_projects to see the available projects and their ids.",
    ...(hasDefaultProject
      ? [
          "When BISIBILITY_PROJECT_ID is configured, it sets the default project, so applicable project_id inputs may be omitted.",
        ]
      : []),
  ].join(" ");
  const server = new McpServer(
    {
      name: options.name ?? SERVER_NAME,
      version: options.version ?? SERVER_VERSION,
    },
    {
      instructions,
    },
  );
  const toolsets = options.toolsets ?? envConfig?.toolsets;

  registerBisibilityTools(server, {
    client: options.client,
    readOnly: options.readOnly ?? envConfig?.readOnly ?? false,
    ...(toolsets ? { toolsets } : {}),
  });

  return server;
}
