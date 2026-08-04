# Distribution

This page is the public source of truth for where the bisibility MCP server is available. Statuses
were last verified on 2026-08-04.

| Channel | Status | Link | Version |
| --- | --- | --- | --- |
| npm | Published | [@bisibility/mcp](https://www.npmjs.com/package/@bisibility/mcp) | `0.6.2` |
| Official MCP Registry | Published | [com.bisibility/mcp](https://registry.modelcontextprotocol.io/v0.1/servers?search=com.bisibility%2Fmcp) | `0.6.2` |
| GitHub MCP Registry and VS Code | Pending downstream indexing | [GitHub MCP Registry](https://github.com/mcp) | `0.6.2` upstream |
| Glama server | Listed, schema scan pending | [Open-source server](https://glama.ai/mcp/servers/CorgiCorner/bisibility-mcp) | `0.6.2` |
| Glama connector | Listed, unhealthy - rescan required | [Hosted connector](https://glama.ai/mcp/connectors/com.bisibility/mcp) | Hosted |
| Smithery | Published | [bisibility/mcp](https://smithery.ai/servers/bisibility/mcp) | Hosted |
| Docker MCP Catalog | Submitted - under review | [docker/mcp-registry#4603](https://github.com/docker/mcp-registry/pull/4603) | `0.6.0` |
| Cline Marketplace | Submitted - under review | [Submission #2178](https://github.com/cline/mcp-marketplace/issues/2178) | `0.6.0` |
| Cursor Marketplace | Deferred - pending traction | [Cursor Marketplace](https://cursor.com/marketplace) | - |
| Claude Connectors Directory | Deferred - pending traction | [Claude connectors](https://www.anthropic.com/partners/mcp) | - |
| ChatGPT and Codex Plugins Directory | Deferred - pending traction | [Submit plugins](https://developers.openai.com/plugins/deploy/submission) | - |
| mcp.so | Not submitted | [mcp.so](https://mcp.so/) | - |

`Hosted` means the directory points to the managed `https://bisibility.com/api/mcp` endpoint,
which follows the production deployment instead of the npm package version. A dash means that no
public version has been submitted to that channel.

`Deferred - pending traction` means the channel is intentionally postponed until Bisibility has
more external adoption. It is not blocked by a failed submission or a technical incompatibility.

## Release maintenance

For every public MCP release:

1. Update the version for npm, the Official MCP Registry, and every versioned directory listing.
2. Recheck every public link and status after publication.
3. Update the verification date at the top of this page.
4. Keep the README distribution section limited to badges and the link to this page.

Directory status can also be updated between releases when a listing is accepted, rescanned, or
removed.
