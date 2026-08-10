import type {
  AddCompetitorInput,
  AnalyzeBacklinksOptions,
  BisibilityClient,
  ConnectProviderInput,
  CreateAlertRuleInput,
  CreateApiKeyInput,
  CreateKeywordInput,
  CreateMyTokenInput,
  CreateProjectInput,
  CreateSavedKeywordInput,
  CreateSavedKeywordsInput,
  CreateSavedViewInput,
  CreateSignalInput,
  CreateTeamInviteInput,
  CreateWebhookInput,
  ExportRankHistoryJsonOptions,
  GetCostEstimateOptions,
  GetKeywordMetricsInput,
  KeywordBulkInput,
  KeywordScheduleInput,
  ListKeywordsOptions,
  ListRankChecksOptions,
  ListRankedKeywordSuggestionsOptions,
  ListSavedViewsOptions,
  ListSearchPerformanceQueryStatsOptions,
  ListSignalsOptions,
  ListTrafficSnapshotsOptions,
  LoadMoreBacklinkRowsOptions,
  MintMigrationTokenInput,
  PaginationOptions,
  ProjectDefaultsPatch,
  ProviderSettingsInput,
  RequestOptions,
  ResearchKeywordsOptions,
  RunRankCheckInput,
  RunRankCheckOptions,
  SearchLocationsOptions,
  TestProviderConnectionInput,
  UpdateAlertRuleInput,
  UpdateKeywordInput,
  UpdateMeInput,
  UpdateNotificationPreferencesInput,
  UpdateProjectInput,
  UpdateTeamMemberRoleInput,
  UpdateWebhookInput,
} from "@bisibility/sdk";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type * as z from "zod/v4";

import type { BisibilityMcpToolset } from "./config.js";
import { errorToolResult, jsonToolResult } from "./result.js";
import {
  addCompetitorInputSchema,
  addKeywordsInputSchema,
  analyzeBacklinksInputSchema,
  createAlertRuleInputSchema,
  createApiKeyInputSchema,
  createPersonalTokenInputSchema,
  createProjectApiKeyInputSchema,
  createProjectInputSchema,
  createSavedKeywordsInputSchema,
  createSavedViewInputSchema,
  createSignalInputSchema,
  createTeamInviteInputSchema,
  createWebhookInputSchema,
  deleteAlertRuleInputSchema,
  deleteKeywordInputSchema,
  deleteProjectInputSchema,
  deleteSavedKeywordInputSchema,
  deleteSavedViewInputSchema,
  deleteWebhookInputSchema,
  emptyInputSchema,
  exportRankHistoryInputSchema,
  getCostEstimateInputSchema,
  getKeywordInputSchema,
  getKeywordMetricsInputSchema,
  getMeInputSchema,
  getNotificationPreferencesInputSchema,
  getProjectDefaultsInputSchema,
  getProjectInputSchema,
  getRankCheckResultInputSchema,
  getRankHistoryInputSchema,
  keywordBulkInputSchema,
  type keywordCreateItemInputSchema,
  type keywordScheduleInput,
  listAlertRulesInputSchema,
  listApiKeysInputSchema,
  listCompetitorsInputSchema,
  listKeywordsInputSchema,
  listMigrationTokensInputSchema,
  listPersonalTokensInputSchema,
  listProjectApiKeysInputSchema,
  listProjectsInputSchema,
  listProvidersInputSchema,
  listRankedKeywordSuggestionsInputSchema,
  listSavedKeywordsInputSchema,
  listSavedViewsInputSchema,
  listSearchPerformanceQueryStatsInputSchema,
  listSignalsInputSchema,
  listSitemapMonitorsInputSchema,
  listTeamInvitesInputSchema,
  listTeamMembersInputSchema,
  listTrafficSnapshotsInputSchema,
  listTriggeredAlertsInputSchema,
  listWebhooksInputSchema,
  loadMoreBacklinkRowsInputSchema,
  markProjectAlertsReadInputSchema,
  mintMigrationTokenInputSchema,
  muteTriggeredAlertInputSchema,
  providerActionInputSchema,
  providerConnectionInputSchema,
  removeCompetitorInputSchema,
  removeTeamMemberInputSchema,
  researchKeywordsInputSchema,
  resendTeamInviteInputSchema,
  revokeApiKeyInputSchema,
  revokeMigrationTokenInputSchema,
  revokePersonalTokenInputSchema,
  revokeTeamInviteInputSchema,
  runRankCheckInputSchema,
  searchLocationsInputSchema,
  setKeywordTargetUrlInputSchema,
  setPrimaryProviderInputSchema,
  setProviderEnabledInputSchema,
  setProviderPriorityInputSchema,
  syncProjectTrafficInputSchema,
  testProviderConnectionInputSchema,
  updateAlertRuleInputSchema,
  updateKeywordInputSchema,
  updateMeInputSchema,
  updateNotificationPreferencesInputSchema,
  updateProjectDefaultsInputSchema,
  updateProjectInputSchema,
  updateProviderSettingsInputSchema,
  updateSitemapMonitorInputSchema,
  updateTeamMemberRoleInputSchema,
  updateWebhookInputSchema,
} from "./schemas.js";

export type BisibilityToolClient = Pick<
  BisibilityClient,
  | "addCompetitor"
  | "addKeywords"
  | "analyzeBacklinks"
  | "bulkUpdateKeywords"
  | "connectProvider"
  | "createAlertRule"
  | "createApiKey"
  | "createMyToken"
  | "createProject"
  | "createProjectApiKey"
  | "createSavedKeywords"
  | "createSavedView"
  | "createSignal"
  | "createTeamInvite"
  | "createWebhook"
  | "deleteAlertRule"
  | "deleteKeyword"
  | "deleteProject"
  | "deleteSavedKeyword"
  | "deleteSavedView"
  | "deleteWebhook"
  | "disconnectProvider"
  | "exportRankHistory"
  | "getCapabilities"
  | "getCloudImportCompatibility"
  | "getCostEstimate"
  | "getHealth"
  | "getKeyword"
  | "getKeywordMetrics"
  | "getMe"
  | "getNotificationPreferences"
  | "getProject"
  | "getProjectDefaults"
  | "getProviderRates"
  | "getRankCheckResult"
  | "listAlertRules"
  | "listApiKeys"
  | "listCompetitors"
  | "listKeywords"
  | "listMigrationTokens"
  | "listMyTokens"
  | "listProjectApiKeys"
  | "listProjects"
  | "listProviders"
  | "listRankChecks"
  | "listRankedKeywordSuggestions"
  | "listSavedKeywords"
  | "listSavedViews"
  | "listSearchPerformanceQueryStats"
  | "listSignals"
  | "listSitemapMonitors"
  | "listTeamInvites"
  | "listTeamMembers"
  | "listTrafficSnapshots"
  | "listTriggeredAlerts"
  | "listWebhooks"
  | "loadMoreBacklinkRows"
  | "markProjectAlertsRead"
  | "mintMigrationToken"
  | "muteTriggeredAlert"
  | "removeCompetitor"
  | "removeTeamMember"
  | "researchKeywords"
  | "resendTeamInvite"
  | "revokeApiKey"
  | "revokeMigrationToken"
  | "revokeMyToken"
  | "revokeTeamInvite"
  | "runRankCheck"
  | "searchLocations"
  | "setKeywordTargetUrl"
  | "setPrimaryProvider"
  | "setProviderEnabled"
  | "setProviderPriority"
  | "syncProjectTraffic"
  | "testProviderConnection"
  | "updateAlertRule"
  | "updateKeyword"
  | "updateMe"
  | "updateNotificationPreferences"
  | "updateProject"
  | "updateProjectDefaults"
  | "updateProviderSettings"
  | "updateSitemapMonitor"
  | "updateTeamMemberRole"
  | "updateWebhook"
>;

