import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type PackageManifest = {
  files: string[];
  mcpName?: string;
  name: string;
  version: string;
};

type ServerManifest = {
  name: string;
  packages: Array<{
    environmentVariables?: Array<{ default?: string; name: string }>;
    identifier: string;
    registryType: string;
    runtimeHint?: string;
    version?: string;
  }>;
  remotes: Array<{ type: string; url: string }>;
  version: string;
};

const packageManifest = JSON.parse(readFileSync("package.json", "utf8")) as PackageManifest;
const serverManifest = JSON.parse(readFileSync("server.json", "utf8")) as ServerManifest;

describe("MCP distribution metadata", () => {
  it("keeps the Official MCP Registry identity and npm release aligned", () => {
    expect(packageManifest.mcpName).toBe("com.bisibility/mcp");
    expect(serverManifest.name).toBe(packageManifest.mcpName);
    expect(serverManifest.version).toBe(packageManifest.version);
    expect(serverManifest.packages).toContainEqual(
      expect.objectContaining({
        environmentVariables: expect.arrayContaining([
          expect.objectContaining({
            default: "https://eu.bisibility.com/api/v1",
            name: "BISIBILITY_BASE_URL",
          }),
        ]),
        identifier: packageManifest.name,
        registryType: "npm",
        runtimeHint: "npx",
        version: packageManifest.version,
      }),
    );
    expect(serverManifest.remotes).toContainEqual({
      type: "streamable-http",
      url: "https://bisibility.com/api/mcp",
    });
    expect(packageManifest.files).toContain("server.json");
  });

  it("documents one-command installation for people and agents", () => {
    const readme = readFileSync("README.md", "utf8");
    const agentInstall = readFileSync("llms-install.md", "utf8");

    expect(readme).toContain("npx -y @bisibility/mcp");
    expect(agentInstall).toContain("npx -y @bisibility/mcp");
    expect(agentInstall).toContain("BISIBILITY_BASE_URL");
    expect(agentInstall).toContain("https://eu.bisibility.com/api/v1");
    expect(agentInstall).toContain("BISIBILITY_API_KEY");
    expect(agentInstall).toContain("list_projects");
  });

  it("ships a 400 by 400 PNG marketplace icon", () => {
    const png = readFileSync("assets/bisibility-mcp.png");

    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(400);
    expect(png.readUInt32BE(20)).toBe(400);
  });
});
