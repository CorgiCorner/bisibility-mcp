import * as z from "zod/v4";

export const publicIdPrefixes = [
  "al",
  "alr",
  "audit",
  "check",
  "cmp",
  "conn",
  "dwh",
  "ferry",
  "imp",
  "inv",
  "key",
  "kw",
  "mbr",
  "ntf",
  "pat",
  "prj",
  "sid",
  "sig",
  "svkw",
  "tag",
  "usr",
  "viw",
  "we",
] as const;

export type PublicIdPrefix = (typeof publicIdPrefixes)[number];
export type PublicIdForPrefix<Prefix extends PublicIdPrefix> = `${Prefix}_${string}`;

const publicIdPrefixSet = new Set<string>(publicIdPrefixes);
const publicIdSuffixPattern = /^[a-z][a-z0-9]{23}$/;

function publicIdPattern(prefix: PublicIdPrefix) {
  if (!publicIdPrefixSet.has(prefix)) {
    throw new Error(`Unsupported public ID prefix: ${prefix}.`);
  }
  // This interpolation is safe: prefix is checked against the closed registry above.
  // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
  return new RegExp(`^${prefix}_[a-z][a-z0-9]{23}$`);
}

function matchesPublicId(value: string, prefix: PublicIdPrefix) {
  const expectedPrefix = `${prefix}_`;
  return (
    value.startsWith(expectedPrefix) &&
    publicIdSuffixPattern.test(value.slice(expectedPrefix.length))
  );
}

export function assertPublicId<Prefix extends PublicIdPrefix>(
  value: string,
  prefix: Prefix,
): asserts value is PublicIdForPrefix<Prefix> {
  if (!matchesPublicId(value, prefix)) {
    throw new Error(`Expected a ${prefix}_ public ID.`);
  }
}

export function parsePublicId<Prefix extends PublicIdPrefix>(
  value: string,
  prefix: Prefix,
): PublicIdForPrefix<Prefix> {
  assertPublicId(value, prefix);
  return value;
}

export const publicIdInput = <Prefix extends PublicIdPrefix>(prefix: Prefix) =>
  z
    .string()
    .trim()
    .regex(publicIdPattern(prefix), {
      message: `Expected a ${prefix}_ public ID.`,
    })
    .transform((value) => parsePublicId(value, prefix));

const alertIdInput = publicIdInput("al").describe(
  "Identifier of the triggered alert to operate on.",
);
const checkIdInput = publicIdInput("check").describe("Identifier of the rank check to retrieve.");
const competitorIdInput = publicIdInput("cmp").describe(
  "Identifier of the competitor to operate on.",
);
const connectionIdInput = publicIdInput("conn").describe(
  "Identifier of the provider connection to operate on.",
);
const inviteIdInput = publicIdInput("inv").describe(
  "Identifier of the team invitation to operate on.",
);
const keyIdInput = publicIdInput("key").describe("Identifier of the API key to operate on.");
const keywordIdInput = publicIdInput("kw").describe(
  "Identifier of the tracked keyword to operate on.",
);
const memberIdInput = publicIdInput("mbr").describe(
  "Identifier of the project member to operate on.",
);
const migrationTokenIdInput = publicIdInput("ferry").describe(
  "Identifier of the migration token to operate on.",
);
const personalAccessTokenIdInput = publicIdInput("pat").describe(
  "Identifier of the personal access token to operate on.",
);
export const projectIdInput = publicIdInput("prj").describe(
  "Identifier of the bisibility project to operate on; list_projects returns valid project ids.",
);
const ruleIdInput = publicIdInput("alr").describe("Identifier of the alert rule to operate on.");
const savedKeywordIdInput = publicIdInput("svkw").describe(
  "Identifier of the saved keyword to delete.",
);
const viewIdInput = publicIdInput("viw").describe("Identifier of the saved view to operate on.");
const webhookIdInput = publicIdInput("we").describe(
  "Identifier of the webhook endpoint to operate on.",
);
export const deviceInput = z
  .enum(["desktop", "mobile"])
  .describe("Device whose search or ranking data is being selected.");
export const rankCheckFrequencyValues = [
  "paused",
  "manual",
  "daily",
  "weekly",
  "monthly",
  "custom_cron",
] as const;
export const rankCheckFrequencyInput = z
  .enum(rankCheckFrequencyValues)
  .describe("Schedule frequency that determines when rank checks run.");
