import type { BisibilityClient } from "@bisibility/sdk";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { type BisibilityMcpToolset, readBisibilityMcpToolConfig } from "./config.js";
import { SERVER_NAME, SERVER_VERSION } from "./constants.js";
import { bisibilitySessionProfile, registerBisibilityTools } from "./tools.js";

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
  const toolsets = options.toolsets ?? envConfig?.toolsets;
  const registerOptions = {
    client: options.client,
    readOnly: options.readOnly ?? envConfig?.readOnly ?? false,
    ...(toolsets ? { toolsets } : {}),
  };
  const profile = bisibilitySessionProfile(registerOptions);
  const profileSentence = `Session profile: read-only: ${profile.read_only}, toolsets: [${profile.toolsets.join(", ")}], tools: ${profile.tool_count}${profile.read_only ? "; write tools are hidden, not forbidden by the API." : "."}`;
  const instructions = [
    "bisibility MCP lets you inspect and manage SEO tracking projects, rankings, alerts, webhooks, and integrations.",
    // Conditional on purpose. An unconditional "call list_projects first" made both
    // models resolve the project even when the prompt already named one, costing accuracy on
    // tasks that were previously correct.
    "Most tools are project-scoped and accept a project_id. If you do not already have a project id, call list_projects to see the available projects and their ids.",
    ...(hasDefaultProject
      ? [
          "When BISIBILITY_PROJECT_ID is configured, it sets the default project, so applicable project_id inputs may be omitted.",
        ]
      : []),
    `${profileSentence} Call get_session_profile to see the same profile as structured data.`,
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

  registerBisibilityTools(server, registerOptions);

  return server;
}
