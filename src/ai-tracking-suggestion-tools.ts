import type { BisibilityClient } from "@bisibility/sdk";
import { aiTrackingSuggestionSchemas } from "./ai-tracking-suggestion-schemas.js";
import { type BisibilityToolClient, registerTool } from "./tools.js";

export function registerAiTrackingSuggestionTools(
  registration: Parameters<typeof registerTool>[0],
  client: BisibilityToolClient,
) {
  registerTool(
    registration,
    "ai_tracking_suggestions_preview",
    {
      access: "read",
      group: "ai-tracking",
      title: "Preview AI prompt model generation",
      description:
        "Review the full business context, chosen competitors, model and market before model generation. This spend-free forecast never calls a model or reserves budget; its estimate is not a guaranteed maximum.",
      inputSchema: aiTrackingSuggestionSchemas.aiTrackingSuggestionsPreview,
      publishClosedSchema: true,
    },
    async ({ project_id, ...input }) =>
      client.aiTrackingSuggestionsPreview(
        project_id,
        input as Parameters<BisibilityClient["aiTrackingSuggestionsPreview"]>[1],
      ),
  );
  registerTool(
    registration,
    "ai_tracking_suggestions_generate",
    {
      access: "write",
      group: "ai-tracking",
      title: "Generate AI prompt hypotheses",
      description:
        "Generate editable hypotheses from the exact reviewed preview with explicit paid consent and a stable retry UUID. Generated prompts are hypotheses with no measured popularity and are saved only after separate acceptance.",
      inputSchema: aiTrackingSuggestionSchemas.aiTrackingSuggestionsGenerate,
      publishClosedSchema: true,
    },
    async ({ project_id, idempotency_key, ...input }) =>
      client.aiTrackingSuggestionsGenerate(
        project_id,
        input as Parameters<BisibilityClient["aiTrackingSuggestionsGenerate"]>[1],
        { idempotencyKey: idempotency_key },
      ),
  );
}