export const alertConditionTypeInput = z
  .enum([
    "change_pct",
    "competitor_overtake",
    "ctr_drop",
    "downtrend",
    "enters_top_n",
    "exits_top_n",
    "position_drop",
    "serp_feature",
    "threshold",
    "url_mismatch",
  ])
  .describe("Condition that determines when the alert rule fires.");
export const alertChannelInput = z.enum(["email", "slack", "webhook"]);
export const alertTargetTypeInput = z.enum(["all", "keyword", "tag"]);
export const teamInviteRoleInput = z
  .enum(["admin", "member", "viewer"])
  .describe("Project role to grant to the invited or existing team member.");
export const migrationScopeInput = z.enum(["full", "keywords"]);
export const savedViewChangeFilterInput = z
  .enum(["any", "down", "lost", "new", "up"])
  .describe("Ranking change category included in the saved view.");
// Country and SERP filters are validated server-side against the data-driven
// market list, so accept any string here instead of a stale hardcoded enum.
// Known values are documented in the create-saved-view tool description.
export const savedViewCountryFilterInput = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .describe("Country filter stored in the saved view.");
export const savedViewDeviceFilterInput = z
  .enum(["all", "desktop", "mobile"])
  .describe("Device filter stored in the saved view.");
export const savedViewPositionFilterInput = z
  .enum(["11-50", "51-100", "top10", "top3"])
  .describe("Ranking position range stored in the saved view.");
export const savedViewSerpFilterInput = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .describe("SERP feature filter stored in the saved view.");
// Provider ids are registry-driven and validated server-side. Keep known values
// in the description without rejecting providers added after this MCP release.
export const providerIdInput = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .describe("Provider id. Known values: dataforseo, serpapi, ga4, gsc, plausible.");
export const signalSourceInput = z
  .enum([
    "api",
    "cms",
    "deploy",
    "manual",
    "rank_tracker",
    "search_analytics",
    "search_engine_status",
    "sitemap",
    "url_inspection",
  ])
  .describe("System or workflow that produced the signal.");
export const createSignalSourceInput = z
  .enum(["api", "cms", "deploy"])
  .describe("System or workflow that produced the new signal.");
export const signalSeverityInput = z.enum(["critical", "info", "warning"]);
export const costEstimateFrequencyInput = rankCheckFrequencyInput.exclude([
  "paused",
  "manual",
  "custom_cron",
]);

const tagInput = z.string().trim().min(1).max(48).describe("Tag label assigned to the keyword.");
const optionalLimitedText = (max: number) => z.string().trim().min(1).max(max).optional();
const nullableLimitedText = (max: number) =>
  z.string().trim().min(1).max(max).nullable().optional();
const providerSecretInput = z.string().trim().min(1).max(4096).optional();
const dateInput = z.iso.date().describe("Calendar date delimiting the requested reporting period.");
const httpUrlInput = (field: string, max: number) =>
  z
    .url()
    .trim()
    .max(max)
    .regex(/^https?:\/\//i, { message: `${field} must use http or https.` })
    .describe(`${field} HTTP or HTTPS URL supplied by the endpoint owner.`);
export const locationKeyInput = z
  .string()
  .trim()
  .regex(/^[A-Z]{2}(\/[^/@]{1,80}){0,2}(@[a-z]{2,3}(-[a-z0-9]{2,8})?)?$/, {
    message:
      'location_key must look like "US", "US/California/Los Angeles", or "ES/Andalusia/Malaga@en".',
  })
  .describe(
    "Canonical country, region, or city key. Append @language for a non-default language pair; an unqualified key uses the country's default language.",
  )
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
  .nullable()
  .describe("Canonical destination URL or site-relative path to associate with the keyword.");

export const targetUrlInput = targetUrlValueInput.optional();

export const keywordScheduleInput = z
  .object({
    cron_expression: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .nullable()
      .describe("Cron expression for custom_cron schedules; use null for other frequencies."),
    frequency: rankCheckFrequencyInput,
    jitter_minutes: z.number().int().min(0).max(120).optional(),
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
  project_id: projectIdInput.optional(),
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
    name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .describe("Display name chosen for your bisibility account."),
  })
  .strict();

export const createProjectInputSchema = z
  .object({
    ...requestOptionsInput,
    domain: z.string().trim().min(1).max(253).describe("Primary domain the new project tracks."),
    name: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .describe("Human-readable name chosen for the new project."),
    tracking_scope: z.enum(["city", "country"]).optional(),
  })
  .strict();

export const listPersonalTokensInputSchema = emptyInputSchema;

export const createPersonalTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    expires_in_days: z.union([z.literal(30), z.literal(90), z.literal(365), z.null()]).optional(),
    name: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .describe("Label you choose to identify the personal token."),
    scope: z.enum(["admin", "read", "write"]).optional(),
  })
  .strict();

