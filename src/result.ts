import type { ZodError } from "zod/v4";

interface ErrorLike {
  body?: unknown;
  message?: unknown;
  name?: unknown;
  problem?: unknown;
  status?: unknown;
}

function toStructuredContent(data: unknown): Record<string, unknown> {
  if (data && typeof data === "object" && !Array.isArray(data)) {
    return data as Record<string, unknown>;
  }

  return { value: data };
}

export function jsonToolResult(data: unknown) {
  return {
    content: [{ text: JSON.stringify(data, null, 2), type: "text" as const }],
    structuredContent: toStructuredContent(data),
  };
}

function isErrorLike(error: unknown): error is ErrorLike {
  return Boolean(error && typeof error === "object");
}

function zodIssues(error: unknown) {
  const maybeZod = error as Partial<ZodError>;
  return Array.isArray(maybeZod.issues) ? maybeZod.issues : undefined;
}

export function serializeToolError(error: unknown) {
  if (!isErrorLike(error)) {
    return {
      message: typeof error === "string" ? error : "Unknown error.",
      name: "Error",
    };
  }

  return {
    body: typeof error.body === "string" ? error.body : undefined,
    issues: zodIssues(error),
    message: typeof error.message === "string" ? error.message : "Unknown error.",
    name: typeof error.name === "string" ? error.name : "Error",
    problem: error.problem,
    status: typeof error.status === "number" ? error.status : undefined,
  };
}

export function errorToolResult(error: unknown) {
  const serialized = serializeToolError(error);

  return {
    content: [{ text: JSON.stringify({ error: serialized }, null, 2), type: "text" as const }],
    isError: true,
    structuredContent: { error: serialized },
  };
}
