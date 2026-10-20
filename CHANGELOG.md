# Changelog

## Unreleased

## 0.18.0 - 2026-10-20

- Use `@bisibility/sdk` 0.18.0 and align the version with the 0.18 release of the Bisibility SDKs, CLI and MCP server.

## 0.17.1 - 2026-10-16

- Require the latest opaque snapshot_ref when appending backlink rows and preserve replacement references for subsequent appends.
- Validate AI citation hostnames up to 253 characters, with a 63-character provider limit after removing a leading www. for domain searches.

## 0.17.0 - 2026-10-14

- Add retained rank-check execution reads for cancelled, blocked and deferred outcomes without observations.
- Add five Local monitor read tools and versioned rank-history reports preserving original scope, nullable evidence, and continuation cursors.
- Add project-default previews and explicit confirmations gated by advertised server support.

## 0.16.0 - 2026-10-10

- Add 26 project-scoped AI tracking tools for topics, immutable prompt revisions, schedules,
  consented runs, samples, history, trends, evidence exports, and accepted suggestions.
- Add a free AI research catalog tool and prompt comparison options for current models, web search,
  locale hints, and explicitly acknowledged provider actual-cost mode.
- Add read-only full context review and model generation preview. Paid generation requires a frozen
  preview, explicit consent, and a stable idempotency UUID; forecasts have no guaranteed maximum.
- Preserve trusted generation or provider dataset references when accepting edited prompt drafts.
  Generated hypotheses carry no measured popularity, and unknown costs remain null.

## 0.11.0 - 2026-10-07

- Added project context, saved reports, cost-capped AI visibility and prompt comparison, and bounded site audit tools.
- Added session profile and cost estimate tools, plus spending caps for rank checks and ranked keyword suggestions.
- Improved project defaults, sitemap monitor controls, provider setup guidance, and descriptions of tool results.
- Preserved cost-only dry runs and identified MCP API traffic for usage reporting.
- Updated protocol dependencies for security fixes, improved package guidance, and included NOTICE in npm and MCPB packages.

## 0.10.0 - 2026-09-09

- Added depth-aware cost estimates for manual, paused, and custom schedules, preserving unknown monthly costs instead of reporting zero.
- Updated URI parsing to address security vulnerabilities.

## 0.9.0 - 2026-08-14

- Added language-qualified market keys across location discovery, project defaults, and keyword
  tools, with exact market fields preserved in keyword responses.

## 0.8.0 - 2026-08-13

- Added cost-capped Domain Overview tools for estimates, reports, history, ranked keywords, and
  relevant pages.

## 0.7.0 - 2026-08-10

- Preserved primary-provider compatibility inputs: `primary: true` promotes priority `0`, while
  `primary: false` is a legacy no-op. New tool calls should use `priority`.

## 0.6.3 - 2026-08-08

- Updated public ID documentation and validation errors to describe the current typed ID format
  without retired migration-version terminology.

## 0.6.2 - 2026-08-04

- Redacted MCP startup diagnostics so invalid credentials and environment values are not written
  to stderr.
- Updated runtime dependencies to fix high-severity URL parsing and IP address classification
  advisories.

## 0.6.1 - 2026-08-02

- Improved invalid `BISIBILITY_API_KEY` errors by showing the unsupported prefix and how to unset
  or replace the credential.

## 0.6.0 - 2026-08-02

- Added tools to list, save, and delete keyword ideas without starting rank tracking.
- Added a pre-built MCPB target for one-click installation with guided credentials, self-hosted
  API URLs, and least-privilege tool controls.
- Added a public distribution status page covering package, registry, and directory availability.

## 0.5.2 - 2026-07-30

- Added Official MCP Registry metadata for the npm and hosted transports, a one-command `npx`
  setup, agent installation instructions, and a marketplace icon.
- Added `openWorldHint` annotations so MCP clients can distinguish tools that contact external
  providers or send invitations.
- Changed the default bisibility Cloud API URL to the direct regional endpoint so credentials are
  not sent through a cross-origin redirect.

## 0.5.1 - 2026-07-30

- Improved package metadata to describe the MCP server's SEO rank-tracking tools and agent use
  cases.

## 0.5.0 - 2026-07-29

- Breaking: require public ID v3 prefixes and `bsb_key_*` or `bsb_pat_live_` credentials.
  Public ID v2 values and legacy `bsk_*` or `bsp_*` credentials are no longer accepted.

## 0.4.0 - 2026-07-29

- Breaking: use the same 84 unprefixed `snake_case` tool names as `/api/mcp`; clients must remove
  `bisibility_` from stored tool names.
- Breaking: enforce resource-specific public ID v2 prefixes for tool inputs and
  `BISIBILITY_PROJECT_ID`.
- Align tool schemas with `/api/mcp`, add backlink tools and project guidance, and require user
  confirmation before paid rank checks.

## 0.3.0 - 2026-07-27

- Added `BISIBILITY_MCP_READ_ONLY` to register only read tools, so mutating tools are absent
  from the tool list rather than refused on call.
- Added `BISIBILITY_MCP_TOOLSETS` to register only the named tool groups. An unknown group now
  fails startup and lists the valid names.
- Added `readOnlyHint` and `destructiveHint` annotations so clients that support them can ask
  for confirmation before destructive calls.
- Documented the security model, including the destructive tool surface and prompt-injection
  exposure through API-returned content.

## 0.2.1 - 2026-07-26

- No tool or behaviour changes. This release ships a container image definition so the server
  can be installed from the Docker MCP Catalog.

## 0.2.0 - 2026-07-26

- Added a project defaults read tool that preserves market provenance and reports SERP depth and
  stop-on-match settings.
- Removed the retired `auto_schedule` input from keyword schedules and project defaults so strict
  tool schemas reject it instead of advertising an ignored setting.

## 0.1.0 - 2026-07-24

- Initial release.
