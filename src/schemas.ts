import * as z from "zod/v4";

export const idInput = z.string().trim().min(1).max(160);
export const deviceInput = z.enum(["desktop", "mobile"]);
export const rankCheckFrequencyValues = [
  "paused",
  "manual",
  "daily",
  "weekly",
  "monthly",
  "custom_cron",
] as const;
export const rankCheckFrequencyInput = z.enum(rankCheckFrequencyValues);
export const alertConditionTypeInput = z.enum([
  "change_pct",
  "competitor_overtake",
  "enters_top_n",
  "exits_top_n",
  "serp_feature",
  "threshold",
]);
export const alertChannelInput = z.enum(["email", "slack", "webhook"]);
export const alertTargetTypeInput = z.enum(["all", "keyword", "tag"]);
export const teamInviteRoleInput = z.enum(["admin", "member", "viewer"]);
export const migrationScopeInput = z.enum(["full", "keywords"]);
export const savedViewChangeFilterInput = z.enum(["any", "down", "lost", "new", "up"]);
// Country and SERP filters are validated server-side against the data-driven
// market list, so accept any string here instead of a stale hardcoded enum.
// Known values are documented in the create-saved-view tool description.
export const savedViewCountryFilterInput = z.string().trim().min(1).max(80);
export const savedViewDeviceFilterInput = z.enum(["all", "desktop", "mobile"]);
export const savedViewPositionFilterInput = z.enum(["11-50", "51-100", "top10", "top3"]);
export const savedViewSerpFilterInput = z.string().trim().min(1).max(80);
// Provider ids are registry-driven and validated server-side. Keep known values
// in the description without rejecting providers added after this MCP release.
export const providerIdInput = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .describe("Provider id. Known values: dataforseo, serpapi, ga4, gsc, plausible.");
export const signalSourceInput = z.enum([
  "api",
  "cms",
  "deploy",
  "manual",
  "rank_tracker",
  "search_analytics",
  "search_engine_status",
  "sitemap",
  "url_inspection",
]);
export const createSignalSourceInput = z.enum(["api", "cms", "deploy"]);
export const signalSeverityInput = z.enum(["critical", "info", "warning"]);
export const costEstimateFrequencyInput = rankCheckFrequencyInput.exclude([
  "paused",
  "manual",
  "custom_cron",
]);

const tagInput = z.string().trim().min(1).max(48);
const optionalLimitedText = (max: number) => z.string().trim().min(1).max(max).optional();
const nullableLimitedText = (max: number) =>
  z.string().trim().min(1).max(max).nullable().optional();
