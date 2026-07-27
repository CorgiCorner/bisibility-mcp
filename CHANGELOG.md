# Changelog

## Unreleased

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
