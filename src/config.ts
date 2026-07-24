import { BisibilityClient } from "@bisibility/sdk";
import type { BisibilityClientConfig } from "@bisibility/sdk";

import { DEFAULT_BISIBILITY_BASE_URL } from "./constants.js";

export interface BisibilityMcpEnv {
  BISIBILITY_API_KEY?: string;
  BISIBILITY_BASE_URL?: string;
  BISIBILITY_PROJECT_ID?: string;
  [key: string]: string | undefined;
}

export interface BisibilityMcpConfig {
  apiKey: string;
  baseUrl: string;
  projectId?: string;
}

function cleanEnvValue(value: string | undefined) {
  const cleaned = value?.trim();
  if (!cleaned) {
    return undefined;
  }
  return cleaned;
}

export function readBisibilityMcpConfig(env: BisibilityMcpEnv = process.env): BisibilityMcpConfig {
  const apiKey = cleanEnvValue(env.BISIBILITY_API_KEY);
  if (!apiKey) {
    throw new Error("BISIBILITY_API_KEY is required to run the Bisibility MCP server.");
  }

  const baseUrl = cleanEnvValue(env.BISIBILITY_BASE_URL ?? DEFAULT_BISIBILITY_BASE_URL);
  if (!baseUrl) {
    throw new Error("BISIBILITY_BASE_URL cannot be empty.");
  }

  const projectId = cleanEnvValue(env.BISIBILITY_PROJECT_ID);
  return { apiKey, baseUrl, ...(projectId ? { projectId } : {}) };
}

export function createBisibilityClientFromEnv(
  env: BisibilityMcpEnv = process.env,
  overrides: Omit<BisibilityClientConfig, "apiKey" | "baseUrl"> = {},
) {
  const config = readBisibilityMcpConfig(env);

  return new BisibilityClient({
    ...overrides,
    apiKey: config.apiKey,
    baseUrl: config.baseUrl,
    ...(config.projectId ? { projectId: config.projectId } : {}),
  });
}