export interface RegisterBisibilityToolsOptions {
  client: BisibilityToolClient;
  readOnly?: boolean;
  toolsets?: readonly BisibilityMcpToolset[];
}

type ToolSchema = z.ZodObject<z.ZodRawShape>;
type ParsedToolInput<TSchema extends ToolSchema> = z.output<TSchema>;
type ToolExecutor<TSchema extends ToolSchema> = (
  input: ParsedToolInput<TSchema>,
) => Promise<unknown>;

function requestOptions(input: {
  idempotency_key?: string | undefined;
}): RequestOptions | undefined {
  return input.idempotency_key ? { idempotencyKey: input.idempotency_key } : undefined;
}

function implicitRequestOptions(input: {
  idempotency_key?: string | undefined;
  project_id?: string | undefined;
}): RequestOptions | undefined {
  const options = requestOptions(input);
  if (!input.project_id) return options;
  return { ...options, headers: { "X-Bisibility-Project": input.project_id } };
}

function omitUndefined<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as Partial<T>;
}

function savedKeywordsPayload(
  input: ParsedToolInput<typeof createSavedKeywordsInputSchema>,
): CreateSavedKeywordsInput {
  return {
    keywords: input.keywords.map((item) =>
      typeof item === "string" ? item : (omitUndefined(item) as CreateSavedKeywordInput),
    ),
  };
}

function listKeywordsOptions(
  input: ParsedToolInput<typeof listKeywordsInputSchema>,
): ListKeywordsOptions {
  return omitUndefined({
    country: input.country,
    cursor: input.cursor,
    device: input.device,
    intent: input.intent,
    limit: input.limit,
    positionGt: input.position_gt,
    positionLt: input.position_lt,
    search: input.search,
    sort: input.sort,
    tag: input.tag,
    topic: input.topic,
  }) as ListKeywordsOptions;
}

function listRankedKeywordSuggestionsOptions(
  input: ParsedToolInput<typeof listRankedKeywordSuggestionsInputSchema>,
): ListRankedKeywordSuggestionsOptions {
  return omitUndefined({
    connectionId: input.connection_id,
    fresh: input.fresh,
    limit: input.limit,
    offset: input.offset,
  }) as ListRankedKeywordSuggestionsOptions;
}

function researchKeywordsOptions(
  input: ParsedToolInput<typeof researchKeywordsInputSchema>,
): ResearchKeywordsOptions {
  return omitUndefined({
    connectionId: input.connection_id,
    estimateOnly: input.estimate_only,
    fresh: input.fresh,
    includeClickstream: input.include_clickstream,
    maxCostCents: input.max_cost_cents,
    mode: input.mode,
    resultLimit: input.result_limit,
    seed: input.seed,
  }) as ResearchKeywordsOptions;
}

function analyzeBacklinksOptions(
  input: ParsedToolInput<typeof analyzeBacklinksInputSchema>,
): AnalyzeBacklinksOptions {
  return omitUndefined({
    estimateOnly: input.estimate_only,
    fresh: input.fresh,
    includeSubdomains: input.include_subdomains,
    maxCostCents: input.max_cost_cents,
    mode: input.mode,
    resultLimit: input.result_limit,
    target: input.target,
    targetScope: input.target_scope,
  }) as AnalyzeBacklinksOptions;
}

function loadMoreBacklinkRowsOptions(
  input: ParsedToolInput<typeof loadMoreBacklinkRowsInputSchema>,
): LoadMoreBacklinkRowsOptions {
  return omitUndefined({
    includeSubdomains: input.include_subdomains,
    limit: input.limit,
    target: input.target,
    targetScope: input.target_scope,
  }) as LoadMoreBacklinkRowsOptions;
}

function keywordMetricsInput(
  input: ParsedToolInput<typeof getKeywordMetricsInputSchema>,
): GetKeywordMetricsInput {
  return omitUndefined({
    connection_id: input.connection_id,
    estimate_only: input.estimate_only,
    fresh: input.fresh,
    include_clickstream: input.include_clickstream,
    keywords: input.keywords,
    max_cost_cents: input.max_cost_cents,
  }) as GetKeywordMetricsInput;
}

function exportRankHistoryOptions(
  input: ParsedToolInput<typeof exportRankHistoryInputSchema>,
): ExportRankHistoryJsonOptions {
  return omitUndefined({
    cursor: input.cursor,
    format: "json",
    granularity: input.granularity,
    keywordIds: input.keyword_ids,
    limit: input.limit,
    range: input.range,
  }) as ExportRankHistoryJsonOptions;
}

function searchLocationsOptions(
  input: ParsedToolInput<typeof searchLocationsInputSchema>,
): SearchLocationsOptions {
  return omitUndefined({
    country: input.country,
    limit: input.limit,
    q: input.q,
  }) as SearchLocationsOptions;
}

function listSignalsOptions(
  input: ParsedToolInput<typeof listSignalsInputSchema>,
): ListSignalsOptions {
  return omitUndefined({
    cursor: input.cursor,
    from: input.from,
    limit: input.limit,
    source: input.source,
    to: input.to,
    type: input.type,
  }) as ListSignalsOptions;
}

function listTrafficSnapshotsOptions(
  input: ParsedToolInput<typeof listTrafficSnapshotsInputSchema>,
): ListTrafficSnapshotsOptions {
  return omitUndefined({
    endDate: input.end_date,
    limit: input.limit,
    offset: input.offset,
    paths: input.paths,
    startDate: input.start_date,
  }) as ListTrafficSnapshotsOptions;
}

function listSearchPerformanceQueryStatsOptions(
  input: ParsedToolInput<typeof listSearchPerformanceQueryStatsInputSchema>,
): ListSearchPerformanceQueryStatsOptions {
  return omitUndefined({
    connectionId: input.connection_id,
    endDate: input.end_date,
    limit: input.limit,
    query: input.query,
    startDate: input.start_date,
  }) as ListSearchPerformanceQueryStatsOptions;
}

function createSignalPayload(
  input: ParsedToolInput<typeof createSignalInputSchema>,
): CreateSignalInput {
  return omitUndefined({
    happened_at: input.happened_at,
    keyword_id: input.keyword_id,
    payload: input.payload,
    severity: input.severity,
    source: input.source,
    type: input.type,
    url: input.url,
  }) as CreateSignalInput;
}

function costEstimateOptions(
  input: ParsedToolInput<typeof getCostEstimateInputSchema>,
): GetCostEstimateOptions {
  return omitUndefined({
    devices: input.devices,
    frequency: input.frequency,
    keywords: input.keywords,
    locations: input.locations,
    option: input.option,
    plan: input.plan,
    provider: input.provider,
  }) as GetCostEstimateOptions;
}

function listRankChecksOptions(
  input: ParsedToolInput<typeof getRankHistoryInputSchema>,
): ListRankChecksOptions {
  return omitUndefined({
    cursor: input.cursor,
    limit: input.limit,
    since: input.since,
    status: input.status,
    until: input.until,
  }) as ListRankChecksOptions;
}

function paginationOptions(input: {
  cursor?: string | undefined;
  limit?: number | undefined;
}): PaginationOptions {
  return omitUndefined({
    cursor: input.cursor,
    limit: input.limit,
  }) as PaginationOptions;
}

function savedViewListOptions(
  input: ParsedToolInput<typeof listSavedViewsInputSchema>,
): ListSavedViewsOptions {
  return omitUndefined({
    cursor: input.cursor,
    limit: input.limit,
    surface: input.surface,
  }) as ListSavedViewsOptions;
}

function schedulePayload(
  schedule: z.output<typeof keywordScheduleInput> | undefined,
): KeywordScheduleInput | undefined {
  if (!schedule) {
    return undefined;
  }

  return omitUndefined({
    cron_expression: schedule.cron_expression,
    frequency: schedule.frequency,
    jitter_minutes: schedule.jitter_minutes,
    timezone: schedule.timezone,
  }) as KeywordScheduleInput;
}