export const revokePersonalTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    token_id: personalAccessTokenIdInput,
  })
  .strict();

export const listWebhooksInputSchema = z
  .object({ ...paginationInput, project_id: projectIdInput })
  .strict();

export const createWebhookInputSchema = z
  .object({
    ...requestOptionsInput,
    description: z.string().trim().max(160).nullable().optional(),
    enabled: z.boolean().optional(),
    hmac_secret: z
      .string()
      .trim()
      .min(16)
      .max(500)
      .describe("Secret you provide to sign webhook deliveries with HMAC."),
    project_id: projectIdInput,
    url: httpUrlInput("url", 500),
  })
  .strict();

export const updateWebhookInputSchema = z
  .object({
    ...requestOptionsInput,
    description: z.string().trim().max(160).nullable().optional(),
    enabled: z.boolean().optional(),
    hmac_secret: z.string().trim().min(16).max(500).optional(),
    project_id: projectIdInput,
    url: httpUrlInput("url", 500).optional(),
    webhook_id: webhookIdInput,
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
  .object({ ...requestOptionsInput, project_id: projectIdInput, webhook_id: webhookIdInput })
  .strict();

export const createProjectApiKeyInputSchema = z
  .object({
    ...requestOptionsInput,
    name: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .describe("Label you choose to identify the project API key."),
    project_id: projectIdInput,
  })
  .strict();

export const listProjectApiKeysInputSchema = z
  .object({ ...paginationInput, project_id: projectIdInput })
  .strict();

export const getProjectInputSchema = z
  .object({
    project_id: projectIdInput,
  })
  .strict();

export const getProjectDefaultsInputSchema = z
  .object({
    project_id: projectIdInput,
  })
  .strict();

export const updateProjectInputSchema = z
  .object({
    ...requestOptionsInput,
    domain: optionalLimitedText(253),
    name: optionalLimitedText(120),
    project_id: projectIdInput,
  })
  .strict()
  .refine((value) => value.domain !== undefined || value.name !== undefined, {
    message: "domain or name is required.",
    path: ["name"],
  });

export const deleteProjectInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
  })
  .strict();

export const updateProjectDefaultsInputSchema = z
  .object({
    ...requestOptionsInput,
    city: nullableLimitedText(120),
    country: optionalLimitedText(120),
    cron_expression: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .nullable()
      .optional()
      .describe("Cron expression used when frequency is custom_cron; otherwise null."),
    device: deviceInput.optional(),
    frequency: rankCheckFrequencyInput,
    jitter_minutes: z.number().int().min(0).max(120).optional(),
    location_key: locationKeyInput,
    project_id: projectIdInput,
    serp_stop_on_match: z
      .boolean()
      .optional()
      .describe("Set false to fetch the full configured depth for competitor snapshots."),
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
    expires_in_days: z
      .union([z.literal(30), z.literal(90), z.literal(365), z.null()])
      .optional()
      .describe("Lifetime in days. Use null for no expiry."),
    name: z.string().trim().min(1).max(80).describe("Label you choose to identify the API key."),
    scope: z
      .enum(["read", "write", "admin"])
      .default("admin")
      .describe("Access tier. When omitted, defaults to admin for backward compatibility."),
  })
  .strict();

export const revokeApiKeyInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    key_id: keyIdInput,
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
    project_id: projectIdInput,
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
    connection_id: connectionIdInput.optional(),
    fresh: z.boolean().optional(),
    limit: z.number().int().min(1).max(100).optional(),
    offset: z.number().int().min(0).max(900).multipleOf(100).optional(),
    project_id: projectIdInput,
  })
  .strict();

export const researchKeywordsInputSchema = z
  .object({
    connection_id: connectionIdInput.optional(),
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
    project_id: projectIdInput,
    result_limit: z.union([z.literal(100), z.literal(300), z.literal(500)]).optional(),
    seed: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .describe("Keyword or phrase used as the starting point for research."),
  })
  .strict();

