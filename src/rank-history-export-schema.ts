import * as z from "zod/v4";

/** Export cursors are endpoint-owned opaque tokens; never decode or trim them. */
export function rankHistoryExportSchema<
  Id extends z.ZodType<string>,
  Keyword extends z.ZodType<string>,
>(projectId: Id, keywordId: Keyword) {
  return z
    .object({
      cursor: z
        .string()
        .min(1)
        .max(8192)
        .optional()
        .describe("Opaque continuation from this export; preserve all selected options."),
      limit: z.number().int().min(1).max(200).optional(),
      project_id: projectId,
      keyword_ids: z
        .array(keywordId)
        .max(500)
        .optional()
        .describe("Tracked keyword public IDs to include in the export."),
      granularity: z.enum(["daily", "weekly"]).optional(),
      range: z.enum(["30", "90", "all"]).optional(),
      version: z
        .enum(["1", "2"])
        .optional()
        .describe("1 retains legacy rows; 2 returns frozen report records and quality metadata."),
      stream: z
        .enum(["observations", "attempts"])
        .optional()
        .describe(
          "Version 2 normalized observations or logical checks plus retained run/item outcomes; this never launches a check.",
        ),
      basis: z
        .enum(["observed_at", "recorded_at"])
        .optional()
        .describe("Timestamp selecting version 2 records. Attempts require recorded_at."),
      from: z.iso
        .datetime()
        .optional()
        .describe("Inclusive version 2 window start, supplied together with to."),
      to: z.iso
        .datetime()
        .optional()
        .describe("Inclusive version 2 window end, supplied together with from."),
      aggregation: z
        .literal("none")
        .optional()
        .describe("Version 2 exports raw records without aggregation."),
    })
    .strict()
    .superRefine((value, ctx) => {
      if (value.keyword_ids && new Set(value.keyword_ids).size !== value.keyword_ids.length)
        ctx.addIssue({ code: "custom", message: "Keyword IDs must be unique." });
      if (
        Boolean(value.from) !== Boolean(value.to) ||
        (value.from && value.to && Date.parse(value.from) > Date.parse(value.to))
      )
        ctx.addIssue({ code: "custom", message: "A complete ordered export window is required." });
      if (
        value.version !== "2" &&
        (value.from || value.to || value.stream === "attempts" || value.basis === "observed_at")
      )
        ctx.addIssue({
          code: "custom",
          message: "Explicit report windows/streams require version 2.",
        });
      if (value.version === "2" && value.granularity === "weekly")
        ctx.addIssue({
          code: "custom",
          message: "Version 2 exports raw records with aggregation=none.",
        });
      if (value.stream === "attempts" && value.basis === "observed_at")
        ctx.addIssue({ code: "custom", message: "Attempt windows use recorded_at." });
    });
}