const providerSecretInput = z.string().trim().min(1).max(4096).optional();
const dateInput = z.iso.date();
const httpUrlInput = (field: string, max: number) =>
  z
    .url()
    .trim()
    .max(max)
    .regex(/^https?:\/\//i, { message: `${field} must use http or https.` });
export const locationKeyInput = z
  .string()
  .trim()
  .regex(/^[A-Z]{2}(\/[^/]{1,80}){0,2}$/, {
    message: 'location_key must look like "US" or "US/California/Los Angeles".',
  })
  .optional();

const keywordMarketInputs = {
  city: nullableLimitedText(120),
  intent: nullableLimitedText(80),
  location_key: locationKeyInput,
  topic: nullableLimitedText(80),
};

function isAbsoluteUrlOrPath(value: string) {
  if (value.startsWith("/")) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const targetUrlValueInput = z
  .string()
  .trim()
  .max(500)
  .refine(isAbsoluteUrlOrPath, {
    message: "Target URL must be an absolute URL or a path.",
  })
  .nullable();

export const targetUrlInput = targetUrlValueInput.optional();

export const keywordScheduleInput = z
  .object({
    auto_schedule: z.boolean().optional(),
    cron_expression: z.string().trim().min(1).max(120).nullable(),
    frequency: rankCheckFrequencyInput,
    jitter_minutes: z.number().int().min(0).max(1440).optional(),
    timezone: z.string().trim().min(1).max(80).optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.frequency === "custom_cron" && !value.cron_expression) {
      ctx.addIssue({
        code: "custom",
        message: "Custom cron schedules require a cron expression.",
        path: ["cron_expression"],
      });
    }
  });

export const paginationInput = {
  cursor: optionalLimitedText(512),
  limit: z.number().int().min(1).max(200).optional(),
};

export const requestOptionsInput = {
  idempotency_key: optionalLimitedText(160),
};

export const projectSelectionInput = {
  project_id: idInput.optional(),
};

export const emptyInputSchema = z.object({}).strict();

export const getCostEstimateInputSchema = z
  .object({
    devices: z
      .number()
      .int()
      .min(1)
      .max(2)
      .optional()
      .describe("Device count per keyword (1 or 2). Defaults to 1."),
    frequency: costEstimateFrequencyInput
      .optional()
      .describe("Rank-check frequency used to estimate monthly checks. Defaults to daily."),
    keywords: z.number().int().min(0).max(100000).describe("Keyword count to estimate for."),
    locations: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Location count per keyword. Defaults to 1."),
    option: optionalLimitedText(80).describe(
      'Flat-rate provider option key, for example "standard", "priority", or "live".',
    ),
    plan: optionalLimitedText(80).describe(
      "Plan-model provider plan key; unknown values use auto selection.",
    ),
    provider: optionalLimitedText(80).describe(
      'Provider rate card to use. Defaults to "dataforseo".',
    ),
  })
  .strict();

// Project keys return one project; PATs return all memberships. The SDK's
// listProjects method returns the full set without pagination, so this tool
// takes no cursor/limit inputs.
export const listProjectsInputSchema = emptyInputSchema;

export const getMeInputSchema = emptyInputSchema;

export const updateMeInputSchema = z
  .object({
    ...requestOptionsInput,
    name: z.string().trim().min(1).max(120),
  })
  .strict();

export const createProjectInputSchema = z
  .object({
    ...requestOptionsInput,
    domain: z.string().trim().min(1).max(253),
    name: z.string().trim().min(1).max(120),
    tracking_scope: z.enum(["city", "country"]).optional(),
  })
  .strict();

export const listPersonalTokensInputSchema = emptyInputSchema;

export const createPersonalTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    expires_in_days: z.union([z.literal(30), z.literal(90), z.literal(365), z.null()]).optional(),
    name: z.string().trim().min(1).max(80),
    scope: z.enum(["admin", "read", "write"]).optional(),
  })
  .strict();

export const revokePersonalTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    token_id: idInput,
  })
  .strict();

export const listWebhooksInputSchema = z
  .object({ ...paginationInput, project_id: idInput })
  .strict();

export const createWebhookInputSchema = z
  .object({
    ...requestOptionsInput,
    description: z.string().trim().max(160).nullable().optional(),
    enabled: z.boolean().optional(),
    hmac_secret: z.string().trim().min(16).max(500),
    project_id: idInput,
    url: httpUrlInput("url", 500),
  })
  .strict();

export const updateWebhookInputSchema = z
  .object({
    ...requestOptionsInput,
    description: z.string().trim().max(160).nullable().optional(),
    enabled: z.boolean().optional(),
    hmac_secret: z.string().trim().min(16).max(500).optional(),
    project_id: idInput,
    url: httpUrlInput("url", 500).optional(),
    webhook_id: idInput,
  })
  .strict()
  .refine(
    (value) =>
      value.description !== undefined ||
      value.enabled !== undefined ||
      value.hmac_secret !== undefined ||
      value.url !== undefined,
    { message: "At least one webhook field is required." },
  );

export const deleteWebhookInputSchema = z
  .object({ ...requestOptionsInput, project_id: idInput, webhook_id: idInput })
  .strict();

export const createProjectApiKeyInputSchema = z
  .object({ ...requestOptionsInput, name: z.string().trim().min(1).max(80), project_id: idInput })
  .strict();

export const listProjectApiKeysInputSchema = z
  .object({ ...paginationInput, project_id: idInput })
  .strict();

export const getProjectInputSchema = z
  .object({
    project_id: idInput,
  })
  .strict();

export const updateProjectInputSchema = z
  .object({
    ...requestOptionsInput,
    domain: optionalLimitedText(253),
    name: optionalLimitedText(120),
    project_id: idInput,
  })
  .strict()
  .refine((value) => value.domain !== undefined || value.name !== undefined, {
    message: "domain or name is required.",
    path: ["name"],
  });

export const deleteProjectInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
  })
  .strict();