function keywordDefaults(input: ParsedToolInput<typeof addKeywordsInputSchema>) {
  return omitUndefined({
    city: input.city,
    country: input.country,
    device: input.device,
    intent: input.intent,
    location: input.location,
    location_key: input.location_key,
    schedule: schedulePayload(input.schedule),
    tags: input.tags,
    target_url: input.target_url,
    topic: input.topic,
  }) as Partial<CreateKeywordInput>;
}

function keywordItemPayload(
  keyword: string | z.output<typeof keywordCreateItemInputSchema>,
  defaults: Partial<CreateKeywordInput>,
): CreateKeywordInput {
  if (typeof keyword === "string") {
    return { ...defaults, keyword };
  }

  return {
    ...defaults,
    ...(omitUndefined({
      city: keyword.city,
      country: keyword.country,
      device: keyword.device,
      intent: keyword.intent,
      location: keyword.location,
      location_key: keyword.location_key,
      schedule: schedulePayload(keyword.schedule),
      tags: keyword.tags,
      target_url: keyword.target_url,
      topic: keyword.topic,
    }) as Partial<CreateKeywordInput>),
    keyword: keyword.keyword,
  };
}

function createKeywordPayload(input: ParsedToolInput<typeof addKeywordsInputSchema>) {
  const defaults = keywordDefaults(input);

  return {
    keywords: input.keywords.map((keyword) => keywordItemPayload(keyword, defaults)),
  };
}

function updateKeywordPayload(input: ParsedToolInput<typeof updateKeywordInputSchema>) {
  return omitUndefined({
    city: input.city,
    country: input.country,
    device: input.device,
    frequency: input.frequency,
    intent: input.intent,
    keyword: input.keyword,
    location: input.location,
    location_key: input.location_key,
    schedule: schedulePayload(input.schedule),
    tags: input.tags,
    target_url: input.target_url,
    topic: input.topic,
  }) as UpdateKeywordInput;
}

function updateProjectPayload(
  input: ParsedToolInput<typeof updateProjectInputSchema>,
): UpdateProjectInput {
  return omitUndefined({
    domain: input.domain,
    name: input.name,
  }) as UpdateProjectInput;
}

function projectDefaultsPayload(
  input: ParsedToolInput<typeof updateProjectDefaultsInputSchema>,
): ProjectDefaultsPatch {
  return omitUndefined({
    city: input.city,
    country: input.country,
    cron_expression: input.cron_expression,
    device: input.device,
    frequency: input.frequency,
    jitter_minutes: input.jitter_minutes,
    location_key: input.location_key,
    serp_stop_on_match: input.serp_stop_on_match,
    timezone: input.timezone,
  }) as ProjectDefaultsPatch;
}

function runRankCheckOptions(
  input: ParsedToolInput<typeof runRankCheckInputSchema>,
): RunRankCheckOptions | undefined {
  const options = {
    ...implicitRequestOptions(input),
    ...(input.async === undefined ? {} : { async: input.async }),
  };

  return Object.keys(options).length ? options : undefined;
}

function bulkKeywordPayload(input: ParsedToolInput<typeof keywordBulkInputSchema>) {
  if (input.operation === "add_tags" || input.operation === "remove_tags") {
    const tags = input.tags;
    if (!tags?.length) {
      throw new Error("tags are required for tag bulk operations.");
    }
    return {
      keyword_ids: input.keyword_ids,
      operation: input.operation,
      tags,
    } satisfies KeywordBulkInput;
  }
  if (input.operation === "set_frequency") {
    const schedule = schedulePayload(input.schedule);
    return {
      keyword_ids: input.keyword_ids,
      operation: "set_frequency",
      ...(input.frequency === undefined ? {} : { frequency: input.frequency }),
      ...(schedule === undefined ? {} : { schedule }),
    } satisfies KeywordBulkInput;
  }
  if (input.operation === "set_target_url") {
    return {
      keyword_ids: input.keyword_ids,
      operation: "set_target_url",
      target_url: input.target_url ?? null,
    } satisfies KeywordBulkInput;
  }

  return { keyword_ids: input.keyword_ids, operation: "delete" } satisfies KeywordBulkInput;
}

function optionalPayload<T extends Record<string, unknown>>(payload: T): Partial<T> | undefined {
  const clean = omitUndefined(payload);

  return Object.keys(clean).length ? clean : undefined;
}

function alertRulePayload(
  input:
    | ParsedToolInput<typeof createAlertRuleInputSchema>
    | ParsedToolInput<typeof updateAlertRuleInputSchema>,
) {
  return omitUndefined({
    change_pct: input.change_pct,
    channels: input.channels,
    condition_type: input.condition_type,
    competitor_domain: input.competitor_domain,
    enabled: input.enabled,
    name: input.name,
    serp_feature: input.serp_feature,
    severity: input.severity,
    target_ids: input.target_ids,
    target_type: input.target_type,
    threshold_position: input.threshold_position,
    top_n: input.top_n,
  }) as CreateAlertRuleInput;
}

function updateAlertRulePayload(
  input: ParsedToolInput<typeof updateAlertRuleInputSchema>,
): UpdateAlertRuleInput {
  return alertRulePayload(input) as UpdateAlertRuleInput;
}

function teamInvitePayload(
  input: ParsedToolInput<typeof createTeamInviteInputSchema>,
): CreateTeamInviteInput {
  return {
    email: input.email,
    role: input.role,
  };
}

function providerCredentialsPayload(
  credentials: ParsedToolInput<typeof providerConnectionInputSchema>["credentials"],
) {
  if (!credentials) {
    return undefined;
  }

  return optionalPayload({
    api_key: credentials.api_key,
    endpoint: credentials.endpoint,
    login: credentials.login,
    secret: credentials.secret,
  });
}

function providerConnectionPayload(
  input: ParsedToolInput<typeof providerConnectionInputSchema>,
): ConnectProviderInput | undefined {
  return optionalPayload({
    cost_per_check: input.cost_per_check,
    credentials: providerCredentialsPayload(input.credentials),
    enabled: input.enabled,
    login: input.login,
    primary: input.primary,
    priority: input.priority,
    secret: input.secret,
  }) as ConnectProviderInput | undefined;
}

function testProviderConnectionPayload(
  input: ParsedToolInput<typeof testProviderConnectionInputSchema>,
): TestProviderConnectionInput | undefined {
  return optionalPayload({
    credentials: providerCredentialsPayload(input.credentials),
    login: input.login,
    secret: input.secret,
  }) as TestProviderConnectionInput | undefined;
}

function providerSettingsPayload(
  input: ParsedToolInput<typeof updateProviderSettingsInputSchema>,
): ProviderSettingsInput {
  return omitUndefined({
    enabled: input.enabled,
    primary: input.primary,
    priority: input.priority,
  }) as ProviderSettingsInput;
}

function savedViewPayload(
  input: ParsedToolInput<typeof createSavedViewInputSchema>,
): CreateSavedViewInput {
  return omitUndefined({
    config: input.config,
    name: input.name,
    surface: input.surface,
  }) as CreateSavedViewInput;
}

function competitorPayload(
  input: ParsedToolInput<typeof addCompetitorInputSchema>,
): AddCompetitorInput {
  return omitUndefined({
    domain: input.domain,
    label: input.label,
  }) as AddCompetitorInput;
}

function notificationPreferencesPayload(
  input: ParsedToolInput<typeof updateNotificationPreferencesInputSchema>,
): UpdateNotificationPreferencesInput {
  return omitUndefined({
    alert_email: input.alert_email,
    alert_in_app: input.alert_in_app,
    alert_slack: input.alert_slack,
    alert_webhook: input.alert_webhook,
    check_email: input.check_email,
    check_in_app: input.check_in_app,
    import_email: input.import_email,
    import_in_app: input.import_in_app,
    invite_email: input.invite_email,
    invite_in_app: input.invite_in_app,
  }) as UpdateNotificationPreferencesInput;
}

