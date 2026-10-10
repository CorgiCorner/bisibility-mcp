import * as z from "zod/v4";
import { promptCostPolicyJsonSchema } from "./prompt-cost-policy-schema.js";
import { publicIdInput } from "./schemas.js";

const projectId = publicIdInput("prj").describe(
  "The public project ID. Project membership and token scopes are enforced.",
);
const reportId = publicIdInput("agr").describe("The public report ID, scoped to this project.");
const idempotencyKey = z
  .string()
  .optional()
  .describe("Optional stable retry key, forwarded as the REST Idempotency-Key header.");
const contextField = z
  .string()
  .max(4000)
  .describe("Project guidance for the agent, up to 4000 characters.");
const reportKind = z
  .string()
  .max(64)
  .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/);

export const getProjectContextInputSchema = z.strictObject({ project_id: projectId });
export const updateProjectContextInputSchema = z.strictObject({
  project_id: projectId,
  business: contextField,
  audience: contextField,
  products: contextField,
  goals: contextField,
  agent_rules: contextField,
  idempotency_key: idempotencyKey,
});
export const listAgentReportsInputSchema = z.strictObject({
  project_id: projectId,
  kind: reportKind.optional().describe("Analysis category, such as ai_visibility or site_audit."),
  limit: z.number().int().min(1).max(100).optional().describe("Page size, at most 100."),
  cursor: z.string().optional().describe("Opaque next-page cursor from the previous response."),
});
export const createAgentReportInputSchema = z.strictObject({
  project_id: projectId,
  kind: reportKind.describe(
    "External analysis kind; site_audit, ai_visibility and prompt_explorer are reserved.",
  ),
  title: z.string().min(1).max(160).describe("Human-readable report title."),
  body: z
    .record(z.string(), z.unknown())
    .describe("Structured analysis. Maximum 256 KiB; untrusted text is rendered safely."),
  provenance: z
    .record(z.string(), z.unknown())
    .optional()
    .describe("Source attribution and limitations. Maximum 32 KiB."),
  idempotency_key: idempotencyKey,
});
export const getAgentReportInputSchema = z.strictObject({
  project_id: projectId,
  report_id: reportId,
});