export const updateProjectDefaultsInputSchema = z
  .object({
    ...requestOptionsInput,
    auto_schedule: z.boolean().optional(),
    city: nullableLimitedText(120),
    country: optionalLimitedText(120),
    cron_expression: z.string().trim().min(1).max(120).nullable().optional(),
    device: deviceInput.optional(),
    frequency: rankCheckFrequencyInput,
    jitter_minutes: z.number().int().min(0).max(1440).optional(),
    location_key: locationKeyInput,
    project_id: idInput,
    timezone: optionalLimitedText(80),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.frequency === "custom_cron" && !value.cron_expression) {
      ctx.addIssue({
        code: "custom",
        message: "Custom cron schedules require a cron expression.",
        path: ["cron_expression"],
      });
    }
    const hasLocationKey = value.location_key !== undefined;
    const hasCountry = value.country !== undefined;
    const hasDevice = value.device !== undefined;
    if (!hasLocationKey && hasCountry !== hasDevice) {
      ctx.addIssue({
        code: "custom",
        message: "country and device must be provided together.",
        path: value.country === undefined ? ["country"] : ["device"],
      });
    }
  });

export const listApiKeysInputSchema = z
  .object({
    ...paginationInput,
    ...projectSelectionInput,
  })
  .strict();

export const createApiKeyInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    name: z.string().trim().min(1).max(80),
  })
  .strict();

export const revokeApiKeyInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    key_id: idInput,
  })
  .strict();

export const listKeywordsInputSchema = z
  .object({
    ...paginationInput,
    country: optionalLimitedText(120),
    device: deviceInput.optional(),
    intent: optionalLimitedText(80),
    position_gt: z.number().int().min(0).optional(),
    position_lt: z.number().int().min(0).optional(),
    project_id: idInput,
    search: optionalLimitedText(180),
    sort: z
      .enum([
        "created_at",
        "-created_at",
        "keyword",
        "-keyword",
        "text",
        "-text",
        "updated_at",
        "-updated_at",
      ])
      .optional(),
    tag: optionalLimitedText(48),
    topic: optionalLimitedText(80),
  })
  .strict();

export const listRankedKeywordSuggestionsInputSchema = z
  .object({
    connection_id: idInput.optional(),
    fresh: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).max(900).multipleOf(100).optional(),
    project_id: idInput,
  })
  .strict();

export const researchKeywordsInputSchema = z
  .object({
    connection_id: idInput.optional(),
    estimate_only: z
      .boolean()
      .optional()
      .describe("Return a free cost estimate without calling the provider or spending budget."),
    fresh: z.boolean().optional(),
    include_clickstream: z.boolean().optional(),
    max_cost_cents: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Best-effort maximum provider cost for this request, in cents."),
    mode: z.enum(["auto", "related", "suggestions", "ideas"]).optional(),
    project_id: idInput,
    result_limit: z.union([z.literal(100), z.literal(300), z.literal(500)]).optional(),
    seed: z.string().trim().min(1).max(80),
  })
  .strict();

export const getKeywordMetricsInputSchema = z
  .object({
    connection_id: idInput.optional(),
    estimate_only: z
      .boolean()
      .optional()
      .describe("Return a free cost estimate without calling the provider or spending budget."),
    fresh: z.boolean().optional(),
    include_clickstream: z.boolean().optional(),
    keywords: z.array(z.string().trim().min(1).max(80)).min(1).max(700),
    max_cost_cents: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Best-effort maximum provider cost for this request, in cents."),
    project_id: idInput,
  })
  .strict();

export const exportRankHistoryInputSchema = z
  .object({
    ...paginationInput,
    granularity: z.enum(["daily", "weekly"]).optional(),
    keyword_id: z.array(idInput).max(500).optional(),
    project_id: idInput,
    range: z.enum(["30", "90", "all"]).optional(),
  })
  .strict();

export const listSitemapMonitorsInputSchema = z.object({ project_id: idInput }).strict();

export const updateSitemapMonitorInputSchema = z
  .object({
    ...requestOptionsInput,
    monitor_id: idInput,
    project_id: idInput,
  })
  .strict();

export const searchLocationsInputSchema = z
  .object({
    country: optionalLimitedText(120),
    limit: z.number().int().min(1).max(100).optional(),
    q: z.string().trim().min(2).max(120),
  })
  .strict();

export const keywordCreateItemInputSchema = z
  .object({
    ...keywordMarketInputs,
    country: optionalLimitedText(120),
    device: deviceInput.optional(),
    keyword: z.string().trim().min(1).max(180),
    location: optionalLimitedText(120),
    schedule: keywordScheduleInput.optional(),
    tags: z.array(tagInput).max(12).optional(),
    target_url: targetUrlInput,
  })
  .strict();

