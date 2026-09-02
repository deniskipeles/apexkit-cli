Here is a complete, production-ready `README.md` for **`@apexkit/cli`**.

---

# `@apexkit/cli`

> The official Command Line Interface and Developer Sync Engine for [ApexKit](https://github.com/deniskipeles/apexkit).

`@apexkit/cli` allows you to develop, test, and synchronize backend scripts, server-side rendered (SSR) templates, custom modules, AI actions, and database schemas directly from your local IDE (VS Code, Cursor, WebStorm, etc.) with real-time live reloading and full TypeScript IntelliSense.

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration (`.env`)](#configuration-env)
- [CLI Commands](#cli-commands)
  - [`apexkit init`](#apexkit-init)
  - [`apexkit create` / `apexkit new`](#apexkit-create--apexkit-new)
  - [`apexkit watch` (Default)](#apexkit-watch-default)
  - [`apexkit push`](#apexkit-push)
  - [`apexkit pull`](#apexkit-pull)
  - [`apexkit commit`](#apexkit-commit)
  - [`apexkit status`](#apexkit-status)
- [Workspace Directory Architecture](#workspace-directory-architecture)
- [File Metadata Specifications](#file-metadata-specifications)
- [TypeScript & IDE IntelliSense Setup](#typescript--ide-intellisense-setup)
- [License](#license)

---

## Installation

You can install `@apexkit/cli` globally or execute it on-demand with `npx`.

```bash
# Global installation (recommended)
npm install -g @apexkit/cli

# Verify installation
apexkit --version
```

Or run directly without installing:

```bash
npx @apexkit/cli <command>
```

> **Alias**: Both `apexkit` and `apex` commands are registered automatically upon installation.

---

## Quick Start

### 1. Initialize a Local Workspace
Run the interactive setup wizard inside an empty folder:

```bash
mkdir my-apex-app && cd my-apex-app
apexkit init
```

### 2. Pull Existing Backend Resources
Download all remote collections, webhooks, templates, and AI actions from your ApexKit server:

```bash
apexkit pull
```

### 3. Start Live Development
Start the bidirectional file watcher:

```bash
apexkit watch
```

Every time you edit and save a script, template, or AI action in your editor, it automatically syncs to your live ApexKit instance in under 50ms.

---

## Configuration (`.env`)

`@apexkit/cli` reads configuration from a `.env` file in the root of your workspace:

```env
# ApexKit Server Endpoint
APEXKIT_URL=http://localhost:5000

# Administrative API Key (Root key or Scoped Tenant/Sandbox key)
APEXKIT_API_KEY=root_sys_prod_xxxxxxxxxxxx_yyyy

# Execution Context (root | tenant:<tenant_id> | sandbox:<session_id>)
SCOPE_KEY=root
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `APEXKIT_URL` | Base URL where your ApexKit server is running. | `http://localhost:5000` |
| `APEXKIT_API_KEY` | Admin or system API key with write access. | *None (Required)* |
| `SCOPE_KEY` | Target environment (`root`, `tenant:<id>`, `sandbox:<id>`). | `root` |

---

## CLI Commands

### `apexkit init`

Runs an interactive setup wizard that:
1. Prompts for your ApexKit server URL, API Key, and target scope.
2. Generates the `.env` file.
3. Provisions the standard folder structure (`webhooks/`, `modules/`, `templates/`, `ai_actions/`, `schemas/`).
4. Generates `apexkit.d.ts` (with full database collection types) and `jsconfig.json` for IDE autocompletion.

```bash
apexkit init
```

---

### `apexkit create` / `apexkit new`

Interactive scaffolding wizard to create a new webhook, database hook, reusable custom module, or SSR template with boilerplate and type annotations.

```bash
apexkit create
# or
apexkit new
# or
apexkit init:file
```

**Options Scaffolded:**
- **Webhooks & Endpoints** (REST endpoints with Hono / native Request-Response)
- **Database Lifecycle Hooks** (`before_create_record`, `after_update_record`, etc.)
- **System & Auth Hooks** (`before_user_login`, `after_user_create`, etc.)
- **Reusable Modules** (Imported across scripts via `@/custom/*`)
- **SSR HTML Templates** (Astro-like Frontmatter + Tailwind + Tera engine)

---

### `apexkit watch` (Default)

Starts a live WebSocket file-watcher. Whenever a `.js`, `.ts`, `.html`, or `.json` file is saved, it is compiled, validated, and pushed directly to the live server.

```bash
# Start watch mode with auto-commit to SQLite DB
apexkit watch
# or simply
apexkit

# Start watch mode in transient memory (VFS only, skips DB commit)
apexkit watch --no-auto-commit
```

---

### `apexkit push`

Performs an immediate, one-time manual push and commit of local files to the live ApexKit database.

```bash
# Push scripts & webhooks only (Default)
apexkit push
apexkit push --scripts
apexkit push -s

# Push SSR templates only
apexkit push --templates
apexkit push -t

# Push AI actions only
apexkit push --actions
apexkit push -a

# Push all categories (Scripts, Templates, AI Actions)
apexkit push --all
apexkit push -A

# Combine specific categories
apexkit push --templates --actions
```

#### Pruning Deleted Remote Items (`--delete-remote`)
To delete items from the remote ApexKit database that no longer exist in your local workspace:

```bash
# Prune all orphaned scripts, templates, and actions
apexkit push --all --delete-remote=all

# Prune only orphaned templates
apexkit push --templates --delete-remote=templates

# Prune only orphaned scripts
apexkit push --scripts --delete-remote=scripts
```

---

### `apexkit pull`

Downloads all remote assets from your ApexKit instance to your local workspace:
- Collection schemas & policies (`schemas/`)
- Webhooks, custom modules, and hooks (`webhooks/`, `modules/`)
- SSR page templates (`templates/`)
- AI prompt actions (`ai_actions/`)
- Generates refreshed `apexkit.d.ts` typings matching your live DB schema.

```bash
apexkit pull
```

---

### `apexkit commit`

Pushes local files into the active server's in-memory Virtual File System (VFS) without persisting changes permanently to the SQLite database. Useful for rapid staging.

```bash
apexkit commit
```

---

### `apexkit status`

Displays the active connection information, target scope, server health, and sync settings.

```bash
apexkit status
```

---

## Workspace Directory Architecture

```
my-apex-app/
├── .env                     # Server URL, API Key, and Scope configuration
├── jsconfig.json            # Module alias resolution for VS Code / IDEs
├── apexkit.d.ts             # Auto-generated IntelliSense typings for DB & APIs
├── package.json             # Workspace package descriptor
│
├── webhooks/                # API Endpoints and Database Lifecycle Hooks
│   ├── handle-payment.js
│   └── validate-order.ts
│
├── modules/
│   ├── custom/              # Reusable local modules (import via "@/custom/<name>")
│   │   └── formatters.js
│   └── esm/                 # Third-party ES modules
│
├── templates/               # Server-Side Rendered (SSR) HTML Pages
│   ├── index.html
│   └── dashboard.html
│
├── ai_actions/              # Structured LLM Prompts & RAG Actions
│   └── summarize-doc.json
│
└── schemas/                 # Database Schema Snapshots (JSON)
    └── collections.json
```

---

## File Metadata Specifications

ApexKit uses a standard file header block to bind scripts and templates to collections, routes, and database triggers.

### 1. Webhooks & Scripts (`.js` / `.ts`)

```typescript
/** @type {import("../apexkit").FileMetadata} */
export const __fileMetadata__ = {
  "name": "create-profile-on-register",
  "extension": "js",
  "type": "webhook",
  "path": "./webhooks/",
  "trigger_type": "after_user_create",
  "target_collection": "profiles",
  "active": true,
  "visibility": "private"
};

export default async function (event) {
  const { id, email } = event.record;
  
  await $db.records.create("profiles", {
    user_id: id,
    display_name: email.split("@")[0]
  });
}
```

### 2. SSR HTML Templates (`.html`)

```html
<!--
__fileMetadata__ = {
  "name": "home",
  "extension": "html",
  "type": "template",
  "path": "./templates/",
  "active": true
}
-->
<script server lang="ts">
/// <reference path="../apexkit.d.ts" />

export default async function(req) {
  const posts = await $db.records.list("posts", { limit: 10 });
  return { 
    title: "ApexKit Portal", 
    posts: posts.items 
  };
}
</script>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ title }}</title>
  <link rel="stylesheet" href="/styles.css">
  <script src="/static/js/htmx.js"></script>
  <script src="/static/js/alpine.js" defer></script>
</head>
<body class="bg-slate-900 text-slate-100 p-8">
  <h1 class="text-3xl font-bold text-indigo-400">{{ title }}</h1>
  <ul class="mt-4 space-y-2">
    {% for post in posts %}
      <li class="p-4 bg-slate-800 rounded border border-slate-700">
        {{ post.data.title }}
      </li>
    {% endfor %}
  </ul>
</body>
</html>
```

### 3. AI Actions (`.json`)

```json
{
  "action": {
    "slug": "content-editor",
    "name": "Content Editor",
    "model": "gemini-2.5-flash-lite",
    "system_prompt": "You are an expert copywriter. Output clean Markdown.",
    "template": "Improve the clarity of this text:\n\n{{text}}",
    "config": {
      "provider": "gemini",
      "grounding": false,
      "streaming": true
    }
  }
}
```

---

## TypeScript & IDE IntelliSense Setup

`@apexkit/cli` automatically produces an `apexkit.d.ts` file tailored to your live database. It defines all globals provided by the runtime:

- `$db` – Strongly typed CRUD, Query Engine, and Vector Search.
- `$root` – Multitenancy management (Root scope only).
- `$files` – File storage operations (read, save, signed URLs).
- `$fs` – Virtual file system scratchpad.
- `$ai` – Local and remote vector embeddings and similarity math.
- `$cache` – In-memory cache operations with TTL support.
- `$queue` – Background task orchestration and status tracking.
- `$realtime` – Real-time WebSocket and SSE event dispatcher.
- `$wasm` – WebAssembly memory loader and WASI execution.
- `$util` – Crypto, hashing, base64, and string formatting utilities.
- `$env` – Environment secrets accessor.

### Enabling Autocomplete in HTML `<script server>` Blocks
To ensure VS Code provides autocomplete inside `.html` template scripts, add the reference directive at the top of your `<script server>` block:

```html
<script server lang="ts">
/// <reference path="../apexkit.d.ts" />

export default async function(req) {
  // Full autocompletion for $db, $http, and database collections
}
</script>
```

---

## License

MIT © [Denis Kipeles](https://github.com/deniskipeles)