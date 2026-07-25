import { describe, expect, it } from "vitest";

import {
  costEstimateFrequencyInput,
  exportRankHistoryInputSchema,
  getKeywordMetricsInputSchema,
  keywordBulkInputSchema,
  keywordScheduleInput,
  listRankedKeywordSuggestionsInputSchema,
  listSignalsInputSchema,
  listTrafficSnapshotsInputSchema,
  locationKeyInput,
  providerCredentialsInputSchema,
  providerIdInput,
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
        project_id: "prj_1",
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
        keyword_ids: ["kw_1"],
        operation: "remove_tags",
      }),
    ).toThrow("tags are required for tag bulk operations.");
  });

  it("requires frequency or schedule for bulk frequency operations", () => {
    expect(() =>
      keywordBulkInputSchema.parse({
        keyword_ids: ["kw_1"],
        operation: "set_frequency",
      }),
    ).toThrow("frequency or schedule is required.");
  });

  it("accepts canonical location keys and rejects malformed ones", () => {
    expect(locationKeyInput.parse("US")).toBe("US");
    expect(locationKeyInput.parse("US/California/Los Angeles")).toBe("US/California/Los Angeles");
    expect(locationKeyInput.parse(undefined)).toBeUndefined();
    expect(() => locationKeyInput.parse("california")).toThrow("location_key must look like");
    expect(() => locationKeyInput.parse("US/a/b/c")).toThrow("location_key must look like");
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
      runRankCheckInputSchema.parse({ keyword_id: "kw_1", provider_id: "future-serp-provider" }),
    ).toMatchObject({ provider_id: "future-serp-provider" });
    expect(() => providerIdInput.parse("")).toThrow();
  });

  it("validates ranked suggestion offsets and analytics dates", () => {
    expect(
      listRankedKeywordSuggestionsInputSchema.parse({
        fresh: true,
        limit: 100,
        offset: 100,
        project_id: "prj_1",
      }),
    ).toMatchObject({ offset: 100 });
    expect(() =>
      listRankedKeywordSuggestionsInputSchema.parse({ offset: 50, project_id: "prj_1" }),
    ).toThrow();
    expect(
      listTrafficSnapshotsInputSchema.parse({
        end_date: "2026-06-30",
        project_id: "prj_1",
        start_date: "2026-06-01",
      }),
    ).toMatchObject({ start_date: "2026-06-01" });
    expect(() =>
      listTrafficSnapshotsInputSchema.parse({
        end_date: "June 30",
        project_id: "prj_1",
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
        project_id: "prj_1",
        result_limit: 500,
        seed: "rank tracker",
      }),
    ).toMatchObject({ estimate_only: true, max_cost_cents: 8, result_limit: 500 });
    expect(() =>
      researchKeywordsInputSchema.parse({ project_id: "prj_1", result_limit: 200, seed: "seo" }),
    ).toThrow();
    expect(
      getKeywordMetricsInputSchema.parse({
        estimate_only: true,
        keywords: ["rank tracker", "seo api"],
        max_cost_cents: 4,
        project_id: "prj_1",
      }),
    ).toMatchObject({ estimate_only: true, max_cost_cents: 4 });
    expect(() =>
      researchKeywordsInputSchema.parse({
        max_cost_cents: 0,
        project_id: "prj_1",
        seed: "seo",
      }),
    ).toThrow();
    expect(() =>
      getKeywordMetricsInputSchema.parse({
        keywords: ["seo"],
        max_cost_cents: -1,
        project_id: "prj_1",
      }),
    ).toThrow();
    expect(() =>
      getKeywordMetricsInputSchema.parse({ keywords: [], project_id: "prj_1" }),
    ).toThrow();
    expect(() =>
      getKeywordMetricsInputSchema.parse({
        keywords: Array.from({ length: 701 }, (_, index) => `keyword ${index}`),
        project_id: "prj_1",
      }),
    ).toThrow();
  });

  it("accepts JSON rank-history export filters and rejects CSV or excessive keywords", () => {
    expect(
      exportRankHistoryInputSchema.parse({
        cursor: "cursor_1",
        granularity: "weekly",
        keyword_id: ["kw_1", "kw_2"],
        limit: 200,
        project_id: "prj_1",
        range: "all",
      }),
    ).toMatchObject({ granularity: "weekly", range: "all" });
    expect(() =>
      exportRankHistoryInputSchema.parse({ format: "csv", project_id: "prj_1" }),
    ).toThrow();
    expect(() =>
      exportRankHistoryInputSchema.parse({
        keyword_id: Array.from({ length: 501 }, (_, index) => `kw_${index}`),
        project_id: "prj_1",
      }),
    ).toThrow();
  });

  it("requires domain or name on project updates", () => {
    expect(updateProjectInputSchema.parse({ name: "Renamed", project_id: "prj_1" })).toEqual({
      name: "Renamed",
      project_id: "prj_1",
    });
    expect(() => updateProjectInputSchema.parse({ project_id: "prj_1" })).toThrow(
      "domain or name is required.",
    );
  });

  it("requires a cron expression for custom cron project defaults", () => {
    expect(() =>
      updateProjectDefaultsInputSchema.parse({
        frequency: "custom_cron",
        project_id: "prj_1",
      }),
    ).toThrow("Custom cron schedules require a cron expression.");
    expect(
      updateProjectDefaultsInputSchema.parse({
        cron_expression: "0 7 * * 1",
        frequency: "custom_cron",
        project_id: "prj_1",
      }),
    ).toEqual({
      cron_expression: "0 7 * * 1",
      frequency: "custom_cron",
      project_id: "prj_1",
    });
  });

  it("requires country and device together unless a location key is provided", () => {
    expect(() =>
      updateProjectDefaultsInputSchema.parse({
        device: "mobile",
        frequency: "daily",
        project_id: "prj_1",
      }),
    ).toThrow("country and device must be provided together.");
    expect(
      updateProjectDefaultsInputSchema.parse({
        device: "mobile",
        frequency: "daily",
        location_key: "US",
        project_id: "prj_1",
      }),
    ).toMatchObject({ device: "mobile", location_key: "US" });
  });

  it("accepts valid bulk frequency operations", () => {
    expect(
      keywordBulkInputSchema.parse({
        frequency: "daily",
        keyword_ids: ["kw_1"],
        operation: "set_frequency",
      }),
    ).toEqual({
      frequency: "daily",
      keyword_ids: ["kw_1"],
      operation: "set_frequency",
    });
  });

  it("requires dot-separated signal types on the list signals filter", () => {
    expect(
      listSignalsInputSchema.parse({ project_id: "prj_1", type: "deploy.completed" }),
    ).toMatchObject({ type: "deploy.completed" });
    expect(listSignalsInputSchema.parse({ project_id: "prj_1" })).toEqual({
      project_id: "prj_1",
    });
    expect(() =>
      listSignalsInputSchema.parse({ project_id: "prj_1", type: "not-dot-separated" }),
    ).toThrow("type must be dot-separated");
    expect(() => listSignalsInputSchema.parse({ project_id: "prj_1", type: "Deploy.Bad" })).toThrow(
      "type must be dot-separated",
    );
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
