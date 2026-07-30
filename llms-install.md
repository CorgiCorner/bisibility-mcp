# Install Bisibility MCP

Use this flow when configuring Bisibility for an MCP client.

1. Ask the user whether they use Bisibility Cloud or a self-hosted instance.
2. Ask the user to create a least-privilege project API key or personal access token.
3. Configure the stdio server with `npx -y @bisibility/mcp`.
4. Set `BISIBILITY_API_KEY` to the credential from step 2.
5. Set `BISIBILITY_BASE_URL` to the instance API v1 root. Bisibility Cloud uses
   `https://eu.bisibility.com/api/v1`.
6. Optionally set `BISIBILITY_PROJECT_ID` when a personal access token should default to one
   project.
7. Start the server and call `list_projects` to verify the connection.

Example:

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

Never print, log, or commit the user's credential.
