import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type PackageManifest = {
  version: string;
};

const distribution = readFileSync("docs/DISTRIBUTION.md", "utf8");
const packageManifest = JSON.parse(readFileSync("package.json", "utf8")) as PackageManifest;
const readme = readFileSync("README.md", "utf8");

describe("public distribution documentation", () => {
  it("keeps release targets pending until canonical channels are verified", () => {
    // Each channel records the version that channel actually serves, checked against its public
    // API before the release. npm and the Official MCP Registry drift apart because registry
    // publication is a separate, manual submission.
    const npmPublishedVersion = "`0.8.0`";
    const registryPublishedVersion = "`0.5.2`";
    const targetVersion = `\`${packageManifest.version}\``;

    expect(distribution).toContain(
      `| npm | Published ${npmPublishedVersion}; ${targetVersion} pending verification | [@bisibility/mcp](https://www.npmjs.com/package/@bisibility/mcp) | ${npmPublishedVersion} verified, ${targetVersion} target |`,
    );
    expect(distribution).toContain(
      `| Official MCP Registry | Published ${registryPublishedVersion}; ${targetVersion} pending downstream indexing | [com.bisibility/mcp](https://registry.modelcontextprotocol.io/v0.1/servers?search=com.bisibility%2Fmcp) | ${registryPublishedVersion} verified, ${targetVersion} target |`,
    );
    expect(distribution).toContain(
      "| Docker MCP Catalog | Submitted - under review | [docker/mcp-registry#4603](https://github.com/docker/mcp-registry/pull/4603) | `0.6.0` |",
    );
    expect(distribution).toContain(
      "| Smithery | Published | [bisibility/mcp](https://smithery.ai/servers/bisibility/mcp) | Hosted |",
    );
    expect(distribution).toContain(
      "Existing directory submissions and pull requests stay on the version originally submitted.",
    );
  });

  it("keeps the README distribution section limited to badges and the public status link", () => {
    const section = readme.match(/## Distribution\n\n([\s\S]*?)\n\nModel Context Protocol server/);

    expect(section?.[1]).toBe(
      [
        "[![npm version](https://img.shields.io/npm/v/%40bisibility%2Fmcp?label=npm)](https://www.npmjs.com/package/@bisibility/mcp)",
        "[![Official MCP Registry](https://img.shields.io/badge/Official_MCP_Registry-active-2ea44f)](https://registry.modelcontextprotocol.io/v0.1/servers?search=com.bisibility%2Fmcp)",
        "[![Glama](https://img.shields.io/badge/Glama-listed-2ea44f)](https://glama.ai/mcp/servers/CorgiCorner/bisibility-mcp)",
        "[![smithery badge](https://smithery.ai/badge/bisibility/mcp)](https://smithery.ai/servers/bisibility/mcp)",
        "",
        "[Distribution status and release channels](https://github.com/CorgiCorner/bisibility-mcp/blob/main/docs/DISTRIBUTION.md)",
      ].join("\n"),
    );
  });
});
