# Changelog

## Unreleased

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
