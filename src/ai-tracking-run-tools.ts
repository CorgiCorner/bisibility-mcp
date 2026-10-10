import type { BisibilityClient } from "@bisibility/sdk";
import { aiTrackingSchemas } from "./ai-tracking-schemas.js";
import { type BisibilityToolClient, registerTool } from "./tools.js";

export function registerAiTrackingRunTools(
  registration: Parameters<typeof registerTool>[0],
  client: BisibilityToolClient,
) {
  registerTool(
    registration,
    "preview_ai_tracking_run",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Review capability, credentials, budget and price before paid AI tracking. Preview never submits a provider task.",
      destructive: false,
      inputSchema: aiTrackingSchemas.previewAiTrackingRun,
      publishClosedSchema: true,
      title: "Preview ai tracking run",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.previewAiTrackingRun(
        input.project_id,
        payload as Parameters<BisibilityClient["previewAiTrackingRun"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "create_ai_tracking_run",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.createAiTrackingRun,
      publishClosedSchema: true,
      title: "Create ai tracking run",
    },
    async (input) => {
      const { project_id, idempotency_key, ...payload } = input;
      return client.createAiTrackingRun(
        input.project_id,
        payload as Parameters<BisibilityClient["createAiTrackingRun"]>[1],
        { idempotencyKey: input.idempotency_key },
      );
    },
  );
  registerTool(
    registration,
    "list_ai_tracking_runs",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.listAiTrackingRuns,
      publishClosedSchema: true,
      title: "List ai tracking runs",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.listAiTrackingRuns(
        input.project_id,
        payload as Parameters<BisibilityClient["listAiTrackingRuns"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "get_ai_tracking_run",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.getAiTrackingRun,
      publishClosedSchema: true,
      title: "Get ai tracking run",
    },
    async (input) => {
      return client.getAiTrackingRun(input.project_id, input.run_id);
    },
  );
  registerTool(
    registration,
    "list_ai_tracking_samples",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.listAiTrackingSamples,
      publishClosedSchema: true,
      title: "List ai tracking samples",
    },
    async (input) => {
      const { project_id, run_id, ...payload } = input;
      return client.listAiTrackingSamples(
        input.project_id,
        input.run_id,
        payload as Parameters<BisibilityClient["listAiTrackingSamples"]>[2],
      );
    },
  );
  registerTool(
    registration,
    "cancel_ai_tracking_run",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.cancelAiTrackingRun,
      publishClosedSchema: true,
      title: "Cancel ai tracking run",
    },
    async (input) => {
      return client.cancelAiTrackingRun(input.project_id, input.run_id);
    },
  );
  registerTool(
    registration,
    "retry_ai_tracking_run",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.retryAiTrackingRun,
      publishClosedSchema: true,
      title: "Retry ai tracking run",
    },
    async (input) => {
      const { project_id, run_id, idempotency_key, ...payload } = input;
      return client.retryAiTrackingRun(
        input.project_id,
        input.run_id,
        payload as Parameters<BisibilityClient["retryAiTrackingRun"]>[2],
        { idempotencyKey: input.idempotency_key },
      );
    },
  );
  registerTool(
    registration,
    "get_ai_tracking_history",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.getAiTrackingHistory,
      publishClosedSchema: true,
      title: "Get ai tracking history",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.getAiTrackingHistory(
        input.project_id,
        payload as Parameters<BisibilityClient["getAiTrackingHistory"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "get_ai_tracking_trends",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.getAiTrackingTrends,
      publishClosedSchema: true,
      title: "Get ai tracking trends",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.getAiTrackingTrends(
        input.project_id,
        payload as Parameters<BisibilityClient["getAiTrackingTrends"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "export_ai_tracking_evidence",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read project-scoped AI tracking evidence with original provenance, partial states, and cost uncertainty.",
      destructive: false,
      inputSchema: aiTrackingSchemas.exportAiTrackingEvidence,
      publishClosedSchema: true,
      title: "Export ai tracking evidence",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.exportAiTrackingEvidence(
        input.project_id,
        payload as Parameters<BisibilityClient["exportAiTrackingEvidence"]>[1],
      );
    },
  );
  registerTool(
    registration,
    "suggest_ai_tracking_prompts",
    {
      access: "read",
      group: "ai-tracking",
      description:
        "Read the complete project context and authoritative competitors for explicit review. Returned manual templates are heuristics with no measured popularity. This never generates with a model, saves a prompt or starts paid provider work.",
      destructive: false,
      inputSchema: aiTrackingSchemas.suggestAiTrackingPrompts,
      publishClosedSchema: true,
      title: "Suggest ai tracking prompts",
    },
    async (input) => {
      return client.suggestAiTrackingPrompts(input.project_id);
    },
  );
  registerTool(
    registration,
    "accept_ai_tracking_suggestions",
    {
      access: "write",
      group: "ai-tracking",
      description:
        "Manage project-scoped AI tracking. Preserve immutable revisions, explicit budget consent, and stable retry keys. This does not start an automatic paid baseline.",
      destructive: false,
      inputSchema: aiTrackingSchemas.acceptAiTrackingSuggestions,
      publishClosedSchema: true,
      title: "Accept ai tracking suggestions",
    },
    async (input) => {
      const { project_id, ...payload } = input;
      return client.acceptAiTrackingSuggestions(
        input.project_id,
        payload as Parameters<BisibilityClient["acceptAiTrackingSuggestions"]>[1],
      );
    },
  );
}
