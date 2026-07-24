import { describe, expect, it } from "vitest";
import * as z from "zod/v4";

import { errorToolResult, jsonToolResult, serializeToolError } from "../src/index.js";

describe("tool result helpers", () => {
  it("wraps primitive responses in structured content", () => {
    expect(jsonToolResult("ok")).toEqual({
      content: [{ text: '"ok"', type: "text" }],
      structuredContent: { value: "ok" },
    });
  });

  it("serializes unknown thrown values", () => {
    expect(serializeToolError("nope")).toEqual({
      message: "nope",
      name: "Error",
    });
    expect(serializeToolError(42)).toEqual({
      message: "Unknown error.",
      name: "Error",
    });
  });

  it("serializes partial error-like objects", () => {
    expect(serializeToolError({ body: 123, message: 456, name: 789, status: "bad" })).toEqual({
      body: undefined,
      issues: undefined,
      message: "Unknown error.",
      name: "Error",
      problem: undefined,
      status: undefined,
    });
  });

  it("serializes zod issues in tool error results", () => {
    const schema = z.object({ value: z.number() });
    const parsed = schema.safeParse({ value: "nope" });
    if (parsed.success) {
      throw new Error("Expected zod parsing to fail");
    }

    const result = errorToolResult(parsed.error);

    expect(result.isError).toBe(true);
    expect(result.structuredContent.error).toMatchObject({
      name: "ZodError",
    });
    expect(JSON.stringify(result.structuredContent.error)).toContain("Invalid input");
  });
});
