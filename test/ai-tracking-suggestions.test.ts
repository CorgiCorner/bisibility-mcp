import { describe, expect, it, vi } from "vitest";
import { aiTrackingSchemas } from "../src/ai-tracking-schemas.js";
import { aiTrackingSuggestionSchemas } from "../src/ai-tracking-suggestion-schemas.js";
import { type BisibilityToolClient, registerBisibilityTools } from "../src/tools.js";
const project = "prj_abcdefghijklmnopqrstuvwx";
const key = "11111111-1111-4111-8111-111111111111";
const input = {
  configuration: {
    provider: "dataforseo",
    engine: "chat_gpt",
    model: "gpt-5-mini",
    language_code: "en",
    max_output_tokens: 1024,
    advisory_cost_limit_cents: 50,
  },
  input_snapshot: {
    context: {
      business: "Example",
      audience: "Teams",
      products: "Analytics",
      goals: "Visibility",
      agent_rules: "Review claims",
    },
    competitors: [],
  },
};
const preview = {
  ...input,
  version: 1,
  snapshot_hash: "a".repeat(64),
  estimated_cost_cents: 0.5,
  estimate_kind: "forecast",
  is_guaranteed_maximum: false,
  credential_connection_id: "conn_abcdefghijklmnopqrstuvwx",
  credential_version: "v1",
  budget_revision: "b1",
  consent_revision: "c1",
  expires_at: "2026-10-08T23:00:00Z",
  limitations: [],
};
function harness(readOnly = false) {
  const handlers = new Map<string, (input: unknown) => Promise<unknown>>();
  const configs = new Map<
    string,
    { annotations: { readOnlyHint: boolean; openWorldHint: boolean } }
  >();
  const client = {
    aiTrackingSuggestionsPreview: vi.fn(async () => ({ data: preview })),
    aiTrackingSuggestionsGenerate: vi.fn(async () => ({
      data: { generation_id: "asg_abcdefghijklmnopqrstuvwx" },
    })),
  };
  registerBisibilityTools(
    {
      registerTool(name: string, config: never, handler: never) {
        configs.set(name, config);
        handlers.set(name, handler);
      },
    } as never,
    { client: client as unknown as BisibilityToolClient, toolsets: ["ai-tracking"], readOnly },
  );
  return { client, handlers, configs };
}
describe("reviewed model generation MCP contract", () => {
  it("retains context review and new preview in read-only sessions and excludes paid generation", () => {
    const { configs } = harness(true);
    expect(configs.get("ai_tracking_suggestions_preview")?.annotations.readOnlyHint).toBe(true);
    expect(configs.has("suggest_ai_tracking_prompts")).toBe(true);
    expect(configs.has("ai_tracking_suggestions_generate")).toBe(false);
    expect(
      harness().configs.get("ai_tracking_suggestions_generate")?.annotations.openWorldHint,
    ).toBe(true);
  });
  it("delegates the exact snapshot and frozen preview to SDK with header-only UUID", async () => {
    const { client, handlers } = harness();
    await handlers.get("ai_tracking_suggestions_preview")?.({ project_id: project, ...input });
    expect(client.aiTrackingSuggestionsPreview).toHaveBeenCalledWith(project, input);
    await handlers.get("ai_tracking_suggestions_generate")?.({
      project_id: project,
      preview,
      consent: true,
      idempotency_key: key,
    });
    expect(client.aiTrackingSuggestionsGenerate).toHaveBeenCalledWith(
      project,
      { preview, consent: true },
      { idempotencyKey: key },
    );
  });
  it("rejects oversized Unicode review, missing consent and fabricated popularity/provenance", () => {
    for (const field of ["business", "audience", "products", "goals", "agent_rules"]) {
      expect(
        aiTrackingSuggestionSchemas.aiTrackingSuggestionsPreview.safeParse({
          project_id: project,
          ...input,
          input_snapshot: {
            ...input.input_snapshot,
            context: { ...input.input_snapshot.context, [field]: "🐕".repeat(2600) },
          },
        }).success,
      ).toBe(true);
    }
    const oversized = {
      ...input,
      input_snapshot: {
        ...input.input_snapshot,
        context: { ...input.input_snapshot.context, business: "🐕".repeat(5000) },
      },
    };
    expect(
      aiTrackingSuggestionSchemas.aiTrackingSuggestionsPreview.safeParse({
        project_id: project,
        ...oversized,
      }).success,
    ).toBe(false);
    expect(
      aiTrackingSuggestionSchemas.aiTrackingSuggestionsGenerate.safeParse({
        project_id: project,
        preview,
        consent: false,
        idempotency_key: key,
      }).success,
    ).toBe(false);
    expect(
      aiTrackingSuggestionSchemas.aiTrackingSuggestionsGenerate.safeParse({
        project_id: project,
        preview,
        consent: true,
        idempotency_key: "stable",
      }).success,
    ).toBe(false);
    const draft = {
      text: "Edited model hypothesis?",
      category: "neutral",
      provenance: "model_generated_hypothesis",
      generation_reference: { generation_id: "asg_abcdefghijklmnopqrstuvwx", draft_id: key },
    };
    expect(
      aiTrackingSchemas.acceptAiTrackingSuggestions.safeParse({
        project_id: project,
        drafts: [draft],
      }).success,
    ).toBe(true);
    expect(
      aiTrackingSchemas.acceptAiTrackingSuggestions.safeParse({
        project_id: project,
        drafts: [{ ...draft, generation_reference: undefined }],
      }).success,
    ).toBe(false);
    expect(
      aiTrackingSchemas.acceptAiTrackingSuggestions.safeParse({
        project_id: project,
        drafts: [{ ...draft, popularity: 100 }],
      }).success,
    ).toBe(false);
  });
  it("checks authoritative competitors and both trusted provenance channels", () => {
    const competitor = {
      id: "cmp_abcdefghijklmnopqrstuvwx",
      label: null,
      domain: "competitor.example.com",
    };
    expect(
      aiTrackingSuggestionSchemas.aiTrackingSuggestionsPreview.safeParse({
        project_id: project,
        ...input,
        input_snapshot: { ...input.input_snapshot, competitors: [competitor] },
      }).success,
    ).toBe(true);
    expect(
      aiTrackingSuggestionSchemas.aiTrackingSuggestionsPreview.safeParse({
        project_id: project,
        ...input,
        input_snapshot: { ...input.input_snapshot, competitors: [competitor, competitor] },
      }).success,
    ).toBe(false);
    const generation_reference = { generation_id: "asg_abcdefghijklmnopqrstuvwx", draft_id: key };
    const provider_dataset_reference = { report_id: "agr_abcdefghijklmnopqrstuvwx", row_index: 0 };
    const parse = (draft: unknown) =>
      aiTrackingSchemas.acceptAiTrackingSuggestions.safeParse({
        project_id: project,
        drafts: [draft],
      }).success;
    const draft = { text: "Dataset prompt?", category: "neutral", provenance: "provider_dataset" };
    expect(parse(draft)).toBe(false);
    expect(parse({ ...draft, provider_dataset_reference })).toBe(true);
    expect(parse({ ...draft, provider_dataset_reference, generation_reference })).toBe(false);
    expect(parse({ text: "Unverified?", category: "neutral", evidence_ids: ["fake"] })).toBe(false);
    expect(parse({ ...draft, provider_dataset_reference, evidence_ids: ["stored-row"] })).toBe(
      true,
    );
  });
});
