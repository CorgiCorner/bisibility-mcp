import { readFileSync } from "node:fs";

import { describe, expect, it, vi } from "vitest";

import type { BisibilityToolClient } from "../src/index.js";
import { registerBisibilityTools } from "../src/index.js";
import {
  activeMigrationToken,
  alertRule,
  apiKey,
  competitor,
  competitorListResponse,
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
  "bisibility_get_health",
  "bisibility_get_capabilities",
  "bisibility_get_cloud_import_compatibility",
  "bisibility_get_provider_rates",
  "bisibility_get_cost_estimate",
  "bisibility_get_me",
  "bisibility_update_me",
  "bisibility_list_projects",
  "bisibility_create_project",
  "bisibility_get_project",
  "bisibility_search_locations",
  "bisibility_update_project",
  "bisibility_delete_project",
  "bisibility_update_project_defaults",
  "bisibility_list_keywords",
  "bisibility_list_ranked_keyword_suggestions",
  "bisibility_research_keywords",
  "bisibility_get_keyword_metrics",
  "bisibility_add_keywords",
  "bisibility_get_keyword",
  "bisibility_update_keyword",
  "bisibility_set_keyword_target_url",
  "bisibility_delete_keyword",
  "bisibility_bulk_update_keywords",
  "bisibility_run_rank_check",
  "bisibility_get_rank_history",
  "bisibility_export_rank_history",
  "bisibility_list_sitemap_monitors",
  "bisibility_enable_sitemap_monitor",
  "bisibility_disable_sitemap_monitor",
  "bisibility_get_rank_check_result",
  "bisibility_create_signal",
  "bisibility_list_signals",
  "bisibility_list_traffic_snapshots",
  "bisibility_list_search_performance_query_stats",
  "bisibility_sync_project_traffic",
  "bisibility_list_api_keys",
  "bisibility_create_api_key",
  "bisibility_revoke_api_key",
  "bisibility_list_project_api_keys",
  "bisibility_create_project_api_key",
  "bisibility_list_personal_tokens",
  "bisibility_create_personal_token",
  "bisibility_revoke_personal_token",
  "bisibility_list_webhooks",
  "bisibility_create_webhook",
  "bisibility_update_webhook",
  "bisibility_delete_webhook",
  "bisibility_list_alert_rules",
  "bisibility_create_alert_rule",
  "bisibility_update_alert_rule",
  "bisibility_delete_alert_rule",
  "bisibility_list_triggered_alerts",
  "bisibility_mute_triggered_alert",
  "bisibility_mark_project_alerts_read",
  "bisibility_list_team_members",
  "bisibility_list_team_invites",
  "bisibility_create_team_invite",
  "bisibility_revoke_team_invite",
  "bisibility_resend_team_invite",
  "bisibility_update_team_member_role",
  "bisibility_remove_team_member",
  "bisibility_list_providers",
  "bisibility_connect_provider",
  "bisibility_test_provider_connection",
  "bisibility_update_provider_settings",
  "bisibility_set_provider_enabled",
  "bisibility_set_provider_priority",
  "bisibility_set_primary_provider",
  "bisibility_disconnect_provider",
  "bisibility_list_saved_views",
  "bisibility_create_saved_view",
  "bisibility_delete_saved_view",
  "bisibility_list_competitors",
  "bisibility_add_competitor",
  "bisibility_remove_competitor",
  "bisibility_get_notification_preferences",
  "bisibility_update_notification_preferences",
  "bisibility_list_migration_tokens",
  "bisibility_mint_migration_token",
  "bisibility_revoke_migration_token",
];

