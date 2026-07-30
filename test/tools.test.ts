import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";
import * as z from "zod/v4";

import type {
  BisibilityMcpToolset,
  BisibilityToolClient,
  RegisterBisibilityToolsOptions,
} from "../src/index.js";
import { registerBisibilityTools } from "../src/index.js";
import {
  activeMigrationToken,
  alertRule,
  apiKey,
  backlinksSnapshot,
  competitor,
  competitorListResponse,
  competitorSavedViewConfig,
  costEstimate,
  createdApiKey,
  dataResponse,
  issuedMigrationToken,
  keyword,
  listResponse,
  migrationTokenListResponse,
  notificationPreferences,
  project,
  projectDefaults,
  provider,
  providerConnection,
  providerRate,
  publicId,
  rankCheck,
  savedView,
  savedViewConfig,
  signal,
  teamInvite,
  teamMember,
  triggeredAlert,
} from "./fixtures.js";

type ToolResult = {
  content: Array<{ text: string; type: "text" }>;
  isError?: boolean;
  structuredContent?: Record<string, unknown>;
};

type ToolHandler = (input?: unknown) => Promise<ToolResult>;

const expectedToolNames = [
  "get_health",
  "get_capabilities",
  "get_cloud_import_compatibility",
  "get_provider_rates",
  "get_cost_estimate",
  "get_me",
  "update_me",
  "list_projects",
  "create_project",
  "get_project",
  "search_locations",
  "update_project",
  "delete_project",
  "get_project_defaults",
  "update_project_defaults",
  "list_keywords",
  "list_ranked_keyword_suggestions",
  "research_keywords",
  "analyze_backlinks",
  "load_more_backlink_rows",
  "get_keyword_metrics",
  "add_keywords",
  "get_keyword",
  "update_keyword",
  "set_keyword_target_url",
  "delete_keyword",
  "bulk_update_keywords",
  "run_rank_check",
  "get_rank_history",
  "export_rank_history",
  "list_sitemap_monitors",
  "enable_sitemap_monitor",
  "disable_sitemap_monitor",
  "get_rank_check_result",
  "create_signal",
  "list_signals",
  "list_traffic_snapshots",
  "list_search_performance_query_stats",
  "sync_project_traffic",
  "list_api_keys",
  "create_api_key",
  "revoke_api_key",
  "list_project_api_keys",
  "create_project_api_key",
  "list_personal_tokens",
  "create_personal_token",
  "revoke_personal_token",
  "list_webhooks",
  "create_webhook",
  "update_webhook",
  "delete_webhook",
  "list_alert_rules",
  "create_alert_rule",
  "update_alert_rule",
  "delete_alert_rule",
  "list_triggered_alerts",
  "mute_triggered_alert",
  "mark_project_alerts_read",
  "list_team_members",
  "list_team_invites",
  "create_team_invite",
  "revoke_team_invite",
  "resend_team_invite",
  "update_team_member_role",
  "remove_team_member",
  "list_providers",
  "connect_provider",
  "test_provider_connection",
  "update_provider_settings",
  "set_provider_enabled",
  "set_provider_priority",
  "set_primary_provider",
  "disconnect_provider",
  "list_saved_views",
  "create_saved_view",
  "delete_saved_view",
  "list_competitors",
  "add_competitor",
  "remove_competitor",
  "get_notification_preferences",
  "update_notification_preferences",
  "list_migration_tokens",
  "mint_migration_token",
  "revoke_migration_token",
];

function createClientMock(): Record<keyof BisibilityToolClient, ReturnType<typeof vi.fn>> {
  return {
    addCompetitor: vi.fn(),
    addKeywords: vi.fn(),
    analyzeBacklinks: vi.fn(),
    bulkUpdateKeywords: vi.fn(),
    connectProvider: vi.fn(),
    createAlertRule: vi.fn(),
    createApiKey: vi.fn(),
    createMyToken: vi.fn(),
    createProject: vi.fn(),
    createProjectApiKey: vi.fn(),
    createSavedView: vi.fn(),
    createSignal: vi.fn(),
    createTeamInvite: vi.fn(),
    createWebhook: vi.fn(),
    deleteAlertRule: vi.fn(),
    deleteKeyword: vi.fn(),
    deleteProject: vi.fn(),
    deleteSavedView: vi.fn(),
    deleteWebhook: vi.fn(),
    disconnectProvider: vi.fn(),
    exportRankHistory: vi.fn(),
    getCapabilities: vi.fn(),
    getCloudImportCompatibility: vi.fn(),
    getCostEstimate: vi.fn(),
    getHealth: vi.fn(),
    getKeyword: vi.fn(),
    getKeywordMetrics: vi.fn(),
    getMe: vi.fn(),
    getNotificationPreferences: vi.fn(),
    getProject: vi.fn(),
    getProjectDefaults: vi.fn(),
    getProviderRates: vi.fn(),
    getRankCheckResult: vi.fn(),
    listAlertRules: vi.fn(),
    listApiKeys: vi.fn(),
    listCompetitors: vi.fn(),
    listKeywords: vi.fn(),
    listMigrationTokens: vi.fn(),
    listMyTokens: vi.fn(),
    listProjectApiKeys: vi.fn(),
    listProjects: vi.fn(),
    listProviders: vi.fn(),
    listRankChecks: vi.fn(),
    listRankedKeywordSuggestions: vi.fn(),
    listSavedViews: vi.fn(),
    listSearchPerformanceQueryStats: vi.fn(),
    listSignals: vi.fn(),
    listSitemapMonitors: vi.fn(),
    listTeamInvites: vi.fn(),
    listTeamMembers: vi.fn(),
    listTrafficSnapshots: vi.fn(),
    listTriggeredAlerts: vi.fn(),
    listWebhooks: vi.fn(),
    loadMoreBacklinkRows: vi.fn(),
    markProjectAlertsRead: vi.fn(),
    mintMigrationToken: vi.fn(),
    muteTriggeredAlert: vi.fn(),
    removeCompetitor: vi.fn(),
    removeTeamMember: vi.fn(),
    researchKeywords: vi.fn(),
    resendTeamInvite: vi.fn(),
    revokeApiKey: vi.fn(),
    revokeMigrationToken: vi.fn(),
    revokeMyToken: vi.fn(),
    revokeTeamInvite: vi.fn(),
    runRankCheck: vi.fn(),
    searchLocations: vi.fn(),
    setKeywordTargetUrl: vi.fn(),
    setPrimaryProvider: vi.fn(),
    setProviderEnabled: vi.fn(),
    setProviderPriority: vi.fn(),
    syncProjectTraffic: vi.fn(),
    testProviderConnection: vi.fn(),
    updateAlertRule: vi.fn(),
    updateKeyword: vi.fn(),
    updateMe: vi.fn(),
    updateNotificationPreferences: vi.fn(),
    updateProject: vi.fn(),
    updateProjectDefaults: vi.fn(),
    updateProviderSettings: vi.fn(),
    updateSitemapMonitor: vi.fn(),
    updateTeamMemberRole: vi.fn(),
    updateWebhook: vi.fn(),
  };
}

function createToolHarness(
  options: Pick<RegisterBisibilityToolsOptions, "readOnly" | "toolsets"> = {},
) {
  const tools = new Map<string, ToolHandler>();
  const configs = new Map<
    string,
    {
      annotations: { destructiveHint: boolean; openWorldHint: boolean; readOnlyHint: boolean };
      description: string;
      inputSchema: object;
      title: string;
    }
  >();
  const server = {
    registerTool: vi.fn((name: string, config: never, handler: ToolHandler) => {
      configs.set(name, config);
      tools.set(name, handler);
    }),
  };
  const client = createClientMock();

  registerBisibilityTools(server as never, {
    client: client as unknown as BisibilityToolClient,
    ...options,
  });

  const callTool = async (name: string, input: unknown = {}) => {
    const handler = tools.get(name);
    if (!handler) {
      throw new Error(`Tool not registered: ${name}`);
    }

    return handler(input);
  };

  return { callTool, client, configs, server, tools };
}

function parsedContent(result: ToolResult) {
  return JSON.parse(result.content[0]?.text ?? "null") as unknown;
}

function missingRequiredDescriptions(schema: Record<string, unknown>, path: string): string[] {
  const properties =
    schema.properties && typeof schema.properties === "object"
      ? (schema.properties as Record<string, Record<string, unknown>>)
      : {};
  const missing = (Array.isArray(schema.required) ? schema.required : [])
    .filter((name): name is string => typeof name === "string")
    .filter((name) => typeof properties[name]?.description !== "string")
    .map((name) => `${path}.${name}`);

  for (const [name, property] of Object.entries(properties)) {
    missing.push(...missingRequiredDescriptions(property, `${path}.${name}`));
  }
  if (schema.items && typeof schema.items === "object") {
    missing.push(
      ...missingRequiredDescriptions(schema.items as Record<string, unknown>, `${path}[]`),
    );
  }
  for (const keyword of ["allOf", "anyOf", "oneOf"] as const) {
    const branches = schema[keyword];
    if (!Array.isArray(branches)) continue;
    for (const [index, branch] of branches.entries()) {
      if (branch && typeof branch === "object") {
        missing.push(
          ...missingRequiredDescriptions(
            branch as Record<string, unknown>,
            `${path}.${keyword}[${index}]`,
          ),
        );
      }
    }
  }
  return missing;
}

