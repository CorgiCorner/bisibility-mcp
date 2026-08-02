import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type PackageManifest = {
  version: string;
};

const distribution = readFileSync("docs/DISTRIBUTION.md", "utf8");
const packageManifest = JSON.parse(readFileSync("package.json", "utf8")) as PackageManifest;
const readme = readFileSync("README.md", "utf8");

describe("public distribution documentation", () => {
  it("keeps versioned canonical channels aligned with the package release", () => {
    const version = `\`${packageManifest.version}\``;

    expect(distribution).toContain(
      `| npm | Published | [@bisibility/mcp](https://www.npmjs.com/package/@bisibility/mcp) | ${version} |`,
    );
    expect(distribution).toContain(
      `| Official MCP Registry | Published | [com.bisibility/mcp](https://registry.modelcontextprotocol.io/v0.1/servers?search=com.bisibility%2Fmcp) | ${version} |`,
    );
    expect(distribution).toContain(
      "| Smithery | Published | [bisibility/mcp](https://smithery.ai/servers/bisibility/mcp) | Hosted |",
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
