import * as z from "zod/v4";
import { aiTrackingSuggestionSchemas } from "./ai-tracking-suggestion-schemas.js";
import { publicIdInput } from "./schemas.js";

const trackingIdPrefixes = ["ait", "aip", "ais", "air", "asg"] as const;
type TrackingIdPrefix = (typeof trackingIdPrefixes)[number];
const trackingIdPrefixSet = new Set<string>(trackingIdPrefixes);

function trackingIdPattern(prefix: TrackingIdPrefix) {
  if (!trackingIdPrefixSet.has(prefix)) {
    throw new Error(`Unsupported tracking ID prefix: ${prefix}.`);
  }
  // This interpolation is safe: prefix is checked against the closed registry above.
  // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
  return new RegExp(`^${prefix}_[a-z][a-z0-9]{23}$`);
}

const trackingId = <P extends TrackingIdPrefix>(prefix: P, description: string) =>
  z
    .string()
    .regex(trackingIdPattern(prefix))
    .transform((value) => value as `${P}_${string}`)
    .describe(description);
const project = publicIdInput("prj").describe(
  "Public project ID; membership and token scope are enforced.",
);
const topic = trackingId("ait", "Public topic ID scoped to this project.");
const prompt = trackingId("aip", "Public prompt ID scoped to this project.");
const schedule = trackingId("ais", "Public schedule ID scoped to this project.");
const run = trackingId("air", "Public tracking run ID scoped to this project.");
const page = {
  limit: z.number().int().min(1).max(100).optional().describe("Page size, at most 100."),
  cursor: z.string().max(512).optional().describe("Opaque cursor from the previous response."),
};
export const trackingSourceConfiguration = z.strictObject({
  provider: z.literal("dataforseo").describe("Provider that supplies this observation."),
  endpoint: z.string().min(1).max(256).describe("Capability-supported provider endpoint."),
  engine: z
    .enum(["chat_gpt", "gemini", "claude", "perplexity", "google"])
    .describe("Consumer engine, distinct from the model and observation source."),
  source: z
    .enum(["consumer_scrape", "model_api", "google_aio"])
    .describe("Observation mechanism; model API responses are synthetic tests."),
  model: z
    .string()
    .max(256)
    .nullable()
    .describe("Requested model, or null when unavailable for this source."),
  parameters: z
    .record(z.string(), z.json())
    .describe("Requested provider parameters; capability and fresh price checks fail closed."),
});
const preview = {
  prompt_ids: z
    .array(prompt)
    .min(1)
    .max(100)
    .describe("Active public prompt IDs to observe; each run captures immutable revisions."),
  configurations: z
    .array(trackingSourceConfiguration)
    .min(1)
    .max(20)
    .describe("Exact observation configurations to review before paid launch."),
  credential_connection_id: publicIdInput("conn")
    .optional()
    .describe("Project provider connection; credentials are never accepted here."),
};
const plan = {
  ...preview,
  credential_connection_id: publicIdInput("conn").describe(
    "Provider connection returned by the reviewed preview.",
  ),
  credential_version: z
    .string()
    .min(1)
    .describe("Credential identity version returned by preview."),
  budget_revision: z.string().min(1).describe("Budget revision returned by preview."),
  consent_revision: z.string().min(1).describe("Consent identity returned by preview."),
  deadline: z.iso.datetime().describe("UTC deadline after which work must stop."),
  consent: z
    .literal(true)
    .describe("Explicit acceptance of paid provider work for this reviewed configuration."),
  schedule_id: schedule.optional(),
  planned_at: z.iso
    .datetime()
    .optional()
    .describe("UTC scheduled occurrence; supplied together with schedule_id."),
};
const key = z
  .string()
  .min(1)
  .max(200)
  .describe("Stable launch retry key sent as REST Idempotency-Key; payload must remain identical.");
const topicFields = {
  paused: z
    .boolean()
    .optional()
    .describe(
      "Pause or resume future planning for this topic without changing historical samples.",
    ),
  name: z.string().min(1).max(200).describe("Human-readable topic name."),
  description: z.string().max(4000).nullable().optional().describe("Optional topic description."),
};
const generationReference = z
  .strictObject({
    generation_id: trackingId("asg", "Trusted completed project generation public ID."),
    draft_id: z
      .uuid()
      .describe("Original generated draft UUID; edits retain this trusted reference."),
  })
  .optional()
  .describe(
    "Trusted model generation provenance, verified against the completed project generation.",
  );
const providerDatasetReference = z
  .strictObject({
    report_id: publicIdInput("agr").describe(
      "Trusted project AI visibility dataset report public ID.",
    ),
    row_index: z
      .number()
      .int()
      .min(0)
      .describe("Verified observed-dataset row index in the stored report."),
  })
  .optional()
  .describe("Trusted provider dataset provenance, validated against the project report.");
