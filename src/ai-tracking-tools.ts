import { registerAiTrackingCatalogTools } from "./ai-tracking-catalog-tools.js";
import { registerAiTrackingRunTools } from "./ai-tracking-run-tools.js";
import { registerAiTrackingSuggestionTools } from "./ai-tracking-suggestion-tools.js";
import type { BisibilityToolClient, registerTool } from "./tools.js";

export function registerAiTrackingTools(
  registration: Parameters<typeof registerTool>[0],
  client: BisibilityToolClient,
) {
  registerAiTrackingCatalogTools(registration, client);
  registerAiTrackingRunTools(registration, client);
  registerAiTrackingSuggestionTools(registration, client);
}