export const addKeywordsInputSchema = z
  .object({
    ...requestOptionsInput,
    ...keywordMarketInputs,
    country: optionalLimitedText(120),
    device: deviceInput.optional(),
    keywords: z
      .array(z.union([z.string().trim().min(1).max(180), keywordCreateItemInputSchema]))
      .min(1)
      .max(500),
    location: optionalLimitedText(120),
    project_id: idInput,
    schedule: keywordScheduleInput.optional(),
    tags: z.array(tagInput).max(12).optional(),
    target_url: targetUrlInput,
  })
  .strict();

export const getKeywordInputSchema = z
  .object({
    ...projectSelectionInput,
    keyword_id: idInput,
  })
  .strict();

export const updateKeywordInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    ...keywordMarketInputs,
    country: optionalLimitedText(120),
    device: deviceInput.optional(),
    frequency: rankCheckFrequencyInput.optional(),
    keyword: optionalLimitedText(180),
    keyword_id: idInput,
    location: optionalLimitedText(120),
    schedule: keywordScheduleInput.optional(),
    tags: z.array(tagInput).max(12).optional(),
    target_url: targetUrlInput,
  })
  .strict();

export const setKeywordTargetUrlInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    keyword_id: idInput,
    target_url: targetUrlValueInput,
  })
  .strict();

export const deleteKeywordInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    keyword_id: idInput,
  })
  .strict();

export const keywordBulkInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    frequency: rankCheckFrequencyInput.optional(),
    keyword_ids: z.array(idInput).min(1).max(500),
    operation: z.enum(["add_tags", "delete", "remove_tags", "set_frequency", "set_target_url"]),
    schedule: keywordScheduleInput.optional(),
    tags: z.array(tagInput).max(12).optional(),
    target_url: targetUrlInput,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      (value.operation === "add_tags" || value.operation === "remove_tags") &&
      !value.tags?.length
    ) {
      ctx.addIssue({
        code: "custom",
        message: "tags are required for tag bulk operations.",
        path: ["tags"],
      });
    }
    if (value.operation === "set_frequency" && !value.frequency && !value.schedule) {
      ctx.addIssue({
        code: "custom",
        message: "frequency or schedule is required.",
        path: ["frequency"],
      });
    }
    if (value.operation === "set_target_url" && value.target_url === undefined) {
      ctx.addIssue({
        code: "custom",
        message: "target_url is required for set_target_url.",
        path: ["target_url"],
      });
    }
  });

export const runRankCheckInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    async: z.boolean().optional(),
    keyword_id: idInput,
    provider_id: providerIdInput
      .optional()
      .describe("SERP provider id, validated server-side. Known values: dataforseo and serpapi."),
  })
  .strict();

export const getRankHistoryInputSchema = z
  .object({
    ...paginationInput,
    ...projectSelectionInput,
    keyword_id: idInput,
    since: optionalLimitedText(80),
    status: z.enum(["completed", "failed"]).optional(),
    until: optionalLimitedText(80),
  })
  .strict();

export const getRankCheckResultInputSchema = z
  .object({
    ...projectSelectionInput,
    check_id: idInput,
  })
  .strict();

const signalPayloadLimitBytes = 8 * 1024;

export const signalPayloadInput = z.record(z.string(), z.unknown()).superRefine((value, ctx) => {
  let size = 0;
  try {
    size = new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    ctx.addIssue({ code: "custom", message: "payload must be JSON serializable." });
    return;
  }
  if (size > signalPayloadLimitBytes) {
    ctx.addIssue({ code: "custom", message: "payload must serialize to 8KB or less." });
  }
});

export const signalTypeInput = z
  .string()
  .trim()
  .regex(/^[a-z_]+\.[a-z_]+$/, {
    message: 'type must be dot-separated lowercase segments such as "deploy.completed".',
  });

export const createSignalInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    happened_at: optionalLimitedText(80).describe(
      "ISO-8601 date-time when the signal happened. Defaults to now on the server.",
    ),
    keyword_id: idInput.optional(),
    payload: signalPayloadInput
      .optional()
      .describe("JSON object payload. Serialized payloads above 8KB are rejected."),
    severity: signalSeverityInput.optional().describe('Signal severity. Defaults to "info".'),
    source: createSignalSourceInput,
    type: signalTypeInput.describe('Dot-separated signal type such as "deploy.completed".'),
    url: httpUrlInput("url", 2000).optional(),
  })
  .strict();

export const listSignalsInputSchema = z
  .object({
    ...paginationInput,
    from: optionalLimitedText(80).describe(
      "Only signals that happened at or after this ISO-8601 date-time.",
    ),
    project_id: idInput,
    source: signalSourceInput.optional(),
    to: optionalLimitedText(80).describe(
      "Only signals that happened at or before this ISO-8601 date-time.",
    ),
    type: signalTypeInput
      .max(160)
      .optional()
      .describe('Exact signal type filter such as "deploy.completed".'),
  })
  .strict();

