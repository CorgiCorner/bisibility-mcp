import { readFileSync } from "node:fs";

import { beforeEach, describe, expect, it, vi } from "vitest";

const bisibilityClientMock = vi.hoisted(() => vi.fn());

vi.mock("@bisibility/sdk", () => ({
  BisibilityClient: bisibilityClientMock,
}));

import {
  DEFAULT_BISIBILITY_BASE_URL,
  SERVER_VERSION,
  createBisibilityClientFromEnv,
  readBisibilityMcpConfig,
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
});
