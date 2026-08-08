import { BisibilityClient } from "@bisibility/sdk";
import type { BisibilityClientConfig } from "@bisibility/sdk";

import { DEFAULT_BISIBILITY_BASE_URL } from "./constants.js";
import { type PublicIdForPrefix, projectIdInput } from "./schemas.js";

export interface BisibilityMcpEnv {
  BISIBILITY_API_KEY?: string;
  BISIBILITY_BASE_URL?: string;
  BISIBILITY_PROJECT_ID?: string;
  BISIBILITY_MCP_READ_ONLY?: string;
  BISIBILITY_MCP_TOOLSETS?: string;
  [key: string]: string | undefined;
}

export const BISIBILITY_MCP_TOOLSETS = [
  "account",
  "alerts",
  "analytics",
  "backlinks",
  "checks",
  "competitors",
  "keywords",
  "notifications",
  "projects",
  "providers",
  "rank-history",
  "saved-keywords",
  "saved-views",
  "signals",
  "sitemaps",
  "system",
  "team",
  "tokens",
  "webhooks",
] as const;

export type BisibilityMcpToolset = (typeof BISIBILITY_MCP_TOOLSETS)[number];

export interface BisibilityMcpToolConfig {
  readOnly: boolean;
  toolsets?: BisibilityMcpToolset[];
}

export interface BisibilityMcpConfig {
  apiKey: string;
  baseUrl: string;
  projectId?: PublicIdForPrefix<"prj">;
}

const API_CREDENTIAL_PREFIXES = ["bsb_key_live_", "bsb_key_test_", "bsb_pat_live_"] as const;

function apiCredentialPrefix(value: string) {
  return /^[a-z][a-z0-9]{1,7}_/i.exec(value)?.[0];
}

function readApiCredential(value: string | undefined) {
  const credential = cleanEnvValue(value);
  if (!credential) {
    throw new Error("BISIBILITY_API_KEY is required to run the bisibility MCP server.");
  }
  if (!API_CREDENTIAL_PREFIXES.some((prefix) => credential.startsWith(prefix))) {
    const prefix = apiCredentialPrefix(credential);
    const problem = prefix ? `unsupported prefix "${prefix}"` : "unsupported format";
    throw new Error(
      `Invalid API credential from BISIBILITY_API_KEY: ${problem}. Unset BISIBILITY_API_KEY or set a current credential.`,
    );
  }
  return credential;
}

function cleanEnvValue(value: string | undefined) {
  const cleaned = value?.trim();
  if (!cleaned) {
    return undefined;
  }
  return cleaned;
}

function isTruthyEnvValue(value: string | undefined) {
  const normalized = cleanEnvValue(value)?.toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
}

function readToolsets(value: string | undefined): BisibilityMcpToolset[] | undefined {
  const configured = cleanEnvValue(value);
  if (!configured) {
    return undefined;
  }

  const requested = [...new Set(configured.split(",").map((toolset) => toolset.trim()))].filter(
    Boolean,
  );
  const valid = new Set<string>(BISIBILITY_MCP_TOOLSETS);
  const unknown = requested.filter((toolset) => !valid.has(toolset));
  if (unknown.length) {
    throw new Error(
      `Unknown BISIBILITY_MCP_TOOLSETS value${unknown.length === 1 ? "" : "s"}: ${unknown.join(
        ", ",
      )}. Valid toolsets: ${BISIBILITY_MCP_TOOLSETS.join(", ")}.`,
    );
  }

  return requested as BisibilityMcpToolset[];
}

export function readBisibilityMcpToolConfig(
  env: BisibilityMcpEnv = process.env,
): BisibilityMcpToolConfig {
  const toolsets = readToolsets(env.BISIBILITY_MCP_TOOLSETS);
  return {
    readOnly: isTruthyEnvValue(env.BISIBILITY_MCP_READ_ONLY),
    ...(toolsets ? { toolsets } : {}),
  };
}

export function readBisibilityMcpConfig(env: BisibilityMcpEnv = process.env): BisibilityMcpConfig {
  const apiKey = readApiCredential(env.BISIBILITY_API_KEY);

  const baseUrl = cleanEnvValue(env.BISIBILITY_BASE_URL ?? DEFAULT_BISIBILITY_BASE_URL);
  if (!baseUrl) {
    throw new Error("BISIBILITY_BASE_URL cannot be empty.");
  }

  const projectId = cleanEnvValue(env.BISIBILITY_PROJECT_ID);
  if (projectId) {
    const parsedProjectId = projectIdInput.safeParse(projectId);
    if (!parsedProjectId.success) {
      throw new Error("BISIBILITY_PROJECT_ID must be a prj_ public ID.");
    }
    return { apiKey, baseUrl, projectId: parsedProjectId.data };
  }

  return { apiKey, baseUrl };
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
