# @bisibility/mcp

> Part of [bisibility](https://github.com/CorgiCorner/bisibility) - an open-source SEO
> platform for keyword research, backlink analysis, and Google rank tracking. This
> repository contains the MCP server that exposes bisibility tools to AI agents.
>
> [Docs](https://bisibility.com/docs) ·
> [API reference](https://bisibility.com/docs/api/overview) ·
> [Roadmap](https://bisibility.com/roadmap)
>
> **Status:** Developer preview.

## Distribution

[![npm version](https://img.shields.io/npm/v/%40bisibility%2Fmcp?label=npm)](https://www.npmjs.com/package/@bisibility/mcp)
[![Official MCP Registry](https://img.shields.io/badge/Official_MCP_Registry-active-2ea44f)](https://registry.modelcontextprotocol.io/v0.1/servers?search=com.bisibility%2Fmcp)
[![Glama](https://img.shields.io/badge/Glama-listed-2ea44f)](https://glama.ai/mcp/servers/CorgiCorner/bisibility-mcp)
[![smithery badge](https://smithery.ai/badge/bisibility/mcp)](https://smithery.ai/servers/bisibility/mcp)

[Distribution status and release channels](https://github.com/CorgiCorner/bisibility-mcp/blob/main/docs/DISTRIBUTION.md)

Model Context Protocol server for the bisibility REST API. It exposes stdio tools
backed by the published `@bisibility/sdk` package.

## Requirements

- Node.js 18 or newer
- A bisibility API key
- A bisibility API v1 base URL

## Install

Run the published stdio server without a global install:

```sh
npx -y @bisibility/mcp
```

For local development, install and build from this package directory:

From this package directory:

```sh
npm install
npm run build
```

The SDK is consumed from the npm registry:

```json
"@bisibility/sdk": "^0.8.0"
```

### MCPB bundle

Directories and clients that support MCPB can distribute bisibility as a one-click local bundle.
The bundle includes the stdio server and all production dependencies, but never a bisibility
credential. The client collects configuration during installation.

Build the upload artifact with:

```sh
npm ci
npm run build
npm run build:mcpb
```

The versioned file is written to `artifacts/`.

## Environment

```sh
export BISIBILITY_API_KEY="bsb_pat_live_..."
export BISIBILITY_BASE_URL="https://eu.bisibility.com/api/v1"
export BISIBILITY_PROJECT_ID="prj_..."
export BISIBILITY_MCP_READ_ONLY="1"
export BISIBILITY_MCP_TOOLSETS="projects,keywords,checks,rank-history"
```

`BISIBILITY_BASE_URL` is optional and defaults to `https://eu.bisibility.com/api/v1`. For self-hosted
installs, set it to your API v1 root, for example `https://rank.example/api/v1`.
`BISIBILITY_API_KEY` accepts a project key (`bsb_key_live_...`) or personal access
token (`bsb_pat_live_...`). Set optional `BISIBILITY_PROJECT_ID` as the default
`X-Bisibility-Project` selector for project-implicit PAT tools; a tool's
optional `project_id` argument overrides it for that call. Every resource ID
accepted by the MCP server, including `BISIBILITY_PROJECT_ID`, must use the
current typed public ID format: a canonical lowercase prefix plus `_` and a
24-character lowercase suffix, for example `prj_a1b2c3d4e5f6g7h8j9k0m2n3`.
Malformed IDs, mixed-case IDs, and wrong resource prefixes are rejected.
Location selection uses the returned `location_key`, never a location ID.

The server consumes the public ID contract from the published
`@bisibility/sdk` package. Do not replace it with a local SDK link.

`BISIBILITY_MCP_READ_ONLY` accepts `1`, `true`, `yes`, or `on`, ignoring case. When enabled,
write tools are not registered and do not appear in `tools/list`.

`BISIBILITY_MCP_TOOLSETS` is an optional comma-separated allowlist. Valid toolsets are `account`,
`alerts`, `analytics`, `backlinks`, `checks`, `competitors`, `domain-overview`, `keywords`,
`notifications`, `projects`, `providers`, `rank-history`, `saved-views`, `signals`, `sitemaps`,
`system`, `team`, `tokens`, and `webhooks`. An unknown value prevents the server from starting.
When the variable is unset, all toolsets are registered. The toolset filter and read-only mode
compose. The allowlist is a scope control, not a way to improve tool selection.

## Run

```sh
npm run build
BISIBILITY_API_KEY="bsb_key_live_..." node dist/stdio.js
```

When installed as a package, the bin is:

```sh
bisibility-mcp
```

## Connect

After building the repository, connect Codex to the local stdio server:

```sh
codex mcp add bisibility \
  --env BISIBILITY_API_KEY="bsb_key_live_..." \
  --env BISIBILITY_BASE_URL="https://bisibility.com/api/v1" \
  -- node /absolute/path/to/bisibility-mcp/dist/stdio.js
```

The `codex mcp add` syntax above was verified against the Codex CLI. Replace the
absolute path and credential before running it.

Other MCP clients commonly use a JSON configuration like this:

```json
{
  "mcpServers": {
    "bisibility": {
      "command": "npx",
      "args": ["-y", "@bisibility/mcp"],
      "env": {
        "BISIBILITY_API_KEY": "bsb_key_live_...",
        "BISIBILITY_BASE_URL": "https://eu.bisibility.com/api/v1"
      }
    }
  }
}
```

If `bisibility-mcp` is installed on the client's `PATH`, use the package bin:

```json
{
  "mcpServers": {
    "bisibility": {
      "command": "bisibility-mcp",
      "env": {
        "BISIBILITY_API_KEY": "bsb_key_live_...",
        "BISIBILITY_BASE_URL": "https://eu.bisibility.com/api/v1"
      }
    }
  }
}
```

## Tools

Tools use unprefixed `snake_case` names and can be filtered with
`BISIBILITY_MCP_TOOLSETS`. The names match the built-in `/api/mcp` endpoint, so clients can
switch transports without rewriting tool calls.

Domain Overview tools always require a nonnegative whole-cent `max_cost_cents`
cap. Use `estimate_only: true` together with `max_cost_cents: 0` for the safe
estimate-first step; provider estimates and returned charges may still contain
fractional cents.

| Area | Examples |
| --- | --- |
| Discovery | Health, capabilities, provider rates, and cost estimates |
| Rank tracking | Projects, keywords, checks, rank history, and sitemaps |
| Analytics | Traffic snapshots, query statistics, signals, backlinks, and Domain Overview |
| Collaboration | Alerts, team members, invitations, and notifications |
| Administration | Providers, API keys, personal tokens, webhooks, and migration tokens |

<details>
<summary>View all registered tool names</summary>

- `get_health`
- `get_capabilities`
- `get_cloud_import_compatibility`
- `get_provider_rates`
- `get_cost_estimate`
- `get_me`
- `update_me`
- `list_projects`
- `create_project`
- `get_project`
- `search_locations`
- `update_project`
- `delete_project`
- `get_project_defaults`
- `update_project_defaults`
- `list_keywords`
- `list_ranked_keyword_suggestions`
- `research_keywords`
- `analyze_backlinks`
- `load_more_backlink_rows`
- `analyze_domain_overview`
- `load_domain_overview_history`
- `load_domain_overview_keywords`
- `load_domain_overview_pages`
- `get_keyword_metrics`
- `add_keywords`
- `get_keyword`
- `update_keyword`
- `set_keyword_target_url`
- `delete_keyword`
- `bulk_update_keywords`
- `run_rank_check`
- `get_rank_history`
- `export_rank_history`
- `list_sitemap_monitors`
- `enable_sitemap_monitor`
- `disable_sitemap_monitor`
- `get_rank_check_result`
- `create_signal`
- `list_signals`
- `list_traffic_snapshots`
- `list_search_performance_query_stats`
- `sync_project_traffic`
- `list_api_keys`
- `create_api_key`
- `revoke_api_key`
- `list_project_api_keys`
- `create_project_api_key`
- `list_personal_tokens`
- `create_personal_token`
- `revoke_personal_token`
- `list_webhooks`
- `create_webhook`
- `update_webhook`
- `delete_webhook`
- `list_alert_rules`
- `create_alert_rule`
- `update_alert_rule`
- `delete_alert_rule`
- `list_triggered_alerts`
- `mute_triggered_alert`
- `mark_project_alerts_read`
- `list_team_members`
- `list_team_invites`
- `create_team_invite`
- `revoke_team_invite`
- `resend_team_invite`
- `update_team_member_role`
- `remove_team_member`
- `list_providers`
- `connect_provider` (`primary: true` is a legacy alias for priority `0`)
- `test_provider_connection`
- `update_provider_settings`
- `set_provider_enabled`
- `set_provider_priority`
- `set_primary_provider` (legacy: true promotes priority `0`; false is a no-op)
- `disconnect_provider`
- `list_saved_keywords`
- `create_saved_keywords`
- `delete_saved_keyword`
- `list_saved_views`
- `create_saved_view`
- `delete_saved_view`
- `list_competitors`
- `add_competitor`
- `remove_competitor`
- `get_notification_preferences`
- `update_notification_preferences`
- `list_migration_tokens`
- `mint_migration_token`
- `revoke_migration_token`

</details>

All protected tools use the configured `BISIBILITY_API_KEY`. Write tools accept an optional
`idempotency_key`, which is forwarded as the API `Idempotency-Key` request option.

The list above is asserted by a test (`test/tools.test.ts`), so it stays in sync with the
registered tool surface.

## Security

The credential's scope is the primary authorization control, and the server accepts two kinds.
A project key (`bsb_key_live_...`) belongs to exactly one project, which bounds the damage from a
leak and makes it a good fit for a single-project or machine setup. A personal access token
(`bsb_pat_live_...`) covers the projects you are a member of, so one token serves them all; its
effective access in each project is the lower of the token's scope and your role there, meaning
a token never grants more than the person behind it. Use `BISIBILITY_PROJECT_ID` to set the
default project for a token that spans several, as described under Environment above.

Whichever kind you use, create it with a `read` scope for assistant use whenever possible, and
do not grant `admin` unless the assistant needs an administrative API operation. Server-side
filtering narrows the tools presented to the model, but it does not expand or replace the
permissions of the configured credential.

An agent that receives a write-scoped or admin credential can create and change project data.
Provider-backed Domain Overview tools can also spend the project's own provider budget on a cache
miss. Every Domain Overview call requires an explicit nonnegative integer `max_cost_cents`. For the
safe estimate-first step, call `analyze_domain_overview` with `estimate_only: true` and
`max_cost_cents: 0`; use the same zero cap for a cache-only attempt. A positive value caps the
permitted provider charge.

The destructive surface includes `delete_project`, `delete_keyword`,
`bulk_update_keywords` when its operation is `delete`, `delete_webhook`,
`delete_alert_rule`, `delete_saved_keyword`, `delete_saved_view`,
`remove_team_member`, `remove_competitor`,
`disconnect_provider`, `revoke_api_key`,
`revoke_personal_token`, `revoke_team_invite`, and
`revoke_migration_token`. Revoking the credential used by the server can immediately
lock the server out.

Use read-only mode and a narrow toolset allowlist as defense in depth:

```sh
export BISIBILITY_MCP_READ_ONLY="1"
export BISIBILITY_MCP_TOOLSETS="projects,keywords,checks,rank-history,alerts"
```

Content returned by the API is untrusted input that reaches the model. Project names, keyword
phrases, alert text, and similar tracked data can contain hostile instructions intended to steer
an agent that also has write tools. Keep credentials and registered toolsets as narrow as the
workflow permits, and enable client-side confirmation for tool calls when the MCP client supports
it.

## HTTP Transport

This package ships stdio transport only. The code is split so an HTTP transport can reuse the same
server factory:

```ts
import { createBisibilityClientFromEnv, createBisibilityMcpServer } from "@bisibility/mcp";

const client = createBisibilityClientFromEnv();
const server = createBisibilityMcpServer({ client });
```

An HTTP entry point can wrap that server with the official SDK HTTP transport, such as
`StreamableHTTPServerTransport`, in a Node, Worker, or hosted adapter.

## Development

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