function migrationTokenPayload(
  input: ParsedToolInput<typeof mintMigrationTokenInputSchema>,
): MintMigrationTokenInput | undefined {
  return optionalPayload({
    scope: input.scope,
  }) as MintMigrationTokenInput | undefined;
}

function createProjectPayload(
  input: ParsedToolInput<typeof createProjectInputSchema>,
): CreateProjectInput {
  return omitUndefined({
    domain: input.domain,
    name: input.name,
    trackingScope: input.tracking_scope,
  }) as CreateProjectInput;
}

function createPersonalTokenPayload(
  input: ParsedToolInput<typeof createPersonalTokenInputSchema>,
): CreateMyTokenInput {
  return omitUndefined({
    expiresInDays: input.expires_in_days,
    name: input.name,
    scope: input.scope,
  }) as CreateMyTokenInput;
}

function createWebhookPayload(
  input: ParsedToolInput<typeof createWebhookInputSchema>,
): CreateWebhookInput {
  return omitUndefined({
    description: input.description,
    enabled: input.enabled,
    hmac_secret: input.hmac_secret,
    url: input.url,
  }) as CreateWebhookInput;
}

function updateWebhookPayload(
  input: ParsedToolInput<typeof updateWebhookInputSchema>,
): UpdateWebhookInput {
  return omitUndefined({
    description: input.description,
    enabled: input.enabled,
    hmac_secret: input.hmac_secret,
    url: input.url,
  }) as UpdateWebhookInput;
}

function toolHandler<TSchema extends ToolSchema>(schema: TSchema, execute: ToolExecutor<TSchema>) {
  return async (rawInput: unknown) => {
    try {
      return jsonToolResult(await execute(schema.parse(rawInput)));
    } catch (error) {
      return errorToolResult(error);
    }
  };
}

function registerTool<TSchema extends ToolSchema>(
  registration: {
    options: {
      readOnly: boolean;
      toolsets?: readonly BisibilityMcpToolset[];
    };
    server: McpServer;
  },
  name: string,
  config: {
    access: "read" | "write";
    description: string;
    destructive?: boolean;
    group: BisibilityMcpToolset;
    inputSchema: TSchema;
    title: string;
  },
  execute: ToolExecutor<TSchema>,
) {
  if (
    (registration.options.readOnly && config.access === "write") ||
    (registration.options.toolsets && !registration.options.toolsets.includes(config.group))
  ) {
    return;
  }

  registration.server.registerTool(
    name,
    {
      annotations: {
        destructiveHint: config.destructive ?? false,
        openWorldHint: OPEN_WORLD_TOOL_NAMES.has(name),
        readOnlyHint: config.access === "read",
      },
      description: config.description,
      inputSchema: config.inputSchema.shape,
      title: config.title,
    },
    toolHandler(config.inputSchema, execute),
  );
}

const OPEN_WORLD_TOOL_NAMES = new Set([
  "analyze_backlinks",
  "connect_provider",
  "create_team_invite",
  "get_keyword_metrics",
  "list_ranked_keyword_suggestions",
  "load_more_backlink_rows",
  "research_keywords",
  "resend_team_invite",
  "run_rank_check",
  "sync_project_traffic",
  "test_provider_connection",
]);

