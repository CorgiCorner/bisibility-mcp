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
local `@bisibility/sdk` package.

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

The SDK is consumed as a workspace-style file dependency:

```json
"@bisibility/sdk": "file:../bisibility-sdk-ts-private"
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
optional `project_id` argument overrides it for that call.

`BISIBILITY_MCP_READ_ONLY` accepts `1`, `true`, `yes`, or `on`, ignoring case. When enabled,
write tools are not registered and do not appear in `tools/list`.

`BISIBILITY_MCP_TOOLSETS` is an optional comma-separated allowlist. Valid toolsets are `account`,
`alerts`, `analytics`, `checks`, `competitors`, `keywords`, `notifications`, `projects`,
`providers`, `rank-history`, `saved-views`, `signals`, `sitemaps`, `system`, `team`, `tokens`,
and `webhooks`. An unknown value prevents the server from starting. When the variable is unset,
all toolsets are registered. The toolset filter and read-only mode compose.

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

- `bisibility_get_health`
- `bisibility_get_capabilities`
- `bisibility_get_cloud_import_compatibility`
- `bisibility_get_provider_rates`
- `bisibility_get_cost_estimate`
- `bisibility_get_me`
- `bisibility_update_me`
- `bisibility_list_projects`
- `bisibility_create_project`
- `bisibility_get_project`
- `bisibility_search_locations`
- `bisibility_update_project`
- `bisibility_delete_project`
- `bisibility_get_project_defaults`
- `bisibility_update_project_defaults`
- `bisibility_list_keywords`
- `bisibility_list_ranked_keyword_suggestions`
- `bisibility_research_keywords`
- `bisibility_get_keyword_metrics`
- `bisibility_add_keywords`
- `bisibility_get_keyword`
- `bisibility_update_keyword`
- `bisibility_set_keyword_target_url`
- `bisibility_delete_keyword`
- `bisibility_bulk_update_keywords`
- `bisibility_run_rank_check`
- `bisibility_get_rank_history`
- `bisibility_export_rank_history`
- `bisibility_list_sitemap_monitors`
- `bisibility_enable_sitemap_monitor`
- `bisibility_disable_sitemap_monitor`
- `bisibility_get_rank_check_result`
- `bisibility_create_signal`
- `bisibility_list_signals`
- `bisibility_list_traffic_snapshots`
- `bisibility_list_search_performance_query_stats`
- `bisibility_sync_project_traffic`
- `bisibility_list_api_keys`
- `bisibility_create_api_key`
- `bisibility_revoke_api_key`
- `bisibility_list_project_api_keys`
- `bisibility_create_project_api_key`
- `bisibility_list_personal_tokens`
- `bisibility_create_personal_token`
- `bisibility_revoke_personal_token`
- `bisibility_list_webhooks`
- `bisibility_create_webhook`
- `bisibility_update_webhook`
- `bisibility_delete_webhook`
- `bisibility_list_alert_rules`
- `bisibility_create_alert_rule`
- `bisibility_update_alert_rule`
- `bisibility_delete_alert_rule`
- `bisibility_list_triggered_alerts`
- `bisibility_mute_triggered_alert`
- `bisibility_mark_project_alerts_read`
- `bisibility_list_team_members`
- `bisibility_list_team_invites`
- `bisibility_create_team_invite`
- `bisibility_revoke_team_invite`
- `bisibility_resend_team_invite`
- `bisibility_update_team_member_role`
- `bisibility_remove_team_member`
- `bisibility_list_providers`
- `bisibility_connect_provider`
- `bisibility_test_provider_connection`
- `bisibility_update_provider_settings`
- `bisibility_set_provider_enabled`
- `bisibility_set_provider_priority`
- `bisibility_set_primary_provider`
- `bisibility_disconnect_provider`
- `bisibility_list_saved_views`
- `bisibility_create_saved_view`
- `bisibility_delete_saved_view`
- `bisibility_list_competitors`
- `bisibility_add_competitor`
- `bisibility_remove_competitor`
- `bisibility_get_notification_preferences`
- `bisibility_update_notification_preferences`
- `bisibility_list_migration_tokens`
- `bisibility_mint_migration_token`
- `bisibility_revoke_migration_token`

All protected tools use the configured `BISIBILITY_API_KEY`. Write tools accept an optional
`idempotency_key`, which is forwarded as the API `Idempotency-Key` request option.

The list above is asserted by a test (`test/tools.test.ts`), so it stays in sync with the
registered tool surface.

## Security

Bisibility API keys are project-scoped, and their API scope is the primary authorization
control. Create a `read`-scoped key for assistant use whenever possible. Do not grant `admin`
unless the assistant needs an administrative API operation. Server-side filtering narrows the
tools presented to the model, but it does not expand or replace the permissions of the
configured credential.

An agent that receives a write-scoped or admin credential can create and change project data.
The destructive surface includes `bisibility_delete_project`, `bisibility_delete_keyword`,
`bisibility_bulk_update_keywords` when its operation is `delete`, `bisibility_delete_webhook`,
`bisibility_delete_alert_rule`, `bisibility_delete_saved_view`,
`bisibility_remove_team_member`, `bisibility_remove_competitor`,
`bisibility_disconnect_provider`, `bisibility_revoke_api_key`,
`bisibility_revoke_personal_token`, `bisibility_revoke_team_invite`, and
`bisibility_revoke_migration_token`. Revoking the credential used by the server can immediately
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
