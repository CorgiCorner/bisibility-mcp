import type {
  ActiveMigrationToken,
  AlertRule,
  ApiKey,
  BacklinksSnapshot,
  Competitor,
  CompetitorListResponse,
  CreatedApiKey,
  DataResponse,
  FlatCostEstimate,
  FlatProviderRate,
  IssuedMigrationToken,
  Keyword,
  ListResponse,
  MigrationTokenListResponse,
  NotificationPreferences,
  Project,
  ProjectDefaults,
  Provider,
  ProviderConnection,
  RankCheck,
  SavedView,
  Signal,
  TeamInvite,
  TeamMember,
  TriggeredAlert,
} from "@bisibility/sdk";
import { type PublicIdForPrefix, type PublicIdPrefix, assertPublicId } from "../src/schemas.js";

type AllKeywordAlertRule = Extract<AlertRule, { target_type: "all" }>;

export function publicId<Prefix extends PublicIdPrefix>(
  prefix: Prefix,
  first = "a",
): PublicIdForPrefix<Prefix> {
  const value = `${prefix}_${first}${"0".repeat(23)}`;
  assertPublicId(value, prefix);
  return value;
}

export function listResponse<T>(data: T[], nextCursor: string | null = null): ListResponse<T> {
  return { data, meta: { next_cursor: nextCursor } };
}

export function dataResponse<T>(data: T): DataResponse<T> {
  return { data };
}

export function backlinksSnapshot(overrides: Partial<BacklinksSnapshot> = {}): BacklinksSnapshot {
  return {
    cached: false,
    cached_until: "2026-07-25T15:00:00.000Z",
    cost_cents: 5,
    fetched_at: "2026-07-24T15:00:00.000Z",
    fetched_row_count: 100,
    history: [{ lost_links: 8, month: "2026-07", new_links: 22 }],
    include_subdomains: true,
    provider: "dataforseo",
    rows: [
      {
        anchor: "example.com",
        domain_authority: 91,
        first_seen: "2026-01-21",
        flags: ["nofollow", "ugc"],
        links_count: 6,
        lost_at: null,
        source_domain: "source.example.com",
        source_url: "https://source.example.com/r/example",
        spam_score: 2,
        status: "new",
        target_url: "https://example.com/",
      },
    ],
    summary: {
      backlinks_total: 1685,
      broken_backlinks: 0,
      broken_pages: 0,
      dofollow_pct: 61,
      domain_rank: 37,
      lost_backlinks: 12,
      lost_referring_domains: 1,
      new_backlinks: 34,
      new_referring_domains: 3,
      referring_domains_total: 48,
      referring_pages: 1422,
      spam_score: 3,
    },
    target: "example.com",
    target_scope: "site",
    total_rows_available: 1685,
    ...overrides,
  };
}

export function signal(overrides: Partial<Signal> = {}): Signal {
  return {
    created_at: "2026-01-06T00:00:01.000Z",
    happened_at: "2026-01-06T00:00:00.000Z",
    id: publicId("sig"),
    keyword_id: null,
    payload: null,
    project_id: publicId("prj"),
    public_id: publicId("sig"),
    severity: "info",
    source: "deploy",
    type: "deploy.completed",
    url: null,
    ...overrides,
  };
}

export function providerRate(overrides: Partial<FlatProviderRate> = {}): FlatProviderRate {
  return {
    checked_at: "2026-01-05T00:00:00.000Z",
    label: "DataForSEO",
    options: [
      {
        key: "standard",
        label: "Standard queue",
        short_label: "Standard",
        turnaround: "~5 min",
        unit_cost_cents: 0.06,
        unit_cost_usd: 0.0006,
      },
    ],
    pricing_model: "flat",
    provider_id: "dataforseo",
    source_url: "https://pricing.example.com/dataforseo",
    ...overrides,
  };
}

export function costEstimate(overrides: Partial<FlatCostEstimate> = {}): FlatCostEstimate {
  return {
    checks_per_run: 100,
    effective_cost_per_check_cents: 0.06,
    exceeds_largest_plan: false,
    exceeds_selected_plan: false,
    monthly_checks: 3000,
    monthly_cost_cents: 180,
    monthly_cost_usd: 1.8,
    pricing_model: "flat",
    provider_id: "dataforseo",
    rate_checked_at: "2026-01-05T00:00:00.000Z",
    rate_source_url: "https://pricing.example.com/dataforseo",
    selected_option: {
      key: "standard",
      label: "Standard queue",
      short_label: "Standard",
      turnaround: "~5 min",
      unit_cost_cents: 0.06,
      unit_cost_usd: 0.0006,
    },
    ...overrides,
  };
}

export function project(overrides: Partial<Project> = {}): Project {
  return {
    created_at: "2026-01-01T00:00:00.000Z",
    domain: "example.com",
    id: publicId("prj"),
    name: "Example",
    updated_at: "2026-01-02T00:00:00.000Z",
    write_mode: "active",
    ...overrides,
  };
}