export const listProjectResourcesInputSchema = z
  .object({
    ...paginationInput,
    project_id: idInput,
  })
  .strict();

const alertRuleInputShape = {
  change_pct: z.number().min(0).nullable().optional(),
  channels: z.array(alertChannelInput).min(1).max(3).optional(),
  condition_type: alertConditionTypeInput,
  competitor_domain: nullableLimitedText(253),
  enabled: z.boolean().optional(),
  name: z.string().trim().min(1).max(120),
  serp_feature: nullableLimitedText(80),
  target_ids: z.array(idInput).max(500).optional(),
  target_type: alertTargetTypeInput.optional(),
  threshold_position: z.number().int().min(1).max(100).nullable().optional(),
  top_n: z.number().int().min(1).max(100).nullable().optional(),
};

export const listAlertRulesInputSchema = listProjectResourcesInputSchema;

export const createAlertRuleInputSchema = z
  .object({
    ...requestOptionsInput,
    ...alertRuleInputShape,
    project_id: idInput,
  })
  .strict();

export const updateAlertRuleInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    ...alertRuleInputShape,
    rule_id: idInput,
  })
  .strict();

export const deleteAlertRuleInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    rule_id: idInput,
  })
  .strict();

export const listTriggeredAlertsInputSchema = listProjectResourcesInputSchema;

export const muteTriggeredAlertInputSchema = z
  .object({
    ...requestOptionsInput,
    alert_id: idInput,
    project_id: idInput,
  })
  .strict();

export const markProjectAlertsReadInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
  })
  .strict();

export const listTeamMembersInputSchema = listProjectResourcesInputSchema;

export const listTeamInvitesInputSchema = listProjectResourcesInputSchema;

export const createTeamInviteInputSchema = z
  .object({
    ...requestOptionsInput,
    email: z.email().trim().max(254),
    project_id: idInput,
    role: teamInviteRoleInput,
  })
  .strict();

export const revokeTeamInviteInputSchema = z
  .object({
    ...requestOptionsInput,
    invite_id: idInput,
    project_id: idInput,
  })
  .strict();

export const resendTeamInviteInputSchema = z
  .object({
    ...requestOptionsInput,
    invite_id: idInput,
    project_id: idInput,
  })
  .strict();

export const updateTeamMemberRoleInputSchema = z
  .object({
    ...requestOptionsInput,
    member_id: idInput,
    project_id: idInput,
    role: teamInviteRoleInput,
  })
  .strict();

export const removeTeamMemberInputSchema = z
  .object({
    ...requestOptionsInput,
    member_id: idInput,
    project_id: idInput,
  })
  .strict();

export const listTrafficSnapshotsInputSchema = z
  .object({
    end_date: dateInput,
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).optional(),
    paths: z.array(z.string().trim().min(1).max(500)).max(50).optional(),
    project_id: idInput,
    start_date: dateInput,
  })
  .strict();

export const listSearchPerformanceQueryStatsInputSchema = z
  .object({
    connection_id: idInput.optional(),
    end_date: dateInput,
    limit: z.number().int().min(1).max(1000).optional(),
    project_id: idInput,
    query: optionalLimitedText(1000),
    start_date: dateInput,
  })
  .strict();

export const syncProjectTrafficInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
  })
  .strict();

export const providerCredentialsInputSchema = z
  .object({
    api_key: providerSecretInput,
    endpoint: httpUrlInput("endpoint", 500)
      .optional()
      .describe("Base API URL for self-hosted provider instances, such as self-hosted Plausible."),
    login: providerSecretInput,
    secret: providerSecretInput,
  })
  .strict();

export const listProvidersInputSchema = listProjectResourcesInputSchema;

export const providerConnectionInputSchema = z
  .object({
    ...requestOptionsInput,
    cost_per_check: z.number().min(0).optional(),
    credentials: providerCredentialsInputSchema.optional(),
    enabled: z.boolean().optional(),
    login: providerSecretInput,
    primary: z.boolean().optional(),
    priority: z.number().int().min(0).max(10000).optional(),
    project_id: idInput,
    provider_id: providerIdInput,
    secret: providerSecretInput,
  })
  .strict();