export function registerBisibilityTools(
  server: McpServer,
  options: RegisterBisibilityToolsOptions,
) {
  const { client } = options;
  const registration = {
    options: {
      readOnly: options.readOnly ?? false,
      ...(options.toolsets ? { toolsets: options.toolsets } : {}),
    },
    server,
  };

  registerTool(
    registration,
    "get_health",
    {
      access: "read",
      group: "system",
      description: "Check bisibility API health and configured SERP providers.",
      inputSchema: emptyInputSchema,
      title: "Get API health",
    },
    async () => client.getHealth(),
  );

  registerTool(
    registration,
    "get_capabilities",
    {
      access: "read",
      group: "system",
      description: "List the public bisibility API capabilities exposed for agent workflows.",
      inputSchema: emptyInputSchema,
      title: "Get API capabilities",
    },
    async () => client.getCapabilities(),
  );

  registerTool(
    registration,
    "get_cloud_import_compatibility",
    {
      access: "read",
      group: "system",
      description:
        "Check whether a cloud export package can be imported: returns the running app version, " +
        "the latest applied migration, and the cloud-import schema versions the API accepts. " +
        "Anonymous preflight endpoint; no project scope or credential needed. Use before " +
        "preparing a migration to confirm the export schema is still supported.",
      inputSchema: emptyInputSchema,
      title: "Get cloud import compatibility",
    },
    async () => client.getCloudImportCompatibility(),
  );

  registerTool(
    registration,
    "get_provider_rates",
    {
      access: "read",
      group: "providers",
      description:
        "List public provider rate cards used for rank-check cost estimates. Each rate card is " +
        "either flat-priced (per-check options such as standard, priority, live) or plan-priced " +
        "(monthly plans with included checks). Anonymous endpoint; no project scope needed.",
      inputSchema: emptyInputSchema,
      title: "Get provider rates",
    },
    async () => client.getProviderRates(),
  );

  registerTool(
    registration,
    "get_cost_estimate",
    {
      access: "read",
      group: "providers",
      description:
        "Estimate the monthly rank-check cost for a keyword portfolio using the public provider " +
        "rate cards. Provide the keyword count plus optional devices per keyword (1-2), " +
        "locations per keyword, and check frequency (daily, weekly, or monthly). Pick a rate " +
        "card with provider (defaults to dataforseo) and optionally a flat-rate option key or a " +
        "plan key; see get_provider_rates for available keys. Anonymous endpoint.",
      inputSchema: getCostEstimateInputSchema,
      title: "Get cost estimate",
    },
    async (input) => client.getCostEstimate(costEstimateOptions(input)),
  );

  registerTool(
    registration,
    "get_me",
    {
      access: "read",
      group: "account",
      description:
        "Get the authenticated user and all project memberships. Requires a personal access token.",
      inputSchema: getMeInputSchema,
      title: "Get authenticated user",
    },
    async () => client.getMe(),
  );

  registerTool(
    registration,
    "update_me",
    {
      access: "write",
      group: "account",
      description: "Update the authenticated user's display name. Requires a write PAT.",
      inputSchema: updateMeInputSchema,
      title: "Update authenticated user",
    },
    async (input) =>
      client.updateMe({ name: input.name } satisfies UpdateMeInput, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_projects",
    {
      access: "read",
      group: "projects",
      description:
        "List projects visible to the configured credential. Project keys return one project; " +
        "personal access tokens return all project memberships.",
      inputSchema: listProjectsInputSchema,
      title: "List projects",
    },
    // The /projects endpoint ignores pagination (single scoped project) and the
    // SDK method takes no pagination options, so cursor/limit are not forwarded.
    async () => client.listProjects(),
  );

  registerTool(
    registration,
    "create_project",
    {
      access: "write",
      group: "projects",
      description: "Create a project. Requires a personal access token with write scope.",
      inputSchema: createProjectInputSchema,
      title: "Create project",
    },
    async (input) => client.createProject(createProjectPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "get_project",
    {
      access: "read",
      group: "projects",
      description: "Get one bisibility project by project id.",
      inputSchema: getProjectInputSchema,
      title: "Get project",
    },
    async ({ project_id }) => client.getProject(project_id),
  );

  registerTool(
    registration,
    "search_locations",
    {
      access: "read",
      group: "keywords",
      description:
        "Search canonical keyword locations. Use the returned location_key verbatim when " +
        "creating or updating keywords for city-level tracking.",
      inputSchema: searchLocationsInputSchema,
      title: "Search locations",
    },
    async (input) => client.searchLocations(searchLocationsOptions(input)),
  );

  registerTool(
    registration,
    "update_project",
    {
      access: "write",
      group: "projects",
      description: "Update a project's name or domain. At least one of name or domain is required.",
      inputSchema: updateProjectInputSchema,
      title: "Update project",
    },
    async (input) =>
      client.updateProject(input.project_id, updateProjectPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "delete_project",
    {
      access: "write",
      destructive: true,
      group: "projects",
      description:
        "Permanently delete a project and all of its keywords, rank history, and settings. " +
        "This cannot be undone. Use only after the user confirms deletion.",
      inputSchema: deleteProjectInputSchema,
      title: "Delete project",
    },
    async (input) => client.deleteProject(input.project_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "get_project_defaults",
    {
      access: "read",
      group: "projects",
      description:
        "Get the effective rank-check schedule and SERP market defaults for a project. The " +
        "response includes serp_depth, serp_stop_on_match, and source: explicit means the market " +
        "was configured, derived means it was inferred from existing keywords, and fallback " +
        "means the instance default was used.",
      inputSchema: getProjectDefaultsInputSchema,
      title: "Get project defaults",
    },
    async ({ project_id }) => client.getProjectDefaults(project_id),
  );

  registerTool(
    registration,
    "update_project_defaults",
    {
      access: "write",
      group: "projects",
      description:
        "Update the project default rank-check schedule and SERP market. The schedule is " +
        "replaced as a whole: omitted schedule fields reset to their defaults (jitter 60, " +
        "timezone UTC, no cron). Provide country and device together, or a " +
        "location_key, to move the default SERP market. Use search_locations and " +
        "pass its location_key verbatim for city-level tracking.",
      inputSchema: updateProjectDefaultsInputSchema,
      title: "Update project defaults",
    },
    async (input) =>
      client.updateProjectDefaults(
        input.project_id,
        projectDefaultsPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "list_keywords",
    {
      access: "read",
      group: "keywords",
      description: "List keywords for a project with pagination, search, filters, and sorting.",
      inputSchema: listKeywordsInputSchema,
      title: "List project keywords",
    },
    async (input) => client.listKeywords(input.project_id, listKeywordsOptions(input)),
  );

  registerTool(
    registration,
    "list_ranked_keyword_suggestions",
    {
      access: "write",
      group: "keywords",
      description:
        "Paid provider lookup on the project's own DataForSEO account, about $0.02 per " +
        "100-keyword page on a cache miss. Results are cached for 12 hours and shared with " +
        "the UI and API. already_tracked marks keywords the project tracks.",
      inputSchema: listRankedKeywordSuggestionsInputSchema,
      title: "List ranked keyword suggestions",
    },
    async (input) =>
      client.listRankedKeywordSuggestions(
        input.project_id,
        listRankedKeywordSuggestionsOptions(input),
      ),
  );

  registerTool(
    registration,
    "research_keywords",
    {
      access: "write",
      group: "keywords",
      description:
        "Requires API write scope. Paid keyword research uses the project's own DataForSEO " +
        "account. When cost matters, call with estimate_only first for a free dry run, then use " +
        "max_cost_cents as a best-effort request guard. Approximate per-source pricing comes " +
        "from the current rate card exposed by get_provider_rates. Send one seed per " +
        "call. Results are cached for 12 hours and shared with the API and future UI. " +
        "Clickstream-refined volumes double provider cost. already_tracked marks keywords the " +
        "project tracks.",
      inputSchema: researchKeywordsInputSchema,
      title: "Research keywords",
    },
    async (input) => client.researchKeywords(input.project_id, researchKeywordsOptions(input)),
  );

  registerTool(
    registration,
    "analyze_backlinks",
    {
      access: "write",
      group: "backlinks",
      description:
        "Requires API write scope because cache misses spend the project's own DataForSEO budget. " +
        "Returns summary metrics, 12-month history, and per-link rows with new or lost status. " +
        "Snapshots are cached for 24 hours. Call with estimate_only first for a free dry run, then " +
        "use max_cost_cents as a best-effort request guard. Compute aggregate views from rows and " +
        'treat them as "within fetched rows" only.',
      inputSchema: analyzeBacklinksInputSchema,
      title: "Analyze backlinks",
    },
    async (input) => client.analyzeBacklinks(input.project_id, analyzeBacklinksOptions(input)),
  );

  registerTool(
    registration,
    "load_more_backlink_rows",
    {
      access: "write",
      group: "backlinks",
      description:
        "Requires API write scope. Extends the current unexpired backlinks snapshot at the " +
        "per-100-row provider rate. Returns 409 snapshot_expired when no current snapshot exists; " +
        "run analyze_backlinks first.",
      inputSchema: loadMoreBacklinkRowsInputSchema,
      title: "Load more backlink rows",
    },
    async (input) =>
      client.loadMoreBacklinkRows(input.project_id, loadMoreBacklinkRowsOptions(input)),
  );

  registerTool(
    registration,
    "get_keyword_metrics",
    {
      access: "write",
      group: "keywords",
      description:
        "Requires API write scope. Paid metrics lookup uses the project's own DataForSEO account. " +
        "When cost matters, call with estimate_only first for a free dry run, then use " +
        "max_cost_cents as a best-effort request guard. Approximate pricing per 100 fetched " +
        "keywords comes from the current rate card exposed by get_provider_rates. " +
        "Batches contain up to 700 keywords and cache each keyword for 12 hours, shared with the " +
        "API and future UI. Clickstream-refined volumes double provider cost.",
      inputSchema: getKeywordMetricsInputSchema,
      title: "Get keyword metrics",
    },
    async (input) => client.getKeywordMetrics(input.project_id, keywordMetricsInput(input)),
  );

  registerTool(
    registration,
    "add_keywords",
    {
      access: "write",
      group: "keywords",
      description:
        "Add one or more keywords to a project, optionally with tags, target URL, and schedule. " +
        "Use search_locations and pass its location_key verbatim for city-level tracking.",
      inputSchema: addKeywordsInputSchema,
      title: "Add keywords",
    },
    async (input) =>
      client.addKeywords(input.project_id, createKeywordPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "get_keyword",
    {
      access: "read",
      group: "keywords",
      description: "Get a keyword and its latest rank position by keyword id.",
      inputSchema: getKeywordInputSchema,
      title: "Get keyword",
    },
    async (input) => {
      const options = implicitRequestOptions(input);
      return options
        ? client.getKeyword(input.keyword_id, options)
        : client.getKeyword(input.keyword_id);
    },
  );

  registerTool(
    registration,
    "update_keyword",
    {
      access: "write",
      group: "keywords",
      description:
        "Update keyword metadata such as text, country, device, target URL, tags, or schedule. " +
        "Use search_locations and pass its location_key verbatim for city-level tracking.",
      inputSchema: updateKeywordInputSchema,
      title: "Update keyword",
    },
    async (input) =>
      client.updateKeyword(
        input.keyword_id,
        updateKeywordPayload(input),
        implicitRequestOptions(input),
      ),
  );

  registerTool(
    registration,
    "set_keyword_target_url",
    {
      access: "write",
      group: "keywords",
      description: "Set or clear the target URL used when evaluating a keyword ranking.",
      inputSchema: setKeywordTargetUrlInputSchema,
      title: "Set keyword target URL",
    },
    async (input) =>
      client.setKeywordTargetUrl(
        input.keyword_id,
        input.target_url ?? null,
        implicitRequestOptions(input),
      ),
  );

  registerTool(
    registration,
    "delete_keyword",
    {
      access: "write",
      destructive: true,
      group: "keywords",
      description: "Delete one keyword by keyword id. Use only after the user confirms deletion.",
      inputSchema: deleteKeywordInputSchema,
      title: "Delete keyword",
    },
    async (input) => client.deleteKeyword(input.keyword_id, implicitRequestOptions(input)),
  );

  registerTool(
    registration,
    "bulk_update_keywords",
    {
      access: "write",
      destructive: true,
      group: "keywords",
      description:
        "Bulk mutate keywords by adding tags, removing tags, setting frequency, setting target URL, or deleting.",
      inputSchema: keywordBulkInputSchema,
      title: "Bulk update keywords",
    },
    async (input) =>
      client.bulkUpdateKeywords(bulkKeywordPayload(input), implicitRequestOptions(input)),
  );

  registerTool(
    registration,
    "run_rank_check",
    {
      access: "write",
      group: "checks",
      description:
        "Run a provider-backed rank check for one keyword. Requires write access and may incur " +
        "provider cost. Ask for explicit user approval immediately before calling; this server " +
        "cannot enforce the client's confirmation UI. By default the check runs synchronously " +
        "and returns the completed result. Set async to true to enqueue the check and return a " +
        "running rank check immediately; poll it with get_rank_check_result.",
      inputSchema: runRankCheckInputSchema,
      title: "Run rank check",
    },
    async (input) =>
      client.runRankCheck(
        input.keyword_id,
        // MCP provider ids are registry-driven and intentionally validated by the server.
        input.provider_id ? ({ provider_id: input.provider_id } as RunRankCheckInput) : undefined,
        runRankCheckOptions(input),
      ),
  );

  registerTool(
    registration,
    "get_rank_history",
    {
      access: "read",
      group: "rank-history",
      description:
        "List historical rank checks for a keyword with date, status, and pagination filters.",
      inputSchema: getRankHistoryInputSchema,
      title: "Get rank history",
    },
    async (input) => {
      const options = implicitRequestOptions(input);
      return options
        ? client.listRankChecks(input.keyword_id, listRankChecksOptions(input), options)
        : client.listRankChecks(input.keyword_id, listRankChecksOptions(input));
    },
  );

  registerTool(
    registration,
    "export_rank_history",
    {
      access: "read",
      group: "rank-history",
      description:
        "Export project rank history as cursor-paginated JSON for reports and analysis. " +
        "For full streamed CSV dumps, use the REST endpoint directly.",
      inputSchema: exportRankHistoryInputSchema,
      title: "Export project rank history",
    },
    async (input) => client.exportRankHistory(input.project_id, exportRankHistoryOptions(input)),
  );

  registerTool(
    registration,
    "list_sitemap_monitors",
    {
      access: "read",
      group: "sitemaps",
      description:
        "List the project sitemap monitor, including its status and latest snapshot summary.",
      inputSchema: listSitemapMonitorsInputSchema,
      title: "List sitemap monitors",
    },
    async (input) => client.listSitemapMonitors(input.project_id),
  );

  registerTool(
    registration,
    "enable_sitemap_monitor",
    {
      access: "write",
      group: "sitemaps",
      description:
        "Enable the project sitemap monitor. The next scheduled worker sync fetches the sitemap; enabling does not fetch immediately.",
      inputSchema: updateSitemapMonitorInputSchema,
      title: "Enable sitemap monitor",
    },
    async (input) =>
      client.updateSitemapMonitor(
        input.project_id,
        input.monitor_id,
        { enabled: true },
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "disable_sitemap_monitor",
    {
      access: "write",
      group: "sitemaps",
      description: "Disable the project sitemap monitor while retaining its existing snapshots.",
      inputSchema: updateSitemapMonitorInputSchema,
      title: "Disable sitemap monitor",
    },
    async (input) =>
      client.updateSitemapMonitor(
        input.project_id,
        input.monitor_id,
        { enabled: false },
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "get_rank_check_result",
    {
      access: "read",
      group: "checks",
      description: "Get one rank check result by check id.",
      inputSchema: getRankCheckResultInputSchema,
      title: "Get rank check result",
    },
    async (input) => {
      const options = implicitRequestOptions(input);
      return options
        ? client.getRankCheckResult(input.check_id, options)
        : client.getRankCheckResult(input.check_id);
    },
  );

  registerTool(
    registration,
    "create_signal",
    {
      access: "write",
      group: "signals",
      description:
        "Ingest a signal for the key-scoped project: an external event such as a deploy, CMS " +
        "content change, or custom API event that may explain ranking movements. source must " +
        'be deploy, cms, or api; type is a dot-separated identifier such as "deploy.completed" ' +
        'or "cms.page_updated". Optionally attach an ISO-8601 happened_at (defaults to now), a ' +
        "related keyword_id, an http(s) url, a severity (info, warning, or critical), and a " +
        "JSON payload of up to 8KB.",
      inputSchema: createSignalInputSchema,
      title: "Create signal",
    },
    async (input) => client.createSignal(createSignalPayload(input), implicitRequestOptions(input)),
  );

  registerTool(
    registration,
    "list_signals",
    {
      access: "read",
      group: "signals",
      description:
        "List signals for a project, newest first. Filter by source (including system sources " +
        "such as rank_tracker or search_analytics), exact type, and a happened-at date range " +
        "via from/to ISO-8601 date-times, with cursor pagination.",
      inputSchema: listSignalsInputSchema,
      title: "List signals",
    },
    async (input) => client.listSignals(input.project_id, listSignalsOptions(input)),
  );

  registerTool(
    registration,
    "list_traffic_snapshots",
    {
      access: "read",
      group: "analytics",
      description:
        "List stored page traffic snapshots collected from the project's own connected analytics " +
        "accounts, filtered by date range and optional page paths.",
      inputSchema: listTrafficSnapshotsInputSchema,
      title: "List traffic snapshots",
    },
    async (input) =>
      client.listTrafficSnapshots(input.project_id, listTrafficSnapshotsOptions(input)),
  );

  registerTool(
    registration,
    "list_search_performance_query_stats",
    {
      access: "read",
      group: "analytics",
      description:
        "Fetch live query statistics from one of the project's own connected search-performance " +
        "accounts. Provider rate limits and reauthorization rules apply.",
      inputSchema: listSearchPerformanceQueryStatsInputSchema,
      title: "List search-performance query stats",
    },
    async (input) =>
      client.listSearchPerformanceQueryStats(
        input.project_id,
        listSearchPerformanceQueryStatsOptions(input),
      ),
  );

  registerTool(
    registration,
    "sync_project_traffic",
    {
      access: "write",
      group: "analytics",
      description:
        "Synchronize traffic snapshots from the project's own connected analytics accounts now. " +
        "Provider rate limits and connection authorization rules apply.",
      inputSchema: syncProjectTrafficInputSchema,
      title: "Synchronize project traffic",
    },
    async (input) => client.syncProjectTraffic(input.project_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_api_keys",
    {
      access: "read",
      group: "tokens",
      description: "List API keys for the authenticated project, including revoked keys.",
      inputSchema: listApiKeysInputSchema,
      title: "List API keys",
    },
    async (input) => {
      const options = implicitRequestOptions(input);
      return options
        ? client.listApiKeys(paginationOptions(input), options)
        : client.listApiKeys(paginationOptions(input));
    },
  );

  registerTool(
    registration,
    "create_api_key",
    {
      access: "write",
      group: "tokens",
      description:
        "Create a new API key for the authenticated project. The raw token is returned once in " +
        "the response and cannot be retrieved again; store it securely.",
      inputSchema: createApiKeyInputSchema,
      title: "Create API key",
    },
    async (input) =>
      client.createApiKey(
        omitUndefined({
          expires_in_days: input.expires_in_days,
          name: input.name,
          scope: input.scope,
        }) as CreateApiKeyInput,
        implicitRequestOptions(input),
      ),
  );

  registerTool(
    registration,
    "revoke_api_key",
    {
      access: "write",
      destructive: true,
      group: "tokens",
      description:
        "Revoke an API key by key id. Revocation is immediate and cannot be undone; revoking " +
        "the key this server is configured with locks the server out. Use only after the user " +
        "confirms revocation.",
      inputSchema: revokeApiKeyInputSchema,
      title: "Revoke API key",
    },
    async (input) => client.revokeApiKey(input.key_id, implicitRequestOptions(input)),
  );

  registerTool(
    registration,
    "list_project_api_keys",
    {
      access: "read",
      group: "tokens",
      description: "List API keys scoped to a specific project, including revoked keys.",
      inputSchema: listProjectApiKeysInputSchema,
      title: "List project API keys",
    },
    async (input) => client.listProjectApiKeys(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "create_project_api_key",
    {
      access: "write",
      group: "tokens",
      description:
        "Create a project-scoped API key for CI or automation. The raw key is returned once.",
      inputSchema: createProjectApiKeyInputSchema,
      title: "Create project API key",
    },
    async (input) =>
      client.createProjectApiKey(input.project_id, { name: input.name }, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_personal_tokens",
    {
      access: "read",
      group: "tokens",
      description: "List the user's personal access tokens. Requires an admin PAT.",
      inputSchema: listPersonalTokensInputSchema,
      title: "List personal tokens",
    },
    async () => client.listMyTokens(),
  );

  registerTool(
    registration,
    "create_personal_token",
    {
      access: "write",
      group: "tokens",
      description:
        "Create a personal access token. The raw account-wide token is returned once. Requires an admin PAT.",
      inputSchema: createPersonalTokenInputSchema,
      title: "Create personal token",
    },
    async (input) => client.createMyToken(createPersonalTokenPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "revoke_personal_token",
    {
      access: "write",
      destructive: true,
      group: "tokens",
      description:
        'Revoke a personal token by id, or pass "current" to revoke the configured token.',
      inputSchema: revokePersonalTokenInputSchema,
      title: "Revoke personal token",
    },
    async (input) => client.revokeMyToken(input.token_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_webhooks",
    {
      access: "read",
      group: "webhooks",
      description:
        "Webhook endpoints: list the per-project HTTP URLs that notifications and events are delivered to.",
      inputSchema: listWebhooksInputSchema,
      title: "List webhooks",
    },
    async (input) => client.listWebhooks(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "create_webhook",
    {
      access: "write",
      group: "webhooks",
      description: "Create a webhook endpoint. The HMAC secret is write-only.",
      inputSchema: createWebhookInputSchema,
      title: "Create webhook",
    },
    async (input) =>
      client.createWebhook(input.project_id, createWebhookPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "update_webhook",
    {
      access: "write",
      group: "webhooks",
      description: "Update a webhook endpoint or rotate its write-only HMAC secret.",
      inputSchema: updateWebhookInputSchema,
      title: "Update webhook",
    },
    async (input) =>
      client.updateWebhook(
        input.project_id,
        input.webhook_id,
        updateWebhookPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "delete_webhook",
    {
      access: "write",
      destructive: true,
      group: "webhooks",
      description: "Delete a webhook endpoint. Requires admin access.",
      inputSchema: deleteWebhookInputSchema,
      title: "Delete webhook",
    },
    async (input) =>
      client.deleteWebhook(input.project_id, input.webhook_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_alert_rules",
    {
      access: "read",
      group: "alerts",
      description:
        "Alert rules: list the per-project conditions that decide when a notification fires.",
      inputSchema: listAlertRulesInputSchema,
      title: "List alert rules",
    },
    async (input) => client.listAlertRules(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "create_alert_rule",
    {
      access: "write",
      group: "alerts",
      description:
        "Create an alert rule for project rank changes, thresholds, SERP features, or competitors.",
      inputSchema: createAlertRuleInputSchema,
      title: "Create alert rule",
    },
    async (input) =>
      client.createAlertRule(input.project_id, alertRulePayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "update_alert_rule",
    {
      access: "write",
      group: "alerts",
      description:
        "Update an alert rule by rule id. The API replaces the whole rule configuration, so " +
        "name and condition_type are required even when updating a single field.",
      inputSchema: updateAlertRuleInputSchema,
      title: "Update alert rule",
    },
    async (input) =>
      client.updateAlertRule(
        input.rule_id,
        updateAlertRulePayload(input),
        implicitRequestOptions(input),
      ),
  );

  registerTool(
    registration,
    "delete_alert_rule",
    {
      access: "write",
      destructive: true,
      group: "alerts",
      description: "Delete an alert rule by rule id. Use only after the user confirms deletion.",
      inputSchema: deleteAlertRuleInputSchema,
      title: "Delete alert rule",
    },
    async (input) => client.deleteAlertRule(input.rule_id, implicitRequestOptions(input)),
  );

  registerTool(
    registration,
    "list_triggered_alerts",
    {
      access: "read",
      group: "alerts",
      description: "List triggered alerts for a project.",
      inputSchema: listTriggeredAlertsInputSchema,
      title: "List triggered alerts",
    },
    async (input) => client.listTriggeredAlerts(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "mute_triggered_alert",
    {
      access: "write",
      group: "alerts",
      description:
        "Mute one firing alert for 24 hours. This changes shared alert state for the whole project team.",
      inputSchema: muteTriggeredAlertInputSchema,
      title: "Mute triggered alert",
    },
    async (input) =>
      client.muteTriggeredAlert(input.project_id, input.alert_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "mark_project_alerts_read",
    {
      access: "write",
      group: "alerts",
      description: "Mark every firing alert in the project as read for the whole project team.",
      inputSchema: markProjectAlertsReadInputSchema,
      title: "Mark project alerts read",
    },
    async (input) => client.markProjectAlertsRead(input.project_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_team_members",
    {
      access: "read",
      group: "team",
      description: "List team members for a project.",
      inputSchema: listTeamMembersInputSchema,
      title: "List team members",
    },
    async (input) => client.listTeamMembers(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "list_team_invites",
    {
      access: "read",
      group: "team",
      description: "List pending team invites for a project.",
      inputSchema: listTeamInvitesInputSchema,
      title: "List team invites",
    },
    async (input) => client.listTeamInvites(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "create_team_invite",
    {
      access: "write",
      group: "team",
      description: "Invite a user to a project team with an admin, member, or viewer role.",
      inputSchema: createTeamInviteInputSchema,
      title: "Create team invite",
    },
    async (input) =>
      client.createTeamInvite(input.project_id, teamInvitePayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "revoke_team_invite",
    {
      access: "write",
      destructive: true,
      group: "team",
      description: "Revoke a pending project team invite.",
      inputSchema: revokeTeamInviteInputSchema,
      title: "Revoke team invite",
    },
    async (input) =>
      client.revokeTeamInvite(input.project_id, input.invite_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "resend_team_invite",
    {
      access: "write",
      group: "team",
      description: "Resend a pending team invitation and replace its expiration and token.",
      inputSchema: resendTeamInviteInputSchema,
      title: "Resend team invite",
    },
    async (input) =>
      client.resendTeamInvite(input.project_id, input.invite_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "update_team_member_role",
    {
      access: "write",
      group: "team",
      description:
        "Change a non-owner project member role to admin, member, or viewer. Ownership transfer " +
        "remains UI-only.",
      inputSchema: updateTeamMemberRoleInputSchema,
      title: "Update team member role",
    },
    async (input) =>
      client.updateTeamMemberRole(
        input.project_id,
        input.member_id,
        { role: input.role } satisfies UpdateTeamMemberRoleInput,
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "remove_team_member",
    {
      access: "write",
      destructive: true,
      group: "team",
      description:
        "Permanently remove a non-owner project member. Confirm the user's intent before calling this tool.",
      inputSchema: removeTeamMemberInputSchema,
      title: "Remove team member",
    },
    async (input) =>
      client.removeTeamMember(input.project_id, input.member_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_providers",
    {
      access: "read",
      group: "providers",
      description: "List provider connection options and status for a project.",
      inputSchema: listProvidersInputSchema,
      title: "List providers",
    },
    async (input) => client.listProviders(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "connect_provider",
    {
      access: "write",
      group: "providers",
      description:
        "Connect or update credentials for a project provider. SERP providers are dataforseo " +
        "and serpapi; analytics providers are ga4, gsc, and plausible. Self-hosted providers " +
        "such as Plausible accept an optional credentials.endpoint base URL. Use priority for " +
        "ordering; the deprecated primary=true alias promotes priority 0 and primary=false is a no-op.",
      inputSchema: providerConnectionInputSchema,
      title: "Connect provider",
    },
    async (input) =>
      client.connectProvider(
        input.project_id,
        input.provider_id,
        providerConnectionPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "test_provider_connection",
    {
      access: "write",
      group: "providers",
      description:
        "Test provider credentials or the saved provider connection. Self-hosted providers " +
        "such as Plausible accept an optional credentials.endpoint base URL.",
      inputSchema: testProviderConnectionInputSchema,
      title: "Test provider connection",
    },
    async (input) =>
      client.testProviderConnection(
        input.project_id,
        input.provider_id,
        testProviderConnectionPayload(input),
      ),
  );

  registerTool(
    registration,
    "update_provider_settings",
    {
      access: "write",
      group: "providers",
      description:
        "Update provider settings such as enabled state or priority. primary is a deprecated " +
        "compatibility alias: true promotes priority 0 and false is a no-op.",
      inputSchema: updateProviderSettingsInputSchema,
      title: "Update provider settings",
    },
    async (input) =>
      client.updateProviderSettings(
        input.project_id,
        input.provider_id,
        providerSettingsPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "set_provider_enabled",
    {
      access: "write",
      group: "providers",
      description: "Enable or disable a provider for a project.",
      inputSchema: setProviderEnabledInputSchema,
      title: "Set provider enabled",
    },
    async (input) =>
      client.setProviderEnabled(
        input.project_id,
        input.provider_id,
        input.enabled,
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "set_provider_priority",
    {
      access: "write",
      group: "providers",
      description: "Set provider priority for a project. Lower numbers are preferred first.",
      inputSchema: setProviderPriorityInputSchema,
      title: "Set provider priority",
    },
    async (input) =>
      client.setProviderPriority(
        input.project_id,
        input.provider_id,
        input.priority,
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "set_primary_provider",
    {
      access: "write",
      group: "providers",
      description:
        "Deprecated compatibility tool. true promotes priority 0; false is a legacy no-op. " +
        "Use set_provider_priority for new calls.",
      inputSchema: setPrimaryProviderInputSchema,
      title: "Set primary provider",
    },
    async (input) =>
      client.setPrimaryProvider(
        input.project_id,
        input.provider_id,
        input.primary ?? true,
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "disconnect_provider",
    {
      access: "write",
      destructive: true,
      group: "providers",
      description:
        "Disconnect a provider from a project. Use only after the user confirms deletion.",
      inputSchema: providerActionInputSchema,
      title: "Disconnect provider",
    },
    async (input) =>
      client.disconnectProvider(input.project_id, input.provider_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_saved_keywords",
    {
      access: "read",
      group: "saved-keywords",
      description: "List keyword ideas saved without rank tracking for a project.",
      inputSchema: listSavedKeywordsInputSchema,
      title: "List saved keywords",
    },
    async (input) => client.listSavedKeywords(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "create_saved_keywords",
    {
      access: "write",
      group: "saved-keywords",
      description:
        "Save keyword ideas without starting paid rank tracking. Keywords already tracked or saved are skipped.",
      inputSchema: createSavedKeywordsInputSchema,
      title: "Create saved keywords",
    },
    async (input) =>
      client.createSavedKeywords(
        input.project_id,
        savedKeywordsPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "delete_saved_keyword",
    {
      access: "write",
      destructive: true,
      group: "saved-keywords",
      description: "Delete one saved keyword. Use only after the user confirms deletion.",
      inputSchema: deleteSavedKeywordInputSchema,
      title: "Delete saved keyword",
    },
    async (input) =>
      client.deleteSavedKeyword(input.project_id, input.saved_keyword_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_saved_views",
    {
      access: "read",
      group: "saved-views",
      description: "List saved keyword views for a project.",
      inputSchema: listSavedViewsInputSchema,
      title: "List saved views",
    },
    async (input) => client.listSavedViews(input.project_id, savedViewListOptions(input)),
  );

  registerTool(
    registration,
    "create_saved_view",
    {
      access: "write",
      group: "saved-views",
      description:
        "Create a saved keyword view for a project. Known country filter values: 'all' or a " +
        "supported market country code such as us, gb, ca, au, de, fr, es, it, nl, se, pl. " +
        "Known serp filter values: ai, featured, image, paa, sitelinks, video. The API " +
        "validates both against its data-driven market list.",
      inputSchema: createSavedViewInputSchema,
      title: "Create saved view",
    },
    async (input) =>
      client.createSavedView(input.project_id, savedViewPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "delete_saved_view",
    {
      access: "write",
      destructive: true,
      group: "saved-views",
      description: "Delete a project saved view. Use only after the user confirms deletion.",
      inputSchema: deleteSavedViewInputSchema,
      title: "Delete saved view",
    },
    async (input) => client.deleteSavedView(input.project_id, input.view_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "list_competitors",
    {
      access: "read",
      group: "competitors",
      description: "List tracked competitors, market data, and suggestions for a project.",
      inputSchema: listCompetitorsInputSchema,
      title: "List competitors",
    },
    async (input) => client.listCompetitors(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "add_competitor",
    {
      access: "write",
      group: "competitors",
      description: "Add a tracked competitor domain to a project.",
      inputSchema: addCompetitorInputSchema,
      title: "Add competitor",
    },
    async (input) =>
      client.addCompetitor(input.project_id, competitorPayload(input), requestOptions(input)),
  );

  registerTool(
    registration,
    "remove_competitor",
    {
      access: "write",
      destructive: true,
      group: "competitors",
      description: "Remove a tracked competitor from a project.",
      inputSchema: removeCompetitorInputSchema,
      title: "Remove competitor",
    },
    async (input) =>
      client.removeCompetitor(input.project_id, input.competitor_id, requestOptions(input)),
  );

  registerTool(
    registration,
    "get_notification_preferences",
    {
      access: "read",
      group: "notifications",
      description:
        "Notification channel switches: get which channels (email, Slack, webhook) are turned on for the project. Returns no addresses or URLs; use list_webhooks for where notifications are sent.",
      inputSchema: getNotificationPreferencesInputSchema,
      title: "Get notification preferences",
    },
    async ({ project_id }) => client.getNotificationPreferences(project_id),
  );

  registerTool(
    registration,
    "update_notification_preferences",
    {
      access: "write",
      group: "notifications",
      description:
        "Notification channel switches: turn the project's notification channels (email, Slack, webhook) on or off. Does not create or change webhook endpoints; use create_webhook or update_webhook for those.",
      inputSchema: updateNotificationPreferencesInputSchema,
      title: "Update notification preferences",
    },
    async (input) =>
      client.updateNotificationPreferences(
        input.project_id,
        notificationPreferencesPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "list_migration_tokens",
    {
      access: "read",
      group: "tokens",
      description: "List active migration tokens for a project.",
      inputSchema: listMigrationTokensInputSchema,
      title: "List migration tokens",
    },
    async (input) => client.listMigrationTokens(input.project_id, paginationOptions(input)),
  );

  registerTool(
    registration,
    "mint_migration_token",
    {
      access: "write",
      group: "tokens",
      description: "Mint a migration token for a project.",
      inputSchema: mintMigrationTokenInputSchema,
      title: "Mint migration token",
    },
    async (input) =>
      client.mintMigrationToken(
        input.project_id,
        migrationTokenPayload(input),
        requestOptions(input),
      ),
  );

  registerTool(
    registration,
    "revoke_migration_token",
    {
      access: "write",
      destructive: true,
      group: "tokens",
      description: "Revoke a project migration token.",
      inputSchema: revokeMigrationTokenInputSchema,
      title: "Revoke migration token",
    },
    async (input) =>
      client.revokeMigrationToken(input.project_id, input.token_id, requestOptions(input)),
  );
}