function createClientMock(): Record<keyof BisibilityToolClient, ReturnType<typeof vi.fn>> {
  return {
    addCompetitor: vi.fn(),
    addKeywords: vi.fn(),
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

function createToolHarness() {
  const tools = new Map<string, ToolHandler>();
  const configs = new Map<string, { description: string; inputSchema: object; title: string }>();
  const server = {
    registerTool: vi.fn((name: string, config: never, handler: ToolHandler) => {
      configs.set(name, config);
      tools.set(name, handler);
    }),
  };
  const client = createClientMock();

  registerBisibilityTools(server as never, { client: client as unknown as BisibilityToolClient });

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

describe("registerBisibilityTools", () => {
  it("registers the Bisibility MCP tool surface", () => {
    const { configs, server, tools } = createToolHarness();

    expect([...tools.keys()]).toEqual(expectedToolNames);
    expect(server.registerTool).toHaveBeenCalledTimes(expectedToolNames.length);
    expect(configs.get("bisibility_add_keywords")).toMatchObject({
      title: "Add keywords",
    });
    expect(configs.get("bisibility_list_keywords")?.inputSchema).toHaveProperty("project_id");
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

    const result = await callTool("bisibility_list_projects");

    expect(result.isError).toBeUndefined();
    expect(parsedContent(result)).toEqual(listResponse([project()]));
    expect(result.structuredContent).toEqual(listResponse([project()]));
    expect(client.listProjects).toHaveBeenCalledWith();
  });

  it("exposes PAT account, project, API-key, and webhook automation", async () => {
    const { callTool, client } = createToolHarness();
    const me = {
      email: "owner@example.com",
      id: "user_1",
      name: "Owner",
      projects: [{ domain: "example.com", id: "prj_1", name: "Example", role: "owner" }],
    };
    const token = {
      created_at: "2026-07-12T00:00:00.000Z",
      expires_at: null,
      id: "pat_1",
      last_used_at: null,
      name: "Agent",
      prefix: "bsp_live_example",
      revoked_at: null,
      scope: "admin",
    };
    const webhook = {
      created_at: "2026-07-12T00:00:00.000Z",
      description: null,
      enabled: true,
      id: "wh_1",
      last_delivery_at: null,
      updated_at: "2026-07-12T00:00:00.000Z",
      url: "https://example.com/hook",
    };
    client.getMe.mockResolvedValueOnce(me);
    client.updateMe.mockResolvedValueOnce({ ...me, name: "Renamed" });
    client.createProject.mockResolvedValueOnce(project({ id: "prj_new" }));
    client.listProjectApiKeys.mockResolvedValueOnce(listResponse([createdApiKey()]));
    client.createProjectApiKey.mockResolvedValueOnce(createdApiKey());
    client.listMyTokens.mockResolvedValueOnce(listResponse([token]));
    client.createMyToken.mockResolvedValueOnce({
      ...token,
      masked_value: "masked",
      token: "bsp_raw",
    });
    client.revokeMyToken.mockResolvedValueOnce({
      ...token,
      revoked_at: "2026-07-12T01:00:00.000Z",
    });
    client.listWebhooks.mockResolvedValueOnce(listResponse([webhook]));
    client.createWebhook.mockResolvedValueOnce(webhook);
    client.updateWebhook.mockResolvedValueOnce({ ...webhook, enabled: false });
    client.deleteWebhook.mockResolvedValueOnce(webhook);

    await callTool("bisibility_get_me");
    await callTool("bisibility_update_me", { name: "Renamed" });
    await callTool("bisibility_create_project", {
      domain: "example.com",
      name: "Example",
      tracking_scope: "city",
    });
    await callTool("bisibility_list_project_api_keys", { limit: 10, project_id: "prj_1" });
    await callTool("bisibility_create_project_api_key", { name: "CI", project_id: "prj_1" });
    await callTool("bisibility_list_personal_tokens");
    const created = await callTool("bisibility_create_personal_token", {
      expires_in_days: 90,
      name: "Agent",
      scope: "admin",
    });
    await callTool("bisibility_revoke_personal_token", { token_id: "current" });
    await callTool("bisibility_list_webhooks", { limit: 10, project_id: "prj_1" });
    await callTool("bisibility_create_webhook", {
      hmac_secret: "1234567890123456",
      project_id: "prj_1",
      url: webhook.url,
    });
    await callTool("bisibility_update_webhook", {
      enabled: false,
      project_id: "prj_1",
      webhook_id: "wh_1",
    });
    await callTool("bisibility_delete_webhook", {
      project_id: "prj_1",
      webhook_id: "wh_1",
    });

    expect(client.updateMe).toHaveBeenCalledWith({ name: "Renamed" }, undefined);
    expect(client.createProject).toHaveBeenCalledWith(
      { domain: "example.com", name: "Example", trackingScope: "city" },
      undefined,
    );
    expect(client.listProjectApiKeys).toHaveBeenCalledWith("prj_1", { limit: 10 });
    expect(client.createProjectApiKey).toHaveBeenCalledWith("prj_1", { name: "CI" }, undefined);
    expect(client.createMyToken).toHaveBeenCalledWith(
      { expiresInDays: 90, name: "Agent", scope: "admin" },
      undefined,
    );
    expect(client.listWebhooks).toHaveBeenCalledWith("prj_1", { limit: 10 });
    expect(client.createWebhook).toHaveBeenCalledWith(
      "prj_1",
      { hmac_secret: "1234567890123456", url: webhook.url },
      undefined,
    );
    expect(parsedContent(created)).toMatchObject({ token: "bsp_raw" });
  });

  it("maps optional project_id to the SDK request header on implicit tools", async () => {
    const { callTool, client } = createToolHarness();
    client.getKeyword.mockResolvedValueOnce(keyword());

    await callTool("bisibility_get_keyword", { keyword_id: "kw_1", project_id: "prj_2" });

    expect(client.getKeyword).toHaveBeenCalledWith("kw_1", {
      headers: { "X-Bisibility-Project": "prj_2" },
    });
  });

  it("calls project and discovery SDK methods", async () => {
    const { callTool, client } = createToolHarness();
    client.getHealth.mockResolvedValueOnce({ status: "ok" });
    client.getCapabilities.mockResolvedValueOnce({ data: [{ name: "listProjects" }] });
    client.getProject.mockResolvedValueOnce(project());

    await expect(callTool("bisibility_get_health")).resolves.toMatchObject({
      structuredContent: { status: "ok" },
    });
    await expect(callTool("bisibility_get_capabilities")).resolves.toMatchObject({
      structuredContent: { data: [{ name: "listProjects" }] },
    });
    await callTool("bisibility_get_project", { project_id: "prj_1" });

    expect(client.getProject).toHaveBeenCalledWith("prj_1");
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
          id: "loc_1",
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
      callTool("bisibility_search_locations", { country: "US", limit: 20, q: "Austin" }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.searchLocations).toHaveBeenCalledWith({ country: "US", limit: 20, q: "Austin" });
    expect(configs.get("bisibility_search_locations")?.description).toContain(
      "location_key verbatim",
    );
    expect(configs.get("bisibility_add_keywords")?.description).toContain(
      "bisibility_search_locations",
    );
    expect(configs.get("bisibility_update_keyword")?.description).toContain(
      "bisibility_search_locations",
    );
  });

  it("rejects pagination inputs on list projects", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("bisibility_list_projects", { cursor: "cursor_1", limit: 10 });

    expect(result.isError).toBe(true);
    expect(client.listProjects).not.toHaveBeenCalled();
  });

  it("updates and deletes projects", async () => {
    const { callTool, client } = createToolHarness();
    client.updateProject.mockResolvedValueOnce(project({ name: "Renamed" }));
    client.deleteProject.mockResolvedValueOnce(project());

    await callTool("bisibility_update_project", {
      domain: "renamed.example",
      idempotency_key: "idem_project",
      name: "Renamed",
      project_id: "prj_1",
    });
    await callTool("bisibility_update_project", {
      name: "Renamed only",
      project_id: "prj_1",
    });
    await callTool("bisibility_delete_project", {
      idempotency_key: "idem_delete_project",
      project_id: "prj_1",
    });

    expect(client.updateProject).toHaveBeenNthCalledWith(
      1,
      "prj_1",
      { domain: "renamed.example", name: "Renamed" },
      { idempotencyKey: "idem_project" },
    );
    expect(client.updateProject).toHaveBeenNthCalledWith(
      2,
      "prj_1",
      { name: "Renamed only" },
      undefined,
    );
    expect(client.deleteProject).toHaveBeenCalledWith("prj_1", {
      idempotencyKey: "idem_delete_project",
    });
  });

  it("requires name or domain when updating a project", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("bisibility_update_project", { project_id: "prj_1" });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(parsedContent(result))).toContain("domain or name is required.");
    expect(client.updateProject).not.toHaveBeenCalled();
  });

  it("updates project defaults with schedule and market fields", async () => {
    const { callTool, client } = createToolHarness();
    client.updateProjectDefaults.mockResolvedValue(projectDefaults());

    await callTool("bisibility_update_project_defaults", {
      auto_schedule: true,
      country: "United States",
      cron_expression: null,
      device: "desktop",
      frequency: "daily",
      idempotency_key: "idem_defaults",
      jitter_minutes: 30,
      project_id: "prj_1",
      timezone: "Europe/Warsaw",
    });
    await callTool("bisibility_update_project_defaults", {
      frequency: "weekly",
      location_key: "US/California/Los Angeles",
      project_id: "prj_1",
    });

    expect(client.updateProjectDefaults).toHaveBeenNthCalledWith(
      1,
      "prj_1",
      {
        auto_schedule: true,
        country: "United States",
        cron_expression: null,
        device: "desktop",
        frequency: "daily",
        jitter_minutes: 30,
        timezone: "Europe/Warsaw",
      },
      { idempotencyKey: "idem_defaults" },
    );
    expect(client.updateProjectDefaults).toHaveBeenNthCalledWith(
      2,
      "prj_1",
      { frequency: "weekly", location_key: "US/California/Los Angeles" },
      undefined,
    );
  });

  it("requires country and device together on project defaults updates", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("bisibility_update_project_defaults", {
      country: "United States",
      frequency: "daily",
      project_id: "prj_1",
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

    await callTool("bisibility_list_api_keys", { cursor: "key_cursor", limit: 10 });
    await callTool("bisibility_create_api_key", {
      idempotency_key: "idem_key",
      name: "CI key",
    });
    await callTool("bisibility_revoke_api_key", {
      idempotency_key: "idem_revoke_key",
      key_id: "key_1",
    });

    expect(client.listApiKeys).toHaveBeenCalledWith({ cursor: "key_cursor", limit: 10 });
    expect(client.createApiKey).toHaveBeenCalledWith(
      { name: "CI key" },
      { idempotencyKey: "idem_key" },
    );
    expect(client.revokeApiKey).toHaveBeenCalledWith("key_1", {
      idempotencyKey: "idem_revoke_key",
    });
  });

  it("lists keywords with API filter names converted to SDK options", async () => {
    const { callTool, client } = createToolHarness();
    client.listKeywords.mockResolvedValueOnce(listResponse([keyword()], "next"));

    await callTool("bisibility_list_keywords", {
      country: "United States",
      cursor: "cursor_1",
      device: "mobile",
      intent: "commercial",
      limit: 25,
      position_gt: 3,
      position_lt: 20,
      project_id: "prj_1",
      search: "rank",
      sort: "-updated_at",
      tag: "Product",
      topic: "tools",
    });

    expect(client.listKeywords).toHaveBeenCalledWith("prj_1", {
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
      connections: [{ id: "conn_1", label: "DataForSEO", provider: "dataforseo" }],
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
      callTool("bisibility_list_ranked_keyword_suggestions", {
        connection_id: "conn_1",
        fresh: true,
        limit: 100,
        offset: 100,
        project_id: "prj_1",
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.listRankedKeywordSuggestions).toHaveBeenCalledWith("prj_1", {
      connectionId: "conn_1",
      fresh: true,
      limit: 100,
      offset: 100,
    });
    expect(configs.get("bisibility_list_ranked_keyword_suggestions")?.description).toContain(
      "$0.02",
    );
    expect(configs.get("bisibility_list_ranked_keyword_suggestions")?.description).toContain(
      "cached for 12 hours",
    );
  });

  it("researches one seed with paid lookup and cache guidance", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      cached: false,
      connections: [{ id: "conn_1", label: "DataForSEO", provider: "dataforseo" }],
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
      callTool("bisibility_research_keywords", {
        connection_id: "conn_1",
        fresh: true,
        include_clickstream: true,
        max_cost_cents: 6,
        mode: "auto",
        project_id: "prj_1",
        result_limit: 300,
        seed: "rank tracker",
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.researchKeywords).toHaveBeenCalledWith("prj_1", {
      connectionId: "conn_1",
      fresh: true,
      includeClickstream: true,
      maxCostCents: 6,
      mode: "auto",
      resultLimit: 300,
      seed: "rank tracker",
    });
    expect(configs.get("bisibility_research_keywords")?.description).toContain("one seed per call");
    expect(configs.get("bisibility_research_keywords")?.description).toContain(
      "bisibility_get_provider_rates",
    );
    expect(configs.get("bisibility_research_keywords")?.description).toContain(
      "double provider cost",
    );
    expect(configs.get("bisibility_research_keywords")?.description).toContain(
      "Requires API write scope",
    );
    expect(configs.get("bisibility_research_keywords")?.description).toContain(
      "estimate_only first",
    );
  });

  it("hydrates nullable metrics with per-keyword cache guidance", async () => {
    const { callTool, client, configs } = createToolHarness();
    const response = {
      cached_count: 1,
      connections: [{ id: "conn_1", label: "DataForSEO", provider: "dataforseo" }],
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
      callTool("bisibility_get_keyword_metrics", {
        connection_id: "conn_1",
        fresh: true,
        include_clickstream: false,
        keywords: ["rank tracker", "seo api"],
        project_id: "prj_1",
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.getKeywordMetrics).toHaveBeenCalledWith("prj_1", {
      connection_id: "conn_1",
      fresh: true,
      include_clickstream: false,
      keywords: ["rank tracker", "seo api"],
    });
    expect(configs.get("bisibility_get_keyword_metrics")?.description).toContain(
      "up to 700 keywords",
    );
    expect(configs.get("bisibility_get_keyword_metrics")?.description).toContain(
      "cache each keyword for 12 hours",
    );
    expect(configs.get("bisibility_get_keyword_metrics")?.description).toContain(
      "Requires API write scope",
    );
    expect(configs.get("bisibility_get_keyword_metrics")?.description).toContain(
      "estimate_only first",
    );
  });

  it("forwards free estimate and maximum cost options for research and metrics", async () => {
    const { callTool, client } = createToolHarness();
    const researchEstimate = {
      cached: false,
      connections: [{ id: "conn_1", label: "DataForSEO", provider: "dataforseo" }],
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
      connections: [{ id: "conn_1", label: "DataForSEO", provider: "dataforseo" }],
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
      callTool("bisibility_research_keywords", {
        estimate_only: true,
        max_cost_cents: 3,
        project_id: "prj_1",
        seed: "rank tracker",
      }),
    ).resolves.toMatchObject({ structuredContent: researchEstimate });
    await expect(
      callTool("bisibility_get_keyword_metrics", {
        estimate_only: true,
        keywords: ["rank tracker", "seo api"],
        max_cost_cents: 3,
        project_id: "prj_1",
      }),
    ).resolves.toMatchObject({ structuredContent: metricsEstimate });

    expect(client.researchKeywords).toHaveBeenCalledWith("prj_1", {
      estimateOnly: true,
      maxCostCents: 3,
      seed: "rank tracker",
    });
    expect(client.getKeywordMetrics).toHaveBeenCalledWith("prj_1", {
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
          id: "check_1",
          keyword: "rank tracker api",
          keyword_id: "kw_1",
          position: 4,
          previous_position: null,
          ranking_url: "https://example.com/rank-tracker",
        },
      ],
      meta: { next_cursor: "cursor_2" },
    };
    client.exportRankHistory.mockResolvedValueOnce(response);

    await expect(
      callTool("bisibility_export_rank_history", {
        cursor: "cursor_1",
        granularity: "weekly",
        keyword_id: ["kw_1", "kw_2"],
        limit: 25,
        project_id: "prj_1",
        range: "90",
      }),
    ).resolves.toMatchObject({ structuredContent: response });

    expect(client.exportRankHistory).toHaveBeenCalledWith("prj_1", {
      cursor: "cursor_1",
      format: "json",
      granularity: "weekly",
      keywordIds: ["kw_1", "kw_2"],
      limit: 25,
      range: "90",
    });
    expect(configs.get("bisibility_export_rank_history")?.description).toContain(
      "REST endpoint directly",
    );
  });

  it("lists, enables, and disables sitemap monitors", async () => {
    const { callTool, client } = createToolHarness();
    const monitor = {
      enabled: true,
      id: "prj_1",
      latest_snapshot: {
        fetched_at: "2026-07-22T09:00:00.000Z",
        id: "snapshot_1",
        sitemap_url: "https://example.com/sitemap.xml",
        url_count: 42,
      },
      project_id: "prj_1",
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

    await callTool("bisibility_list_sitemap_monitors", { project_id: "prj_1" });
    await callTool("bisibility_enable_sitemap_monitor", {
      idempotency_key: "idem_enable",
      monitor_id: "prj_1",
      project_id: "prj_1",
    });
    await callTool("bisibility_disable_sitemap_monitor", {
      monitor_id: "prj_1",
      project_id: "prj_1",
    });

    expect(client.listSitemapMonitors).toHaveBeenCalledWith("prj_1");
    expect(client.updateSitemapMonitor).toHaveBeenNthCalledWith(
      1,
      "prj_1",
      "prj_1",
      { enabled: true },
      { idempotencyKey: "idem_enable" },
    );
    expect(client.updateSitemapMonitor).toHaveBeenNthCalledWith(
      2,
      "prj_1",
      "prj_1",
      { enabled: false },
      undefined,
    );
  });

  it("adds keywords with defaults and forwards idempotency keys", async () => {
    const { callTool, client } = createToolHarness();
    client.addKeywords.mockResolvedValueOnce({
      created: 2,
      results: [
        { keyword: keyword({ id: "kw_1" }), status: "created" },
        { keyword: keyword({ id: "kw_2", text: "brand search" }), status: "created" },
      ],
      skipped: 0,
    });

    await callTool("bisibility_add_keywords", {
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
      project_id: "prj_1",
      tags: ["seo"],
      target_url: "https://example.com/rank",
    });

    expect(client.addKeywords).toHaveBeenCalledWith(
      "prj_1",
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

    await callTool("bisibility_add_keywords", {
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
      project_id: "prj_1",
    });
    await callTool("bisibility_update_keyword", {
      city: "Warsaw",
      intent: null,
      keyword_id: "kw_1",
      location_key: "PL/Masovian Voivodeship/Warsaw",
      topic: "tools",
    });

    expect(client.addKeywords).toHaveBeenCalledWith(
      "prj_1",
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
      "kw_1",
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

    const result = await callTool("bisibility_update_keyword", {
      keyword_id: "kw_1",
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

    await callTool("bisibility_get_keyword", { keyword_id: "kw_1" });
    await callTool("bisibility_update_keyword", {
      idempotency_key: "idem_update",
      keyword: "rank tracker api",
      keyword_id: "kw_1",
      schedule: {
        cron_expression: null,
        frequency: "weekly",
      },
      tags: ["api"],
      target_url: "/pricing",
    });
    await callTool("bisibility_set_keyword_target_url", {
      idempotency_key: "idem_target",
      keyword_id: "kw_1",
      target_url: null,
    });
    await callTool("bisibility_delete_keyword", {
      idempotency_key: "idem_delete",
      keyword_id: "kw_1",
    });

    expect(client.getKeyword).toHaveBeenCalledWith("kw_1");
    expect(client.updateKeyword).toHaveBeenCalledWith(
      "kw_1",
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
    expect(client.setKeywordTargetUrl).toHaveBeenCalledWith("kw_1", null, {
      idempotencyKey: "idem_target",
    });
    expect(client.deleteKeyword).toHaveBeenCalledWith("kw_1", {
      idempotencyKey: "idem_delete",
    });
  });

  it("runs rank checks and reads rank history", async () => {
    const { callTool, client } = createToolHarness();
    client.runRankCheck.mockResolvedValueOnce(rankCheck());
    client.listRankChecks.mockResolvedValueOnce(listResponse([rankCheck()], "next"));
    client.getRankCheckResult.mockResolvedValueOnce(rankCheck());

    await callTool("bisibility_run_rank_check", {
      idempotency_key: "idem_check",
      keyword_id: "kw_1",
      provider_id: "dataforseo",
    });
    await callTool("bisibility_run_rank_check", {
      keyword_id: "kw_1",
    });
    await callTool("bisibility_run_rank_check", {
      async: true,
      keyword_id: "kw_1",
    });
    await callTool("bisibility_run_rank_check", {
      async: true,
      idempotency_key: "idem_async",
      keyword_id: "kw_1",
      provider_id: "dataforseo",
    });
    await callTool("bisibility_get_rank_history", {
      cursor: "cursor_1",
      keyword_id: "kw_1",
      limit: 10,
      since: "2026-01-01T00:00:00.000Z",
      status: "completed",
      until: "2026-01-31T00:00:00.000Z",
    });
    await callTool("bisibility_get_rank_check_result", { check_id: "check_1" });

    expect(client.runRankCheck).toHaveBeenCalledWith(
      "kw_1",
      { provider_id: "dataforseo" },
      { idempotencyKey: "idem_check" },
    );
    expect(client.runRankCheck).toHaveBeenCalledWith("kw_1", undefined, undefined);
    expect(client.runRankCheck).toHaveBeenCalledWith("kw_1", undefined, { async: true });
    expect(client.runRankCheck).toHaveBeenCalledWith(
      "kw_1",
      { provider_id: "dataforseo" },
      { async: true, idempotencyKey: "idem_async" },
    );
    expect(client.listRankChecks).toHaveBeenCalledWith("kw_1", {
      cursor: "cursor_1",
      limit: 10,
      since: "2026-01-01T00:00:00.000Z",
      status: "completed",
      until: "2026-01-31T00:00:00.000Z",
    });
    expect(client.getRankCheckResult).toHaveBeenCalledWith("check_1");
  });

  it("forwards provider ids for server-side validation", async () => {
    const { callTool, client } = createToolHarness();
    client.runRankCheck.mockResolvedValueOnce(rankCheck());

    const result = await callTool("bisibility_run_rank_check", {
      keyword_id: "kw_1",
      provider_id: "future-serp-provider",
    });

    expect(result.isError).toBeUndefined();
    expect(client.runRankCheck).toHaveBeenCalledWith(
      "kw_1",
      { provider_id: "future-serp-provider" },
      undefined,
    );
  });

  it("creates signals with optional metadata and idempotency keys", async () => {
    const { callTool, client } = createToolHarness();
    client.createSignal.mockResolvedValue(signal());

    await callTool("bisibility_create_signal", {
      happened_at: "2026-01-06T00:00:00.000Z",
      idempotency_key: "idem_signal",
      keyword_id: "kw_1",
      payload: { commit: "abc123" },
      severity: "warning",
      source: "deploy",
      type: "deploy.completed",
      url: "https://example.com/releases/42",
    });
    await callTool("bisibility_create_signal", {
      source: "api",
      type: "content.refreshed",
    });

    expect(client.createSignal).toHaveBeenNthCalledWith(
      1,
      {
        happened_at: "2026-01-06T00:00:00.000Z",
        keyword_id: "kw_1",
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

    const typeResult = await callTool("bisibility_create_signal", {
      source: "api",
      type: "not-dot-separated",
    });
    const sourceResult = await callTool("bisibility_create_signal", {
      source: "manual",
      type: "deploy.completed",
    });
    const payloadResult = await callTool("bisibility_create_signal", {
      payload: { blob: "x".repeat(9 * 1024) },
      source: "api",
      type: "deploy.completed",
    });
    const serializationResult = await callTool("bisibility_create_signal", {
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

    await callTool("bisibility_list_signals", {
      cursor: "signal_cursor",
      from: "2026-01-01T00:00:00.000Z",
      limit: 25,
      project_id: "prj_1",
      source: "rank_tracker",
      to: "2026-01-31T00:00:00.000Z",
      type: "deploy.completed",
    });
    await callTool("bisibility_list_signals", { project_id: "prj_1" });

    expect(client.listSignals).toHaveBeenNthCalledWith(1, "prj_1", {
      cursor: "signal_cursor",
      from: "2026-01-01T00:00:00.000Z",
      limit: 25,
      source: "rank_tracker",
      to: "2026-01-31T00:00:00.000Z",
      type: "deploy.completed",
    });
    expect(client.listSignals).toHaveBeenNthCalledWith(2, "prj_1", {});
  });

  it("reads analytics and triggers project traffic sync", async () => {
    const { callTool, client, configs } = createToolHarness();
    const snapshots = { offset: 0, rows: [], total_count: 0 };
    const queryStats = {
      connection: { id: "conn_gsc", label: "Search Console", provider: "gsc" },
      rows: [],
    };
    const sync = {
      connections: 1,
      keyword_snapshots: 0,
      page_snapshots: 3,
      project_id: "prj_1",
      runs: [],
      skipped: [],
    };
    client.listTrafficSnapshots.mockResolvedValueOnce(snapshots);
    client.listSearchPerformanceQueryStats.mockResolvedValueOnce(queryStats);
    client.syncProjectTraffic.mockResolvedValueOnce(sync);

    await callTool("bisibility_list_traffic_snapshots", {
      end_date: "2026-06-30",
      limit: 50,
      offset: 0,
      paths: ["/", "/pricing"],
      project_id: "prj_1",
      start_date: "2026-06-01",
    });
    await callTool("bisibility_list_search_performance_query_stats", {
      connection_id: "conn_gsc",
      end_date: "2026-06-30",
      limit: 100,
      project_id: "prj_1",
      query: "rank tracker",
      start_date: "2026-06-01",
    });
    const result = await callTool("bisibility_sync_project_traffic", {
      idempotency_key: "sync_1",
      project_id: "prj_1",
    });

    expect(client.listTrafficSnapshots).toHaveBeenCalledWith("prj_1", {
      endDate: "2026-06-30",
      limit: 50,
      offset: 0,
      paths: ["/", "/pricing"],
      startDate: "2026-06-01",
    });
    expect(client.listSearchPerformanceQueryStats).toHaveBeenCalledWith("prj_1", {
      connectionId: "conn_gsc",
      endDate: "2026-06-30",
      limit: 100,
      query: "rank tracker",
      startDate: "2026-06-01",
    });
    expect(client.syncProjectTraffic).toHaveBeenCalledWith("prj_1", {
      idempotencyKey: "sync_1",
    });
    expect(result.structuredContent).toEqual(sync);
    expect(configs.get("bisibility_list_traffic_snapshots")?.description).toContain(
      "project's own connected",
    );
    expect(configs.get("bisibility_list_search_performance_query_stats")?.description).toContain(
      "project's own connected",
    );
    expect(configs.get("bisibility_sync_project_traffic")?.description).toContain(
      "project's own connected",
    );
  });

  it("lists provider rates and estimates costs", async () => {
    const { callTool, client } = createToolHarness();
    client.getProviderRates.mockResolvedValueOnce(dataResponse([providerRate()]));
    client.getCostEstimate.mockResolvedValue(dataResponse(costEstimate()));

    const ratesResult = await callTool("bisibility_get_provider_rates");
    await callTool("bisibility_get_cost_estimate", {
      devices: 2,
      frequency: "weekly",
      keywords: 100,
      locations: 3,
      option: "priority",
      plan: "starter",
      provider: "serpapi",
    });
    await callTool("bisibility_get_cost_estimate", { keywords: 50 });

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
      schema_versions_supported: [1, 2, 3],
    };
    client.getCloudImportCompatibility.mockResolvedValueOnce(compatibility);

    const result = await callTool("bisibility_get_cloud_import_compatibility");

    expect(result.structuredContent).toEqual(compatibility);
    expect(client.getCloudImportCompatibility).toHaveBeenCalledWith();
  });

  it("requires a keyword count within bounds for cost estimates", async () => {
    const { callTool, client } = createToolHarness();

    const missingResult = await callTool("bisibility_get_cost_estimate", {});
    const boundsResult = await callTool("bisibility_get_cost_estimate", { keywords: 100001 });

    expect(missingResult.isError).toBe(true);
    expect(boundsResult.isError).toBe(true);
    expect(client.getCostEstimate).not.toHaveBeenCalled();
  });

  it("bulk updates keywords with operation-specific payloads", async () => {
    const { callTool, client } = createToolHarness();
    client.bulkUpdateKeywords.mockResolvedValue({ operation: "add_tags", results: [] });

    await callTool("bisibility_bulk_update_keywords", {
      idempotency_key: "idem_bulk",
      keyword_ids: ["kw_1", "kw_2"],
      operation: "add_tags",
      tags: ["seo"],
    });
    await callTool("bisibility_bulk_update_keywords", {
      keyword_ids: ["kw_1"],
      operation: "set_frequency",
      schedule: {
        cron_expression: "0 7 * * 1",
        frequency: "custom_cron",
        timezone: "Europe/Warsaw",
      },
    });
    await callTool("bisibility_bulk_update_keywords", {
      keyword_ids: ["kw_1"],
      operation: "set_target_url",
      target_url: null,
    });
    await callTool("bisibility_bulk_update_keywords", {
      keyword_ids: ["kw_1"],
      operation: "delete",
    });

    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      1,
      {
        keyword_ids: ["kw_1", "kw_2"],
        operation: "add_tags",
        tags: ["seo"],
      },
      { idempotencyKey: "idem_bulk" },
    );
    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      2,
      {
        keyword_ids: ["kw_1"],
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
        keyword_ids: ["kw_1"],
        operation: "set_target_url",
        target_url: null,
      },
      undefined,
    );
    expect(client.bulkUpdateKeywords).toHaveBeenNthCalledWith(
      4,
      {
        keyword_ids: ["kw_1"],
        operation: "delete",
      },
      undefined,
    );
  });

  it("manages alert rules and lists triggered alerts", async () => {
    const { callTool, client } = createToolHarness();
    client.listAlertRules.mockResolvedValueOnce(listResponse([alertRule()], "rules_next"));
    client.createAlertRule.mockResolvedValueOnce(alertRule({ id: "rule_new" }));
    client.updateAlertRule.mockResolvedValueOnce(alertRule({ enabled: false }));
    client.deleteAlertRule.mockResolvedValueOnce({ deleted: true });
    client.listTriggeredAlerts.mockResolvedValueOnce(
      listResponse([triggeredAlert()], "alerts_next"),
    );

    await callTool("bisibility_list_alert_rules", {
      cursor: "cursor_1",
      limit: 10,
      project_id: "prj_1",
    });
    await callTool("bisibility_create_alert_rule", {
      channels: ["email", "webhook"],
      condition_type: "threshold",
      idempotency_key: "idem_alert",
      name: "Ranking drop",
      project_id: "prj_1",
      target_type: "all",
      threshold_position: 10,
    });
    await callTool("bisibility_update_alert_rule", {
      condition_type: "threshold",
      enabled: false,
      name: "Ranking drop",
      rule_id: "rule_1",
      target_type: "all",
      threshold_position: 9,
    });
    await callTool("bisibility_delete_alert_rule", {
      idempotency_key: "idem_delete_rule",
      rule_id: "rule_1",
    });
    await callTool("bisibility_list_triggered_alerts", {
      limit: 5,
      project_id: "prj_1",
    });

    expect(client.listAlertRules).toHaveBeenCalledWith("prj_1", {
      cursor: "cursor_1",
      limit: 10,
    });
    expect(client.createAlertRule).toHaveBeenCalledWith(
      "prj_1",
      {
        channels: ["email", "webhook"],
        condition_type: "threshold",
        name: "Ranking drop",
        target_type: "all",
        threshold_position: 10,
      },
      { idempotencyKey: "idem_alert" },
    );
    expect(client.updateAlertRule).toHaveBeenCalledWith(
      "rule_1",
      {
        condition_type: "threshold",
        enabled: false,
        name: "Ranking drop",
        target_type: "all",
        threshold_position: 9,
      },
      undefined,
    );
    expect(client.deleteAlertRule).toHaveBeenCalledWith("rule_1", {
      idempotencyKey: "idem_delete_rule",
    });
    expect(client.listTriggeredAlerts).toHaveBeenCalledWith("prj_1", { limit: 5 });
  });

  it("mutes alerts and marks project alerts read for the whole team", async () => {
    const { callTool, client, configs } = createToolHarness();
    const muteResult = { muted: true, snoozed_until: "2026-07-23T10:00:00.000Z" };
    const readResult = { updated: 3 };
    client.muteTriggeredAlert.mockResolvedValueOnce(muteResult);
    client.markProjectAlertsRead.mockResolvedValueOnce(readResult);

    await expect(
      callTool("bisibility_mute_triggered_alert", {
        alert_id: "alert_1",
        idempotency_key: "idem_mute",
        project_id: "prj_1",
      }),
    ).resolves.toMatchObject({ structuredContent: muteResult });
    await expect(
      callTool("bisibility_mark_project_alerts_read", {
        project_id: "prj_1",
      }),
    ).resolves.toMatchObject({ structuredContent: readResult });

    expect(client.muteTriggeredAlert).toHaveBeenCalledWith("prj_1", "alert_1", {
      idempotencyKey: "idem_mute",
    });
    expect(client.markProjectAlertsRead).toHaveBeenCalledWith("prj_1", undefined);
    expect(configs.get("bisibility_mute_triggered_alert")?.description).toContain(
      "whole project team",
    );
    expect(configs.get("bisibility_mark_project_alerts_read")?.description).toContain(
      "whole project team",
    );
  });

  it("lists team members and manages team invites", async () => {
    const { callTool, client } = createToolHarness();
    client.listTeamMembers.mockResolvedValueOnce(listResponse([teamMember()], "members_next"));
    client.listTeamInvites.mockResolvedValueOnce(listResponse([teamInvite()], "invites_next"));
    client.createTeamInvite.mockResolvedValueOnce({
      expires_at: "2026-01-14T00:00:00.000Z",
      id: "inv_2",
      invite_link: "https://bisibility.test/invite/raw",
    });
    client.revokeTeamInvite.mockResolvedValueOnce({ id: "inv_1" });

    await callTool("bisibility_list_team_members", {
      cursor: "member_cursor",
      limit: 25,
      project_id: "prj_1",
    });
    await callTool("bisibility_list_team_invites", {
      limit: 5,
      project_id: "prj_1",
    });
    await callTool("bisibility_create_team_invite", {
      email: "new@example.com",
      idempotency_key: "idem_invite",
      project_id: "prj_1",
      role: "viewer",
    });
    await callTool("bisibility_revoke_team_invite", {
      idempotency_key: "idem_revoke_invite",
      invite_id: "inv_1",
      project_id: "prj_1",
    });

    expect(client.listTeamMembers).toHaveBeenCalledWith("prj_1", {
      cursor: "member_cursor",
      limit: 25,
    });
    expect(client.listTeamInvites).toHaveBeenCalledWith("prj_1", { limit: 5 });
    expect(client.createTeamInvite).toHaveBeenCalledWith(
      "prj_1",
      { email: "new@example.com", role: "viewer" },
      { idempotencyKey: "idem_invite" },
    );
    expect(client.revokeTeamInvite).toHaveBeenCalledWith("prj_1", "inv_1", {
      idempotencyKey: "idem_revoke_invite",
    });
  });

  it("updates and removes team members and resends invites", async () => {
    const { callTool, client, configs } = createToolHarness();
    client.resendTeamInvite.mockResolvedValueOnce({
      expires_at: "2026-07-29T10:00:00.000Z",
      id: "inv_1",
      invite_link: "https://bisibility.test/invite/new-token",
    });
    client.updateTeamMemberRole.mockResolvedValueOnce({ id: "mem_1", role: "viewer" });
    client.removeTeamMember.mockResolvedValueOnce({ id: "mem_1" });

    await callTool("bisibility_resend_team_invite", {
      idempotency_key: "resend_1",
      invite_id: "inv_1",
      project_id: "prj_1",
    });
    await callTool("bisibility_update_team_member_role", {
      idempotency_key: "role_1",
      member_id: "mem_1",
      project_id: "prj_1",
      role: "viewer",
    });
    await callTool("bisibility_remove_team_member", {
      idempotency_key: "remove_1",
      member_id: "mem_1",
      project_id: "prj_1",
    });

    expect(client.resendTeamInvite).toHaveBeenCalledWith("prj_1", "inv_1", {
      idempotencyKey: "resend_1",
    });
    expect(client.updateTeamMemberRole).toHaveBeenCalledWith(
      "prj_1",
      "mem_1",
      { role: "viewer" },
      { idempotencyKey: "role_1" },
    );
    expect(client.removeTeamMember).toHaveBeenCalledWith("prj_1", "mem_1", {
      idempotencyKey: "remove_1",
    });
    expect(configs.get("bisibility_remove_team_member")?.description).toContain(
      "Confirm the user's intent",
    );
    expect(configs.get("bisibility_update_team_member_role")?.description).toContain(
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

    await callTool("bisibility_list_providers", {
      cursor: "provider_cursor",
      limit: 20,
      project_id: "prj_1",
    });
    await callTool("bisibility_connect_provider", {
      cost_per_check: 0.01,
      credentials: { api_key: "secret" },
      idempotency_key: "idem_provider",
      primary: true,
      priority: 0,
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_connect_provider", {
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_test_provider_connection", {
      credentials: { api_key: "secret" },
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_test_provider_connection", {
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_update_provider_settings", {
      enabled: false,
      priority: 25,
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_set_provider_enabled", {
      enabled: false,
      idempotency_key: "idem_enabled",
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_set_provider_priority", {
      priority: 20,
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_set_primary_provider", {
      primary: false,
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    await callTool("bisibility_disconnect_provider", {
      idempotency_key: "idem_disconnect",
      project_id: "prj_1",
      provider_id: "serpapi",
    });

    expect(client.listProviders).toHaveBeenCalledWith("prj_1", {
      cursor: "provider_cursor",
      limit: 20,
    });
    expect(client.connectProvider).toHaveBeenNthCalledWith(
      1,
      "prj_1",
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
      "prj_1",
      "serpapi",
      undefined,
      undefined,
    );
    expect(client.testProviderConnection).toHaveBeenNthCalledWith(1, "prj_1", "serpapi", {
      credentials: { api_key: "secret" },
    });
    expect(client.testProviderConnection).toHaveBeenNthCalledWith(2, "prj_1", "serpapi", undefined);
    expect(client.updateProviderSettings).toHaveBeenCalledWith(
      "prj_1",
      "serpapi",
      { enabled: false, priority: 25 },
      undefined,
    );
    expect(client.setProviderEnabled).toHaveBeenCalledWith("prj_1", "serpapi", false, {
      idempotencyKey: "idem_enabled",
    });
    expect(client.setProviderPriority).toHaveBeenCalledWith("prj_1", "serpapi", 20, undefined);
    expect(client.setPrimaryProvider).toHaveBeenCalledWith("prj_1", "serpapi", false, undefined);
    expect(client.disconnectProvider).toHaveBeenCalledWith("prj_1", "serpapi", {
      idempotencyKey: "idem_disconnect",
    });
  });

  it("connects and tests self-hosted analytics providers with an endpoint credential", async () => {
    const { callTool, client } = createToolHarness();
    client.connectProvider.mockResolvedValueOnce(
      providerConnection({ kind: "analytics", provider: "plausible" }),
    );
    client.testProviderConnection.mockResolvedValueOnce({ message: "Connected", ok: true });

    await callTool("bisibility_connect_provider", {
      credentials: {
        api_key: "plausible-key",
        endpoint: "https://plausible.example.com/api",
        login: "example.com",
      },
      project_id: "prj_1",
      provider_id: "plausible",
    });
    await callTool("bisibility_test_provider_connection", {
      credentials: { endpoint: "https://plausible.example.com/api" },
      project_id: "prj_1",
      provider_id: "plausible",
    });

    expect(client.connectProvider).toHaveBeenCalledWith(
      "prj_1",
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
    expect(client.testProviderConnection).toHaveBeenCalledWith("prj_1", "plausible", {
      credentials: { endpoint: "https://plausible.example.com/api" },
    });
  });

  it("forwards newly registered provider ids for server-side validation", async () => {
    const { callTool, client } = createToolHarness();
    client.connectProvider.mockResolvedValueOnce(providerConnection());

    const result = await callTool("bisibility_connect_provider", {
      project_id: "prj_1",
      provider_id: "future_provider",
    });

    expect(result.isError).toBeUndefined();
    expect(client.connectProvider).toHaveBeenCalledWith(
      "prj_1",
      "future_provider",
      undefined,
      undefined,
    );
  });

  it("manages saved views and competitors", async () => {
    const { callTool, client } = createToolHarness();
    client.listSavedViews.mockResolvedValueOnce(listResponse([savedView()], "views_next"));
    client.createSavedView.mockResolvedValueOnce(savedView({ id: "view_new" }));
    client.deleteSavedView.mockResolvedValueOnce({ deleted: true });
    client.listCompetitors.mockResolvedValueOnce(competitorListResponse());
    client.addCompetitor.mockResolvedValueOnce(competitor({ label: null }));
    client.removeCompetitor.mockResolvedValueOnce({ removed: true });

    await callTool("bisibility_list_saved_views", {
      cursor: "view_cursor",
      limit: 2,
      project_id: "prj_1",
    });
    await callTool("bisibility_create_saved_view", {
      config: savedViewConfig,
      idempotency_key: "idem_view",
      name: "Product keywords",
      project_id: "prj_1",
    });
    await callTool("bisibility_delete_saved_view", {
      idempotency_key: "idem_delete_view",
      project_id: "prj_1",
      view_id: "view_1",
    });
    await callTool("bisibility_list_competitors", {
      cursor: "competitor_cursor",
      limit: 25,
      project_id: "prj_1",
    });
    await callTool("bisibility_add_competitor", {
      domain: "https://rankzly.io",
      idempotency_key: "idem_competitor",
      project_id: "prj_1",
    });
    await callTool("bisibility_remove_competitor", {
      competitor_id: "comp_1",
      idempotency_key: "idem_remove_competitor",
      project_id: "prj_1",
    });

    expect(client.listSavedViews).toHaveBeenCalledWith("prj_1", {
      cursor: "view_cursor",
      limit: 2,
    });
    expect(client.createSavedView).toHaveBeenCalledWith(
      "prj_1",
      { config: savedViewConfig, name: "Product keywords" },
      { idempotencyKey: "idem_view" },
    );
    expect(client.deleteSavedView).toHaveBeenCalledWith("prj_1", "view_1", {
      idempotencyKey: "idem_delete_view",
    });
    expect(client.listCompetitors).toHaveBeenCalledWith("prj_1", {
      cursor: "competitor_cursor",
      limit: 25,
    });
    expect(client.addCompetitor).toHaveBeenCalledWith(
      "prj_1",
      { domain: "https://rankzly.io" },
      { idempotencyKey: "idem_competitor" },
    );
    expect(client.removeCompetitor).toHaveBeenCalledWith("prj_1", "comp_1", {
      idempotencyKey: "idem_remove_competitor",
    });
  });

  it("accepts any provider-supported saved view country and serp filter values", async () => {
    const { callTool, client } = createToolHarness();
    client.createSavedView.mockResolvedValueOnce(savedView({ name: "France AI" }));

    const config = {
      filters: { ...savedViewConfig.filters, country: "fr", serp: ["ai", "shopping"] },
      search: "",
    };

    const result = await callTool("bisibility_create_saved_view", {
      config,
      name: "France AI",
      project_id: "prj_1",
    });

    expect(result.isError).toBeUndefined();
    expect(client.createSavedView).toHaveBeenCalledWith(
      "prj_1",
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

    await callTool("bisibility_get_notification_preferences", { project_id: "prj_1" });
    await callTool("bisibility_update_notification_preferences", {
      alert_email: false,
      alert_slack: true,
      idempotency_key: "idem_prefs",
      project_id: "prj_1",
    });

    expect(client.getNotificationPreferences).toHaveBeenCalledWith("prj_1");
    expect(client.updateNotificationPreferences).toHaveBeenCalledWith(
      "prj_1",
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
      id: "tok_1",
      revoked_at: "2026-01-08T00:30:00.000Z",
    });

    await callTool("bisibility_list_migration_tokens", {
      limit: 1,
      project_id: "prj_1",
    });
    await callTool("bisibility_mint_migration_token", {
      idempotency_key: "idem_mint",
      project_id: "prj_1",
    });
    await callTool("bisibility_mint_migration_token", {
      project_id: "prj_1",
      scope: "keywords",
    });
    await callTool("bisibility_revoke_migration_token", {
      idempotency_key: "idem_revoke_token",
      project_id: "prj_1",
      token_id: "tok_1",
    });

    expect(client.listMigrationTokens).toHaveBeenCalledWith("prj_1", { limit: 1 });
    expect(client.mintMigrationToken).toHaveBeenNthCalledWith(1, "prj_1", undefined, {
      idempotencyKey: "idem_mint",
    });
    expect(client.mintMigrationToken).toHaveBeenNthCalledWith(
      2,
      "prj_1",
      { scope: "keywords" },
      undefined,
    );
    expect(client.revokeMigrationToken).toHaveBeenCalledWith("prj_1", "tok_1", {
      idempotencyKey: "idem_revoke_token",
    });
  });

  it("returns tool errors for validation failures without calling the SDK", async () => {
    const { callTool, client } = createToolHarness();

    const result = await callTool("bisibility_list_keywords", {
      limit: 500,
      project_id: "prj_1",
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

    const result = await callTool("bisibility_bulk_update_keywords", {
      keyword_ids: ["kw_1"],
      operation: "set_target_url",
    });

    expect(result.isError).toBe(true);
    expect(JSON.stringify(parsedContent(result))).toContain("target_url is required");
    expect(client.bulkUpdateKeywords).not.toHaveBeenCalled();
  });

  it("requires provider settings and notification updates to include a value", async () => {
    const { callTool, client } = createToolHarness();

    const providerResult = await callTool("bisibility_update_provider_settings", {
      project_id: "prj_1",
      provider_id: "serpapi",
    });
    const notificationResult = await callTool("bisibility_update_notification_preferences", {
      project_id: "prj_1",
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

    const result = await callTool("bisibility_list_projects");

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