export const testProviderConnectionInputSchema = z
  .object({
    credentials: providerCredentialsInputSchema.optional(),
    login: providerSecretInput,
    project_id: idInput,
    provider_id: providerIdInput,
    secret: providerSecretInput,
  })
  .strict();

export const updateProviderSettingsInputSchema = z
  .object({
    ...requestOptionsInput,
    enabled: z.boolean().optional(),
    primary: z.boolean().optional(),
    priority: z.number().int().min(0).max(10000).optional(),
    project_id: idInput,
    provider_id: providerIdInput,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (
      value.enabled === undefined &&
      value.primary === undefined &&
      value.priority === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        message: "At least one provider setting is required.",
        path: ["enabled"],
      });
    }
  });

export const setProviderEnabledInputSchema = z
  .object({
    ...requestOptionsInput,
    enabled: z.boolean(),
    project_id: idInput,
    provider_id: providerIdInput,
  })
  .strict();

export const providerActionInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
    provider_id: providerIdInput,
  })
  .strict();

export const setProviderPriorityInputSchema = z
  .object({
    ...requestOptionsInput,
    priority: z.number().int().min(0).max(10000),
    project_id: idInput,
    provider_id: providerIdInput,
  })
  .strict();

export const setPrimaryProviderInputSchema = z
  .object({
    ...requestOptionsInput,
    primary: z.boolean().optional(),
    project_id: idInput,
    provider_id: providerIdInput,
  })
  .strict();

export const savedViewFiltersInputSchema = z
  .object({
    change: savedViewChangeFilterInput,
    contains: z.string().trim().max(180),
    country: savedViewCountryFilterInput,
    device: savedViewDeviceFilterInput,
    position: z.array(savedViewPositionFilterInput).max(4),
    serp: z.array(savedViewSerpFilterInput).max(6),
    tags: z.array(tagInput).max(12),
    vol_max: z.number().min(0),
    vol_min: z.number().min(0),
    wrong_url: z.boolean(),
  })
  .strict();

export const savedViewConfigInputSchema = z
  .object({
    filters: savedViewFiltersInputSchema,
    search: z.string().trim().max(180),
  })
  .strict();

export const listSavedViewsInputSchema = listProjectResourcesInputSchema;

export const createSavedViewInputSchema = z
  .object({
    ...requestOptionsInput,
    config: savedViewConfigInputSchema,
    name: z.string().trim().min(1).max(120),
    project_id: idInput,
  })
  .strict();

export const deleteSavedViewInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
    view_id: idInput,
  })
  .strict();

export const listCompetitorsInputSchema = listProjectResourcesInputSchema;

export const addCompetitorInputSchema = z
  .object({
    ...requestOptionsInput,
    domain: z.string().trim().min(1).max(253),
    label: optionalLimitedText(120),
    project_id: idInput,
  })
  .strict();

export const removeCompetitorInputSchema = z
  .object({
    ...requestOptionsInput,
    competitor_id: idInput,
    project_id: idInput,
  })
  .strict();

const notificationPreferenceInput = z.boolean().optional();

export const getNotificationPreferencesInputSchema = z
  .object({
    project_id: idInput,
  })
  .strict();

export const updateNotificationPreferencesInputSchema = z
  .object({
    ...requestOptionsInput,
    alert_email: notificationPreferenceInput,
    alert_in_app: notificationPreferenceInput,
    alert_slack: notificationPreferenceInput,
    alert_webhook: notificationPreferenceInput,
    check_email: notificationPreferenceInput,
    check_in_app: notificationPreferenceInput,
    import_email: notificationPreferenceInput,
    import_in_app: notificationPreferenceInput,
    invite_email: notificationPreferenceInput,
    invite_in_app: notificationPreferenceInput,
    project_id: idInput,
  })
  .strict()
  .superRefine((value, ctx) => {
    const hasPreference = [
      value.alert_email,
      value.alert_in_app,
      value.alert_slack,
      value.alert_webhook,
      value.check_email,
      value.check_in_app,
      value.import_email,
      value.import_in_app,
      value.invite_email,
      value.invite_in_app,
    ].some((item) => item !== undefined);

    if (!hasPreference) {
      ctx.addIssue({
        code: "custom",
        message: "At least one notification preference is required.",
        path: ["alert_email"],
      });
    }
  });

export const listMigrationTokensInputSchema = listProjectResourcesInputSchema;

export const mintMigrationTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
    scope: migrationScopeInput.optional(),
  })
  .strict();

export const revokeMigrationTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: idInput,
    token_id: idInput,
  })
  .strict();