const aiAnalysisFields = {
  project_id: projectId,
  brand: z.string().min(1).max(120).describe("Brand name to inspect."),
  domain: z
    .string()
    .min(1)
    .max(63)
    .describe("Public hostname to inspect, without a scheme or path."),
  max_cost_cents: z
    .number()
    .int()
    .min(0)
    .max(1000)
    .describe(
      "Maximum accepted provider cost in cents. Estimates and cache reads do not spend credits.",
    ),
  estimate_only: z
    .boolean()
    .default(false)
    .describe("Return the cost estimate without paid provider I/O."),
  fresh: z
    .boolean()
    .default(false)
    .describe("Bypass the stored result and issue a new paid request when admitted."),
};
export const analyzeAiVisibilityInputSchema = z.strictObject({
  ...aiAnalysisFields,
  target_type: z
    .enum(["brand", "domain"])
    .default("domain")
    .describe("Match a brand name or a domain."),
  platform: z
    .enum(["chat_gpt", "google"])
    .default("chat_gpt")
    .describe("Provider observed dataset: ChatGPT or Google AI Overview."),
  location_code: z.number().int().min(1).default(2840).describe("Provider location code."),
  language_code: z
    .string()
    .regex(/^[a-z]{2}(?:-[A-Z]{2})?$/)
    .default("en")
    .describe("Dataset language."),
  limit: z.number().int().min(1).max(20).default(10).describe("Maximum mention rows."),
  idempotency_key: idempotencyKey,
});
export const getAiResearchCatalogInputSchema = getProjectContextInputSchema;
export const compareAiPromptsInputSchema = z
  .strictObject({
    ...aiAnalysisFields,
    max_cost_cents: aiAnalysisFields.max_cost_cents.optional(),
    fresh: aiAnalysisFields.fresh.describe(
      "Hard-cap mode bypasses stored results. Actual-cost retries always reuse their durable request identity; fresh never re-dispatches a pending, unknown or completed attempt.",
    ),
    cost_policy: z
      .enum(["hard_cap", "provider_actual_cost"])
      .default("hard_cap")
      .describe("Hard cap or explicitly consented non-guaranteed actual provider cost."),
    actual_cost_acknowledgement: z
      .literal("non_guaranteed_estimate_v1")
      .optional()
      .describe("Explicit acknowledgement that actual provider cost has no guaranteed maximum."),
    estimated_cost_limit_cents: z
      .number()
      .int()
      .min(0)
      .max(1000)
      .optional()
      .describe("Advisory estimate limit in cents for actual-cost consent."),
    estimate_credentials_ref: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional()
      .describe("Credential identity from the estimate, required for actual-cost execution."),
    prompt: z
      .string()
      .min(1)
      .max(500)
      .refine((value) => new TextEncoder().encode(value).length <= 2000)
      .describe("Same synthetic prompt for each model; maximum 2000 UTF-8 bytes."),
    models: z
      .array(
        z
          .string()
          .min(1)
          .max(120)
          .regex(/^[A-Za-z0-9][A-Za-z0-9._:-]*$/),
      )
      .min(1)
      .max(2)
      .refine((models) => new Set(models).size === models.length)
      .optional()
      .meta({ uniqueItems: true })
      .describe("Distinct model IDs advertised by get_ai_research_catalog."),
    web_search: z.boolean().default(false).describe("Enable provider web search when supported."),
    country_iso_code: z
      .string()
      .regex(/^[A-Z]{2}$/)
      .optional()
      .describe("Country hint; requires web search."),
    response_language: z
      .string()
      .regex(/^[a-z]{2,3}(?:-[a-zA-Z0-9]{2,4})?$/)
      .default("en")
      .describe("Requested response language."),
    max_output_tokens: z
      .number()
      .int()
      .min(16)
      .max(4096)
      .default(512)
      .describe("Maximum output tokens; provider limits also apply."),
    idempotency_key: z
      .string()
      .min(1)
      .max(160)
      .optional()
      .describe(
        "Stable retry key sent as a header; actual-cost mode requires a UUID also sent in the body.",
      ),
  })
  .superRefine((value, context) => {
    const issue = (path: string, message: string) =>
      context.addIssue({ code: "custom", path: [path], message });
    if (value.country_iso_code && !value.web_search)
      issue("country_iso_code", "Country hints require web search.");
    if (value.cost_policy === "hard_cap") {
      if (value.max_cost_cents === undefined)
        issue("max_cost_cents", "A hard cost cap is required.");
      for (const key of [
        "actual_cost_acknowledgement",
        "estimated_cost_limit_cents",
        "estimate_credentials_ref",
      ] as const)
        if (value[key] !== undefined) issue(key, "This field requires actual-cost policy.");
    } else {
      if (value.idempotency_key !== undefined && !z.uuid().safeParse(value.idempotency_key).success)
        issue("idempotency_key", "Actual-cost policy requires a stable UUID.");
      if (value.max_cost_cents !== undefined)
        issue("max_cost_cents", "Actual cost has no guaranteed maximum.");
      for (const key of ["actual_cost_acknowledgement", "estimated_cost_limit_cents"] as const)
        if (value[key] === undefined)
          issue(key, "Explicit consent and an advisory limit are required.");
      if (!value.estimate_only)
        for (const key of ["idempotency_key", "estimate_credentials_ref"] as const)
          if (value[key] === undefined)
            issue(key, "Execution requires estimate identity and a stable request ID.");
    }
  })
  .meta(promptCostPolicyJsonSchema);
export const runSiteAuditInputSchema = z.strictObject({
  project_id: projectId,
  max_pages: z
    .number()
    .int()
    .min(1)
    .max(15)
    .default(10)
    .describe("Maximum pages in this bounded crawl."),
  idempotency_key: idempotencyKey,
});
export const listSiteAuditsInputSchema = z.strictObject({ project_id: projectId });
export const getSiteAuditInputSchema = z.strictObject({
  project_id: projectId,
  report_id: reportId,
});
