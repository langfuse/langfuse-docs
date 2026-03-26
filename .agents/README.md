# Shared Agent Setup

This directory is the neutral, repo-owned source of truth for agent behavior in
`langfuse-docs`.

Use `.agents/` for instructions and provider inputs that should apply across
tools. Do not keep durable shared guidance only in `.claude/` or `.cursor/`.

## Layout

- `AGENTS.md`: canonical shared root instructions
- `config.json`: shared bootstrap and MCP configuration used to generate
  tool-specific shims
- `skills/`: shared, tool-neutral implementation guidance
- `claude/`: canonical Claude-specific inputs that are projected into `.claude/`
- `cursor/`: canonical Cursor rules and commands that are projected into
  `.cursor/`

## `config.json`

`.agents/config.json` contains five kinds of data:

- `shared`: defaults used across tools
- `mcpServers`: project MCP servers and how to connect to them
- `claude`: Claude-specific generated settings inputs
- `codex`: Codex-specific generated settings inputs
- `cursor`: Cursor-specific generated settings inputs

Current shape:

```json
{
  "shared": {
    "setupScript": "pnpm install",
    "devCommand": "pnpm dev",
    "devTerminalDescription": "Development server on http://localhost:3333"
  },
  "mcpServers": {},
  "claude": {
    "settings": {}
  },
  "codex": {
    "environment": {
      "version": 1,
      "name": "langfuse-docs"
    }
  },
  "cursor": {
    "environment": {
      "agentCanUpdateSnapshot": true,
      "terminals": [
        {
          "name": "Run dev server",
          "command": "pnpm dev"
        }
      ]
    }
  }
}
```

`cursor.environment.terminals` is optional. When present, it preserves
repo-specific Cursor terminal shortcuts while still keeping the config
centralized under `.agents/`.

## How Shims Are Generated

`scripts/agents/sync-agent-shims.mjs` reads `.agents/config.json` and writes the
tool discovery files that those products require.

Generated local artifacts:

- `.claude/settings.json`
- `.claude/launch.json`
- `.claude/skills/*`
- `.cursor/environment.json`
- `.cursor/mcp.json`
- `.cursor/commands/*`
- `.cursor/rules/*`
- `.vscode/mcp.json`
- `.mcp.json`
- `.codex/config.toml`
- `.codex/environments/environment.toml`

The repo root discovery files remain committed as symlinks:

- `AGENTS.md` -> `.agents/AGENTS.md`
- `CLAUDE.md` -> `AGENTS.md`

This keeps provider discovery stable while `.agents/` remains the source of
truth.

## Workflow

After editing `.agents/config.json`, `.agents/skills/`, `.agents/claude/`, or
`.agents/cursor/`:

1. Run `pnpm run agents:sync`
2. Run `pnpm run agents:check`
3. Verify you did not stage generated files under `.claude/`, `.cursor/`,
   `.vscode/`, `.mcp.json`, or `.codex/`

`pnpm install` also runs the sync/check flow via `postinstall`.
