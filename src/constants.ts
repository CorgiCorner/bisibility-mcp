declare const __SERVER_VERSION__: string | undefined;

export const SERVER_NAME = "@bisibility/mcp";
// Injected from package.json at build time (tsup/vitest define) so the reported
// server version tracks releases instead of a hardcoded literal.
export const SERVER_VERSION =
  typeof __SERVER_VERSION__ === "string" ? __SERVER_VERSION__ : "0.0.0-dev";
export const DEFAULT_BISIBILITY_BASE_URL = "https://eu.bisibility.com/api/v1";
