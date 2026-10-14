import { z } from "zod/v4";
/** Exact confirmation fields from the existing PATCH defaults server contract. */
export const defaultsReviewInputSchema = z
  .object({
    expected_source_hash: z
      .string()
      .regex(/^[a-f0-9]{64}$/u)
      .describe("Exact source hash returned by the reviewed preview."),
    expected_revision: z
      .string()
      .regex(/^(0|[1-9][0-9]*)$/u)
      .describe("Opaque decimal revision string from preview; never convert to a number."),
    preview_token: z.string().min(1).max(8192).describe("Unmodified issuer-bound preview token."),
    idempotency_key: z
      .string()
      .trim()
      .min(8)
      .max(128)
      .describe("Stable command key; reuse with the exact body after a lost response."),
    confirmed: z
      .literal(true)
      .describe("True only after the caller explicitly approves the displayed draft and impact."),
  })
  .strict();