export const analyzeBacklinksInputSchema = z
  .object({
    estimate_only: z
      .boolean()
      .optional()
      .describe("Return a free cost estimate without calling the provider or spending budget."),
    fresh: z
      .boolean()
      .optional()
      .describe("Bypass the current cached snapshot and request fresh provider data."),
    include_subdomains: z
      .boolean()
      .optional()
      .describe("Include backlinks to subdomains for site targets. Ignored for page targets."),
    max_cost_cents: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Best-effort maximum provider cost for this request, in cents."),
    mode: z
      .enum(["as_is", "one_per_domain"])
      .optional()
      .describe("Return backlinks as provided or denoise to one backlink per referring domain."),
    project_id: projectIdInput.describe("Project id whose provider budget and snapshot are used."),
    result_limit: z
      .union([z.literal(100), z.literal(300), z.literal(500), z.literal(1000)])
      .optional()
      .describe("Maximum number of backlink rows to fetch: 100, 300, 500, or 1000."),
    target: z.string().trim().min(1).max(2048).describe("Domain or full page URL to analyze."),
    target_scope: z
      .enum(["site", "page"])
      .optional()
      .describe("Analyze the whole site or one page. The API infers the scope when omitted."),
  })
  .strict();

export const loadMoreBacklinkRowsInputSchema = z
  .object({
    include_subdomains: z
      .boolean()
      .optional()
      .describe("Include backlinks to subdomains for site targets. Ignored for page targets."),
    limit: z
      .number()
      .int()
      .positive()
      .max(1000)
      .multipleOf(100)
      .optional()
      .describe("Number of additional rows to fetch, in multiples of 100 up to 1000."),
    project_id: projectIdInput.describe("Project id whose provider budget and snapshot are used."),
    target: z
      .string()
      .trim()
      .min(1)
      .max(2048)
      .describe("Domain or full page URL matching the current unexpired snapshot."),
    target_scope: z
      .enum(["site", "page"])
      .optional()
      .describe("Site or page scope matching the current unexpired snapshot."),
  })
  .strict();

const domainOverviewCommonInput = {
  fresh: z
    .boolean()
    .optional()
    .describe("Bypass cached module data and request fresh provider data."),
  language_code: z
    .string()
    .trim()
    .min(2)
    .max(12)
    .describe("Language code used for the provider lookup, for example en."),
  location_code: z
    .number()
    .int()
    .positive()
    .describe("Positive DataForSEO location code identifying the lookup market."),
  project_id: projectIdInput.describe(
    "Project id whose provider connection, budget, and Domain Overview snapshot are used.",
  ),
  scope_override: z
    .enum(["root", "subdomain"])
    .optional()
    .describe("Override automatic target scope detection with root-domain or subdomain scope."),
  target: z.string().trim().min(1).max(253).describe("Domain or subdomain to analyze."),
};

const domainOverviewMaxCostInput = z
  .number()
  .int()
  .nonnegative()
  .describe(
    "Maximum provider cost for this request, in cents. Use zero for an explicit cache-only attempt.",
  );

export const analyzeDomainOverviewInputSchema = z
  .object({
    ...domainOverviewCommonInput,
    estimate_only: z
      .boolean()
      .optional()
      .describe("Return a free cost estimate without calling the provider or spending budget."),
    keyword_limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Maximum ranked keyword rows to include in the initial report."),
    max_cost_cents: domainOverviewMaxCostInput.describe(
      "Maximum provider cost for this request, in cents. Use zero for an estimate or explicit cache-only attempt.",
    ),
    page_limit: z
      .number()
      .int()
      .min(1)
      .max(1000)
      .optional()
      .describe("Maximum relevant page rows to include in the initial report."),
  })
  .strict();

export const loadDomainOverviewHistoryInputSchema = z
  .object({
    ...domainOverviewCommonInput,
    max_cost_cents: domainOverviewMaxCostInput,
  })
  .strict();

const domainOverviewPageInput = {
  ...domainOverviewCommonInput,
  max_cost_cents: domainOverviewMaxCostInput,
  offset: z.number().int().nonnegative().describe("Zero-based provider row offset for this page."),
};

