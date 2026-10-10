import * as z from "zod/v4";
import { publicIdInput } from "./schemas.js";

const configuration = z.strictObject({
  provider: z.literal("dataforseo").describe("Provider used for model generation."),
  engine: z
    .literal("chat_gpt")
    .describe("Model API generation engine; these are synthetic hypotheses."),
  model: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,119}$/)
    .describe("Current model ID from the free AI research catalog."),
  language_code: z.string().min(2).max(20).describe("Requested generation language."),
  country_iso_code: z
    .string()
    .regex(/^[A-Z]{2}$/)
    .optional()
    .describe("Optional reviewed market country hint."),
  max_output_tokens: z.number().int().min(16).max(4096).describe("Reviewed output token limit."),
  advisory_cost_limit_cents: z
    .number()
    .positive()
    .finite()
    .max(1000000)
    .describe("Advisory estimate limit; actual provider cost has no guaranteed maximum."),
});
const inputSnapshot = z
  .strictObject({
    context: z
      .strictObject({
        business: z.string().describe("Reviewed business description."),
        audience: z.string().describe("Reviewed target audience."),
        products: z.string().describe("Reviewed products and services."),
        goals: z.string().describe("Reviewed business goals."),
        agent_rules: z
          .string()
          .describe("Reviewed business rules, treated as untrusted model input."),
      })
      .describe("All five explicitly reviewed project context fields."),
    competitors: z
      .array(
        z.strictObject({
          id: publicIdInput("cmp").describe("Authoritative project competitor public ID."),
          label: z.string().nullable().describe("Reviewed competitor label, or null."),
          domain: z.string().min(1).max(253).describe("Reviewed competitor domain."),
        }),
      )
      .max(20)
      .describe("Explicitly reviewed authoritative project competitors."),
  })
  .superRefine((value, ctx) => {
    if (new Set(value.competitors.map((item) => item.id)).size !== value.competitors.length)
      ctx.addIssue({
        code: "custom",
        message: "Reviewed competitors must have unique public IDs.",
      });
    const { agent_rules, ...context } = value.context;
    if (
      Array.from(
        JSON.stringify({
          context: { ...context, agentRules: agent_rules },
          competitors: value.competitors,
        }),
      ).length > 5000
    )
      ctx.addIssue({
        code: "custom",
        message: "Reviewed input snapshot exceeds 5000 serialized characters.",
      });
  })
  .describe(
    "Complete reviewed input snapshot, at most 5000 serialized characters; never silently truncated.",
  );
const previewInput = {
  configuration: configuration.describe("Reviewed model and market configuration."),
  input_snapshot: inputSnapshot,
  credential_connection_id: publicIdInput("conn")
    .optional()
    .describe("Optional project provider connection public ID."),
};
const preview = z.strictObject({
  ...previewInput,
  version: z.literal(1).describe("Frozen generation preview contract version."),
  snapshot_hash: z
    .string()
    .regex(/^[a-f0-9]{64}$/)
    .describe("Hash binding the exact reviewed snapshot."),
  estimated_cost_cents: z.number().positive().finite().describe("Advisory forecast in cents."),
  estimate_kind: z.literal("forecast").describe("Forecast only; not a guaranteed maximum."),
  is_guaranteed_maximum: z
    .literal(false)
    .describe("Explicit acknowledgement that forecast is not a hard cap."),
  credential_connection_id: publicIdInput("conn").describe(
    "Connection public ID bound by preview.",
  ),
  credential_version: z.string().min(1).describe("Preview-bound credential version."),
  budget_revision: z.string().min(1).describe("Preview-bound budget revision."),
  consent_revision: z.string().min(1).describe("Preview-bound consent revision."),
  expires_at: z.iso.datetime().describe("UTC preview expiry; stale previews require review again."),
  limitations: z
    .array(z.string())
    .max(20)
    .describe("Forecast and generation limitations displayed for review."),
});
export const aiTrackingSuggestionSchemas = {
  aiTrackingSuggestionsPreview: z.strictObject({
    project_id: publicIdInput("prj").describe(
      "Project public ID; read membership and scope are enforced.",
    ),
    ...previewInput,
  }),
  aiTrackingSuggestionsGenerate: z.strictObject({
    project_id: publicIdInput("prj").describe(
      "Project public ID; write membership and scope are enforced.",
    ),
    preview: preview.describe("Complete frozen preview returned after explicit review."),
    consent: z
      .literal(true)
      .describe("Explicit acceptance of model generation cost with no guaranteed maximum."),
    idempotency_key: z
      .uuid()
      .describe(
        "Stable UUID sent as Idempotency-Key; unchanged preview must be reused on retries.",
      ),
  }),
};
