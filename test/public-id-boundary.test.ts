import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  assertPublicId,
  createAlertRuleInputSchema,
  getKeywordInputSchema,
  getProjectInputSchema,
  getRankCheckResultInputSchema,
  parsePublicId,
  publicIdInput,
  publicIdPrefixes,
  revokeMigrationTokenInputSchema,
  revokePersonalTokenInputSchema,
  updateWebhookInputSchema,
} from "../src/schemas.js";
import {
  activeMigrationToken,
  alertRule,
  apiKey,
  competitor,
  keyword,
  migrationJob,
  notificationPreferences,
  project,
  projectDefaults,
  providerConnection,
  publicId,
  rankCheck,
  savedView,
  signal,
  teamInvite,
  teamMember,
  triggeredAlert,
} from "./fixtures.js";

const suffix = `b${"0".repeat(23)}`;

function atPath(value: unknown, path: string[]) {
  return path.reduce<unknown>((current, part) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[part];
  }, value);
}

describe("public ID MCP boundary", () => {
  it("accepts every canonical prefix with an unknown well-formed suffix", () => {
    for (const prefix of publicIdPrefixes) {
      const value = `${prefix}_${suffix}`;
      expect(publicIdInput(prefix).parse(value)).toBe(value);
    }
  });

  it.each(["prj_1", "prj_A000000000000000000000000", `prj_a${"0".repeat(22)}`, "cuidraw"])(
    "rejects malformed, mixed-case, short, and wrong-format IDs: %s",
    (value) => {
      expect(() => publicIdInput("prj").parse(value)).toThrow();
    },
  );

  it("narrows values for callers and rejects a mismatched prefix directly", () => {
    const projectId = publicId("prj");

    expect(parsePublicId(projectId, "prj")).toBe(projectId);
    expect(() => assertPublicId(publicId("kw"), "prj")).toThrow("Expected a prj_ public ID.");
  });

  it("rejects wrong prefixes in every typed tool context", () => {
    expect(() => getProjectInputSchema.parse({ project_id: publicId("kw") })).toThrow();
    expect(() => getKeywordInputSchema.parse({ keyword_id: publicId("prj") })).toThrow();
    expect(() => getRankCheckResultInputSchema.parse({ check_id: publicId("kw") })).toThrow();
    expect(() => revokePersonalTokenInputSchema.parse({ token_id: publicId("ferry") })).toThrow();
    expect(() =>
      revokeMigrationTokenInputSchema.parse({
        project_id: publicId("prj"),
        token_id: publicId("pat"),
      }),
    ).toThrow();
    expect(() =>
      updateWebhookInputSchema.parse({
        enabled: true,
        project_id: publicId("prj"),
        webhook_id: publicId("dwh"),
      }),
    ).toThrow();
  });

  it("validates alert target IDs against target_type", () => {
    expect(
      createAlertRuleInputSchema.parse({
        condition_type: "threshold",
        name: "Keyword threshold",
        project_id: publicId("prj"),
        target_ids: [publicId("kw")],
        target_type: "keyword",
      }),
    ).toMatchObject({ target_ids: [publicId("kw")] });

    expect(
      createAlertRuleInputSchema.parse({
        condition_type: "threshold",
        name: "Tag threshold",
        project_id: publicId("prj"),
        target_ids: [publicId("tag")],
        target_type: "tag",
      }),
    ).toMatchObject({ target_ids: [publicId("tag")] });

    for (const target of [publicId("tag"), "kw_1", publicId("prj")]) {
      expect(() =>
        createAlertRuleInputSchema.parse({
          condition_type: "threshold",
          name: "Keyword threshold",
          project_id: publicId("prj"),
          target_ids: [target],
          target_type: "keyword",
        }),
      ).toThrow();
    }

    expect(() =>
      createAlertRuleInputSchema.parse({
        condition_type: "threshold",
        name: "All keywords",
        project_id: publicId("prj"),
        target_ids: [publicId("kw")],
        target_type: "all",
      }),
    ).toThrow("All-target rules cannot include target IDs.");
  });

  it("keeps response fixtures aligned with their public ID contracts", () => {
    const cases: Array<{ paths: Array<[string[], string]>; value: unknown }> = [
      { paths: [[["id"], "prj"]], value: project() },
      { paths: [[["project_id"], "prj"]], value: projectDefaults() },
      { paths: [[["id"], "key"]], value: apiKey() },
      {
        paths: [
          [["id"], "kw"],
          [["project_id"], "prj"],
        ],
        value: keyword(),
      },
      {
        paths: [
          [["id"], "check"],
          [["keyword_id"], "kw"],
        ],
        value: rankCheck(),
      },
      { paths: [[["id"], "alr"]], value: alertRule() },
      { paths: [[["id"], "al"]], value: triggeredAlert() },
      { paths: [[["id"], "mbr"]], value: teamMember() },
      { paths: [[["id"], "inv"]], value: teamInvite() },
      {
        paths: [
          [["id"], "viw"],
          [["created_by_id"], "usr"],
        ],
        value: savedView(),
      },
      { paths: [[["id"], "cmp"]], value: competitor() },
      {
        paths: [
          [["id"], "conn"],
          [["project_id"], "prj"],
        ],
        value: providerConnection(),
      },
      { paths: [[["project_id"], "prj"]], value: notificationPreferences() },
      { paths: [[["id"], "imp"]], value: migrationJob() },
      { paths: [[["id"], "ferry"]], value: activeMigrationToken() },
      {
        paths: [
          [["id"], "sig"],
          [["project_id"], "prj"],
          [["public_id"], "sig"],
        ],
        value: signal(),
      },
    ];

    for (const { paths, value } of cases) {
      for (const [path, prefix] of paths) {
        expect(atPath(value, path)).toMatch(new RegExp(`^${prefix}_[a-z][a-z0-9]{23}$`));
      }
    }
  });

  it("has no broad ID schema and no location ID fixture", () => {
    const schemas = readFileSync(new URL("../src/schemas.ts", import.meta.url), "utf8");
    const toolTests = readFileSync(new URL("./tools.test.ts", import.meta.url), "utf8");

    expect(schemas).not.toContain("idInput");
    expect(toolTests).not.toContain('id: "loc_');
    expect(toolTests).not.toContain('id: "snapshot_');
    expect(toolTests).toContain("location_key");
  });
});
