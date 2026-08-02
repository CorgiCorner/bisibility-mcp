import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const packageManifest = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf8")) as {
  version: string;
};
const bundleManifest = JSON.parse(
  readFileSync(join(process.cwd(), "mcpb/manifest.json"), "utf8"),
) as {
  compatibility: { runtimes: { node: string } };
  icon: string;
  manifest_version: string;
  privacy_policies: string[];
  server: {
    entry_point: string;
    mcp_config: { env: Record<string, string> };
    type: string;
  };
  tools_generated: boolean;
  user_config: Record<string, { required?: boolean; sensitive?: boolean }>;
  version: string;
};

describe("MCPB manifest", () => {
  it("tracks the package version and bundled stdio entry point", () => {
    expect(bundleManifest.manifest_version).toBe("0.4");
    expect(bundleManifest.version).toBe(packageManifest.version);
    expect(bundleManifest.server).toMatchObject({
      entry_point: "server/dist/stdio.js",
      type: "node",
    });
    expect(bundleManifest.icon).toBe("assets/bisibility-mcp.png");
    expect(bundleManifest.compatibility.runtimes.node).toBe(">=18");
    expect(bundleManifest.tools_generated).toBe(true);
  });

  it("collects the secret credential and least-privilege settings through user config", () => {
    expect(bundleManifest.user_config.api_key).toMatchObject({
      required: true,
      sensitive: true,
    });
    expect(bundleManifest.server.mcp_config.env).toEqual({
      BISIBILITY_API_KEY: "${user_config.api_key}",
      BISIBILITY_BASE_URL: "${user_config.base_url}",
      BISIBILITY_MCP_READ_ONLY: "${user_config.read_only}",
      BISIBILITY_MCP_TOOLSETS: "${user_config.toolsets}",
      BISIBILITY_PROJECT_ID: "${user_config.project_id}",
    });
    expect(bundleManifest.privacy_policies).toEqual(["https://bisibility.com/privacy"]);
  });
});
