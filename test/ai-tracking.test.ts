import { describe, expect, it, vi } from "vitest";
import { aiTrackingSchemas } from "../src/ai-tracking-schemas.js";
import { compareAiPromptsInputSchema } from "../src/research-workspace-schemas.js";
import { type BisibilityToolClient, registerBisibilityTools } from "../src/tools.js";

const project = "prj_abcdefghijklmnopqrstuvwx";
const prompt = "aip_abcdefghijklmnopqrstuvwx";
const plan = {
  prompt_ids: [prompt],
  configurations: [
    {
      provider: "dataforseo",
      endpoint: "consumer_scrape",
      source: "consumer_scrape",
      engine: "chat_gpt",
      model: null,
      parameters: {},
    },
  ],
  credential_connection_id: "conn_abcdefghijklmnopqrstuvwx",
  credential_version: "v1",
  budget_revision: "b1",
  consent_revision: "c1",
  deadline: "2026-10-09T00:00:00Z",
  consent: true,
};
function harness(readOnly = false) {
  const configs = new Map<
    string,
    { annotations: { readOnlyHint: boolean; openWorldHint: boolean } }
  >();
  const handlers = new Map<string, (input: unknown) => Promise<unknown>>();
  const createAiTrackingRun = vi.fn(async () => ({ data: { id: "air_abcdefghijklmnopqrstuvwx" } }));
  const calls = new Map<string, ReturnType<typeof vi.fn>>();
  calls.set("createAiTrackingRun", createAiTrackingRun);
  const client = new Proxy(
    {},
    {
      get(_target, name: string) {
        if (!calls.has(name))
          calls.set(
            name,
            vi.fn(async () => ({ data: {} })),
          );
        return calls.get(name);
      },
    },
  ) as BisibilityToolClient;
  registerBisibilityTools(
    {
      registerTool(name: string, config: never, handler: never) {
        configs.set(name, config);
        handlers.set(name, handler);
      },
    } as never,
    { client, toolsets: ["ai-tracking"], readOnly },
  );
  return { configs, handlers, createAiTrackingRun, calls };
}
describe("tracking MCP contract", () => {
  it("exposes 26 operations and uses read scope for spend-free preview", () => {
    const { configs } = harness();
    expect(configs.size).toBe(27); // Includes the always-visible session profile.
    expect(configs.get("preview_ai_tracking_run")?.annotations.readOnlyHint).toBe(true);
    expect(configs.get("create_ai_tracking_run")?.annotations.openWorldHint).toBe(true);
    const reads = harness(true).configs;
    expect(reads.has("preview_ai_tracking_run")).toBe(true);
    expect(reads.has("create_ai_tracking_run")).toBe(false);
    expect(reads.has("accept_ai_tracking_suggestions")).toBe(false);
  });
  it("routes paid launch through the SDK and keeps the key out of the body", async () => {
    const { handlers, createAiTrackingRun } = harness();
    await handlers.get("create_ai_tracking_run")?.({
      project_id: project,
      ...plan,
      idempotency_key: "stable",
    });
    expect(createAiTrackingRun).toHaveBeenCalledExactlyOnceWith(project, plan, {
      idempotencyKey: "stable",
    });
  });
  it("delegates every operation to the matching SDK method with project scope", async () => {
    const { handlers, calls } = harness();
    const ids = {
      topic_id: "ait_abcdefghijklmnopqrstuvwx",
      prompt_id: prompt,
      schedule_id: "ais_abcdefghijklmnopqrstuvwx",
      run_id: "air_abcdefghijklmnopqrstuvwx",
    };
    for (const [method, schema] of Object.entries(aiTrackingSchemas)) {
      if (method === "aiTrackingSuggestionsPreview" || method === "aiTrackingSuggestionsGenerate")
        continue; // Covered by the frozen generation contract tests.
      const name = method.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      const fixture = {
        project_id: project,
        ...ids,
        ...plan,
        name: "Weekly",
        text: "Example?",
        cron: "0 8 * * 1",
        timezone: "Etc/UTC",
        configuration: plan,
        idempotency_key: "stable",
        drafts: [
          {
            text: "Example?",
            category: "neutral",
            provenance: "generated_hypothesis",
            evidence_ids: [],
            popularity: null,
            accepted: false,
          },
        ],
      };
      // Strip unrelated fields using the authoritative object shape, while retaining required values.
      const selected = Object.fromEntries(
        Object.keys(schema.shape)
          .filter((key) => key in fixture)
          .map((key) => [key, fixture[key as keyof typeof fixture]]),
      );
      const parsed = schema.parse(selected);
      await handlers.get(name)?.(parsed);
      expect(calls.get(method)).toHaveBeenCalledOnce();
      expect(calls.get(method)?.mock.calls[0]?.[0]).toBe(project);
    }
  });
  it("validates typed resource IDs, explicit consent and strict payloads", () => {
    expect(
      aiTrackingSchemas.previewAiTrackingRun.safeParse({
        project_id: project,
        prompt_ids: [prompt],
        configurations: plan.configurations,
      }).success,
    ).toBe(true);
    expect(
      aiTrackingSchemas.createAiTrackingRun.safeParse({
        project_id: project,
        ...plan,
        consent: false,
        idempotency_key: "stable",
      }).success,
    ).toBe(false);
    expect(
      aiTrackingSchemas.getAiTrackingRun.safeParse({ project_id: project, run_id: prompt }).success,
    ).toBe(false);
    expect(
      aiTrackingSchemas.previewAiTrackingRun.safeParse({
        project_id: project,
        prompt_ids: [prompt],
        configurations: plan.configurations,
        extra: true,
      }).success,
    ).toBe(false);
  });
  it("preserves catalog model selection and actual-cost consent semantics", () => {
    const input = {
      project_id: project,
      brand: "Example",
      domain: "example.com",
      prompt: "Example?",
      models: ["gpt-5-mini"],
      estimate_only: true,
      cost_policy: "provider_actual_cost",
      actual_cost_acknowledgement: "non_guaranteed_estimate_v1",
      estimated_cost_limit_cents: 0,
    };
    expect(compareAiPromptsInputSchema.safeParse(input).success).toBe(true);
    expect(compareAiPromptsInputSchema.safeParse({ ...input, estimate_only: false }).success).toBe(
      false,
    );
    expect(compareAiPromptsInputSchema.safeParse({ ...input, max_cost_cents: 0 }).success).toBe(
      false,
    );
  });
});
