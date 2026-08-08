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

const projectId = `prj_a${"0".repeat(23)}`;

describe("server metadata", () => {
  it("reports the package.json version", () => {
    const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
      version: string;
    };

    expect(SERVER_VERSION).toBe(pkg.version);
  });
});

describe("bisibility MCP config", () => {
  beforeEach(() => {
    bisibilityClientMock.mockClear();
  });

  it("defaults bisibility Cloud to the direct regional API URL", () => {
    expect(DEFAULT_BISIBILITY_BASE_URL).toBe("https://eu.bisibility.com/api/v1");
  });

  it("reads API key and defaults the base URL", () => {
    expect(readBisibilityMcpConfig({ BISIBILITY_API_KEY: " bsb_key_live_1 " })).toEqual({
      apiKey: "bsb_key_live_1",
      baseUrl: DEFAULT_BISIBILITY_BASE_URL,
    });
  });

  it("uses an explicit base URL", () => {
    expect(
      readBisibilityMcpConfig({
        BISIBILITY_API_KEY: "bsb_key_live_1",
        BISIBILITY_BASE_URL: " https://rank.example/api/v1/ ",
      }),
    ).toEqual({
      apiKey: "bsb_key_live_1",
      baseUrl: "https://rank.example/api/v1/",
    });
  });

  it("passes the optional PAT project selector to the SDK", () => {
    expect(
      readBisibilityMcpConfig({
        BISIBILITY_API_KEY: "bsb_pat_live_1",
        BISIBILITY_PROJECT_ID: ` ${projectId} `,
      }),
    ).toEqual({
      apiKey: "bsb_pat_live_1",
      baseUrl: DEFAULT_BISIBILITY_BASE_URL,
      projectId,
    });

    createBisibilityClientFromEnv({
      BISIBILITY_API_KEY: "bsb_pat_live_1",
      BISIBILITY_PROJECT_ID: projectId,
    });
    expect(bisibilityClientMock).toHaveBeenLastCalledWith({
      apiKey: "bsb_pat_live_1",
      baseUrl: DEFAULT_BISIBILITY_BASE_URL,
      projectId,
    });
  });

  it("requires BISIBILITY_API_KEY", () => {
    expect(() => readBisibilityMcpConfig({})).toThrow(
      "BISIBILITY_API_KEY is required to run the bisibility MCP server.",
    );
  });

  it.each([
    ["bsp_live_old", 'unsupported prefix "bsp_"'],
    ["bsk_live_old", 'unsupported prefix "bsk_"'],
    ["unknown", "unsupported format"],
  ])("explains how to replace an invalid API credential: %s", (apiKey, problem) => {
    expect(() => readBisibilityMcpConfig({ BISIBILITY_API_KEY: apiKey })).toThrow(
      `Invalid API credential from BISIBILITY_API_KEY: ${problem}. Unset BISIBILITY_API_KEY or set a current credential.`,
    );
    expect(() => readBisibilityMcpConfig({ BISIBILITY_API_KEY: apiKey })).not.toThrow(apiKey);
    expect(bisibilityClientMock).not.toHaveBeenCalled();
  });

  it("rejects an empty base URL", () => {
    expect(() =>
      readBisibilityMcpConfig({
        BISIBILITY_API_KEY: "bsb_key_live_1",
        BISIBILITY_BASE_URL: " ",
      }),
    ).toThrow("BISIBILITY_BASE_URL cannot be empty.");
  });

  it.each(["prj_1", "kw_a000000000000000000000000", "prj_A000000000000000000000000"])(
    "rejects a malformed project selector: %s",
    (value) => {
      expect(() =>
        readBisibilityMcpConfig({
          BISIBILITY_API_KEY: "bsb_pat_live_1",
          BISIBILITY_PROJECT_ID: value,
        }),
      ).toThrow("BISIBILITY_PROJECT_ID must be a prj_ public ID.");
    },
  );

  it("creates the SDK client from env with overrides", () => {
    const fetchImpl = vi.fn();
    createBisibilityClientFromEnv(
      {
        BISIBILITY_API_KEY: "bsb_key_live_1",
        BISIBILITY_BASE_URL: "https://rank.example/api/v1",
      },
      { fetch: fetchImpl },
    );

    expect(bisibilityClientMock).toHaveBeenCalledWith({
      apiKey: "bsb_key_live_1",
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
