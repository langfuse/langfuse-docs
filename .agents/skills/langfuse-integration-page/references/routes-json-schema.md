# `cookbook/_routes.json` schema

This JSON file is the source of truth for which notebooks get converted to docs pages and where they land. `scripts/move_docs.py` reads it after `nbconvert` produces `.md` files, then publishes each entry to the right location.

Forgetting to add a routes entry is the #1 way a new integration notebook fails to appear on the site, so always update this file when adding a notebook.

## Schema

The file is a JSON array. Each entry is an object with these fields:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `notebook` | string | yes | Filename of the notebook in `cookbook/`, including `.ipynb` extension. |
| `docsPath` | string \| null | yes | Relative path under `content/` where the final MDX lands (no extension). `null` means "don't publish as a dedicated page." |
| `isGuide` | boolean | yes | If `true`, also publish a copy to `content/guides/cookbook/<notebook-basename>.mdx` for the general cookbook index. |

## Examples

### Integration page (most common)

```json
{
  "notebook": "integration_pydantic_ai.ipynb",
  "docsPath": "integrations/frameworks/pydantic-ai",
  "isGuide": false
}
```

Lands the rendered page at `content/integrations/frameworks/pydantic-ai.mdx`. Does NOT duplicate into `content/guides/cookbook/`.

### Integration page that also appears in the cookbook index

```json
{
  "notebook": "integration_anthropic.ipynb",
  "docsPath": "integrations/model-providers/anthropic",
  "isGuide": true
}
```

Rare — use only when the user explicitly wants the integration to show up in both places. Default for new integrations is `isGuide: false`.

### Guide-only notebook (no dedicated integration page)

```json
{
  "notebook": "evaluation_of_rag_with_ragas.ipynb",
  "docsPath": null,
  "isGuide": true
}
```

Only publishes to `content/guides/cookbook/evaluation_of_rag_with_ragas.mdx`. Not what you want for an integration.

## Path conventions

The `docsPath` segment after `integrations/` determines the sidebar category:

- `integrations/model-providers/<slug>` — inference APIs, model providers, hosted model offerings.
- `integrations/frameworks/<slug>` — agent and app frameworks.
- `integrations/gateways/<slug>` — LLM proxies/routers.
- `integrations/other/<slug>` — everything else (scraping tools, UI frameworks, IDE integrations, etc.).

The `<slug>` is kebab-case and should match the part after `integration_` in the notebook filename, with underscores replaced by hyphens. Example: `integration_fireworks_ai.ipynb` → `fireworks-ai`.

## JS-specific conventions

- JS notebook filenames start with `js_integration_` instead of `integration_`.
- When a partner has both a Python and JS integration, the JS slug typically gets a `-js` suffix (e.g., `anthropic` + `anthropic-js`, `claude-agent-sdk` + `claude-agent-sdk-js`). When there's only a JS version, no suffix is needed.
- JS pages use the `integration-learn-more-js.mdx` component in their final cell instead of the Python one.

## How to safely append an entry

The JSON is formatted with 2-space indentation and one trailing newline. To append by hand:

1. Find the last `}` before the closing `]`.
2. Add a comma after it.
3. Add your new object with 2-space indentation.
4. Keep the closing `]` and trailing newline.

Or run `scripts/add_route.py` from this skill, which does this safely:

```bash
python3 <skill-dir>/scripts/add_route.py \
  --routes cookbook/_routes.json \
  --notebook integration_<slug>.ipynb \
  --docs-path integrations/<category>/<slug> \
  --is-guide false
```

The script validates the file parses cleanly before writing, and it refuses to duplicate an existing `notebook` entry.
