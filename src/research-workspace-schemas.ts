import * as z from "zod/v4";
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
export const compareAiPromptsInputSchema = z.strictObject({
  ...aiAnalysisFields,
  prompt: z
    .string()
    .min(1)
    .max(500)
    .describe("The same synthetic test prompt for each selected model. Maximum 2000 UTF-8 bytes."),
  models: z
    .array(z.enum(["gpt-4.1-mini", "gpt-4.1-nano"]))
    .min(1)
    .max(2)
    .refine((models) => new Set(models).size === models.length, "Models must be unique.")
    .optional()
    .meta({ uniqueItems: true })
    .describe(
      "Bounded, supported non-reasoning models; web search is disabled in this first version.",
    ),
  idempotency_key: idempotencyKey,
});
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
