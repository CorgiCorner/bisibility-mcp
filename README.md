# @bisibility/mcp

> Part of [bisibility](https://github.com/CorgiCorner/bisibility) - open-source keyword
> rank tracking you can self-host and automate. This repository contains the MCP server
> that exposes Bisibility tools to AI agents.
>
> [Docs](https://bisibility.com/docs) ·
> [API reference](https://bisibility.com/docs/api/overview) ·
> [Roadmap](https://bisibility.com/roadmap)
>
> **Status:** Developer preview.

Model Context Protocol server for the Bisibility REST API. It exposes stdio tools backed by the
published `@bisibility/sdk` package.

## Requirements

- Node.js 18 or newer
- A Bisibility API key
- A Bisibility API v1 base URL

## Install and Build

From this package directory:

```sh
npm install
npm run build
```

The SDK is consumed from the npm registry:

```json
"@bisibility/sdk": "^0.5.0"
```

## Environment

```sh
export BISIBILITY_API_KEY="bsp_live_..."
export BISIBILITY_BASE_URL="https://bisibility.com/api/v1"
export BISIBILITY_PROJECT_ID="prj_..."
export BISIBILITY_MCP_READ_ONLY="1"
export BISIBILITY_MCP_TOOLSETS="projects,keywords,checks,rank-history"
```

`BISIBILITY_BASE_URL` is optional and defaults to `https://bisibility.com/api/v1`. For self-hosted
installs, set it to your API v1 root, for example `https://rank.example/api/v1`.
`BISIBILITY_API_KEY` accepts a project key (`bsk_live_...`) or personal access
token (`bsp_live_...`). Set optional `BISIBILITY_PROJECT_ID` as the default
`X-Bisibility-Project` selector for project-implicit PAT tools; a tool's
optional `project_id` argument overrides it for that call. Every resource ID
accepted by the MCP server, including `BISIBILITY_PROJECT_ID`, must use public
ID v2: a canonical lowercase prefix plus `_` and a 24-character lowercase
CUID2 suffix, for example `prj_a1b2c3d4e5f6g7h8j9k0m2n3`. Raw database IDs,
legacy IDs, mixed-case IDs, and wrong resource prefixes are rejected. Location
selection uses the returned `location_key`, never a location ID.

The SDK dependency and lockfile use the published registry package. Do not use
a local SDK link.

`BISIBILITY_MCP_READ_ONLY` accepts `1`, `true`, `yes`, or `on`, ignoring case. When enabled,
write tools are not registered and do not appear in `tools/list`.

`BISIBILITY_MCP_TOOLSETS` is an optional comma-separated allowlist. Valid toolsets are `account`,
`alerts`, `analytics`, `backlinks`, `checks`, `competitors`, `keywords`, `notifications`, `projects`,
`providers`, `rank-history`, `saved-views`, `signals`, `sitemaps`, `system`, `team`, `tokens`,
and `webhooks`. An unknown value prevents the server from starting. When the variable is unset, all
toolsets are registered. The toolset filter and read-only mode compose. The allowlist is a scope
control, not a way to improve tool selection.

## Run

```sh
npm run build
BISIBILITY_API_KEY="bsk_live_..." node dist/stdio.js
```

When installed as a package, the bin is:

```sh
bisibility-mcp
```

## Connect

Example MCP client configuration using the built local package:

```json
{
  "mcpServers": {
    "bisibility": {
      "command": "node",
      "args": ["/path/to/bisibility-mcp/dist/stdio.js"],
      "env": {
        "BISIBILITY_API_KEY": "bsk_live_...",
        "BISIBILITY_BASE_URL": "https://bisibility.com/api/v1"
      }
    }
  }
}
```

Example using the package bin:

```json
{
  "mcpServers": {
    "bisibility": {
      "command": "bisibility-mcp",
      "env": {
        "BISIBILITY_API_KEY": "bsk_live_...",
        "BISIBILITY_BASE_URL": "https://bisibility.com/api/v1"
      }
    }
  }
}
```

## Tools

Tools use unprefixed `snake_case` names and can be filtered with
`BISIBILITY_MCP_TOOLSETS`. The names match the built-in `/api/mcp` endpoint, so clients can
switch transports without rewriting tool calls.

| Area | Examples |
| --- | --- |
| Discovery | Health, capabilities, provider rates, and cost estimates |
| Rank tracking | Projects, keywords, checks, rank history, and sitemaps |
| Analytics | Traffic snapshots, query statistics, signals, and backlinks |
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
- `connect_provider`
- `test_provider_connection`
- `update_provider_settings`
- `set_provider_enabled`
- `set_provider_priority`
- `set_primary_provider`
- `disconnect_provider`
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
A project key (`bsk_live_...`) belongs to exactly one project, which bounds the damage from a
leak and makes it a good fit for a single-project or machine setup. A personal access token
(`bsp_live_...`) covers the projects you are a member of, so one token serves them all; its
effective access in each project is the lower of the token's scope and your role there, meaning
a token never grants more than the person behind it. Use `BISIBILITY_PROJECT_ID` to set the
default project for a token that spans several, as described under Environment above.

Whichever kind you use, create it with a `read` scope for assistant use whenever possible, and
do not grant `admin` unless the assistant needs an administrative API operation. Server-side
filtering narrows the tools presented to the model, but it does not expand or replace the
permissions of the configured credential.

An agent that receives a write-scoped or admin credential can create and change project data.
The destructive surface includes `delete_project`, `delete_keyword`,
`bulk_update_keywords` when its operation is `delete`, `delete_webhook`,
`delete_alert_rule`, `delete_saved_view`,
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