export const loadDomainOverviewKeywordsInputSchema = z
  .object({
    ...domainOverviewPageInput,
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .describe("Number of ranked keyword rows to load, from 1 through 100."),
  })
  .strict();

export const loadDomainOverviewPagesInputSchema = z
  .object({
    ...domainOverviewPageInput,
    limit: z
      .number()
      .int()
      .min(1)
      .max(1000)
      .describe("Number of relevant-page rows to load, from 1 through 1000."),
  })
  .strict();

export const getKeywordMetricsInputSchema = z
  .object({
    connection_id: connectionIdInput.optional(),
    estimate_only: z
      .boolean()
      .optional()
      .describe("Return a free cost estimate without calling the provider or spending budget."),
    fresh: z.boolean().optional(),
    include_clickstream: z.boolean().optional(),
    keywords: z
      .array(z.string().trim().min(1).max(80))
      .min(1)
      .max(700)
      .describe("Keywords to request metrics for, supplied as search phrases."),
    max_cost_cents: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Best-effort maximum provider cost for this request, in cents."),
    project_id: projectIdInput,
  })
  .strict();

export const exportRankHistoryInputSchema = z
  .object({
    ...paginationInput,
    granularity: z.enum(["daily", "weekly"]).optional(),
    keyword_ids: z
      .array(keywordIdInput)
      .max(500)
      .optional()
      .describe("Tracked keyword ids to include in the export."),
    project_id: projectIdInput,
    range: z.enum(["30", "90", "all"]).optional(),
  })
  .strict();

export const listSitemapMonitorsInputSchema = z.object({ project_id: projectIdInput }).strict();

export const updateSitemapMonitorInputSchema = z
  .object({
    ...requestOptionsInput,
    monitor_id: projectIdInput,
    project_id: projectIdInput,
  })
  .strict();

export const searchLocationsInputSchema = z
  .object({
    country: optionalLimitedText(120),
    limit: z.number().int().min(1).max(100).optional(),
    q: z
      .string()
      .trim()
      .min(2)
      .max(120)
      .describe("Location name or search phrase used to find matching markets."),
  })
  .strict();

export const keywordCreateItemInputSchema = z
  .object({
    ...keywordMarketInputs,
    country: optionalLimitedText(120),
    device: deviceInput.optional(),
    keyword: z.string().trim().min(1).max(180).describe("Search phrase to add to the project."),
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
      .max(500)
      .describe("Keyword phrases or keyword objects to add to the project."),
    location: optionalLimitedText(120),
    project_id: projectIdInput,
    schedule: keywordScheduleInput.optional(),
    tags: z.array(tagInput).max(12).optional(),
    target_url: targetUrlInput,
  })
  .strict();

export const getKeywordInputSchema = z
  .object({
    ...projectSelectionInput,
    keyword_id: keywordIdInput,
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
    keyword_id: keywordIdInput,
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
    keyword_id: keywordIdInput,
    target_url: targetUrlValueInput,
  })
  .strict();

export const deleteKeywordInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    keyword_id: keywordIdInput,
  })
  .strict();

export const keywordBulkInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    frequency: rankCheckFrequencyInput.optional(),
    keyword_ids: z
      .array(keywordIdInput)
      .min(1)
      .max(500)
      .describe("Keyword identifiers returned by the project's keyword list or create response."),
    operation: z
      .enum(["add_tags", "delete", "remove_tags", "set_frequency", "set_target_url"])
      .describe("Bulk change to apply to every supplied keyword id."),
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
    keyword_id: keywordIdInput,
    provider_id: providerIdInput
      .optional()
      .describe("SERP provider id, validated server-side. Known values: dataforseo and serpapi."),
  })
  .strict();

export const getRankHistoryInputSchema = z
  .object({
    ...paginationInput,
    ...projectSelectionInput,
    keyword_id: keywordIdInput,
    since: optionalLimitedText(80),
    status: z.enum(["completed", "failed"]).optional(),
    until: optionalLimitedText(80),
  })
  .strict();

export const getRankCheckResultInputSchema = z
  .object({
    ...projectSelectionInput,
    check_id: checkIdInput,
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
    keyword_id: keywordIdInput.optional(),
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
    project_id: projectIdInput,
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
    project_id: projectIdInput,
  })
  .strict();

