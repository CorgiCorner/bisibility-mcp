import type {
  AddCompetitorInput,
  BisibilityClient,
  ConnectProviderInput,
  CreateAlertRuleInput,
  CreateKeywordInput,
  CreateMyTokenInput,
  CreateProjectInput,
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
  ListSearchPerformanceQueryStatsOptions,
  ListSignalsOptions,
  ListTrafficSnapshotsOptions,
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

import { errorToolResult, jsonToolResult } from "./result.js";
import {
  addCompetitorInputSchema,
  addKeywordsInputSchema,
  createAlertRuleInputSchema,
  createApiKeyInputSchema,
  createPersonalTokenInputSchema,
  createProjectApiKeyInputSchema,
  createProjectInputSchema,
  createSavedViewInputSchema,
  createSignalInputSchema,
  createTeamInviteInputSchema,
  createWebhookInputSchema,
  deleteAlertRuleInputSchema,
  deleteKeywordInputSchema,
  deleteProjectInputSchema,
  deleteSavedViewInputSchema,
  deleteWebhookInputSchema,
  emptyInputSchema,
  exportRankHistoryInputSchema,
  getCostEstimateInputSchema,
  getKeywordInputSchema,
  getKeywordMetricsInputSchema,
  getMeInputSchema,
  getNotificationPreferencesInputSchema,
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
  listSavedViewsInputSchema,
  listSearchPerformanceQueryStatsInputSchema,
  listSignalsInputSchema,
  listSitemapMonitorsInputSchema,
  listTeamInvitesInputSchema,
  listTeamMembersInputSchema,
  listTrafficSnapshotsInputSchema,
  listTriggeredAlertsInputSchema,
  listWebhooksInputSchema,
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
  | "bulkUpdateKeywords"
  | "connectProvider"
  | "createAlertRule"
  | "createApiKey"
  | "createMyToken"
  | "createProject"
  | "createProjectApiKey"
  | "createSavedView"
  | "createSignal"
  | "createTeamInvite"
  | "createWebhook"
  | "deleteAlertRule"
  | "deleteKeyword"
  | "deleteProject"
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
  | "listSavedViews"
  | "listSearchPerformanceQueryStats"
  | "listSignals"
  | "listSitemapMonitors"
  | "listTeamInvites"
  | "listTeamMembers"
  | "listTrafficSnapshots"
  | "listTriggeredAlerts"
  | "listWebhooks"
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
    keywordIds: input.keyword_id,
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

function schedulePayload(
  schedule: z.output<typeof keywordScheduleInput> | undefined,
): KeywordScheduleInput | undefined {
  if (!schedule) {
    return undefined;
  }

  return omitUndefined({
    auto_schedule: schedule.auto_schedule,
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
    auto_schedule: input.auto_schedule,
    city: input.city,
    country: input.country,
    cron_expression: input.cron_expression,
    device: input.device,
    frequency: input.frequency,
    jitter_minutes: input.jitter_minutes,
    location_key: input.location_key,
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
  const base = {
    keyword_ids: input.keyword_ids,
    operation: input.operation,
  };

  if (input.operation === "add_tags" || input.operation === "remove_tags") {
    return {
      ...base,
      operation: input.operation,
      tags: input.tags ?? [],
    } satisfies KeywordBulkInput;
  }
  if (input.operation === "set_frequency") {
    return omitUndefined({
      ...base,
      frequency: input.frequency,
      operation: input.operation,
      schedule: schedulePayload(input.schedule),
    }) as KeywordBulkInput;
  }
  if (input.operation === "set_target_url") {
    return {
      ...base,
      operation: input.operation,
      target_url: input.target_url ?? null,
    } satisfies KeywordBulkInput;
  }

  return { ...base, operation: "delete" } satisfies KeywordBulkInput;
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
  // The SDK still types country and SERP filters as narrow unions, while the API
  // validates them against its data-driven market list; widen deliberately.
  return {
    config: input.config,
    name: input.name,
  } as CreateSavedViewInput;
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
  server: McpServer,
  name: string,
  config: { description: string; inputSchema: TSchema; title: string },
  execute: ToolExecutor<TSchema>,
) {
  server.registerTool(
    name,
    {
      description: config.description,
      inputSchema: config.inputSchema.shape,
      title: config.title,
    },
    toolHandler(config.inputSchema, execute),
  );
}

export function registerBisibilityTools(
  server: McpServer,
  options: RegisterBisibilityToolsOptions,
) {
  const { client } = options;

  registerTool(
    server,
    "bisibility_get_health",
    {
      description: "Check Bisibility API health and configured SERP providers.",
      inputSchema: emptyInputSchema,
      title: "Get API health",
    },
    async () => client.getHealth(),
  );

  registerTool(
    server,
    "bisibility_get_capabilities",
    {
      description: "List the public Bisibility API capabilities exposed for agent workflows.",
      inputSchema: emptyInputSchema,
      title: "Get API capabilities",
    },
    async () => client.getCapabilities(),
  );

  registerTool(
    server,
    "bisibility_get_cloud_import_compatibility",
    {
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
    server,
    "bisibility_get_provider_rates",
    {
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
    server,
    "bisibility_get_cost_estimate",
    {
      description:
        "Estimate the monthly rank-check cost for a keyword portfolio using the public provider " +
        "rate cards. Provide the keyword count plus optional devices per keyword (1-2), " +
        "locations per keyword, and check frequency (daily, weekly, or monthly). Pick a rate " +
        "card with provider (defaults to dataforseo) and optionally a flat-rate option key or a " +
        "plan key; see bisibility_get_provider_rates for available keys. Anonymous endpoint.",
      inputSchema: getCostEstimateInputSchema,
      title: "Get cost estimate",
    },
    async (input) => client.getCostEstimate(costEstimateOptions(input)),
  );

  registerTool(
    server,
    "bisibility_get_me",
    {
      description:
        "Get the authenticated user and all project memberships. Requires a personal access token.",
      inputSchema: getMeInputSchema,
      title: "Get authenticated user",
    },
    async () => client.getMe(),
  );

  registerTool(
    server,
    "bisibility_update_me",
    {
      description: "Update the authenticated user's display name. Requires a write PAT.",
      inputSchema: updateMeInputSchema,
      title: "Update authenticated user",
    },
    async (input) =>
      client.updateMe({ name: input.name } satisfies UpdateMeInput, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_projects",
    {
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
    server,
    "bisibility_create_project",
    {
      description: "Create a project. Requires a personal access token with write scope.",
      inputSchema: createProjectInputSchema,
      title: "Create project",
    },
    async (input) => client.createProject(createProjectPayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_get_project",
    {
      description: "Get one Bisibility project by project id.",
      inputSchema: getProjectInputSchema,
      title: "Get project",
    },
    async ({ project_id }) => client.getProject(project_id),
  );

  registerTool(
    server,
    "bisibility_search_locations",
    {
      description:
        "Search canonical keyword locations. Use the returned location_key verbatim when " +
        "creating or updating keywords for city-level tracking.",
      inputSchema: searchLocationsInputSchema,
      title: "Search locations",
    },
    async (input) => client.searchLocations(searchLocationsOptions(input)),
  );

  registerTool(
    server,
    "bisibility_update_project",
    {
      description: "Update a project's name or domain. At least one of name or domain is required.",
      inputSchema: updateProjectInputSchema,
      title: "Update project",
    },
    async (input) =>
      client.updateProject(input.project_id, updateProjectPayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_delete_project",
    {
      description:
        "Permanently delete a project and all of its keywords, rank history, and settings. " +
        "This cannot be undone. Use only after the user confirms deletion.",
      inputSchema: deleteProjectInputSchema,
      title: "Delete project",
    },
    async (input) => client.deleteProject(input.project_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_update_project_defaults",
    {
      description:
        "Update the project default rank-check schedule and SERP market. The schedule is " +
        "replaced as a whole: omitted schedule fields reset to their defaults (auto_schedule " +
        "true, jitter 60, timezone UTC, no cron). Provide country and device together, or a " +
        "location_key, to move the default SERP market. Use bisibility_search_locations and " +
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
    server,
    "bisibility_list_keywords",
    {
      description: "List keywords for a project with pagination, search, filters, and sorting.",
      inputSchema: listKeywordsInputSchema,
      title: "List project keywords",
    },
    async (input) => client.listKeywords(input.project_id, listKeywordsOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_ranked_keyword_suggestions",
    {
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
    server,
    "bisibility_research_keywords",
    {
      description:
        "Requires API write scope. Paid keyword research uses the project's own DataForSEO " +
        "account. When cost matters, call with estimate_only first for a free dry run, then use " +
        "max_cost_cents as a best-effort request guard. Approximate per-source pricing comes " +
        "from the current rate card exposed by bisibility_get_provider_rates. Send one seed per " +
        "call. Results are cached for 12 hours and shared with the API and future UI. " +
        "Clickstream-refined volumes double provider cost. already_tracked marks keywords the " +
        "project tracks.",
      inputSchema: researchKeywordsInputSchema,
      title: "Research keywords",
    },
    async (input) => client.researchKeywords(input.project_id, researchKeywordsOptions(input)),
  );

  registerTool(
    server,
    "bisibility_get_keyword_metrics",
    {
      description:
        "Requires API write scope. Paid metrics lookup uses the project's own DataForSEO account. " +
        "When cost matters, call with estimate_only first for a free dry run, then use " +
        "max_cost_cents as a best-effort request guard. Approximate pricing per 100 fetched " +
        "keywords comes from the current rate card exposed by bisibility_get_provider_rates. " +
        "Batches contain up to 700 keywords and cache each keyword for 12 hours, shared with the " +
        "API and future UI. Clickstream-refined volumes double provider cost.",
      inputSchema: getKeywordMetricsInputSchema,
      title: "Get keyword metrics",
    },
    async (input) => client.getKeywordMetrics(input.project_id, keywordMetricsInput(input)),
  );

  registerTool(
    server,
    "bisibility_add_keywords",
    {
      description:
        "Add one or more keywords to a project, optionally with tags, target URL, and schedule. " +
        "Use bisibility_search_locations and pass its location_key verbatim for city-level tracking.",
      inputSchema: addKeywordsInputSchema,
      title: "Add keywords",
    },
    async (input) =>
      client.addKeywords(input.project_id, createKeywordPayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_get_keyword",
    {
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
    server,
    "bisibility_update_keyword",
    {
      description:
        "Update keyword metadata such as text, country, device, target URL, tags, or schedule. " +
        "Use bisibility_search_locations and pass its location_key verbatim for city-level tracking.",
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
    server,
    "bisibility_set_keyword_target_url",
    {
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
    server,
    "bisibility_delete_keyword",
    {
      description: "Delete one keyword by keyword id. Use only after the user confirms deletion.",
      inputSchema: deleteKeywordInputSchema,
      title: "Delete keyword",
    },
    async (input) => client.deleteKeyword(input.keyword_id, implicitRequestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_bulk_update_keywords",
    {
      description:
        "Bulk mutate keywords by adding tags, removing tags, setting frequency, setting target URL, or deleting.",
      inputSchema: keywordBulkInputSchema,
      title: "Bulk update keywords",
    },
    async (input) =>
      client.bulkUpdateKeywords(bulkKeywordPayload(input), implicitRequestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_run_rank_check",
    {
      description:
        "Run a rank check for one keyword. By default the check runs synchronously and returns " +
        "the completed result. Set async to true to enqueue the check and return a running rank " +
        "check immediately; poll it with bisibility_get_rank_check_result.",
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
    server,
    "bisibility_get_rank_history",
    {
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
    server,
    "bisibility_export_rank_history",
    {
      description:
        "Export project rank history as cursor-paginated JSON for reports and analysis. " +
        "For full streamed CSV dumps, use the REST endpoint directly.",
      inputSchema: exportRankHistoryInputSchema,
      title: "Export project rank history",
    },
    async (input) => client.exportRankHistory(input.project_id, exportRankHistoryOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_sitemap_monitors",
    {
      description:
        "List the project sitemap monitor, including its status and latest snapshot summary.",
      inputSchema: listSitemapMonitorsInputSchema,
      title: "List sitemap monitors",
    },
    async (input) => client.listSitemapMonitors(input.project_id),
  );

  registerTool(
    server,
    "bisibility_enable_sitemap_monitor",
    {
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
    server,
    "bisibility_disable_sitemap_monitor",
    {
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
    server,
    "bisibility_get_rank_check_result",
    {
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
    server,
    "bisibility_create_signal",
    {
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
    server,
    "bisibility_list_signals",
    {
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
    server,
    "bisibility_list_traffic_snapshots",
    {
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
    server,
    "bisibility_list_search_performance_query_stats",
    {
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
    server,
    "bisibility_sync_project_traffic",
    {
      description:
        "Synchronize traffic snapshots from the project's own connected analytics accounts now. " +
        "Provider rate limits and connection authorization rules apply.",
      inputSchema: syncProjectTrafficInputSchema,
      title: "Synchronize project traffic",
    },
    async (input) => client.syncProjectTraffic(input.project_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_api_keys",
    {
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
    server,
    "bisibility_create_api_key",
    {
      description:
        "Create a new API key for the authenticated project. The raw token is returned once in " +
        "the response and cannot be retrieved again; store it securely.",
      inputSchema: createApiKeyInputSchema,
      title: "Create API key",
    },
    async (input) => client.createApiKey({ name: input.name }, implicitRequestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_revoke_api_key",
    {
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
    server,
    "bisibility_list_project_api_keys",
    {
      description: "List API keys scoped to a specific project, including revoked keys.",
      inputSchema: listProjectApiKeysInputSchema,
      title: "List project API keys",
    },
    async (input) => client.listProjectApiKeys(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_create_project_api_key",
    {
      description:
        "Create a project-scoped API key for CI or automation. The raw key is returned once.",
      inputSchema: createProjectApiKeyInputSchema,
      title: "Create project API key",
    },
    async (input) =>
      client.createProjectApiKey(input.project_id, { name: input.name }, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_personal_tokens",
    {
      description: "List the user's personal access tokens. Requires an admin PAT.",
      inputSchema: listPersonalTokensInputSchema,
      title: "List personal tokens",
    },
    async () => client.listMyTokens(),
  );

  registerTool(
    server,
    "bisibility_create_personal_token",
    {
      description:
        "Create a personal access token. The raw account-wide token is returned once. Requires an admin PAT.",
      inputSchema: createPersonalTokenInputSchema,
      title: "Create personal token",
    },
    async (input) => client.createMyToken(createPersonalTokenPayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_revoke_personal_token",
    {
      description:
        'Revoke a personal token by id, or pass "current" to revoke the configured token.',
      inputSchema: revokePersonalTokenInputSchema,
      title: "Revoke personal token",
    },
    async (input) => client.revokeMyToken(input.token_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_webhooks",
    {
      description: "List webhook endpoints for a project.",
      inputSchema: listWebhooksInputSchema,
      title: "List webhooks",
    },
    async (input) => client.listWebhooks(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_create_webhook",
    {
      description: "Create a webhook endpoint. The HMAC secret is write-only.",
      inputSchema: createWebhookInputSchema,
      title: "Create webhook",
    },
    async (input) =>
      client.createWebhook(input.project_id, createWebhookPayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_update_webhook",
    {
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
    server,
    "bisibility_delete_webhook",
    {
      description: "Delete a webhook endpoint. Requires admin access.",
      inputSchema: deleteWebhookInputSchema,
      title: "Delete webhook",
    },
    async (input) =>
      client.deleteWebhook(input.project_id, input.webhook_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_alert_rules",
    {
      description: "List alert rules for a project.",
      inputSchema: listAlertRulesInputSchema,
      title: "List alert rules",
    },
    async (input) => client.listAlertRules(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_create_alert_rule",
    {
      description:
        "Create an alert rule for project rank changes, thresholds, SERP features, or competitors.",
      inputSchema: createAlertRuleInputSchema,
      title: "Create alert rule",
    },
    async (input) =>
      client.createAlertRule(input.project_id, alertRulePayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_update_alert_rule",
    {
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
    server,
    "bisibility_delete_alert_rule",
    {
      description: "Delete an alert rule by rule id. Use only after the user confirms deletion.",
      inputSchema: deleteAlertRuleInputSchema,
      title: "Delete alert rule",
    },
    async (input) => client.deleteAlertRule(input.rule_id, implicitRequestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_triggered_alerts",
    {
      description: "List triggered alerts for a project.",
      inputSchema: listTriggeredAlertsInputSchema,
      title: "List triggered alerts",
    },
    async (input) => client.listTriggeredAlerts(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_mute_triggered_alert",
    {
      description:
        "Mute one firing alert for 24 hours. This changes shared alert state for the whole project team.",
      inputSchema: muteTriggeredAlertInputSchema,
      title: "Mute triggered alert",
    },
    async (input) =>
      client.muteTriggeredAlert(input.project_id, input.alert_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_mark_project_alerts_read",
    {
      description: "Mark every firing alert in the project as read for the whole project team.",
      inputSchema: markProjectAlertsReadInputSchema,
      title: "Mark project alerts read",
    },
    async (input) => client.markProjectAlertsRead(input.project_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_team_members",
    {
      description: "List team members for a project.",
      inputSchema: listTeamMembersInputSchema,
      title: "List team members",
    },
    async (input) => client.listTeamMembers(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_team_invites",
    {
      description: "List pending team invites for a project.",
      inputSchema: listTeamInvitesInputSchema,
      title: "List team invites",
    },
    async (input) => client.listTeamInvites(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_create_team_invite",
    {
      description: "Invite a user to a project team with an admin, member, or viewer role.",
      inputSchema: createTeamInviteInputSchema,
      title: "Create team invite",
    },
    async (input) =>
      client.createTeamInvite(input.project_id, teamInvitePayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_revoke_team_invite",
    {
      description: "Revoke a pending project team invite.",
      inputSchema: revokeTeamInviteInputSchema,
      title: "Revoke team invite",
    },
    async (input) =>
      client.revokeTeamInvite(input.project_id, input.invite_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_resend_team_invite",
    {
      description: "Resend a pending team invitation and replace its expiration and token.",
      inputSchema: resendTeamInviteInputSchema,
      title: "Resend team invite",
    },
    async (input) =>
      client.resendTeamInvite(input.project_id, input.invite_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_update_team_member_role",
    {
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
    server,
    "bisibility_remove_team_member",
    {
      description:
        "Permanently remove a non-owner project member. Confirm the user's intent before calling this tool.",
      inputSchema: removeTeamMemberInputSchema,
      title: "Remove team member",
    },
    async (input) =>
      client.removeTeamMember(input.project_id, input.member_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_providers",
    {
      description: "List provider connection options and status for a project.",
      inputSchema: listProvidersInputSchema,
      title: "List providers",
    },
    async (input) => client.listProviders(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_connect_provider",
    {
      description:
        "Connect or update credentials for a project provider. SERP providers are dataforseo " +
        "and serpapi; analytics providers are ga4, gsc, and plausible. Self-hosted providers " +
        "such as Plausible accept an optional credentials.endpoint base URL.",
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
    server,
    "bisibility_test_provider_connection",
    {
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
    server,
    "bisibility_update_provider_settings",
    {
      description: "Update provider settings such as enabled state, priority, or primary status.",
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
    server,
    "bisibility_set_provider_enabled",
    {
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
    server,
    "bisibility_set_provider_priority",
    {
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
    server,
    "bisibility_set_primary_provider",
    {
      description: "Set or clear a provider as the primary project provider.",
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
    server,
    "bisibility_disconnect_provider",
    {
      description:
        "Disconnect a provider from a project. Use only after the user confirms deletion.",
      inputSchema: providerActionInputSchema,
      title: "Disconnect provider",
    },
    async (input) =>
      client.disconnectProvider(input.project_id, input.provider_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_saved_views",
    {
      description: "List saved keyword views for a project.",
      inputSchema: listSavedViewsInputSchema,
      title: "List saved views",
    },
    async (input) => client.listSavedViews(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_create_saved_view",
    {
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
    server,
    "bisibility_delete_saved_view",
    {
      description: "Delete a project saved view. Use only after the user confirms deletion.",
      inputSchema: deleteSavedViewInputSchema,
      title: "Delete saved view",
    },
    async (input) => client.deleteSavedView(input.project_id, input.view_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_list_competitors",
    {
      description: "List tracked competitors, market data, and suggestions for a project.",
      inputSchema: listCompetitorsInputSchema,
      title: "List competitors",
    },
    async (input) => client.listCompetitors(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_add_competitor",
    {
      description: "Add a tracked competitor domain to a project.",
      inputSchema: addCompetitorInputSchema,
      title: "Add competitor",
    },
    async (input) =>
      client.addCompetitor(input.project_id, competitorPayload(input), requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_remove_competitor",
    {
      description: "Remove a tracked competitor from a project.",
      inputSchema: removeCompetitorInputSchema,
      title: "Remove competitor",
    },
    async (input) =>
      client.removeCompetitor(input.project_id, input.competitor_id, requestOptions(input)),
  );

  registerTool(
    server,
    "bisibility_get_notification_preferences",
    {
      description: "Get notification preferences for a project.",
      inputSchema: getNotificationPreferencesInputSchema,
      title: "Get notification preferences",
    },
    async ({ project_id }) => client.getNotificationPreferences(project_id),
  );

  registerTool(
    server,
    "bisibility_update_notification_preferences",
    {
      description: "Update project notification preferences.",
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
    server,
    "bisibility_list_migration_tokens",
    {
      description: "List active migration tokens for a project.",
      inputSchema: listMigrationTokensInputSchema,
      title: "List migration tokens",
    },
    async (input) => client.listMigrationTokens(input.project_id, paginationOptions(input)),
  );

  registerTool(
    server,
    "bisibility_mint_migration_token",
    {
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
    server,
    "bisibility_revoke_migration_token",
    {
      description: "Revoke a project migration token.",
      inputSchema: revokeMigrationTokenInputSchema,
      title: "Revoke migration token",
    },
    async (input) =>
      client.revokeMigrationToken(input.project_id, input.token_id, requestOptions(input)),
  );
}
