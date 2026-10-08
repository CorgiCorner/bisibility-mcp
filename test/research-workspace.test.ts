import type { BisibilityClient } from "@bisibility/sdk";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, it, vi } from "vitest";
import {
  type BisibilityToolClient,
  createBisibilityMcpServer,
  registerBisibilityTools,
} from "../src/index.js";

const project = "prj_a00000000000000000000000";
const report = "agr_a00000000000000000000000";
const context = {
  business: "Example",
  audience: "Teams",
  products: "SEO",
  goals: "Growth",
  agent_rules: "Cite sources",
};
const analysis = { brand: "Example", domain: "example.com", max_cost_cents: 12 };
const reportBody = { SourceURL: "https://example.com", nested: { CaseSensitiveKey: "retained" } };
const cases = [
  ["get_project_context", "getProjectContext", { project_id: project }, [project]],
  [
    "update_project_context",
    "updateProjectContext",
    { project_id: project, ...context, idempotency_key: "stable-context" },
    [project, context, { idempotencyKey: "stable-context" }],
  ],
  [
    "list_agent_reports",
    "listAgentReports",
    { project_id: project, kind: "site_audit", limit: 20, cursor: "opaque+cursor" },
    [project, { kind: "site_audit", limit: 20, cursor: "opaque+cursor" }],
  ],
  [
    "create_agent_report",
    "createAgentReport",
    {
      project_id: project,
      kind: "external_analysis",
      title: "Analysis",
      body: reportBody,
      provenance: { SourceURL: "https://example.org" },
      idempotency_key: "stable-report",
    },
    [
      project,
      {
        kind: "external_analysis",
        title: "Analysis",
        body: reportBody,
        provenance: { SourceURL: "https://example.org" },
      },
      { idempotencyKey: "stable-report" },
    ],
  ],
  [
    "get_agent_report",
    "getAgentReport",
    { project_id: project, report_id: report },
    [project, report],
  ],
  [
    "analyze_ai_visibility",
    "analyzeAiVisibility",
    { project_id: project, ...analysis, estimate_only: true, idempotency_key: "stable-analysis" },
    [
      project,
      {
        ...analysis,
        estimate_only: true,
        fresh: false,
        target_type: "domain",
        platform: "chat_gpt",
        location_code: 2840,
        language_code: "en",
        limit: 10,
      },
      { idempotencyKey: "stable-analysis" },
    ],
  ],
  [
    "compare_ai_prompts",
    "compareAiPrompts",
    {
      project_id: project,
      ...analysis,
      prompt: "Compare example tools",
      models: ["gpt-4.1-mini"],
      idempotency_key: "stable-prompt",
    },
    [
      project,
      {
        ...analysis,
        estimate_only: false,
        fresh: false,
        prompt: "Compare example tools",
        models: ["gpt-4.1-mini"],
      },
      { idempotencyKey: "stable-prompt" },
    ],
  ],
  [
    "run_site_audit",
    "runSiteAudit",
    { project_id: project, idempotency_key: "stable-audit" },
    [project, { max_pages: 10 }, { idempotencyKey: "stable-audit" }],
  ],
  ["list_site_audits", "listSiteAudits", { project_id: project }, [project]],
  ["get_site_audit", "getSiteAudit", { project_id: project, report_id: report }, [project, report]],
] as const;
const writeNames = [
  "update_project_context",
  "create_agent_report",
  "analyze_ai_visibility",
  "compare_ai_prompts",
  "run_site_audit",
];

function harness(readOnly = false) {
  const handlers = new Map<
    string,
    (input: unknown) => Promise<{ isError?: boolean; structuredContent?: unknown }>
  >();
  const configs = new Map<
    string,
    { annotations: { readOnlyHint: boolean; openWorldHint: boolean }; description: string }
  >();
  const sdk = Object.fromEntries(
    cases.map(([, method]) => [
      method,
      vi.fn().mockResolvedValue({ data: { opaque_result: true } }),
    ]),
  );
  registerBisibilityTools(
    {
      registerTool(name: string, config: never, handler: never) {
        configs.set(name, config);
        handlers.set(name, handler);
      },
    } as never,
    { client: sdk as unknown as BisibilityToolClient, readOnly },
  );
  return { handlers, configs, sdk };
}