const alertRuleInputShape = {
  change_pct: z.number().min(0.1).max(1000).nullable().optional(),
  channels: z.array(alertChannelInput).min(1).max(3).optional(),
  condition_type: alertConditionTypeInput,
  competitor_domain: nullableLimitedText(253),
  drop_positions: z.number().int().min(1).max(100).nullable().optional(),
  enabled: z.boolean().optional(),
  name: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .describe("Human-readable name chosen for the alert rule."),
  recipient_ids: z.array(publicIdInput("usr")).max(500).optional(),
  serp_feature: nullableLimitedText(80),
  severity: z
    .enum(["info", "warning", "urgent"])
    .optional()
    .describe("Alert severity. When omitted, the server chooses a condition-specific default."),
  target_ids: z
    .array(z.union([publicIdInput("kw"), publicIdInput("tag")]))
    .max(500)
    .optional(),
  target_type: alertTargetTypeInput.optional(),
  threshold_position: z.number().int().min(1).max(100).nullable().optional(),
  top_n: z.number().int().min(1).max(100).nullable().optional(),
};

function alertTargetPrefix(targetType: z.output<typeof alertTargetTypeInput> | undefined) {
  if (targetType === "keyword") {
    return "kw" as const;
  }
  if (targetType === "tag") {
    return "tag" as const;
  }
  return null;
}

function validateAlertTargets(
  value: {
    target_ids?: string[] | undefined;
    target_type?: z.output<typeof alertTargetTypeInput> | undefined;
  },
  ctx: z.RefinementCtx,
) {
  if (!value.target_ids?.length) return;

  const expectedPrefix = alertTargetPrefix(value.target_type);
  if (!expectedPrefix) {
    ctx.addIssue({
      code: "custom",
      message: "All-target rules cannot include target IDs.",
      path: ["target_ids"],
    });
    return;
  }

  for (const [index, targetId] of value.target_ids.entries()) {
    if (!matchesPublicId(targetId, expectedPrefix)) {
      ctx.addIssue({
        code: "custom",
        message: `Expected a ${expectedPrefix}_ public ID.`,
        path: ["target_ids", index],
      });
    }
  }
}

export const listAlertRulesInputSchema = listProjectResourcesInputSchema;

export const createAlertRuleInputSchema = z
  .object({
    ...requestOptionsInput,
    ...alertRuleInputShape,
    project_id: projectIdInput,
  })
  .strict()
  .superRefine(validateAlertTargets);

export const updateAlertRuleInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    ...alertRuleInputShape,
    rule_id: ruleIdInput,
  })
  .strict()
  .superRefine(validateAlertTargets);

export const deleteAlertRuleInputSchema = z
  .object({
    ...requestOptionsInput,
    ...projectSelectionInput,
    rule_id: ruleIdInput,
  })
  .strict();

export const listTriggeredAlertsInputSchema = listProjectResourcesInputSchema;

export const muteTriggeredAlertInputSchema = z
  .object({
    ...requestOptionsInput,
    alert_id: alertIdInput,
    project_id: projectIdInput,
  })
  .strict();

export const markProjectAlertsReadInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
  })
  .strict();

export const listTeamMembersInputSchema = listProjectResourcesInputSchema;

export const listTeamInvitesInputSchema = listProjectResourcesInputSchema;

export const createTeamInviteInputSchema = z
  .object({
    ...requestOptionsInput,
    email: z
      .email()
      .trim()
      .max(254)
      .describe("Email address of the person to invite to the project."),
    project_id: projectIdInput,
    role: teamInviteRoleInput,
  })
  .strict();

export const revokeTeamInviteInputSchema = z
  .object({
    ...requestOptionsInput,
    invite_id: inviteIdInput,
    project_id: projectIdInput,
  })
  .strict();

export const resendTeamInviteInputSchema = z
  .object({
    ...requestOptionsInput,
    invite_id: inviteIdInput,
    project_id: projectIdInput,
  })
  .strict();

export const updateTeamMemberRoleInputSchema = z
  .object({
    ...requestOptionsInput,
    member_id: memberIdInput,
    project_id: projectIdInput,
    role: teamInviteRoleInput,
  })
  .strict();

export const removeTeamMemberInputSchema = z
  .object({
    ...requestOptionsInput,
    member_id: memberIdInput,
    project_id: projectIdInput,
  })
  .strict();