export function projectDefaults(overrides: Partial<ProjectDefaults> = {}): ProjectDefaults {
  return {
    city: null,
    country: "United States",
    cron_expression: null,
    device: "desktop",
    frequency: "daily",
    jitter_minutes: 60,
    last_checked_at: null,
    location_key: "US",
    next_check_at: "2026-01-06T00:00:00.000Z",
    project_id: publicId("prj"),
    serp_depth: 100,
    serp_stop_on_match: false,
    source: "explicit",
    timezone: "UTC",
    updated_at: "2026-01-05T00:00:00.000Z",
    ...overrides,
  };
}

export function apiKey(overrides: Partial<ApiKey> = {}): ApiKey {
  return {
    created_at: "2026-01-01T00:00:00.000Z",
    expires_at: null,
    id: publicId("key"),
    last_used_at: null,
    name: "CI key",
    prefix: "bsb_key_test_fake1234",
    revoked_at: null,
    scope: "admin",
    ...overrides,
  };
}

export function createdApiKey(overrides: Partial<CreatedApiKey> = {}): CreatedApiKey {
  return {
    ...apiKey(),
    masked_value: "bsb_key_test_fake1234******fake",
    token: "bsb_key_test_fake_not_a_real_secret",
    ...overrides,
  };
}

export function keyword(overrides: Partial<Keyword> = {}): Keyword {
  return {
    country: "United States",
    created_at: "2026-01-03T00:00:00.000Z",
    device: "desktop",
    id: publicId("kw"),
    intent: null,
    language_code: "en",
    language_label: "English",
    latest_position: 4,
    location: "United States",
    location_key: "US",
    previous_position: 8,
    project_id: publicId("prj"),
    ranking_url: "https://example.com/page",
    schedule: null,
    tags: ["Product"],
    target_url: "https://example.com/page",
    text: "rank tracker",
    topic: null,
    updated_at: "2026-01-04T00:00:00.000Z",
    ...overrides,
  };
}

export function rankCheck(overrides: Partial<RankCheck> = {}): RankCheck {
  return {
    attempts: null,
    checked_at: "2026-01-06T00:00:00.000Z",
    cost_cents: 0.06,
    error: null,
    id: publicId("check"),
    keyword_id: publicId("kw"),
    position: 4,
    previous_position: 8,
    provider: "dataforseo",
    ranking_url: "https://example.com/page",
    status: "completed",
    ...overrides,
  };
}

export function alertRule(overrides: Partial<AllKeywordAlertRule> = {}): AllKeywordAlertRule {
  return {
    channel: "Email",
    channels: ["email"],
    condition: "rank crosses below #10",
    condition_type: "threshold",
    enabled: true,
    fires: "2 this week",
    id: publicId("alr"),
    name: "Ranking drop",
    period: "Each check",
    recipient_ids: [],
    scope: "All keywords",
    severity: "urgent",
    status: "active",
    target_ids: [],
    target_type: "all",
    threshold_position: 10,
    ...overrides,
  };
}

export function triggeredAlert(overrides: Partial<TriggeredAlert> = {}): TriggeredAlert {
  return {
    action: "Review the latest rank check.",
    ctas: ["Open keyword"],
    current: "#12",
    headline: "Ranking drop",
    id: publicId("al"),
    keyword: "rank tracker",
    previous: "#4",
    rule: "Ranking drop",
    severity: "urgent",
    unread: true,
    when: "just now",
    ...overrides,
  };
}

export function teamMember(overrides: Partial<TeamMember> = {}): TeamMember {
  return {
    color: "accent",
    email: "owner@example.com",
    id: publicId("mbr"),
    initials: "OE",
    name: "Owner Example",
    role: "Owner",
    role_value: "owner",
    ...overrides,
  };
}

export function teamInvite(overrides: Partial<TeamInvite> = {}): TeamInvite {
  return {
    email: "new@example.com",
    expires_label: "expires in 7d",
    id: publicId("inv"),
    invited_label: "invited just now",
    role: "Viewer",
    role_value: "viewer",
    ...overrides,
  };
}

export function provider(overrides: Partial<Provider> = {}): Provider {
  return {
    category_id: "serp",
    category_title: "SERP providers",
    description: "SerpAPI rank-data provider.",
    drawer: {
      activities: [{ label: "Last used", value: "Never" }],
      cost_help: "Provider billing remains direct between you and the provider.",
      credential_fields: [{ label: "API key", name: "secret", placeholder: "Stored" }],
      defaults: {
        cost_per_check: 0,
        depth: "Top 100",
        device: "Desktop",
        enabled: true,
        language: "English",
        location: "United States",
        login: "",
        primary: false,
        priority: 100,
        secret: "",
      },
      env_hint: "Credentials can also be configured through environment variables.",
      primary_toggle_label: "Set as primary serp provider",
    },
    icon: "globe",
    id: "serpapi",
    meta: [{ label: "State", value: "Ready" }],
    name: "SerpAPI",
    status: "ready",
    tint: "var(--accent)",
    ...overrides,
  };
}

