import { BisibilityClient } from "@bisibility/sdk";
import { describe, expect, it, vi } from "vitest";
import { aiTrackingSchemas } from "../src/ai-tracking-schemas.js";
import { registerBisibilityTools } from "../src/tools.js";

const project = "prj_abcdefghijklmnopqrstuvwx";
const schedule = "ais_abcdefghijklmnopqrstuvwx";
const configuration = {
  prompt_ids: ["aip_abcdefghijklmnopqrstuvwx"],
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
const fields = {
  name: "Weekly",
  cron: "0 8 * * 1",
  timezone: "Etc/UTC",
  configuration,
};
const updateScope = { project_id: project, schedule_id: schedule };
const operations = ["create", "update"] as const;
const consentCases = [undefined, false, true] as const;
const patches = [
  { name: "Renamed" },
  { cron: "0 9 * * 1" },
  { timezone: "Europe/Warsaw" },
  { enabled: false },
  { configuration },
  { next_run_at: null },
];

function harness(savedEnabled = false) {
  const handlers = new Map<string, (input: unknown) => Promise<{ isError?: boolean }>>();
  const fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    if (String(url).endsWith("/capabilities"))
      return Response.json({ apiVersions: ["v1"], data: [] });
    const body = JSON.parse(String(init?.body));
    if (body.configuration && (body.enabled ?? savedEnabled) && body.consent !== true)
      return Response.json(
        { status: 400, title: "Explicit recurring consent is required." },
        { status: 400, headers: { "content-type": "application/problem+json" } },
      );
    return Response.json({
      data: {
        ...fields,
        id: schedule,
        enabled: false,
        archived_at: null,
        created_at: "2026-10-09T00:00:00Z",
        updated_at: "2026-10-09T00:00:00Z",
      },
    });
  });
  registerBisibilityTools(
    {
      registerTool(name: string, _config: never, handler: never) {
        handlers.set(name, handler);
      },
    } as never,
    {
      client: new BisibilityClient({
        apiKey: "bsb_key_test_schedule",
        baseUrl: "https://api.example.com/api/v1",
        fetch,
      }),
      toolsets: ["ai-tracking"],
    },
  );
  async function invoke(
    operation: (typeof operations)[number],
    input: unknown,
    expectedError = false,
  ) {
    const handler = handlers.get(`${operation}_ai_tracking_schedule`);
    expect(handler).toBeDefined();
    const result = await handler?.(input);
    expect(result?.isError === true, JSON.stringify(result)).toBe(expectedError);
    const writes = fetch.mock.calls.filter(([, init]) => init?.method !== "GET");
    expect(writes).toHaveLength(1);
    const write = writes[0];
    if (!write) throw new Error("The schedule handler did not invoke the SDK transport.");
    const [url, init] = write;
    expect(String(url)).toBe(
      `https://api.example.com/api/v1/projects/${project}/ai-tracking/schedules${operation === "update" ? `/${schedule}` : ""}`,
    );
    expect(init?.method).toBe(operation === "create" ? "POST" : "PATCH");
    return JSON.parse(String(init?.body));
  }
  return { invoke };
}

describe("AI tracking schedule schemas", () => {
  it("keeps the disabled creation default without inventing recurring consent", () => {
    const parsed = aiTrackingSchemas.createAiTrackingSchedule.parse({
      project_id: project,
      ...fields,
    });
    expect(parsed.enabled).toBe(false);
    expect(parsed).not.toHaveProperty("consent");
    expect(parsed.configuration.consent).toBe(true);
  });

  it("leaves enabled absent when updating schedule fields", () => {
    const input = { ...updateScope, ...fields };
    expect(aiTrackingSchemas.updateAiTrackingSchedule.parse(input)).toEqual(input);
  });

  it.each(patches)("accepts a partial update %j without adding fields", (patch) => {
    const input = { ...updateScope, ...patch };
    expect(aiTrackingSchemas.updateAiTrackingSchedule.parse(input)).toEqual(input);
  });

  it.each(operations)("preserves explicit or absent top-level %s consent", (operation) => {
    const schema =
      operation === "create"
        ? aiTrackingSchemas.createAiTrackingSchedule
        : aiTrackingSchemas.updateAiTrackingSchedule;
    for (const consent of consentCases) {
      const input = {
        ...(operation === "create" ? { project_id: project } : updateScope),
        ...fields,
        enabled: true,
        ...(consent === undefined ? {} : { consent }),
      };
      expect(schema.parse(input)).toEqual(input);
      expect(schema.safeParse({ ...input, consent: "true" }).success).toBe(false);
    }
  });

  it("retains required creation fields and complete reviewed configuration validation", () => {
    expect(
      aiTrackingSchemas.createAiTrackingSchedule.safeParse({ project_id: project, enabled: false })
        .success,
    ).toBe(false);
    for (const invalidConfiguration of [{ consent: true }, { ...configuration, consent: false }]) {
      expect(
        aiTrackingSchemas.updateAiTrackingSchedule.safeParse({
          ...updateScope,
          configuration: invalidConfiguration,
        }).success,
      ).toBe(false);
    }
    expect(
      aiTrackingSchemas.updateAiTrackingSchedule.safeParse({ ...updateScope, extra: true }).success,
    ).toBe(false);
  });
});

describe("AI tracking schedule handlers through the SDK", () => {
  it("sends the disabled creation default without deriving consent from configuration", async () => {
    const body = await harness().invoke("create", { project_id: project, ...fields });
    expect(body).toEqual({ ...fields, enabled: false });
    expect(body).not.toHaveProperty("consent");
  });

  it("sends a full configuration update without implicitly disabling the schedule", async () => {
    const body = await harness().invoke("update", { ...updateScope, ...fields });
    expect(body).toEqual(fields);
    expect(body).not.toHaveProperty("enabled");
  });

  it.each(patches)("sends only the supplied PATCH fields %j", async (patch) => {
    expect(await harness().invoke("update", { ...updateScope, ...patch })).toEqual(patch);
  });

  it("preserves the API consent guard for configuration changes on enabled schedules", async () => {
    for (const consent of consentCases) {
      const payload = { configuration, ...(consent === undefined ? {} : { consent }) };
      const body = await harness(true).invoke(
        "update",
        { ...updateScope, ...payload },
        consent !== true,
      );
      expect(body).toEqual(payload);
      expect(body).not.toHaveProperty("enabled");
    }
  });

  it.each(operations)("forwards %s consent exactly as supplied", async (operation) => {
    for (const consent of consentCases) {
      const payload = {
        ...fields,
        enabled: true,
        ...(consent === undefined ? {} : { consent }),
      };
      const body = await harness().invoke(
        operation,
        {
          ...(operation === "create" ? { project_id: project } : updateScope),
          ...payload,
        },
        consent !== true,
      );
      expect(body).toEqual(payload);
      expect(body.configuration.consent).toBe(true);
      if (consent === undefined) expect(body).not.toHaveProperty("consent");
      else expect(body.consent).toBe(consent);
    }
  });
});