export const listTrafficSnapshotsInputSchema = z
  .object({
    end_date: dateInput,
    limit: z.number().int().min(1).max(200).optional(),
    offset: z.number().int().min(0).optional(),
    paths: z.array(z.string().trim().min(1).max(500)).max(50).optional(),
    project_id: projectIdInput,
    start_date: dateInput,
  })
  .strict();

export const listSearchPerformanceQueryStatsInputSchema = z
  .object({
    connection_id: connectionIdInput.optional(),
    end_date: dateInput,
    limit: z.number().int().min(1).max(1000).optional(),
    project_id: projectIdInput,
    query: optionalLimitedText(1000),
    start_date: dateInput,
  })
  .strict();

export const syncProjectTrafficInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
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
    primary: z
      .boolean()
      .optional()
      .describe("Deprecated compatibility alias: true promotes priority 0; false is a no-op."),
    priority: z.number().int().min(0).max(1000).optional(),
    project_id: projectIdInput,
    provider_id: providerIdInput,
    secret: providerSecretInput,
  })
  .strict();

export const testProviderConnectionInputSchema = z
  .object({
    credentials: providerCredentialsInputSchema.optional(),
    login: providerSecretInput,
    project_id: projectIdInput,
    provider_id: providerIdInput,
    secret: providerSecretInput,
  })
  .strict();

export const updateProviderSettingsInputSchema = z
  .object({
    ...requestOptionsInput,
    enabled: z.boolean().optional(),
    primary: z
      .boolean()
      .optional()
      .describe("Deprecated compatibility alias: true promotes priority 0; false is a no-op."),
    priority: z.number().int().min(0).max(1000).optional(),
    project_id: projectIdInput,
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
    enabled: z
      .boolean()
      .describe("Whether this provider connection should be active for the project."),
    project_id: projectIdInput,
    provider_id: providerIdInput,
  })
  .strict();

export const providerActionInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
    provider_id: providerIdInput,
  })
  .strict();

export const setProviderPriorityInputSchema = z
  .object({
    ...requestOptionsInput,
    priority: z
      .number()
      .int()
      .min(0)
      .max(1000)
      .describe("Ordering value that determines this provider's preference."),
    project_id: projectIdInput,
    provider_id: providerIdInput,
  })
  .strict();

export const setPrimaryProviderInputSchema = z
  .object({
    ...requestOptionsInput,
    primary: z
      .boolean()
      .optional()
      .describe("Deprecated compatibility alias: true promotes priority 0; false is a no-op."),
    project_id: projectIdInput,
    provider_id: providerIdInput,
  })
  .strict();

export const savedViewFiltersInputSchema = z
  .object({
    change: savedViewChangeFilterInput.default("any"),
    contains: z.string().trim().max(80).default(""),
    intents: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
    last_check: z.enum(["any", "completed", "failed", "running"]).default("any"),
    position: z.array(savedViewPositionFilterInput).max(4).default([]),
    serp: z.array(savedViewSerpFilterInput).max(8).default([]),
    tags: z.array(tagInput).max(20).default([]),
    topics: z.array(z.string().trim().min(1).max(80)).max(20).default([]),
    url_changed: z.boolean().default(false),
    vol_max: z.number().min(0).max(50).default(50),
    vol_min: z.number().min(0).max(50).default(0),
    wrong_url: z.boolean().default(false),
  })
  .strict()
  .describe("Filters stored in the saved view.");

export const keywordSavedViewConfigInputSchema = z
  .object({
    filters: savedViewFiltersInputSchema.default({
      change: "any",
      contains: "",
      intents: [],
      last_check: "any",
      position: [],
      serp: [],
      tags: [],
      topics: [],
      url_changed: false,
      vol_max: 50,
      vol_min: 0,
      wrong_url: false,
    }),
    lens: z
      .object({
        device: savedViewDeviceFilterInput.default("all"),
        location_id: z.string().trim().min(1).nullable().default(null),
      })
      .strict()
      .default({ device: "all", location_id: null }),
    search: z.string().trim().max(120).default(""),
    surface: z.literal("keywords").default("keywords"),
    version: z.literal(1).default(1),
  })
  .strict();

