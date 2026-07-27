import { readFileSync } from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

const bisibilityClientMock = vi.hoisted(() => vi.fn());

vi.mock("@bisibility/sdk", () => ({
  BisibilityClient: bisibilityClientMock,
}));

import {
  BISIBILITY_MCP_TOOLSETS,
  DEFAULT_BISIBILITY_BASE_URL,
  SERVER_VERSION,
  createBisibilityClientFromEnv,
  readBisibilityMcpConfig,
  readBisibilityMcpToolConfig,
} from "../src/index.js";

describe("server metadata", () => {
  it("reports the package.json version", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      version: string;
    };

    expect(SERVER_VERSION).toBe(pkg.version);
  });
});

describe("Bisibility MCP config", () => {
  beforeEach(() => {
    bisibilityClientMock.mockClear();
  });

  it("reads API key and defaults the base URL", () => {
    expect(readBisibilityMcpConfig({ BISIBILITY_API_KEY: " bsk_live_1 " })).toEqual({
      apiKey: "bsk_live_1",
      baseUrl: DEFAULT_BISIBILITY_BASE_URL,
    });
  });

  it("uses an explicit base URL", () => {
    expect(
      readBisibilityMcpConfig({
        BISIBILITY_API_KEY: "bsk_live_1",
        BISIBILITY_BASE_URL: " https://rank.example/api/v1/ ",
      }),
    ).toEqual({
      apiKey: "bsk_live_1",
      baseUrl: "https://rank.example/api/v1/",
    });
  });

  it("passes the optional PAT project selector to the SDK", () => {
    expect(
      readBisibilityMcpConfig({
        BISIBILITY_API_KEY: "bsp_live_1",
        BISIBILITY_PROJECT_ID: " prj_1 ",
      }),
    ).toEqual({
      apiKey: "bsp_live_1",
      baseUrl: DEFAULT_BISIBILITY_BASE_URL,
      projectId: "prj_1",
    });

    createBisibilityClientFromEnv({
      BISIBILITY_API_KEY: "bsp_live_1",
      BISIBILITY_PROJECT_ID: "prj_1",
    });
    expect(bisibilityClientMock).toHaveBeenLastCalledWith({
      apiKey: "bsp_live_1",
      baseUrl: DEFAULT_BISIBILITY_BASE_URL,
      projectId: "prj_1",
    });
  });

  it("requires BISIBILITY_API_KEY", () => {
    expect(() => readBisibilityMcpConfig({})).toThrow(
      "BISIBILITY_API_KEY is required to run the Bisibility MCP server.",
    );
  });

  it("rejects an empty base URL", () => {
    expect(() =>
      readBisibilityMcpConfig({
        BISIBILITY_API_KEY: "bsk_live_1",
        BISIBILITY_BASE_URL: " ",
      }),
    ).toThrow("BISIBILITY_BASE_URL cannot be empty.");
  });

  it("creates the SDK client from env with overrides", () => {
    const fetchImpl = vi.fn();
    createBisibilityClientFromEnv(
      {
        BISIBILITY_API_KEY: "bsk_live_1",
        BISIBILITY_BASE_URL: "https://rank.example/api/v1",
      },
      { fetch: fetchImpl },
    );

    expect(bisibilityClientMock).toHaveBeenCalledWith({
      apiKey: "bsk_live_1",
      baseUrl: "https://rank.example/api/v1",
      fetch: fetchImpl,
    });
  });

  it.each(["1", "true", "TRUE", "yes", "YES", "on", "ON"])(
    "enables read-only mode for %s",
    (value) => {
      expect(readBisibilityMcpToolConfig({ BISIBILITY_MCP_READ_ONLY: value })).toEqual({
        readOnly: true,
      });
    },
  );

  it("leaves read-only mode disabled for unset and non-truthy values", () => {
    expect(readBisibilityMcpToolConfig({})).toEqual({ readOnly: false });
    expect(readBisibilityMcpToolConfig({ BISIBILITY_MCP_READ_ONLY: "0" })).toEqual({
      readOnly: false,
    });
    expect(readBisibilityMcpToolConfig({ BISIBILITY_MCP_READ_ONLY: "false" })).toEqual({
      readOnly: false,
    });
  });

  it("parses and deduplicates a comma-separated toolset allowlist", () => {
    expect(
      readBisibilityMcpToolConfig({
        BISIBILITY_MCP_TOOLSETS: " keywords, rank-history,keywords ",
      }),
    ).toEqual({
      readOnly: false,
      toolsets: ["keywords", "rank-history"],
    });
  });

  it("rejects unknown toolsets and lists every valid value", () => {
    expect(() =>
      readBisibilityMcpToolConfig({ BISIBILITY_MCP_TOOLSETS: "keywords,unknown" }),
    ).toThrow(
      `Unknown BISIBILITY_MCP_TOOLSETS value: unknown. Valid toolsets: ${BISIBILITY_MCP_TOOLSETS.join(
        ", ",
      )}.`,
    );
  });
});
