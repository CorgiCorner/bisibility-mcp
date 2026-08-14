import { describe, expect, it } from "vitest";

import { publicId } from "./fixtures.js";

import {
  analyzeBacklinksInputSchema,
  analyzeDomainOverviewInputSchema,
  costEstimateFrequencyInput,
  createSavedViewInputSchema,
  exportRankHistoryInputSchema,
  getKeywordMetricsInputSchema,
  keywordBulkInputSchema,
  keywordScheduleInput,
  listRankedKeywordSuggestionsInputSchema,
  listSignalsInputSchema,
  listTrafficSnapshotsInputSchema,
  loadDomainOverviewHistoryInputSchema,
  loadDomainOverviewKeywordsInputSchema,
  loadDomainOverviewPagesInputSchema,
  loadMoreBacklinkRowsInputSchema,
  locationKeyInput,
  providerCredentialsInputSchema,
  providerIdInput,
  publicIdInput,
  rankCheckFrequencyInput,
  researchKeywordsInputSchema,
  runRankCheckInputSchema,
  savedViewCountryFilterInput,
  savedViewSerpFilterInput,
  targetUrlValueInput,
  updateProjectDefaultsInputSchema,
  updateProjectInputSchema,
} from "../src/schemas.js";

describe("tool input schemas", () => {
  it("rejects prefixes outside the closed public ID registry", () => {
    expect(() => publicIdInput("unknown" as never)).toThrow("Unsupported public ID prefix");
  });

  it("accepts absolute URLs, relative paths, and explicit null target URLs", () => {
    expect(targetUrlValueInput.parse("https://example.com/rank")).toBe("https://example.com/rank");
    expect(targetUrlValueInput.parse("/rank")).toBe("/rank");
    expect(targetUrlValueInput.parse(null)).toBeNull();
  });

  it("rejects invalid target URLs", () => {
    expect(() => targetUrlValueInput.parse("not a url")).toThrow(
      "Target URL must be an absolute URL or a path.",
    );
  });

  it("requires a cron expression for custom cron schedules", () => {
    expect(() =>
      keywordScheduleInput.parse({
        cron_expression: null,
        frequency: "custom_cron",
      }),
    ).toThrow("Custom cron schedules require a cron expression.");
  });

  it("accepts non-custom schedules without a cron expression", () => {
    expect(
      keywordScheduleInput.parse({
        cron_expression: null,
        frequency: "weekly",
      }),
    ).toEqual({
      cron_expression: null,
      frequency: "weekly",
    });
  });

  it("rejects retired auto_schedule while accepting every schedule field", () => {
    expect(() =>
      keywordScheduleInput.parse({
        auto_schedule: true,
        cron_expression: null,
        frequency: "daily",
      }),
    ).toThrow();
    expect(() =>
      updateProjectDefaultsInputSchema.parse({
        auto_schedule: true,
        frequency: "daily",
        project_id: publicId("prj"),
      }),
    ).toThrow();
    expect(
      keywordScheduleInput.parse({
        cron_expression: "0 7 * * 1",
        frequency: "custom_cron",
        jitter_minutes: 30,
        timezone: "Europe/Warsaw",
      }),
    ).toEqual({
      cron_expression: "0 7 * * 1",
      frequency: "custom_cron",
      jitter_minutes: 30,
      timezone: "Europe/Warsaw",
    });
  });

  it("keeps all rank-check frequency schemas aligned with monthly support", () => {
    expect(rankCheckFrequencyInput.options).toEqual([
      "paused",
      "manual",
      "daily",
      "weekly",
      "monthly",
      "custom_cron",
    ]);
    expect(rankCheckFrequencyInput.parse("monthly")).toBe("monthly");
    expect(costEstimateFrequencyInput.parse("monthly")).toBe("monthly");
    expect(() => costEstimateFrequencyInput.parse("manual")).toThrow();
    expect(
      keywordScheduleInput.parse({ cron_expression: null, frequency: "monthly" }),
    ).toMatchObject({ frequency: "monthly" });
  });

  it("requires tags for bulk tag operations", () => {
    expect(() =>
      keywordBulkInputSchema.parse({
        keyword_ids: [publicId("kw")],
        operation: "remove_tags",
      }),
    ).toThrow("tags are required for tag bulk operations.");
  });

  it("requires frequency or schedule for bulk frequency operations", () => {
    expect(() =>
      keywordBulkInputSchema.parse({
        keyword_ids: [publicId("kw")],
        operation: "set_frequency",
      }),
    ).toThrow("frequency or schedule is required.");
  });

  it("accepts canonical location-language keys and rejects malformed ones", () => {
    expect(locationKeyInput.parse("US")).toBe("US");
    expect(locationKeyInput.parse("US/California/Los Angeles")).toBe("US/California/Los Angeles");
    expect(locationKeyInput.parse("ES/Andalusia/Malaga@en")).toBe("ES/Andalusia/Malaga@en");
    expect(locationKeyInput.parse("ES@es-419")).toBe("ES@es-419");
    expect(locationKeyInput.parse("ZM@bem")).toBe("ZM@bem");
    expect(locationKeyInput.parse(undefined)).toBeUndefined();
    expect(() => locationKeyInput.parse("california")).toThrow("location_key must look like");
    expect(() => locationKeyInput.parse("US/a/b/c")).toThrow("location_key must look like");
    expect(() => locationKeyInput.parse("ES@")).toThrow("location_key must look like");
    expect(() => locationKeyInput.parse("ES@en@es")).toThrow("location_key must look like");
    expect(() => locationKeyInput.parse("ES@en/us")).toThrow("location_key must look like");
  });

  it("accepts any provider-supported saved view country and serp filter strings", () => {
    expect(savedViewCountryFilterInput.parse("all")).toBe("all");
    expect(savedViewCountryFilterInput.parse("fr")).toBe("fr");
    expect(savedViewSerpFilterInput.parse("ai")).toBe("ai");
    expect(savedViewSerpFilterInput.parse("shopping")).toBe("shopping");
    expect(() => savedViewCountryFilterInput.parse("")).toThrow();
  });

  it("accepts provider ids for server-side validation", () => {
    expect(providerIdInput.parse("future-provider")).toBe("future-provider");
    expect(
      runRankCheckInputSchema.parse({
        keyword_id: publicId("kw"),
        provider_id: "future-serp-provider",
      }),
    ).toMatchObject({ provider_id: "future-serp-provider" });
    expect(() => providerIdInput.parse("")).toThrow();
  });

  it("requires the saved-view surface to match its config", () => {
    expect(() =>
      createSavedViewInputSchema.parse({
        config: {
          filters: {
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
          },
          lens: { device: "all", location_id: null },
          search: "",
          surface: "keywords",
          version: 1,
        },
        name: "Keywords",
        project_id: publicId("prj"),
        surface: "competitors",
      }),
    ).toThrow("surface must match config.surface.");
  });

  it("validates ranked suggestion offsets and analytics dates", () => {
    expect(
      listRankedKeywordSuggestionsInputSchema.parse({
        fresh: true,
        limit: 100,
        offset: 100,
        project_id: publicId("prj"),
      }),
    ).toMatchObject({ offset: 100 });
    expect(() =>
      listRankedKeywordSuggestionsInputSchema.parse({ offset: 50, project_id: publicId("prj") }),
    ).toThrow();
    expect(
      listTrafficSnapshotsInputSchema.parse({
        end_date: "2026-06-30",
        project_id: publicId("prj"),
        start_date: "2026-06-01",
      }),
    ).toMatchObject({ start_date: "2026-06-01" });
    expect(() =>
      listTrafficSnapshotsInputSchema.parse({
        end_date: "June 30",
        project_id: publicId("prj"),
        start_date: "2026-06-01",
      }),
    ).toThrow();
  });

  it("validates keyword research depth and metrics batch size", () => {
    expect(
      researchKeywordsInputSchema.parse({
        estimate_only: true,
        include_clickstream: true,
        max_cost_cents: 8,
        mode: "auto",
        project_id: publicId("prj"),
        result_limit: 500,
        seed: "rank tracker",
      }),
    ).toMatchObject({ estimate_only: true, max_cost_cents: 8, result_limit: 500 });
    expect(() =>
      researchKeywordsInputSchema.parse({
        project_id: publicId("prj"),
        result_limit: 200,
        seed: "seo",
      }),
    ).toThrow();
    expect(
      getKeywordMetricsInputSchema.parse({
        estimate_only: true,
        keywords: ["rank tracker", "seo api"],
        max_cost_cents: 4,
        project_id: publicId("prj"),
      }),
    ).toMatchObject({ estimate_only: true, max_cost_cents: 4 });
    expect(() =>
      researchKeywordsInputSchema.parse({
        max_cost_cents: 0,
        project_id: publicId("prj"),
        seed: "seo",
      }),
    ).toThrow();
    expect(() =>
      getKeywordMetricsInputSchema.parse({
        keywords: ["seo"],
        max_cost_cents: -1,
        project_id: publicId("prj"),
      }),
    ).toThrow();
    expect(() =>
      getKeywordMetricsInputSchema.parse({ keywords: [], project_id: publicId("prj") }),
    ).toThrow();
    expect(() =>
      getKeywordMetricsInputSchema.parse({
        keywords: Array.from({ length: 701 }, (_, index) => `keyword ${index}`),
        project_id: publicId("prj"),
      }),
    ).toThrow();
  });

  it("accepts the backlinks analyze enums and result-limit union", () => {
    for (const result_limit of [100, 300, 500, 1000] as const) {
      expect(
        analyzeBacklinksInputSchema.parse({
          mode: result_limit === 100 ? "as_is" : "one_per_domain",
          project_id: publicId("prj"),
          result_limit,
          target: "example.com",
          target_scope: result_limit === 100 ? "site" : "page",
        }),
      ).toMatchObject({ result_limit });
    }
  });

  it("keeps the backlinks analyze schema strict and rejects invalid constrained values", () => {
    expect(() =>
      analyzeBacklinksInputSchema.parse({
        project_id: publicId("prj"),
        result_limit: 200,
        target: "example.com",
      }),
    ).toThrow();
    expect(() =>
      analyzeBacklinksInputSchema.parse({
        mode: "per_domain",
        project_id: publicId("prj"),
        target: "example.com",
      }),
    ).toThrow();
    expect(() =>
      analyzeBacklinksInputSchema.parse({
        project_id: publicId("prj"),
        target: "example.com",
        target_scope: "domain",
      }),
    ).toThrow();
    expect(() =>
      analyzeBacklinksInputSchema.parse({
        max_cost_cents: 0,
        project_id: publicId("prj"),
        target: "example.com",
      }),
    ).toThrow();
    expect(() =>
      analyzeBacklinksInputSchema.parse({
        project_id: publicId("prj"),
        target: "example.com",
        unexpected: true,
      }),
    ).toThrow();
  });

  it("accepts load-more limits in 100-row increments through 1000", () => {
    for (const limit of [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]) {
      expect(
        loadMoreBacklinkRowsInputSchema.parse({
          include_subdomains: false,
          limit,
          project_id: publicId("prj"),
          target: "https://example.com/pricing",
          target_scope: "page",
        }),
      ).toMatchObject({ limit });
    }
  });

  it("keeps the load-more schema strict and rejects invalid scope or limits", () => {
    for (const limit of [0, 150, 1100]) {
      expect(() =>
        loadMoreBacklinkRowsInputSchema.parse({
          limit,
          project_id: publicId("prj"),
          target: "example.com",
        }),
      ).toThrow();
    }
    expect(() =>
      loadMoreBacklinkRowsInputSchema.parse({
        project_id: publicId("prj"),
        target: "example.com",
        target_scope: "domain",
      }),
    ).toThrow();
    expect(() =>
      loadMoreBacklinkRowsInputSchema.parse({
        project_id: publicId("prj"),
        target: "example.com",
        unexpected: true,
      }),
    ).toThrow();
  });

  it("describes every backlinks input field", () => {
    for (const schema of [analyzeBacklinksInputSchema, loadMoreBacklinkRowsInputSchema]) {
      expect(Object.values(schema.shape).every((field) => field.description)).toBe(true);
    }
  });

  it("requires an explicit Domain Overview cost cap for every analysis", () => {
    const common = {
      language_code: "en",
      location_code: 2840,
      project_id: publicId("prj"),
      target: "example.com",
    };

    expect(
      analyzeDomainOverviewInputSchema.parse({
        ...common,
        estimate_only: true,
        max_cost_cents: 0,
      }),
    ).toMatchObject({ estimate_only: true, max_cost_cents: 0 });
    expect(() => analyzeDomainOverviewInputSchema.parse(common)).toThrow();
    expect(() =>
      analyzeDomainOverviewInputSchema.parse({ ...common, estimate_only: true }),
    ).toThrow();
    expect(() =>
      analyzeDomainOverviewInputSchema.parse({
        ...common,
        estimate_only: false,
        max_cost_cents: -1,
      }),
    ).toThrow();
  });

  it("validates strict Domain Overview market, scope, and row limits", () => {
    const common = {
      fresh: true,
      language_code: "en",
      location_code: 2840,
      max_cost_cents: 0,
      project_id: publicId("prj"),
      scope_override: "subdomain" as const,
      target: "blog.example.com",
    };

    expect(
      analyzeDomainOverviewInputSchema.parse({
        ...common,
        keyword_limit: 100,
        page_limit: 1000,
      }),
    ).toMatchObject({ scope_override: "subdomain" });
    expect(loadDomainOverviewHistoryInputSchema.parse(common)).toMatchObject({
      max_cost_cents: 0,
    });
    expect(
      loadDomainOverviewKeywordsInputSchema.parse({ ...common, limit: 100, offset: 0 }),
    ).toMatchObject({ limit: 100 });
    expect(() =>
      loadDomainOverviewKeywordsInputSchema.parse({ ...common, limit: 101, offset: 0 }),
    ).toThrow();
    expect(
      loadDomainOverviewPagesInputSchema.parse({ ...common, limit: 1000, offset: 0 }),
    ).toMatchObject({ limit: 1000 });
    expect(() =>
      loadDomainOverviewPagesInputSchema.parse({ ...common, limit: 1001, offset: 0 }),
    ).toThrow();
    for (const schema of [
      loadDomainOverviewKeywordsInputSchema,
      loadDomainOverviewPagesInputSchema,
    ]) {
      expect(() =>
        schema.parse({
          language_code: "en",
          limit: 1,
          location_code: 2840,
          offset: 0,
          project_id: publicId("prj"),
          target: "example.com",
        }),
      ).toThrow();
      expect(() => schema.parse({ ...common, limit: 0, offset: 0 })).toThrow();
      expect(() => schema.parse({ ...common, limit: 1, offset: -1 })).toThrow();
      expect(() => schema.parse({ ...common, limit: 1, offset: 0, unexpected: true })).toThrow();
    }

    expect(() => analyzeDomainOverviewInputSchema.parse({ ...common, location_code: 0 })).toThrow();
    expect(() =>
      loadDomainOverviewHistoryInputSchema.parse({
        language_code: "en",
        location_code: 2840,
        project_id: publicId("prj"),
        target: "example.com",
      }),
    ).toThrow();
    expect(() =>
      analyzeDomainOverviewInputSchema.parse({ ...common, scope_override: "site" }),
    ).toThrow();
    expect(() =>
      analyzeDomainOverviewInputSchema.parse({ ...common, language_code: "e" }),
    ).toThrow();
  });

  it("describes every Domain Overview input field", () => {
    for (const schema of [
      analyzeDomainOverviewInputSchema,
      loadDomainOverviewHistoryInputSchema,
      loadDomainOverviewKeywordsInputSchema,
      loadDomainOverviewPagesInputSchema,
    ]) {
      expect(Object.values(schema.shape).every((field) => field.description)).toBe(true);
    }
  });

  it("accepts JSON rank-history export filters and rejects CSV or excessive keywords", () => {
    expect(
      exportRankHistoryInputSchema.parse({
        cursor: "cursor_1",
        granularity: "weekly",
        keyword_ids: [publicId("kw"), publicId("kw", "b")],
        limit: 200,
        project_id: publicId("prj"),
        range: "all",
      }),
    ).toMatchObject({ granularity: "weekly", range: "all" });
    expect(() =>
      exportRankHistoryInputSchema.parse({ format: "csv", project_id: publicId("prj") }),
    ).toThrow();
    expect(() =>
      exportRankHistoryInputSchema.parse({
        keyword_ids: Array.from({ length: 501 }, (_, index) =>
          publicId("kw", String.fromCharCode(97 + (index % 26))),
        ),
        project_id: publicId("prj"),
      }),
    ).toThrow();
  });

  it("requires domain or name on project updates", () => {
    expect(
      updateProjectInputSchema.parse({ name: "Renamed", project_id: publicId("prj") }),
    ).toEqual({
      name: "Renamed",
      project_id: publicId("prj"),
    });
    expect(() => updateProjectInputSchema.parse({ project_id: publicId("prj") })).toThrow(
      "domain or name is required.",
    );
  });

  it("requires a cron expression for custom cron project defaults", () => {
    expect(() =>
      updateProjectDefaultsInputSchema.parse({
        frequency: "custom_cron",
        project_id: publicId("prj"),
      }),
    ).toThrow("Custom cron schedules require a cron expression.");
    expect(
      updateProjectDefaultsInputSchema.parse({
        cron_expression: "0 7 * * 1",
        frequency: "custom_cron",
        project_id: publicId("prj"),
      }),
    ).toEqual({
      cron_expression: "0 7 * * 1",
      frequency: "custom_cron",
      project_id: publicId("prj"),
    });
  });

  it("requires country and device together unless a location key is provided", () => {
    expect(() =>
      updateProjectDefaultsInputSchema.parse({
        device: "mobile",
        frequency: "daily",
        project_id: publicId("prj"),
      }),
    ).toThrow("country and device must be provided together.");
    expect(
      updateProjectDefaultsInputSchema.parse({
        device: "mobile",
        frequency: "daily",
        location_key: "US",
        project_id: publicId("prj"),
      }),
    ).toMatchObject({ device: "mobile", location_key: "US" });
  });

  it("accepts valid bulk frequency operations", () => {
    expect(
      keywordBulkInputSchema.parse({
        frequency: "daily",
        keyword_ids: [publicId("kw")],
        operation: "set_frequency",
      }),
    ).toEqual({
      frequency: "daily",
      keyword_ids: [publicId("kw")],
      operation: "set_frequency",
    });
  });

  it("requires dot-separated signal types on the list signals filter", () => {
    expect(
      listSignalsInputSchema.parse({ project_id: publicId("prj"), type: "deploy.completed" }),
    ).toMatchObject({ type: "deploy.completed" });
    expect(listSignalsInputSchema.parse({ project_id: publicId("prj") })).toEqual({
      project_id: publicId("prj"),
    });
    expect(() =>
      listSignalsInputSchema.parse({ project_id: publicId("prj"), type: "not-dot-separated" }),
    ).toThrow("type must be dot-separated");
    expect(() =>
      listSignalsInputSchema.parse({ project_id: publicId("prj"), type: "Deploy.Bad" }),
    ).toThrow("type must be dot-separated");
  });

  it("requires provider credential endpoints to be http(s) URLs", () => {
    expect(
      providerCredentialsInputSchema.parse({ endpoint: "https://plausible.example.com/api" }),
    ).toEqual({ endpoint: "https://plausible.example.com/api" });
    expect(providerCredentialsInputSchema.parse({ endpoint: "http://localhost:8000" })).toEqual({
      endpoint: "http://localhost:8000",
    });
    expect(providerCredentialsInputSchema.parse({})).toEqual({});
    expect(() =>
      providerCredentialsInputSchema.parse({ endpoint: "plausible.example.com" }),
    ).toThrow();
    expect(() => providerCredentialsInputSchema.parse({ endpoint: "ftp://example.com" })).toThrow(
      "endpoint must use http or https.",
    );
  });
});