const promptFields = {
  generation_reference: generationReference,
  provider_dataset_reference: providerDatasetReference,
  text: z
    .string()
    .min(1)
    .max(64000)
    .describe("Prompt text; updates create a new immutable revision."),
  category: z
    .enum(["neutral", "comparative", "branded"])
    .optional()
    .describe("Prompt intent captured in its immutable revision."),
  paused: z
    .boolean()
    .optional()
    .describe("Pause or resume future planning without altering historical samples."),
  topic_id: topic.nullable().optional(),
  label: z.string().max(200).nullable().optional().describe("Optional display label."),
};
const scheduleFields = {
  name: z.string().min(1).max(200).describe("Human-readable schedule name."),
  cron: z.string().min(1).max(200).describe("Cron recurrence evaluated in the schedule timezone."),
  timezone: z.string().min(1).max(100).describe("IANA timezone for this schedule."),
  enabled: z.boolean().describe("Whether future scheduled occurrences are enabled."),
  consent: z
    .boolean()
    .optional()
    .describe(
      "Explicit acceptance of paid recurring work; the API requires true when enabling a schedule or changing configuration while enabled.",
    ),
  configuration: z
    .strictObject(plan)
    .describe("Reviewed immutable configuration for each scheduled occurrence."),
  next_run_at: z.iso
    .datetime()
    .nullable()
    .optional()
    .describe("Next planned UTC occurrence, when provided."),
};
const suggestion = z
  .strictObject({
    generation_reference: generationReference,
    provider_dataset_reference: providerDatasetReference,
    text: z.string().min(3).max(4000).describe("Draft prompt text."),
    category: z.enum(["neutral", "comparative", "branded"]).describe("Draft intent category."),
    provenance: z
      .enum(["generated_hypothesis", "provider_dataset", "model_generated_hypothesis"])
      .optional()
      .describe("How this draft was obtained; hypotheses are not measured popularity."),
    evidence_ids: z
      .array(z.string())
      .max(30)
      .optional()
      .describe("Evidence references for a provider dataset draft."),
    popularity: z.null().optional().describe("Measured popularity when supported, otherwise null."),
    accepted: z
      .literal(false)
      .optional()
      .describe("Unaccepted draft; this operation explicitly saves it."),
  })
  .superRefine((draft, ctx) => {
    const issue = (message: string) => ctx.addIssue({ code: "custom", message });
    if (draft.generation_reference && draft.provider_dataset_reference)
      issue("Choose one trusted provenance reference.");
    if (draft.provenance === "model_generated_hypothesis" && !draft.generation_reference)
      issue("Model drafts require a trusted generation reference.");
    if (draft.provenance === "provider_dataset" && !draft.provider_dataset_reference)
      issue("Provider datasets require a trusted report reference.");
    if (
      draft.evidence_ids?.length &&
      !draft.generation_reference &&
      !draft.provider_dataset_reference
    )
      issue("Evidence claims require a trusted provenance reference.");
  });
const scope = { project_id: project };
export const aiTrackingSchemas = {
  listAiTrackingTopics: z.strictObject({ ...scope, ...page }),
  createAiTrackingTopic: z.strictObject({ ...scope, ...topicFields }),
  updateAiTrackingTopic: z.strictObject({
    ...scope,
    topic_id: topic,
    ...z.strictObject(topicFields).partial().shape,
  }),
  archiveAiTrackingTopic: z.strictObject({ ...scope, topic_id: topic }),
  listAiTrackingPrompts: z.strictObject({ ...scope, ...page }),
  createAiTrackingPrompt: z.strictObject({ ...scope, ...promptFields }),
  updateAiTrackingPrompt: z.strictObject({
    ...scope,
    prompt_id: prompt,
    ...z.strictObject(promptFields).partial().shape,
  }),
  archiveAiTrackingPrompt: z.strictObject({ ...scope, prompt_id: prompt }),
  listAiTrackingSchedules: z.strictObject({ ...scope, ...page }),
  createAiTrackingSchedule: z.strictObject({
    ...scope,
    ...scheduleFields,
    enabled: scheduleFields.enabled
      .default(false)
      .describe("Schedules default to disabled; no paid baseline or missed-run catch-up."),
  }),
  updateAiTrackingSchedule: z.strictObject({
    ...scope,
    schedule_id: schedule,
    ...z.strictObject(scheduleFields).partial().shape,
  }),
  archiveAiTrackingSchedule: z.strictObject({ ...scope, schedule_id: schedule }),
  previewAiTrackingRun: z.strictObject({ ...scope, ...preview }),
  createAiTrackingRun: z.strictObject({ ...scope, ...plan, idempotency_key: key }),
  listAiTrackingRuns: z.strictObject({ ...scope, ...page }),
  getAiTrackingRun: z.strictObject({ ...scope, run_id: run }),
  listAiTrackingSamples: z.strictObject({ ...scope, run_id: run, ...page }),
  cancelAiTrackingRun: z.strictObject({ ...scope, run_id: run }),
  retryAiTrackingRun: z.strictObject({ ...scope, run_id: run, ...plan, idempotency_key: key }),
  getAiTrackingHistory: z.strictObject({ ...scope, ...page }),
  getAiTrackingTrends: z.strictObject({
    ...scope,
    run_id: run,
    previous_run_id: run.optional(),
    ...page,
  }),
  exportAiTrackingEvidence: z.strictObject({
    ...scope,
    run_id: run,
    ...page,
    format: z
      .enum(["json", "csv"])
      .default("json")
      .describe("JSON evidence with cursor metadata, or one CSV evidence page."),
  }),
  suggestAiTrackingPrompts: z.strictObject(scope),
  acceptAiTrackingSuggestions: z.strictObject({
    ...scope,
    drafts: z
      .array(suggestion)
      .min(1)
      .max(20)
      .describe("Drafts explicitly accepted for saving; this starts no provider work."),
  }),
  ...aiTrackingSuggestionSchemas,
};