describe("registerBisibilityTools", () => {
  it("registers the Bisibility MCP tool surface", () => {
    const { configs, server, tools } = createToolHarness();

    expect([...tools.keys()]).toEqual(expectedToolNames);
    expect(server.registerTool).toHaveBeenCalledTimes(expectedToolNames.length);
    expect(configs.get("add_keywords")).toMatchObject({
      title: "Add keywords",
    });
    expect(configs.get("list_keywords")?.inputSchema).toHaveProperty("project_id");
    expect(configs.get("run_rank_check")?.description).toContain("may incur provider cost");
    expect(configs.get("run_rank_check")?.description).toContain("explicit user approval");
  });

  it("uses the same unprefixed snake_case names as the built-in HTTP server", () => {
    const { tools } = createToolHarness();

    expect([...tools]).toHaveLength(84);
    expect([...tools.keys()].every((name) => /^[a-z][a-z0-9_]*$/.test(name))).toBe(true);
    expect([...tools.keys()].some((name) => name.startsWith("bisibility_"))).toBe(false);
  });

  it("describes every required input in the advertised JSON schema", () => {
    const { configs } = createToolHarness();
    const missing = [...configs].flatMap(([name, config]) => {
      const schema = z.toJSONSchema(z.object(config.inputSchema as z.ZodRawShape), {
        io: "input",
      });
      return missingRequiredDescriptions(schema as Record<string, unknown>, name);
    });

    expect(missing).toEqual([]);
  });

  it("registers only read tools in read-only mode", () => {
    const { tools } = createToolHarness({ readOnly: true });
    const mutatingPrefixes = [
      "create_",
      "update_",
      "delete_",
      "remove_",
      "revoke_",
      "set_",
      "add_",
      "bulk_",
      "run_",
      "sync_",
      "enable_",
      "disable_",
      "connect_",
      "disconnect_",
      "mint_",
      "mark_",
      "mute_",
      "resend_",
    ];

    expect(tools.size).toBe(32);
    expect(
      [...tools.keys()].filter((name) =>
        mutatingPrefixes.some((prefix) => name.startsWith(prefix)),
      ),
    ).toEqual([]);
    expect(tools.has("research_keywords")).toBe(false);
    expect(tools.has("get_keyword_metrics")).toBe(false);
  });

  it("registers only tools from selected API-domain toolsets", () => {
    const { tools } = createToolHarness({ toolsets: ["rank-history"] });

    expect([...tools.keys()]).toEqual(["get_rank_history", "export_rank_history"]);
  });

  it("composes read-only mode with toolset filtering", () => {
    const selectedToolsets = ["keywords", "rank-history"] satisfies BisibilityMcpToolset[];
    const { tools } = createToolHarness({
      readOnly: true,
      toolsets: selectedToolsets,
    });

    expect([...tools.keys()]).toEqual([
      "search_locations",
      "list_keywords",
      "get_keyword",
      "get_rank_history",
      "export_rank_history",
    ]);
  });

  it("annotates read, write, and destructive tools from their classifications", () => {
    const { configs } = createToolHarness();

    expect(configs.get("list_keywords")?.annotations).toEqual({
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: true,
    });
    expect(configs.get("create_project")?.annotations).toEqual({
      destructiveHint: false,
      openWorldHint: false,
      readOnlyHint: false,
    });
    expect(configs.get("delete_project")?.annotations).toEqual({
      destructiveHint: true,
      openWorldHint: false,
      readOnlyHint: false,
    });
    expect(configs.get("bulk_update_keywords")?.annotations).toEqual({
      destructiveHint: true,
      openWorldHint: false,
      readOnlyHint: false,
    });
    expect(configs.get("list_ranked_keyword_suggestions")?.annotations).toEqual({
      destructiveHint: false,
      openWorldHint: true,
      readOnlyHint: false,
    });
    expect(configs.get("test_provider_connection")?.annotations).toEqual({
      destructiveHint: false,
      openWorldHint: true,
      readOnlyHint: false,
    });
  });

  it("documents every registered tool in the README", () => {
    const { tools } = createToolHarness();
    const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");

    for (const name of tools.keys()) {
      expect(readme, `README.md is missing tool ${name}`).toContain(`\`${name}\``);
    }
  });

  it("returns JSON text content and structured content", async () => {
    const { callTool, client } = createToolHarness();
    client.listProjects.mockResolvedValueOnce(listResponse([project()]));

    const result = await callTool("list_projects");

    expect(result.isError).toBeUndefined();
    expect(parsedContent(result)).toEqual(listResponse([project()]));
    expect(result.structuredContent).toEqual(listResponse([project()]));
    expect(client.listProjects).toHaveBeenCalledWith();
  });

  it("exposes PAT account, project, API-key, and webhook automation", async () => {
    const { callTool, client } = createToolHarness();
    const me = {
      email: "owner@example.com",
      id: publicId("usr"),
      name: "Owner",
      projects: [{ domain: "example.com", id: publicId("prj"), name: "Example", role: "owner" }],
    };
    const token = {
      created_at: "2026-07-12T00:00:00.000Z",
      expires_at: null,
      id: publicId("pat"),
      last_used_at: null,
      name: "Agent",
      prefix: "bsb_pat_live_example",
      revoked_at: null,
      scope: "admin",
    };
    const webhook = {
      created_at: "2026-07-12T00:00:00.000Z",
      description: null,
      enabled: true,
      id: publicId("we"),
      last_delivery_at: null,
      updated_at: "2026-07-12T00:00:00.000Z",
      url: "https://example.com/hook",
    };
    client.getMe.mockResolvedValueOnce(me);
    client.updateMe.mockResolvedValueOnce({ ...me, name: "Renamed" });
    client.createProject.mockResolvedValueOnce(project({ id: publicId("prj", "c") }));
    client.listProjectApiKeys.mockResolvedValueOnce(listResponse([createdApiKey()]));
    client.createProjectApiKey.mockResolvedValueOnce(createdApiKey());
    client.listMyTokens.mockResolvedValueOnce(listResponse([token]));
    client.createMyToken.mockResolvedValueOnce({
      ...token,
      masked_value: "masked",
      token: "bsb_pat_live_raw",
    });
    client.revokeMyToken.mockResolvedValueOnce({
      ...token,
      revoked_at: "2026-07-12T01:00:00.000Z",
    });
    client.listWebhooks.mockResolvedValueOnce(listResponse([webhook]));
    client.createWebhook.mockResolvedValueOnce(webhook);
    client.updateWebhook.mockResolvedValueOnce({ ...webhook, enabled: false });
    client.deleteWebhook.mockResolvedValueOnce(webhook);

    await callTool("get_me");
    await callTool("update_me", { name: "Renamed" });
    await callTool("create_project", {
      domain: "example.com",
      name: "Example",
      tracking_scope: "city",
    });
    await callTool("list_project_api_keys", { limit: 10, project_id: publicId("prj") });
    await callTool("create_project_api_key", {
      name: "CI",
      project_id: publicId("prj"),
    });
    await callTool("list_personal_tokens");
    const created = await callTool("create_personal_token", {
      expires_in_days: 90,
      name: "Agent",
      scope: "admin",
    });
    await callTool("revoke_personal_token", { token_id: publicId("pat") });
    await callTool("list_webhooks", { limit: 10, project_id: publicId("prj") });
    await callTool("create_webhook", {
      hmac_secret: "1234567890123456",
      project_id: publicId("prj"),
      url: webhook.url,
    });
    await callTool("update_webhook", {
      enabled: false,
      project_id: publicId("prj"),
      webhook_id: publicId("we"),
    });
    await callTool("delete_webhook", {
      project_id: publicId("prj"),
      webhook_id: publicId("we"),
    });

    expect(client.updateMe).toHaveBeenCalledWith({ name: "Renamed" }, undefined);
    expect(client.createProject).toHaveBeenCalledWith(
      { domain: "example.com", name: "Example", trackingScope: "city" },
      undefined,
    );
    expect(client.listProjectApiKeys).toHaveBeenCalledWith(publicId("prj"), { limit: 10 });
    expect(client.createProjectApiKey).toHaveBeenCalledWith(
      publicId("prj"),
      { name: "CI" },
      undefined,
    );
    expect(client.createMyToken).toHaveBeenCalledWith(
      { expiresInDays: 90, name: "Agent", scope: "admin" },
      undefined,
    );
    expect(client.listWebhooks).toHaveBeenCalledWith(publicId("prj"), { limit: 10 });
    expect(client.createWebhook).toHaveBeenCalledWith(
      publicId("prj"),
      { hmac_secret: "1234567890123456", url: webhook.url },
      undefined,
    );
    expect(parsedContent(created)).toMatchObject({ token: "bsb_pat_live_raw" });
  });

  it("maps optional project_id to the SDK request header on implicit tools", async () => {
    const { callTool, client } = createToolHarness();
    client.getKeyword.mockResolvedValueOnce(keyword());

    await callTool("get_keyword", {
      keyword_id: publicId("kw"),
      project_id: publicId("prj", "b"),
    });

    expect(client.getKeyword).toHaveBeenCalledWith(publicId("kw"), {
      headers: { "X-Bisibility-Project": publicId("prj", "b") },
    });
  });

  it("passes unknown strict public IDs to the SDK and rejects malformed IDs before a call", async () => {
    const { callTool, client } = createToolHarness();
    const keywordId = publicId("kw", "y");
    const projectId = publicId("prj", "z");
    client.getKeyword.mockResolvedValueOnce(keyword({ id: keywordId, project_id: projectId }));

    await expect(
      callTool("get_keyword", { keyword_id: keywordId, project_id: projectId }),
    ).resolves.toMatchObject({ structuredContent: { id: keywordId } });

    expect(client.getKeyword).toHaveBeenCalledWith(keywordId, {
      headers: { "X-Bisibility-Project": projectId },
    });

    const invalid = await callTool("get_keyword", {
      keyword_id: "kw_1",
      project_id: projectId,
    });
    expect(invalid.isError).toBe(true);
    expect(client.getKeyword).toHaveBeenCalledTimes(1);
  });

  it("calls project and discovery SDK methods", async () => {
    const { callTool, client } = createToolHarness();
    client.getHealth.mockResolvedValueOnce({ status: "ok" });
    client.getCapabilities.mockResolvedValueOnce({ data: [{ name: "listProjects" }] });
    client.getProject.mockResolvedValueOnce(project());

    await expect(callTool("get_health")).resolves.toMatchObject({
      structuredContent: { status: "ok" },
    });
    await expect(callTool("get_capabilities")).resolves.toMatchObject({
      structuredContent: { data: [{ name: "listProjects" }] },
    });
    await callTool("get_project", { project_id: publicId("prj") });

    expect(client.getProject).toHaveBeenCalledWith(publicId("prj"));
  });

  it("reads every project default field for the resolved project id", async () => {
    const { callTool, client } = createToolHarness();
    const defaults = projectDefaults();
    client.getProjectDefaults.mockResolvedValueOnce(defaults);

    const result = await callTool("get_project_defaults", {
      project_id: publicId("prj"),
    });

    expect(client.getProjectDefaults).toHaveBeenCalledWith(publicId("prj"));
    expect(parsedContent(result)).toEqual(defaults);
    expect(result.structuredContent).toEqual(defaults);
    expect(parsedContent(result)).toMatchObject({
      serp_depth: 100,
      serp_stop_on_match: false,
      source: "explicit",
    });
  });

  it("maps project defaults SDK errors", async () => {
    const { callTool, client } = createToolHarness();
    const error = Object.assign(new Error("Project defaults are unavailable."), {
      name: "BisibilityApiError",
      problem: { detail: "Not found" },
      status: 404,
    });
    client.getProjectDefaults.mockRejectedValueOnce(error);

    const result = await callTool("get_project_defaults", {
      project_id: publicId("prj", "d"),
    });

    expect(result.isError).toBe(true);
    expect(parsedContent(result)).toEqual({
      error: {
        message: "Project defaults are unavailable.",
        name: "BisibilityApiError",
        problem: { detail: "Not found" },
        status: 404,
      },
    });
  });

  it("searches canonical locations and documents location_key reuse", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      data: [
        {
          city_name: "Austin",
          country_code: "US",
          display_name: "Austin, Texas, United States",
          hl: "en",
          kind: "city",
          language_label: "English",
          location_key: "US/Texas/Austin",
          region_code: "TX",
          region_name: "Texas",
        },
      ],
      meta: { next_cursor: null },
    };
    client.searchLocations.mockResolvedValueOnce(response);

    await expect(
      callTool("search_locations", { country: "US", limit: 20, q: "Austin" }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.searchLocations).toHaveBeenCalledWith({ country: "US", limit: 20, q: "Austin" });
    expect(configs.get("search_locations")?.description).toContain("location_key verbatim");
    expect(configs.get("add_keywords")?.description).toContain("search_locations");
    expect(configs.get("update_keyword")?.description).toContain("search_locations");
  });

  it("rejects pagination inputs on list projects", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("list_projects", { cursor: "cursor_1", limit: 10 });

    expect(result.isError).toBe(true);
    expect(client.listProjects).not.toHaveBeenCalled();
  });

  it("updates and deletes projects", async () => {
    const { callTool, client } = createToolHarness();
    client.updateProject.mockResolvedValueOnce(project({ name: "Renamed" }));
    client.deleteProject.mockResolvedValueOnce(project());

    await callTool("update_project", {
      domain: "renamed.example",
      idempotency_key: "idem_project",
      name: "Renamed",
      project_id: publicId("prj"),
    });
    await callTool("update_project", {
      name: "Renamed only",
      project_id: publicId("prj"),
    });
    await callTool("delete_project", {
      idempotency_key: "idem_delete_project",
      project_id: publicId("prj"),
    });

    expect(client.updateProject).toHaveBeenNthCalledWith(
      1,
      publicId("prj"),
      { domain: "renamed.example", name: "Renamed" },
      { idempotencyKey: "idem_project" },
    );
    expect(client.updateProject).toHaveBeenNthCalledWith(
      2,
      publicId("prj"),
      { name: "Renamed only" },
      undefined,
    );
    expect(client.deleteProject).toHaveBeenCalledWith(publicId("prj"), {
      idempotencyKey: "idem_delete_project",
    });
  });

  it("requires name or domain when updating a project", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("update_project", { project_id: publicId("prj") });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(parsedContent(result))).toContain("domain or name is required.");
    expect(client.updateProject).not.toHaveBeenCalled();
  });

  it("updates project defaults with schedule and market fields", async () => {
    const { callTool, client } = createToolHarness();
    client.updateProjectDefaults.mockResolvedValue(projectDefaults());

    await callTool("update_project_defaults", {
      country: "United States",
      cron_expression: null,
      device: "desktop",
      frequency: "daily",
      idempotency_key: "idem_defaults",
      jitter_minutes: 30,
      project_id: publicId("prj"),
      serp_stop_on_match: false,
      timezone: "Europe/Warsaw",
    });
    await callTool("update_project_defaults", {
      frequency: "weekly",
      location_key: "US/California/Los Angeles",
      project_id: publicId("prj"),
    });

    expect(client.updateProjectDefaults).toHaveBeenNthCalledWith(
      1,
      publicId("prj"),
      {
        country: "United States",
        cron_expression: null,
        device: "desktop",
        frequency: "daily",
        jitter_minutes: 30,
        serp_stop_on_match: false,
        timezone: "Europe/Warsaw",
      },
      { idempotencyKey: "idem_defaults" },
    );
    expect(client.updateProjectDefaults).toHaveBeenNthCalledWith(
      2,
      publicId("prj"),
      { frequency: "weekly", location_key: "US/California/Los Angeles" },
      undefined,
    );
  });

  it("requires country and device together on project defaults updates", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("update_project_defaults", {
      country: "United States",
      frequency: "daily",
      project_id: publicId("prj"),
    });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(parsedContent(result))).toContain(
      "country and device must be provided together.",
    );
    expect(client.updateProjectDefaults).not.toHaveBeenCalled();
  });

  it("lists, creates, and revokes API keys", async () => {
    const { callTool, client } = createToolHarness();
    client.listApiKeys.mockResolvedValueOnce(listResponse([apiKey()], "keys_next"));
    client.createApiKey.mockResolvedValueOnce(createdApiKey());
    client.revokeApiKey.mockResolvedValueOnce(apiKey({ revoked_at: "2026-01-09T00:00:00.000Z" }));

    await callTool("list_api_keys", { cursor: "key_cursor", limit: 10 });
    await callTool("create_api_key", {
      expires_in_days: 90,
      idempotency_key: "idem_key",
      name: "CI key",
      scope: "write",
    });
    await callTool("revoke_api_key", {
      idempotency_key: "idem_revoke_key",
      key_id: publicId("key"),
    });

    expect(client.listApiKeys).toHaveBeenCalledWith({ cursor: "key_cursor", limit: 10 });
    expect(client.createApiKey).toHaveBeenCalledWith(
      { expires_in_days: 90, name: "CI key", scope: "write" },
      { idempotencyKey: "idem_key" },
    );
    expect(client.revokeApiKey).toHaveBeenCalledWith(publicId("key"), {
      idempotencyKey: "idem_revoke_key",
    });
  });

  it("lists keywords with API filter names converted to SDK options", async () => {
    const { callTool, client } = createToolHarness();
    client.listKeywords.mockResolvedValueOnce(listResponse([keyword()], "next"));

    await callTool("list_keywords", {
      country: "United States",
      cursor: "cursor_1",
      device: "mobile",
      intent: "commercial",
      limit: 25,
      position_gt: 3,
      position_lt: 20,
      project_id: publicId("prj"),
      search: "rank",
      sort: "-updated_at",
      tag: "Product",
      topic: "tools",
    });

    expect(client.listKeywords).toHaveBeenCalledWith(publicId("prj"), {
      country: "United States",
      cursor: "cursor_1",
      device: "mobile",
      intent: "commercial",
      limit: 25,
      positionGt: 3,
      positionLt: 20,
      search: "rank",
      sort: "-updated_at",
      tag: "Product",
      topic: "tools",
    });
  });

  it("lists paid ranked keyword suggestions with cache metadata", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      cached: false,
      connections: [{ id: publicId("conn"), label: "DataForSEO", provider: "dataforseo" }],
      cost_cents: 2,
      fetched_at: "2026-07-22T10:00:00.000Z",
      offset: 100,
      rows: [
        {
          already_tracked: true,
          estimated_traffic: 61.2,
          keyword: "rank tracker api",
          position: 4,
          search_volume: 720,
        },
      ],
      total_count: 184,
    };
    client.listRankedKeywordSuggestions.mockResolvedValueOnce(response);

    await expect(
      callTool("list_ranked_keyword_suggestions", {
        connection_id: publicId("conn"),
        fresh: true,
        limit: 100,
        offset: 100,
        project_id: publicId("prj"),
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.listRankedKeywordSuggestions).toHaveBeenCalledWith(publicId("prj"), {
      connectionId: publicId("conn"),
      fresh: true,
      limit: 100,
      offset: 100,
    });
    expect(configs.get("list_ranked_keyword_suggestions")?.description).toContain("$0.02");
    expect(configs.get("list_ranked_keyword_suggestions")?.description).toContain(
      "cached for 12 hours",
    );
  });

  it("researches one seed with paid lookup and cache guidance", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      cached: false,
      connections: [{ id: publicId("conn"), label: "DataForSEO", provider: "dataforseo" }],
      cost_cents: 2,
      fetched_at: "2026-07-22T10:00:00.000Z",
      provider: "DataForSEO",
      rows: [
        {
          already_tracked: true,
          competition: 0.61,
          cpc_cents: 243,
          difficulty: 42,
          intent: "commercial",
          keyword: "rank tracker api",
          monthly_trend: [{ month: 6, search_volume: 720, year: 2026 }],
          search_volume: 720,
          source: "related",
        },
      ],
      sources: [
        {
          cached: false,
          cost_cents: 2,
          returned: 1,
          source: "related",
          status: "ok",
        },
        {
          cached: false,
          cost_cents: 0,
          reason: "budget_exhausted",
          returned: 0,
          source: "suggestion",
          status: "failed",
        },
        {
          cached: false,
          cost_cents: 0,
          reason: "previous_source_failed",
          returned: 0,
          source: "idea",
          status: "skipped",
        },
      ],
      total_count: 1,
    };
    client.researchKeywords.mockResolvedValueOnce(response);

    await expect(
      callTool("research_keywords", {
        connection_id: publicId("conn"),
        fresh: true,
        include_clickstream: true,
        max_cost_cents: 6,
        mode: "auto",
        project_id: publicId("prj"),
        result_limit: 300,
        seed: "rank tracker",
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.researchKeywords).toHaveBeenCalledWith(publicId("prj"), {
      connectionId: publicId("conn"),
      fresh: true,
      includeClickstream: true,
      maxCostCents: 6,
      mode: "auto",
      resultLimit: 300,
      seed: "rank tracker",
    });
    expect(configs.get("research_keywords")?.description).toContain("one seed per call");
    expect(configs.get("research_keywords")?.description).toContain("get_provider_rates");
    expect(configs.get("research_keywords")?.description).toContain("double provider cost");
    expect(configs.get("research_keywords")?.description).toContain("Requires API write scope");
    expect(configs.get("research_keywords")?.description).toContain("estimate_only first");
  });

  it("analyzes backlinks and loads more rows with mapped defined options", async () => {
    const { callTool, client, configs } = createToolHarness();
    const analyzed = dataResponse(backlinksSnapshot());
    const loaded = dataResponse(
      backlinksSnapshot({
        cost_cents: 1,
        fetched_row_count: 200,
        history: [],
        rows: [],
        summary: backlinksSnapshot().summary,
      }),
    );
    client.analyzeBacklinks.mockResolvedValue(analyzed);
    client.loadMoreBacklinkRows.mockResolvedValue(loaded);

    await expect(
      callTool("analyze_backlinks", {
        estimate_only: true,
        fresh: true,
        include_subdomains: false,
        max_cost_cents: 7,
        mode: "one_per_domain",
        project_id: publicId("prj"),
        result_limit: 300,
        target: "https://example.com/pricing",
        target_scope: "page",
      }),
    ).resolves.toMatchObject({ structuredContent: analyzed });
    await expect(
      callTool("analyze_backlinks", {
        project_id: publicId("prj"),
        target: "example.com",
      }),
    ).resolves.toMatchObject({ structuredContent: analyzed });
    await expect(
      callTool("load_more_backlink_rows", {
        include_subdomains: false,
        limit: 300,
        project_id: publicId("prj"),
        target: "https://example.com/pricing",
        target_scope: "page",
      }),
    ).resolves.toMatchObject({ structuredContent: loaded });
    await expect(
      callTool("load_more_backlink_rows", {
        project_id: publicId("prj"),
        target: "example.com",
      }),
    ).resolves.toMatchObject({ structuredContent: loaded });

    expect(client.analyzeBacklinks).toHaveBeenNthCalledWith(1, publicId("prj"), {
      estimateOnly: true,
      fresh: true,
      includeSubdomains: false,
      maxCostCents: 7,
      mode: "one_per_domain",
      resultLimit: 300,
      target: "https://example.com/pricing",
      targetScope: "page",
    });
    expect(client.analyzeBacklinks).toHaveBeenNthCalledWith(2, publicId("prj"), {
      target: "example.com",
    });
    expect(client.loadMoreBacklinkRows).toHaveBeenNthCalledWith(1, publicId("prj"), {
      includeSubdomains: false,
      limit: 300,
      target: "https://example.com/pricing",
      targetScope: "page",
    });
    expect(client.loadMoreBacklinkRows).toHaveBeenNthCalledWith(2, publicId("prj"), {
      target: "example.com",
    });
    expect(configs.get("analyze_backlinks")?.description).toContain("Requires API write scope");
    expect(configs.get("analyze_backlinks")?.description).toContain("estimate_only first");
    expect(configs.get("analyze_backlinks")?.description).toContain("within fetched rows");
    expect(configs.get("load_more_backlink_rows")?.description).toContain("snapshot_expired");
  });

  it("returns zod issues for invalid backlinks inputs without calling the SDK", async () => {
    const { callTool, client } = createToolHarness();

    const analyzeResult = await callTool("analyze_backlinks", {
      project_id: publicId("prj"),
      result_limit: 200,
      target: "example.com",
    });
    const loadMoreResult = await callTool("load_more_backlink_rows", {
      limit: 150,
      project_id: publicId("prj"),
      target: "example.com",
    });

    expect(analyzeResult.isError).toBe(true);
    expect(parsedContent(analyzeResult)).toMatchObject({
      error: { issues: expect.any(Array), name: "ZodError" },
    });
    expect(loadMoreResult.isError).toBe(true);
    expect(parsedContent(loadMoreResult)).toMatchObject({
      error: { issues: expect.any(Array), name: "ZodError" },
    });
    expect(client.analyzeBacklinks).not.toHaveBeenCalled();
    expect(client.loadMoreBacklinkRows).not.toHaveBeenCalled();
  });

  it("hydrates nullable metrics with per-keyword cache guidance", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      cached_count: 1,
      connections: [{ id: publicId("conn"), label: "DataForSEO", provider: "dataforseo" }],
      cost_cents: 2,
      fetched_at: "2026-07-22T10:00:00.000Z",
      fetched_count: 1,
      provider: "DataForSEO",
      rows: [
        {
          competition: 0.61,
          cpc_cents: 243,
          difficulty: null,
          intent: null,
          keyword: "rank tracker",
          monthly_trend: [{ month: 6, search_volume: 720, year: 2026 }],
          search_volume: 720,
        },
      ],
      total_count: 1,
    };
    client.getKeywordMetrics.mockResolvedValueOnce(response);

    await expect(
      callTool("get_keyword_metrics", {
        connection_id: publicId("conn"),
        fresh: true,
        include_clickstream: false,
        keywords: ["rank tracker", "seo api"],
        project_id: publicId("prj"),
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.getKeywordMetrics).toHaveBeenCalledWith(publicId("prj"), {
      connection_id: publicId("conn"),
      fresh: true,
      include_clickstream: false,
      keywords: ["rank tracker", "seo api"],
    });
    expect(configs.get("get_keyword_metrics")?.description).toContain("up to 700 keywords");
    expect(configs.get("get_keyword_metrics")?.description).toContain(
      "cache each keyword for 12 hours",
    );
    expect(configs.get("get_keyword_metrics")?.description).toContain("Requires API write scope");
    expect(configs.get("get_keyword_metrics")?.description).toContain("estimate_only first");
  });

  it("forwards free estimate and maximum cost options for research and metrics", async () => {
    const { callTool, client } = createToolHarness();
    const researchEstimate = {
      cached: false,
      connections: [{ id: publicId("conn"), label: "DataForSEO", provider: "dataforseo" }],
      cost_cents: 2,
      estimate: true,
      fetched_at: "2026-07-22T10:00:00.000Z",
      provider: "DataForSEO",
      rows: [],
      sources: [
        {
          cached: false,
          cost_cents: 2,
          returned: 0,
          source: "related",
          status: "ok",
        },
      ],
      total_count: 0,
    };
    const metricsEstimate = {
      cached_count: 1,
      connections: [{ id: publicId("conn"), label: "DataForSEO", provider: "dataforseo" }],
      cost_cents: 2,
      estimate: true,
      estimated_cost_cents: 2,
      fetched_at: "2026-07-22T10:00:00.000Z",
      fetched_count: 0,
      fetched_count_estimate: 1,
      provider: "DataForSEO",
      rows: [],
      total_count: 0,
    };
    client.researchKeywords.mockResolvedValueOnce(researchEstimate);
    client.getKeywordMetrics.mockResolvedValueOnce(metricsEstimate);

    await expect(
      callTool("research_keywords", {
        estimate_only: true,
        max_cost_cents: 3,
        project_id: publicId("prj"),
        seed: "rank tracker",
      }),
    ).resolves.toMatchObject({ structuredContent: researchEstimate });
    await expect(
      callTool("get_keyword_metrics", {
        estimate_only: true,
        keywords: ["rank tracker", "seo api"],
        max_cost_cents: 3,
        project_id: publicId("prj"),
      }),
    ).resolves.toMatchObject({ structuredContent: metricsEstimate });

    expect(client.researchKeywords).toHaveBeenCalledWith(publicId("prj"), {
      estimateOnly: true,
      maxCostCents: 3,
      seed: "rank tracker",
    });
    expect(client.getKeywordMetrics).toHaveBeenCalledWith(publicId("prj"), {
      estimate_only: true,
      keywords: ["rank tracker", "seo api"],
      max_cost_cents: 3,
    });
  });

  it("exports project rank history as JSON and directs CSV dumps to REST", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      data: [
        {
          checked_at: "2026-07-21T10:00:00.000Z",
          id: publicId("check"),
          keyword: "rank tracker api",
          keyword_id: publicId("kw"),
          position: 4,
          previous_position: null,
          ranking_url: "https://example.com/rank-tracker",
        },
      ],
      meta: { next_cursor: "cursor_2" },
    };
    client.exportRankHistory.mockResolvedValueOnce(response);

    await expect(
      callTool("export_rank_history", {
        cursor: "cursor_1",
        granularity: "weekly",
        keyword_ids: [publicId("kw"), publicId("kw", "b")],
        limit: 25,
        project_id: publicId("prj"),
        range: "90",
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.exportRankHistory).toHaveBeenCalledWith(publicId("prj"), {
      cursor: "cursor_1",
      format: "json",
      granularity: "weekly",
      keywordIds: [publicId("kw"), publicId("kw", "b")],
      limit: 25,
      range: "90",
    });
    expect(configs.get("export_rank_history")?.description).toContain("REST endpoint directly");
  });

  it("lists, enables, and disables sitemap monitors", async () => {
    const { callTool, client } = createToolHarness();
    const monitor = {
      enabled: true,
      id: publicId("prj"),
      latest_snapshot: {
        fetched_at: "2026-07-22T09:00:00.000Z",
        sitemap_url: "https://example.com/sitemap.xml",
        url_count: 42,
      },
      project_id: publicId("prj"),
      sitemap_url: "https://example.com/sitemap.xml",
      status: "active",
    };
    client.listSitemapMonitors.mockResolvedValueOnce(listResponse([monitor], null));
    client.updateSitemapMonitor.mockResolvedValueOnce(monitor);
    client.updateSitemapMonitor.mockResolvedValueOnce({
      ...monitor,
      enabled: false,
      status: "disabled",
    });

    await callTool("list_sitemap_monitors", { project_id: publicId("prj") });
    await callTool("enable_sitemap_monitor", {
      idempotency_key: "idem_enable",
      monitor_id: publicId("prj"),
      project_id: publicId("prj"),
    });
    await callTool("disable_sitemap_monitor", {
      monitor_id: publicId("prj"),
      project_id: publicId("prj"),
    });

    expect(client.listSitemapMonitors).toHaveBeenCalledWith(publicId("prj"));
    expect(client.updateSitemapMonitor).toHaveBeenNthCalledWith(
      1,
      publicId("prj"),
      publicId("prj"),
      { enabled: true },
      { idempotencyKey: "idem_enable" },
    );
    expect(client.updateSitemapMonitor).toHaveBeenNthCalledWith(
      2,
      publicId("prj"),
      publicId("prj"),
      { enabled: false },
      undefined,
    );
  });

  it("adds keywords with defaults and forwards idempotency keys", async () => {
    const { callTool, client } = createToolHarness();
    client.addKeywords.mockResolvedValueOnce({
      created: 2,
      results: [
        { keyword: keyword({ id: publicId("kw") }), status: "created" },
        { keyword: keyword({ id: publicId("kw", "b"), text: "brand search" }), status: "created" },
      ],
      skipped: 0,
    });

    await callTool("add_keywords", {
      device: "desktop",
      idempotency_key: "idem_1",
      keywords: [
        "rank tracker",
        {
          keyword: "brand search",
          tags: ["brand"],
          target_url: null,
        },
      ],
      project_id: publicId("prj"),
      tags: ["seo"],
      target_url: "https://example.com/rank",
    });

    expect(client.addKeywords).toHaveBeenCalledWith(
      publicId("prj"),
      {
        keywords: [
          {
            device: "desktop",
            keyword: "rank tracker",
            tags: ["seo"],
            target_url: "https://example.com/rank",
          },
          {
            device: "desktop",
            keyword: "brand search",
            tags: ["brand"],
            target_url: null,
          },
        ],
      },
      { idempotencyKey: "idem_1" },
    );
  });

  it("forwards keyword city, location_key, intent, and topic fields", async () => {
    const { callTool, client } = createToolHarness();
    client.addKeywords.mockResolvedValueOnce({
      created: 1,
      results: [{ keyword: keyword(), status: "created" }],
      skipped: 0,
    });
    client.updateKeyword.mockResolvedValueOnce(keyword({ intent: "commercial" }));

    await callTool("add_keywords", {
      city: "Los Angeles",
      intent: "commercial",
      keywords: [
        {
          city: null,
          keyword: "rank tracker",
          location_key: "US/California/Los Angeles",
          topic: "tools",
        },
      ],
      project_id: publicId("prj"),
    });
    await callTool("update_keyword", {
      city: "Warsaw",
      intent: null,
      keyword_id: publicId("kw"),
      location_key: "PL/Masovian Voivodeship/Warsaw",
      topic: "tools",
    });

    expect(client.addKeywords).toHaveBeenCalledWith(
      publicId("prj"),
      {
        keywords: [
          {
            city: null,
            intent: "commercial",
            keyword: "rank tracker",
            location_key: "US/California/Los Angeles",
            topic: "tools",
          },
        ],
      },
      undefined,
    );
    expect(client.updateKeyword).toHaveBeenCalledWith(
      publicId("kw"),
      {
        city: "Warsaw",
        intent: null,
        location_key: "PL/Masovian Voivodeship/Warsaw",
        topic: "tools",
      },
      undefined,
    );
  });

  it("rejects malformed location keys", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("update_keyword", {
      keyword_id: publicId("kw"),
      location_key: "california",
    });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(parsedContent(result))).toContain("location_key must look like");
    expect(client.updateKeyword).not.toHaveBeenCalled();
  });

  it("gets, updates, sets target URLs, and deletes keywords", async () => {
    const { callTool, client } = createToolHarness();
    client.getKeyword.mockResolvedValueOnce(keyword());
    client.updateKeyword.mockResolvedValueOnce(keyword({ target_url: "/pricing" }));
    client.setKeywordTargetUrl.mockResolvedValueOnce(keyword({ target_url: null }));
    client.deleteKeyword.mockResolvedValueOnce(keyword());

    await callTool("get_keyword", { keyword_id: publicId("kw") });
    await callTool("update_keyword", {
      idempotency_key: "idem_update",
      keyword: "rank tracker api",
      keyword_id: publicId("kw"),
      schedule: {
        cron_expression: null,
        frequency: "weekly",
      },
      tags: ["api"],
      target_url: "/pricing",
    });
    await callTool("set_keyword_target_url", {
      idempotency_key: "idem_target",
      keyword_id: publicId("kw"),
      target_url: null,
    });
    await callTool("delete_keyword", {
      idempotency_key: "idem_delete",
      keyword_id: publicId("kw"),
    });

    expect(client.getKeyword).toHaveBeenCalledWith(publicId("kw"));
    expect(client.updateKeyword).toHaveBeenCalledWith(
      publicId("kw"),
      {
        keyword: "rank tracker api",
        schedule: {
          cron_expression: null,
          frequency: "weekly",
        },
        tags: ["api"],
        target_url: "/pricing",
      },
      { idempotencyKey: "idem_update" },
    );
    expect(client.setKeywordTargetUrl).toHaveBeenCalledWith(publicId("kw"), null, {
      idempotencyKey: "idem_target",
    });
    expect(client.deleteKeyword).toHaveBeenCalledWith(publicId("kw"), {
      idempotencyKey: "idem_delete",
    });
  });

  it("runs rank checks and reads rank history", async () => {
    const { callTool, client } = createToolHarness();
    client.runRankCheck.mockResolvedValueOnce(rankCheck());
    client.listRankChecks.mockResolvedValueOnce(listResponse([rankCheck()], "next"));
    client.getRankCheckResult.mockResolvedValueOnce(rankCheck());

    await callTool("run_rank_check", {
      idempotency_key: "idem_check",
      keyword_id: publicId("kw"),
      provider_id: "dataforseo",
    });
    await callTool("run_rank_check", {
      keyword_id: publicId("kw"),
    });
    await callTool("run_rank_check", {
      async: true,
      keyword_id: publicId("kw"),
    });
    await callTool("run_rank_check", {
      async: true,
      idempotency_key: "idem_async",
      keyword_id: publicId("kw"),
      provider_id: "dataforseo",
    });
    await callTool("get_rank_history", {
      cursor: "cursor_1",
      keyword_id: publicId("kw"),
      limit: 10,
      since: "2026-01-01T00:00:00.000Z",
      status: "completed",
      until: "2026-01-31T00:00:00.000Z",
    });
    await callTool("get_rank_check_result", { check_id: publicId("check") });

    expect(client.runRankCheck).toHaveBeenCalledWith(
      publicId("kw"),
      { provider_id: "dataforseo" },
      { idempotencyKey: "idem_check" },
    );
    expect(client.runRankCheck).toHaveBeenCalledWith(publicId("kw"), undefined, undefined);
    expect(client.runRankCheck).toHaveBeenCalledWith(publicId("kw"), undefined, { async: true });
    expect(client.runRankCheck).toHaveBeenCalledWith(
      publicId("kw"),
      { provider_id: "dataforseo" },
      { async: true, idempotencyKey: "idem_async" },
    );
    expect(client.listRankChecks).toHaveBeenCalledWith(publicId("kw"), {
      cursor: "cursor_1",
      limit: 10,
      since: "2026-01-01T00:00:00.000Z",
      status: "completed",
      until: "2026-01-31T00:00:00.000Z",
    });
    expect(client.getRankCheckResult).toHaveBeenCalledWith(publicId("check"));
  });

  it("forwards provider ids for server-side validation", async () => {
    const { callTool, client } = createToolHarness();
    client.runRankCheck.mockResolvedValueOnce(rankCheck());

    const result = await callTool("run_rank_check", {
      keyword_id: publicId("kw"),
      provider_id: "future-serp-provider",
    });

    expect(result.isError).toBeUndefined();
    expect(client.runRankCheck).toHaveBeenCalledWith(
      publicId("kw"),
      { provider_id: "future-serp-provider" },
      undefined,
    );
  });

  it("creates signals with optional metadata and idempotency keys", async () => {
    const { callTool, client } = createToolHarness();
    client.createSignal.mockResolvedValue(signal());

    await callTool("create_signal", {
      happened_at: "2026-01-06T00:00:00.000Z",
      idempotency_key: "idem_signal",
      keyword_id: publicId("kw"),
      payload: { commit: "abc123" },
      severity: "warning",
      source: "deploy",
      type: "deploy.completed",
      url: "https://example.com/releases/42",
    });
    await callTool("create_signal", {
      source: "api",
      type: "content.refreshed",
    });

    expect(client.createSignal).toHaveBeenNthCalledWith(
      1,
      {
        happened_at: "2026-01-06T00:00:00.000Z",
        keyword_id: publicId("kw"),
        payload: { commit: "abc123" },
        severity: "warning",
        source: "deploy",
        type: "deploy.completed",
        url: "https://example.com/releases/42",
      },
      { idempotencyKey: "idem_signal" },
    );
    expect(client.createSignal).toHaveBeenNthCalledWith(
      2,
      { source: "api", type: "content.refreshed" },
      undefined,
    );
  });

  it("rejects invalid signal types, sources, and payloads", async () => {
    const { callTool, client } = createToolHarness();

    const typeResult = await callTool("create_signal", {
      source: "api",
      type: "not-dot-separated",
    });
    const sourceResult = await callTool("create_signal", {
      source: "manual",
      type: "deploy.completed",
    });
    const payloadResult = await callTool("create_signal", {
      payload: { blob: "x".repeat(9 * 1024) },
      source: "api",
      type: "deploy.completed",
    });
    const serializationResult = await callTool("create_signal", {
      payload: { value: 1n },
      source: "api",
      type: "deploy.completed",
    });

    expect(typeResult.isError).toBe(true);
    expect(JSON.stringify(parsedContent(typeResult))).toContain("type must be dot-separated");
    expect(sourceResult.isError).toBe(true);
    expect(payloadResult.isError).toBe(true);
    expect(JSON.stringify(parsedContent(payloadResult))).toContain(
      "payload must serialize to 8KB or less.",
    );
    expect(serializationResult.isError).toBe(true);
    expect(JSON.stringify(parsedContent(serializationResult))).toContain(
      "payload must be JSON serializable.",
    );
    expect(client.createSignal).not.toHaveBeenCalled();
  });

  it("lists signals with source, type, and date range filters", async () => {
    const { callTool, client } = createToolHarness();
    client.listSignals.mockResolvedValue(listResponse([signal()], "signals_next"));

    await callTool("list_signals", {
      cursor: "signal_cursor",
      from: "2026-01-01T00:00:00.000Z",
      limit: 25,
      project_id: publicId("prj"),
      source: "rank_tracker",
      to: "2026-01-31T00:00:00.000Z",
      type: "deploy.completed",
    });
    await callTool("list_signals", { project_id: publicId("prj") });

    expect(client.listSignals).toHaveBeenNthCalledWith(1, publicId("prj"), {
      cursor: "signal_cursor",
      from: "2026-01-01T00:00:00.000Z",
      limit: 25,
      source: "rank_tracker",
      to: "2026-01-31T00:00:00.000Z",
      type: "deploy.completed",
    });
    expect(client.listSignals).toHaveBeenNthCalledWith(2, publicId("prj"), {});
  });

  it("reads analytics and triggers project traffic sync", async () => {
    const { callTool, client, configs } = createToolHarness();
    const snapshots = { offset: 0, rows: [], total_count: 0 };
    const queryStats = {
      connection: { id: publicId("conn", "b"), label: "Search Console", provider: "gsc" },
      rows: [],
    };
    const sync = {
      connections: 1,
      keyword_snapshots: 0,
      page_snapshots: 3,
      project_id: publicId("prj"),
      runs: [],
      skipped: [],
    };
    client.listTrafficSnapshots.mockResolvedValueOnce(snapshots);
    client.listSearchPerformanceQueryStats.mockResolvedValueOnce(queryStats);
    client.syncProjectTraffic.mockResolvedValueOnce(sync);

    await callTool("list_traffic_snapshots", {
      end_date: "2026-06-30",
      limit: 50,
      offset: 0,
      paths: ["/", "/pricing"],
      project_id: publicId("prj"),
      start_date: "2026-06-01",
    });
    await callTool("list_search_performance_query_stats", {
      connection_id: publicId("conn", "b"),
      end_date: "2026-06-30",
      limit: 100,
      project_id: publicId("prj"),
      query: "rank tracker",
      start_date: "2026-06-01",
    });
    const result = await callTool("sync_project_traffic", {
      idempotency_key: "sync_1",
      project_id: publicId("prj"),
    });

    expect(client.listTrafficSnapshots).toHaveBeenCalledWith(publicId("prj"), {
      endDate: "2026-06-30",
      limit: 50,
      offset: 0,
      paths: ["/", "/pricing"],
      startDate: "2026-06-01",
    });
    expect(client.listSearchPerformanceQueryStats).toHaveBeenCalledWith(publicId("prj"), {
      connectionId: publicId("conn", "b"),
      endDate: "2026-06-30",
      limit: 100,
      query: "rank tracker",
      startDate: "2026-06-01",
    });
    expect(client.syncProjectTraffic).toHaveBeenCalledWith(publicId("prj"), {
      idempotencyKey: "sync_1",
    });
    expect(result.structuredContent).toEqual(sync);
    expect(configs.get("list_traffic_snapshots")?.description).toContain("project's own connected");
    expect(configs.get("list_search_performance_query_stats")?.description).toContain(
      "project's own connected",
    );
    expect(configs.get("sync_project_traffic")?.description).toContain("project's own connected");
  });

  it("lists provider rates and estimates costs", async () => {
    const { callTool, client } = createToolHarness();
    client.getProviderRates.mockResolvedValueOnce(dataResponse([providerRate()]));
    client.getCostEstimate.mockResolvedValue(dataResponse(costEstimate()));

    const ratesResult = await callTool("get_provider_rates");
    await callTool("get_cost_estimate", {
      devices: 2,
      frequency: "weekly",
      keywords: 100,
      locations: 3,
      option: "priority",
      plan: "starter",
      provider: "serpapi",
    });
    await callTool("get_cost_estimate", { keywords: 50 });

    expect(ratesResult.structuredContent).toEqual(dataResponse([providerRate()]));
    expect(client.getProviderRates).toHaveBeenCalledWith();
    expect(client.getCostEstimate).toHaveBeenNthCalledWith(1, {
      devices: 2,
      frequency: "weekly",
      keywords: 100,
      locations: 3,
      option: "priority",
      plan: "starter",
      provider: "serpapi",
    });
    expect(client.getCostEstimate).toHaveBeenNthCalledWith(2, { keywords: 50 });
  });

  it("reports cloud import compatibility from the anonymous preflight", async () => {
    const { callTool, client } = createToolHarness();
    const compatibility = {
      app_version: "1.42.0",
      latest_migration: "2026_07_01_add_cloud_import",
      schema_versions_supported: [5],
    };
    client.getCloudImportCompatibility.mockResolvedValueOnce(compatibility);

    const result = await callTool("get_cloud_import_compatibility");

    expect(result.structuredContent).toEqual(compatibility);
    expect(client.getCloudImportCompatibility).toHaveBeenCalledWith();
  });

  it("requires a keyword count within bounds for cost estimates", async () => {
    const { callTool, client } = createToolHarness();

    const missingResult = await callTool("get_cost_estimate", {});
    const boundsResult = await callTool("get_cost_estimate", { keywords: 100001 });

    expect(missingResult.isError).toBe(true);
    expect(boundsResult.isError).toBe(true);
    expect(client.getCostEstimate).not.toHaveBeenCalled();
  });

  it("bulk updates keywords with operation-specific payloads", async () => {
    const { callTool, client } = createToolHarness();
    client.bulkUpdateKeywords.mockResolvedValue({ operation: "add_tags", results: [] });

    await callTool("bulk_update_keywords", {
      idempotency_key: "idem_bulk",
      keyword_ids: [publicId("kw"), publicId("kw", "b")],
      operation: "add_tags",
      tags: ["seo"],
    });
    await callTool("bulk_update_keywords", {
      keyword_ids: [publicId("kw")],
      operation: "set_frequency",
      schedule: {
        cron_expression: "0 7 * * 1",
        frequency: "custom_cron",
        timezone: "Europe/Warsaw",
      },
    });
    await callTool("bulk_update_keywords", {
      keyword_ids: [publicId("kw")],
      operation: "set_target_url",
      target_url: null,
    });
    await callTool("bulk_update_keywords", {
      keyword_ids: [publicId("kw")],
      operation: "delete",
    });

    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      1,
      {
        keyword_ids: [publicId("kw"), publicId("kw", "b")],
        operation: "add_tags",
        tags: ["seo"],
      },
      { idempotencyKey: "idem_bulk" },
    );
    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      2,
      {
        keyword_ids: [publicId("kw")],
        operation: "set_frequency",
        schedule: {
          cron_expression: "0 7 * * 1",
          frequency: "custom_cron",
          timezone: "Europe/Warsaw",
        },
      },
      undefined,
    );
    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      3,
      {
        keyword_ids: [publicId("kw")],
        operation: "set_target_url",
        target_url: null,
      },
      undefined,
    );
    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      4,
      {
        keyword_ids: [publicId("kw")],
        operation: "delete",
      },
      undefined,
    );
  });

  it("manages alert rules and lists triggered alerts", async () => {
    const { callTool, client } = createToolHarness();
    client.listAlertRules.mockResolvedValueOnce(listResponse([alertRule()], "rules_next"));
    client.createAlertRule.mockResolvedValueOnce(alertRule({ id: publicId("alr", "b") }));
    client.updateAlertRule.mockResolvedValueOnce(alertRule({ enabled: false }));
    client.deleteAlertRule.mockResolvedValueOnce({ deleted: true });
    client.listTriggeredAlerts.mockResolvedValueOnce(
      listResponse([triggeredAlert()], "alerts_next"),
    );

    await callTool("list_alert_rules", {
      cursor: "cursor_1",
      limit: 10,
      project_id: publicId("prj"),
    });
    await callTool("create_alert_rule", {
      channels: ["email", "webhook"],
      condition_type: "threshold",
      idempotency_key: "idem_alert",
      name: "Ranking drop",
      project_id: publicId("prj"),
      severity: "warning",
      target_type: "all",
      threshold_position: 10,
    });
    await callTool("update_alert_rule", {
      condition_type: "threshold",
      enabled: false,
      name: "Ranking drop",
      rule_id: publicId("alr"),
      severity: "info",
      target_type: "all",
      threshold_position: 9,
    });
    await callTool("delete_alert_rule", {
      idempotency_key: "idem_delete_rule",
      rule_id: publicId("alr"),
    });
    await callTool("list_triggered_alerts", {
      limit: 5,
      project_id: publicId("prj"),
    });

    expect(client.listAlertRules).toHaveBeenCalledWith(publicId("prj"), {
      cursor: "cursor_1",
      limit: 10,
    });
    expect(client.createAlertRule).toHaveBeenCalledWith(
      publicId("prj"),
      {
        channels: ["email", "webhook"],
        condition_type: "threshold",
        name: "Ranking drop",
        severity: "warning",
        target_type: "all",
        threshold_position: 10,
      },
      { idempotencyKey: "idem_alert" },
    );
    expect(client.updateAlertRule).toHaveBeenCalledWith(
      publicId("alr"),
      {
        condition_type: "threshold",
        enabled: false,
        name: "Ranking drop",
        severity: "info",
        target_type: "all",
        threshold_position: 9,
      },
      undefined,
    );
    expect(client.deleteAlertRule).toHaveBeenCalledWith(publicId("alr"), {
      idempotencyKey: "idem_delete_rule",
    });
    expect(client.listTriggeredAlerts).toHaveBeenCalledWith(publicId("prj"), { limit: 5 });
  });

  it("mutes alerts and marks project alerts read for the whole team", async () => {
    const { callTool, client, configs } = createToolHarness();
    const muteResult = { muted: true, snoozed_until: "2026-07-23T10:00:00.000Z" };
    const readResult = { updated: 3 };
    client.muteTriggeredAlert.mockResolvedValueOnce(muteResult);
    client.markProjectAlertsRead.mockResolvedValueOnce(readResult);

    await expect(
      callTool("mute_triggered_alert", {
        alert_id: publicId("al"),
        idempotency_key: "idem_mute",
        project_id: publicId("prj"),
      }),
    ).resolves.toMatchObject({ structuredContent: muteResult });
    await expect(
      callTool("mark_project_alerts_read", {
        project_id: publicId("prj"),
      }),
    ).resolves.toMatchObject({ structuredContent: readResult });

    expect(client.muteTriggeredAlert).toHaveBeenCalledWith(publicId("prj"), publicId("al"), {
      idempotencyKey: "idem_mute",
    });
    expect(client.markProjectAlertsRead).toHaveBeenCalledWith(publicId("prj"), undefined);
    expect(configs.get("mute_triggered_alert")?.description).toContain("whole project team");
    expect(configs.get("mark_project_alerts_read")?.description).toContain("whole project team");
  });

  it("lists team members and manages team invites", async () => {
    const { callTool, client } = createToolHarness();
    client.listTeamMembers.mockResolvedValueOnce(listResponse([teamMember()], "members_next"));
    client.listTeamInvites.mockResolvedValueOnce(listResponse([teamInvite()], "invites_next"));
    client.createTeamInvite.mockResolvedValueOnce({
      expires_at: "2026-01-14T00:00:00.000Z",
      id: publicId("inv", "b"),
      invite_link: "https://bisibility.test/invite/raw",
    });
    client.revokeTeamInvite.mockResolvedValueOnce({ id: publicId("inv") });

    await callTool("list_team_members", {
      cursor: "member_cursor",
      limit: 25,
      project_id: publicId("prj"),
    });
    await callTool("list_team_invites", {
      limit: 5,
      project_id: publicId("prj"),
    });
    await callTool("create_team_invite", {
      email: "new@example.com",
      idempotency_key: "idem_invite",
      project_id: publicId("prj"),
      role: "viewer",
    });
    await callTool("revoke_team_invite", {
      idempotency_key: "idem_revoke_invite",
      invite_id: publicId("inv"),
      project_id: publicId("prj"),
    });

    expect(client.listTeamMembers).toHaveBeenCalledWith(publicId("prj"), {
      cursor: "member_cursor",
      limit: 25,
    });
    expect(client.listTeamInvites).toHaveBeenCalledWith(publicId("prj"), { limit: 5 });
    expect(client.createTeamInvite).toHaveBeenCalledWith(
      publicId("prj"),
      { email: "new@example.com", role: "viewer" },
      { idempotencyKey: "idem_invite" },
    );
    expect(client.revokeTeamInvite).toHaveBeenCalledWith(publicId("prj"), publicId("inv"), {
      idempotencyKey: "idem_revoke_invite",
    });
  });

  it("updates and removes team members and resends invites", async () => {
    const { callTool, client, configs } = createToolHarness();
    client.resendTeamInvite.mockResolvedValueOnce({
      expires_at: "2026-07-29T10:00:00.000Z",
      id: publicId("inv"),
      invite_link: "https://bisibility.test/invite/new-token",
    });
    client.updateTeamMemberRole.mockResolvedValueOnce({ id: publicId("mbr"), role: "viewer" });
    client.removeTeamMember.mockResolvedValueOnce({ id: publicId("mbr") });

    await callTool("resend_team_invite", {
      idempotency_key: "resend_1",
      invite_id: publicId("inv"),
      project_id: publicId("prj"),
    });
    await callTool("update_team_member_role", {
      idempotency_key: "role_1",
      member_id: publicId("mbr"),
      project_id: publicId("prj"),
      role: "viewer",
    });
    await callTool("remove_team_member", {
      idempotency_key: "remove_1",
      member_id: publicId("mbr"),
      project_id: publicId("prj"),
    });

    expect(client.resendTeamInvite).toHaveBeenCalledWith(publicId("prj"), publicId("inv"), {
      idempotencyKey: "resend_1",
    });
    expect(client.updateTeamMemberRole).toHaveBeenCalledWith(
      publicId("prj"),
      publicId("mbr"),
      { role: "viewer" },
      { idempotencyKey: "role_1" },
    );
    expect(client.removeTeamMember).toHaveBeenCalledWith(publicId("prj"), publicId("mbr"), {
      idempotencyKey: "remove_1",
    });
    expect(configs.get("remove_team_member")?.description).toContain("Confirm the user's intent");
    expect(configs.get("update_team_member_role")?.description).toContain(
      "Ownership transfer remains UI-only",
    );
  });

  it("manages provider connections and settings", async () => {
    const { callTool, client } = createToolHarness();
    const testResult = { balance: 15.25, message: "Connected", ok: true };
    client.listProviders.mockResolvedValueOnce(listResponse([provider()], "providers_next"));
    client.connectProvider.mockResolvedValue(providerConnection());
    client.testProviderConnection.mockResolvedValue(testResult);
    client.updateProviderSettings.mockResolvedValueOnce(providerConnection({ priority: 25 }));
    client.setProviderEnabled.mockResolvedValueOnce(providerConnection({ enabled: false }));
    client.setProviderPriority.mockResolvedValueOnce(providerConnection({ priority: 20 }));
    client.setPrimaryProvider.mockResolvedValueOnce(providerConnection({ is_primary: false }));
    client.disconnectProvider.mockResolvedValueOnce({ ok: true });

    await callTool("list_providers", {
      cursor: "provider_cursor",
      limit: 20,
      project_id: publicId("prj"),
    });
    await callTool("connect_provider", {
      cost_per_check: 0.01,
      credentials: { api_key: "secret" },
      idempotency_key: "idem_provider",
      primary: true,
      priority: 0,
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("connect_provider", {
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("test_provider_connection", {
      credentials: { api_key: "secret" },
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("test_provider_connection", {
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("update_provider_settings", {
      enabled: false,
      priority: 25,
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("set_provider_enabled", {
      enabled: false,
      idempotency_key: "idem_enabled",
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("set_provider_priority", {
      priority: 20,
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("set_primary_provider", {
      primary: false,
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    await callTool("disconnect_provider", {
      idempotency_key: "idem_disconnect",
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });

    expect(client.listProviders).toHaveBeenCalledWith(publicId("prj"), {
      cursor: "provider_cursor",
      limit: 20,
    });
    expect(client.connectProvider).toHaveBeenNthCalledWith(
      1,
      publicId("prj"),
      "serpapi",
      {
        cost_per_check: 0.01,
        credentials: { api_key: "secret" },
        primary: true,
        priority: 0,
      },
      { idempotencyKey: "idem_provider" },
    );
    expect(client.connectProvider).toHaveBeenNthCalledWith(
      2,
      publicId("prj"),
      "serpapi",
      undefined,
      undefined,
    );
    expect(client.testProviderConnection).toHaveBeenNthCalledWith(1, publicId("prj"), "serpapi", {
      credentials: { api_key: "secret" },
    });
    expect(client.testProviderConnection).toHaveBeenNthCalledWith(
      2,
      publicId("prj"),
      "serpapi",
      undefined,
    );
    expect(client.updateProviderSettings).toHaveBeenCalledWith(
      publicId("prj"),
      "serpapi",
      { enabled: false, priority: 25 },
      undefined,
    );
    expect(client.setProviderEnabled).toHaveBeenCalledWith(publicId("prj"), "serpapi", false, {
      idempotencyKey: "idem_enabled",
    });
    expect(client.setProviderPriority).toHaveBeenCalledWith(
      publicId("prj"),
      "serpapi",
      20,
      undefined,
    );
    expect(client.setPrimaryProvider).toHaveBeenCalledWith(
      publicId("prj"),
      "serpapi",
      false,
      undefined,
    );
    expect(client.disconnectProvider).toHaveBeenCalledWith(publicId("prj"), "serpapi", {
      idempotencyKey: "idem_disconnect",
    });
  });

  it("connects and tests self-hosted analytics providers with an endpoint credential", async () => {
    const { callTool, client } = createToolHarness();
    client.connectProvider.mockResolvedValueOnce(
      providerConnection({ kind: "analytics", provider: "plausible" }),
    );
    client.testProviderConnection.mockResolvedValueOnce({ message: "Connected", ok: true });

    await callTool("connect_provider", {
      credentials: {
        api_key: "plausible-key",
        endpoint: "https://plausible.example.com/api",
        login: "example.com",
      },
      project_id: publicId("prj"),
      provider_id: "plausible",
    });
    await callTool("test_provider_connection", {
      credentials: { endpoint: "https://plausible.example.com/api" },
      project_id: publicId("prj"),
      provider_id: "plausible",
    });

    expect(client.connectProvider).toHaveBeenCalledWith(
      publicId("prj"),
      "plausible",
      {
        credentials: {
          api_key: "plausible-key",
          endpoint: "https://plausible.example.com/api",
          login: "example.com",
        },
      },
      undefined,
    );
    expect(client.testProviderConnection).toHaveBeenCalledWith(publicId("prj"), "plausible", {
      credentials: { endpoint: "https://plausible.example.com/api" },
    });
  });

  it("forwards newly registered provider ids for server-side validation", async () => {
    const { callTool, client } = createToolHarness();
    client.connectProvider.mockResolvedValueOnce(providerConnection());

    const result = await callTool("connect_provider", {
      project_id: publicId("prj"),
      provider_id: "future_provider",
    });

    expect(result.isError).toBeUndefined();
    expect(client.connectProvider).toHaveBeenCalledWith(
      publicId("prj"),
      "future_provider",
      undefined,
      undefined,
    );
  });

  it("manages saved views and competitors", async () => {
    const { callTool, client } = createToolHarness();
    client.listSavedViews.mockResolvedValueOnce(listResponse([savedView()], "views_next"));
    client.createSavedView.mockResolvedValueOnce(savedView({ id: publicId("viw", "b") }));
    client.deleteSavedView.mockResolvedValueOnce({ deleted: true });
    client.listCompetitors.mockResolvedValueOnce(competitorListResponse());
    client.addCompetitor.mockResolvedValueOnce(competitor({ label: null }));
    client.removeCompetitor.mockResolvedValueOnce({ removed: true });

    await callTool("list_saved_views", {
      cursor: "view_cursor",
      limit: 2,
      project_id: publicId("prj"),
      surface: "competitors",
    });
    await callTool("create_saved_view", {
      config: competitorSavedViewConfig,
      idempotency_key: "idem_view",
      name: "Competitor market",
      project_id: publicId("prj"),
      surface: "competitors",
    });
    await callTool("delete_saved_view", {
      idempotency_key: "idem_delete_view",
      project_id: publicId("prj"),
      view_id: publicId("viw"),
    });
    await callTool("list_competitors", {
      cursor: "competitor_cursor",
      limit: 25,
      project_id: publicId("prj"),
    });
    await callTool("add_competitor", {
      domain: "https://competitor.example.com",
      idempotency_key: "idem_competitor",
      project_id: publicId("prj"),
    });
    await callTool("remove_competitor", {
      competitor_id: publicId("cmp"),
      idempotency_key: "idem_remove_competitor",
      project_id: publicId("prj"),
    });

    expect(client.listSavedViews).toHaveBeenCalledWith(publicId("prj"), {
      cursor: "view_cursor",
      limit: 2,
      surface: "competitors",
    });
    expect(client.createSavedView).toHaveBeenCalledWith(
      publicId("prj"),
      { config: competitorSavedViewConfig, name: "Competitor market", surface: "competitors" },
      { idempotencyKey: "idem_view" },
    );
    expect(client.deleteSavedView).toHaveBeenCalledWith(publicId("prj"), publicId("viw"), {
      idempotencyKey: "idem_delete_view",
    });
    expect(client.listCompetitors).toHaveBeenCalledWith(publicId("prj"), {
      cursor: "competitor_cursor",
      limit: 25,
    });
    expect(client.addCompetitor).toHaveBeenCalledWith(
      publicId("prj"),
      { domain: "https://competitor.example.com" },
      { idempotencyKey: "idem_competitor" },
    );
    expect(client.removeCompetitor).toHaveBeenCalledWith(publicId("prj"), publicId("cmp"), {
      idempotencyKey: "idem_remove_competitor",
    });
  });

  it("creates a current keyword saved view without legacy market filters", async () => {
    const { callTool, client } = createToolHarness();
    client.createSavedView.mockResolvedValueOnce(savedView({ name: "France AI" }));

    const config = {
      ...savedViewConfig,
      filters: { ...savedViewConfig.filters, intents: ["commercial"], serp: ["ai", "shopping"] },
      search: "",
    };

    const result = await callTool("create_saved_view", {
      config,
      name: "France AI",
      project_id: publicId("prj"),
    });

    expect(result.isError).toBeUndefined();
    expect(client.createSavedView).toHaveBeenCalledWith(
      publicId("prj"),
      { config, name: "France AI" },
      undefined,
    );
  });

  it("gets and updates notification preferences", async () => {
    const { callTool, client } = createToolHarness();
    client.getNotificationPreferences.mockResolvedValueOnce(notificationPreferences());
    client.updateNotificationPreferences.mockResolvedValueOnce(
      notificationPreferences({ alert_email: false, alert_slack: true }),
    );

    await callTool("get_notification_preferences", { project_id: publicId("prj") });
    await callTool("update_notification_preferences", {
      alert_email: false,
      alert_slack: true,
      idempotency_key: "idem_prefs",
      project_id: publicId("prj"),
    });

    expect(client.getNotificationPreferences).toHaveBeenCalledWith(publicId("prj"));
    expect(client.updateNotificationPreferences).toHaveBeenCalledWith(
      publicId("prj"),
      { alert_email: false, alert_slack: true },
      { idempotencyKey: "idem_prefs" },
    );
  });

  it("lists, mints, and revokes migration tokens", async () => {
    const { callTool, client } = createToolHarness();
    client.listMigrationTokens.mockResolvedValueOnce(
      migrationTokenListResponse([activeMigrationToken()]),
    );
    client.mintMigrationToken.mockResolvedValue(issuedMigrationToken());
    client.revokeMigrationToken.mockResolvedValueOnce({
      id: publicId("ferry"),
      revoked_at: "2026-01-08T00:30:00.000Z",
    });

    await callTool("list_migration_tokens", {
      limit: 1,
      project_id: publicId("prj"),
    });
    await callTool("mint_migration_token", {
      idempotency_key: "idem_mint",
      project_id: publicId("prj"),
    });
    await callTool("mint_migration_token", {
      project_id: publicId("prj"),
      scope: "keywords",
    });
    await callTool("revoke_migration_token", {
      idempotency_key: "idem_revoke_token",
      project_id: publicId("prj"),
      token_id: publicId("ferry"),
    });

    expect(client.listMigrationTokens).toHaveBeenCalledWith(publicId("prj"), { limit: 1 });
    expect(client.mintMigrationToken).toHaveBeenNthCalledWith(1, publicId("prj"), undefined, {
      idempotencyKey: "idem_mint",
    });
    expect(client.mintMigrationToken).toHaveBeenNthCalledWith(
      2,
      publicId("prj"),
      { scope: "keywords" },
      undefined,
    );
    expect(client.revokeMigrationToken).toHaveBeenCalledWith(publicId("prj"), publicId("ferry"), {
      idempotencyKey: "idem_revoke_token",
    });
  });

  it("returns tool errors for validation failures without calling the SDK", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("list_keywords", {
      limit: 500,
      project_id: publicId("prj"),
    });

    expect(result.isError).toBe(true);
    expect(parsedContent(result)).toMatchObject({
      error: {
        name: "ZodError",
      },
    });
    expect(client.listKeywords).not.toHaveBeenCalled();
  });

  it("requires explicit target_url when setting target URLs in bulk", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("bulk_update_keywords", {
      keyword_ids: [publicId("kw")],
      operation: "set_target_url",
    });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(parsedContent(result))).toContain("target_url is required");
    expect(client.bulkUpdateKeywords).not.toHaveBeenCalled();
  });

  it("requires provider settings and notification updates to include a value", async () => {
    const { callTool, client } = createToolHarness();

    const providerResult = await callTool("update_provider_settings", {
      project_id: publicId("prj"),
      provider_id: "serpapi",
    });
    const notificationResult = await callTool("update_notification_preferences", {
      project_id: publicId("prj"),
    });

    expect(providerResult.isError).toBe(true);
    expect(JSON.stringify(parsedContent(providerResult))).toContain(
      "At least one provider setting is required.",
    );
    expect(notificationResult.isError).toBe(true);
    expect(JSON.stringify(parsedContent(notificationResult))).toContain(
      "At least one notification preference is required.",
    );
    expect(client.updateProviderSettings).not.toHaveBeenCalled();
    expect(client.updateNotificationPreferences).not.toHaveBeenCalled();
  });

  it("returns tool errors when SDK calls fail", async () => {
    const { callTool, client } = createToolHarness();
    const error = Object.assign(new Error("API key scope does not allow this operation."), {
      name: "BisibilityApiError",
      problem: { detail: "Forbidden" },
      status: 403,
    });
    client.listProjects.mockRejectedValueOnce(error);

    const result = await callTool("list_projects");

    expect(result.isError).toBe(true);
    expect(parsedContent(result)).toEqual({
      error: {
        message: "API key scope does not allow this operation.",
        name: "BisibilityApiError",
        problem: { detail: "Forbidden" },
        status: 403,
      },
    });
  });
});
