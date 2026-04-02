# Resurgo MCP Server

Exposes your [Resurgo](https://resurgo.life) life operating system as MCP tools for AI agents, code editors (Cursor, VS Code Copilot), and Claude Desktop.

## Setup

### 1. Generate an API key
Go to **resurgo.life/settings/api** and generate an API key. It starts with `rsg_`.

### 2. Install dependencies
```bash
cd mcp-server
npm install
npm run build
```

### 3. Add to your MCP client

**Claude Desktop** (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "resurgo": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "RESURGO_API_KEY": "rsg_your_key_here",
        "RESURGO_BASE_URL": "https://resurgo.life"
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json` in your project or `~/.cursor/mcp.json` globally):
```json
{
  "mcpServers": {
    "resurgo": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-server/dist/index.js"],
      "env": {
        "RESURGO_API_KEY": "rsg_your_key_here"
      }
    }
  }
}
```

## Available Tools

| Tool | Description |
|------|-------------|
| `resurgo_get_today_plan` | Get today's tasks, habits, and goals in one call |
| `resurgo_get_tasks` | List tasks with optional status filter (todo/done/all) |
| `resurgo_add_task` | Add a task (title, priority, dueDate, energy, tags) |
| `resurgo_get_goals` | List active goals with progress |
| `resurgo_get_habits` | List active habits with streak data |
| `resurgo_simplify_today` | Get only the #1 task, habit, and goal for overwhelmed days |
| `resurgo_process_brain_dump` | Parse raw brain dump text into structured tasks |
| `resurgo_plan_day` | Generate a focused day plan summary |

## Local development
```bash
RESURGO_API_KEY=rsg_xxx RESURGO_BASE_URL=http://localhost:3000 npm run dev
```