export function providerConnection(
  overrides: Partial<ProviderConnection> = {},
): ProviderConnection {
  return {
    cost_per_check_cents: 0.01,
    created_at: "2026-01-01T00:00:00.000Z",
    credentials_hash: null,
    enabled: true,
    id: publicId("conn"),
    is_primary: true,
    kind: "serp",
    last_used_at: null,
    priority: 0,
    project_id: publicId("prj"),
    provider: "serpapi",
    status: "connected",
    updated_at: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

export const savedViewConfig = {
  filters: {
    change: "any",
    contains: "",
    intents: [],
    last_check: "any",
    position: [],
    serp: [],
    tags: ["Product"],
    topics: [],
    url_changed: false,
    vol_max: 50,
    vol_min: 0,
    wrong_url: false,
  },
  lens: { device: "all", location_id: null },
  search: "rank",
  surface: "keywords",
  version: 1,
} satisfies SavedView["config"];

export const competitorSavedViewConfig = {
  filters: {
    excluded_keyword_ids: [],
    position: "all",
    tag: null,
  },
  scope: {
    device: "desktop",
    engine: "google",
    location_id: "US",
  },
  surface: "competitors",
  version: 1,
} satisfies SavedView["config"];

export function savedView(overrides: Partial<SavedView> = {}): SavedView {
  return {
    config: savedViewConfig,
    created_at: "2026-01-07T00:00:00.000Z",
    created_by_id: publicId("usr"),
    id: publicId("viw"),
    name: "Product keywords",
    surface: "keywords",
    ...overrides,
  };
}

export function competitor(overrides: Partial<Competitor> = {}): Competitor {
  return {
    domain: "competitor.example.com",
    id: publicId("cmp"),
    initials: "R",
    label: "Rankzly",
    ...overrides,
  };
}

export function competitorListResponse(
  overrides: Partial<CompetitorListResponse["meta"]> = {},
): CompetitorListResponse {
  return {
    data: [competitor()],
    meta: {
      markets: [
        {
          checked_keyword_count: 10,
          columns: [{ domain: "example.com", kind: "You", label: "You" }],
          competitor_count: 1,
          country: "us",
          device: "desktop",
          engine: "google",
          has_rank_data: true,
          key: "us-desktop",
          rows: [{ gap: 2, keyword: "rank tracker", ranks: { [publicId("cmp")]: 2, you: 4 } }],
          shares: [
            {
              color: "#111",
              domain: "competitor.example.com",
              id: publicId("cmp"),
              initials: "R",
              kind: "Managed",
              label: "Rankzly",
              share_of_voice: 0.25,
              shared_keywords: 4,
            },
          ],
          shared_keyword_count: 4,
          tracked_keyword_count: 10,
        },
      ],
      next_cursor: "competitor_cursor",
      suggestions: [{ domain: "search.example", initials: "S", overlap: 3 }],
      ...overrides,
    },
  };
}

export function notificationPreferences(
  overrides: Partial<NotificationPreferences> = {},
): NotificationPreferences {
  return {
    alert_email: true,
    alert_in_app: true,
    alert_slack: false,
    alert_webhook: false,
    check_email: false,
    check_in_app: true,
    email: "owner@example.com",
    email_verification: "verified",
    import_email: true,
    import_in_app: true,
    invite_email: true,
    invite_in_app: true,
    project_id: publicId("prj"),
    slack_available: true,
    webhook_available: false,
    ...overrides,
  };
}

export function migrationJob(): MigrationTokenListResponse["meta"]["import_job"] {
  return {
    counts: null,
    created_at: "2026-01-08T00:00:00.000Z",
    error: null,
    finished_at: null,
    id: publicId("imp"),
    progress: 0,
    started_at: null,
    state: "idle",
  };
}

export function activeMigrationToken(
  overrides: Partial<ActiveMigrationToken> = {},
): ActiveMigrationToken {
  return {
    created_at: "2026-01-08T00:00:00.000Z",
    created_by: { email: "owner@example.com", name: "Owner Example" },
    expires_at: "2026-01-08T01:00:00.000Z",
    id: publicId("ferry"),
    scope: "full",
    single_use: true,
    ...overrides,
  };
}

export function issuedMigrationToken(
  overrides: Partial<IssuedMigrationToken> = {},
): IssuedMigrationToken {
  return {
    ...activeMigrationToken(),
    import_job: migrationJob(),
    token: "mig_secret",
    ...overrides,
  };
}

export function migrationTokenListResponse(
  data: ActiveMigrationToken[] = [activeMigrationToken()],
): MigrationTokenListResponse {
  return {
    data,
    meta: {
      import_job: migrationJob(),
      next_cursor: null,
    },
  };
}