describe("research workspace tools", () => {
  it.each(cases)(
    "delegates %s through the SDK without leaking transport fields",
    async (name, method, input, expected) => {
      const { handlers, sdk } = harness();
      expect(handlers.has(name)).toBe(true);
      const result = await handlers.get(name)?.(input);
      expect(result).toMatchObject({ structuredContent: { data: { opaque_result: true } } });
      expect(sdk[method]).toHaveBeenCalledExactlyOnceWith(...expected);
    },
  );

  it("omits absent report options while preserving explicit zero-cost estimates", async () => {
    const { handlers, sdk } = harness();
    await handlers.get("list_agent_reports")?.({ project_id: project });
    expect(sdk.listAgentReports).toHaveBeenCalledWith(project, {});
    await handlers.get("create_agent_report")?.({
      project_id: project,
      kind: "external",
      title: "Analysis",
      body: reportBody,
    });
    expect(sdk.createAgentReport).toHaveBeenCalledWith(
      project,
      { kind: "external", title: "Analysis", body: reportBody },
      undefined,
    );
    await handlers.get("compare_ai_prompts")?.({
      project_id: project,
      ...analysis,
      prompt: "Compare tools",
      max_cost_cents: 0,
      estimate_only: true,
    });
    expect(sdk.compareAiPrompts).toHaveBeenCalledWith(
      project,
      {
        ...analysis,
        prompt: "Compare tools",
        max_cost_cents: 0,
        estimate_only: true,
        fresh: false,
      },
      undefined,
    );
  });

  it("composes analysis toolset selection with read-only filtering", () => {
    const names: string[] = [];
    registerBisibilityTools(
      {
        registerTool(name: string) {
          names.push(name);
        },
      } as never,
      {
        client: harness().sdk as unknown as BisibilityToolClient,
        readOnly: true,
        toolsets: ["agent-reports", "site-audits"],
      },
    );
    expect(names).toEqual([
      "get_session_profile",
      "list_agent_reports",
      "get_agent_report",
      "list_site_audits",
      "get_site_audit",
    ]);
  });

  it("hides all mutations in a read-only session while retaining saved reports", () => {
    const { handlers, configs } = harness(true);
    for (const [name] of cases) {
      expect(handlers.has(name)).toBe(!writeNames.includes(name));
      if (handlers.has(name)) expect(configs.get(name)?.annotations.readOnlyHint).toBe(true);
    }
    const full = harness();
    for (const name of writeNames)
      expect(full.configs.get(name)?.annotations.readOnlyHint).toBe(false);
    for (const name of ["analyze_ai_visibility", "compare_ai_prompts", "run_site_audit"])
      expect(full.configs.get(name)?.annotations.openWorldHint).toBe(true);
    expect(full.configs.get("compare_ai_prompts")?.description).toContain("not observed");
  });

  it.each([
    ["get_project_context", { project_id: "prj_wrong" }],
    ["update_project_context", { project_id: project, business: "missing the other fields" }],
    ["get_agent_report", { project_id: project, report_id: "check_a00000000000000000000000" }],
    [
      "create_agent_report",
      { project_id: project, kind: "external", title: "Analysis", body: [], extra: true },
    ],
    ["analyze_ai_visibility", { project_id: project, brand: "Example", domain: "example.com" }],
    ["analyze_ai_visibility", { project_id: project, ...analysis, max_cost_cents: 1001 }],
    [
      "compare_ai_prompts",
      { project_id: project, ...analysis, prompt: "Prompt", models: ["unsupported"] },
    ],

    [
      "compare_ai_prompts",
      {
        project_id: project,
        ...analysis,
        prompt: "Prompt",
        models: ["gpt-4.1-mini", "gpt-4.1-mini"],
      },
    ],
    ["get_project_context", { project_id: project, extra: true }],
    ["run_site_audit", { project_id: project, max_pages: 16 }],
    ["list_agent_reports", { project_id: project, limit: 101 }],
  ])("rejects invalid %s input before the SDK call", async (name, input) => {
    const { handlers, sdk } = harness();
    expect(handlers.has(name as string)).toBe(true);
    expect(await handlers.get(name as string)?.(input)).toMatchObject({ isError: true });
    for (const method of Object.values(sdk)) expect(method).not.toHaveBeenCalled();
  });

  it("advertises closed schemas, explicit cost caps and typed report identifiers over MCP", async () => {
    const server = createBisibilityMcpServer({
      client: harness().sdk as unknown as BisibilityClient,
    });
    const client = new Client({ name: "research-workspace-test", version: "1" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    try {
      await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
      const listed = (await client.listTools()).tools;
      for (const [name] of cases) {
        const schema = listed.find((tool) => tool.name === name)?.inputSchema;
        expect(schema?.additionalProperties).toBe(false);
        if (name === "analyze_ai_visibility" || name === "compare_ai_prompts")
          expect(schema?.required).toContain("max_cost_cents");
        if (name === "get_agent_report" || name === "get_site_audit")
          expect(schema?.properties?.report_id).toMatchObject({
            pattern: "^agr_[a-z][a-z0-9]{23}$",
          });
      }
    } finally {
      await client.close().catch(() => undefined);
      await server.close().catch(() => undefined);
    }
  });
});