export const competitorSavedViewConfigInputSchema = z
  .object({
    filters: z
      .object({
        excluded_keyword_ids: z.array(keywordIdInput).max(10_000).default([]),
        position: z.enum(["all", "top3", "top10"]).default("all"),
        tag: z.string().trim().min(1).max(40).nullable().default(null),
      })
      .strict()
      .default({ excluded_keyword_ids: [], position: "all", tag: null }),
    scope: z
      .object({
        device: deviceInput.describe("Device selected for the competitor comparison."),
        engine: z.literal("google").describe("Search engine used for competitor comparison."),
        location_id: z
          .string()
          .trim()
          .min(1)
          .describe("Location identifier selected for the competitor comparison."),
      })
      .strict()
      .describe("Market scope whose competitor view is being saved."),
    surface: z.literal("competitors").describe("Saved-view surface for competitor comparisons."),
    version: z.literal(1).describe("Competitor saved-view schema version."),
  })
  .strict();

export const savedViewConfigInputSchema = z.union([
  keywordSavedViewConfigInputSchema,
  competitorSavedViewConfigInputSchema,
]);

export const savedViewSurfaceInput = z
  .enum(["keywords", "competitors"])
  .describe("Application surface whose saved views should be listed or created.");

export const listSavedViewsInputSchema = z
  .object({
    ...paginationInput,
    project_id: projectIdInput,
    surface: savedViewSurfaceInput.optional(),
  })
  .strict();

export const createSavedViewInputSchema = z
  .object({
    ...requestOptionsInput,
    config: savedViewConfigInputSchema.describe(
      "Saved-view filters and search settings chosen by the user.",
    ),
    name: z
      .string()
      .trim()
      .min(1)
      .max(48)
      .describe("Human-readable name chosen for the saved view."),
    project_id: projectIdInput,
    surface: savedViewSurfaceInput.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.surface && value.surface !== value.config.surface) {
      ctx.addIssue({
        code: "custom",
        message: "surface must match config.surface.",
        path: ["surface"],
      });
    }
  });

export const deleteSavedViewInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
    view_id: viewIdInput,
  })
  .strict();

const savedKeywordTextInput = z
  .string()
  .trim()
  .min(1)
  .max(180)
  .describe("Keyword phrase to save without starting rank tracking.");
const savedKeywordSnapshotInputSchema = z
  .object({
    cpc_cents: z.number().int().nonnegative().nullable().optional(),
    difficulty: z.number().int().min(0).max(100).nullable().optional(),
    intent: z.string().trim().min(1).max(80).nullable().optional(),
    keyword: z
      .string()
      .trim()
      .min(1)
      .max(180)
      .describe("Keyword phrase represented by this research snapshot."),
    location: locationKeyInput.optional(),
    search_volume: z.number().int().nonnegative().nullable().optional(),
    source_seed: savedKeywordTextInput.nullable().optional(),
    variant_count: z.number().int().nonnegative().optional(),
  })
  .strict();

export const listSavedKeywordsInputSchema = listProjectResourcesInputSchema;

export const createSavedKeywordsInputSchema = z
  .object({
    ...requestOptionsInput,
    keywords: z
      .array(z.union([savedKeywordTextInput, savedKeywordSnapshotInputSchema]))
      .min(1)
      .max(500)
      .describe("Keyword ideas to save without starting rank tracking."),
    project_id: projectIdInput,
  })
  .strict();

export const deleteSavedKeywordInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
    saved_keyword_id: savedKeywordIdInput,
  })
  .strict();

export const listCompetitorsInputSchema = listProjectResourcesInputSchema;

export const addCompetitorInputSchema = z
  .object({
    ...requestOptionsInput,
    domain: z
      .string()
      .trim()
      .min(1)
      .max(253)
      .describe("Competitor domain to track alongside the project."),
    label: optionalLimitedText(120),
    project_id: projectIdInput,
  })
  .strict();

export const removeCompetitorInputSchema = z
  .object({
    ...requestOptionsInput,
    competitor_id: competitorIdInput,
    project_id: projectIdInput,
  })
  .strict();

const notificationPreferenceInput = z.boolean().optional();

export const getNotificationPreferencesInputSchema = z
  .object({
    project_id: projectIdInput,
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
    project_id: projectIdInput,
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
    project_id: projectIdInput,
    scope: migrationScopeInput.optional(),
  })
  .strict();

export const revokeMigrationTokenInputSchema = z
  .object({
    ...requestOptionsInput,
    project_id: projectIdInput,
    token_id: migrationTokenIdInput,
  })
  .strict();
