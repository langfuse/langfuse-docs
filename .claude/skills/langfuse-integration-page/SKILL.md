---
name: langfuse-integration-page
description: Create a new Langfuse integration page in the langfuse-docs repo. Use this skill whenever the user wants to add, create, draft, or scaffold an integration page, cookbook, or docs page for a new tool/framework/model-provider/gateway in Langfuse — triggers include "new integration", "integration page", "docs page for <X>", "cookbook for <X>", "add <X> to langfuse docs", or any request that results in a new `cookbook/integration_*.ipynb`. Also use when the user pastes working integration code, a link to a partner's docs, or rough notes and wants them turned into the standard Langfuse integration notebook. The skill produces a correctly formatted Jupyter notebook, updates `cookbook/_routes.json`, and tries to fetch the partner logo into `public/images/integrations/`.
---

# Langfuse integration page creator

This skill scaffolds a new integration page for the [langfuse-docs](https://github.com/langfuse/langfuse-docs) site. Integration pages live as Jupyter notebooks in `cookbook/integration_<slug>.ipynb` and are converted to MDX by `scripts/update_cookbook_docs.sh` using the mapping in `cookbook/_routes.json`. Getting the notebook metadata block, the `STEPS_START`/`STEPS_END` wrapper, and the routes entry right is the whole job — once those are correct, the build does the rest.

## What to produce

Three things, always, in the user's `langfuse-docs` checkout:

1. A new notebook at `cookbook/integration_<slug>.ipynb` that matches the house template (see "Notebook structure" below).
2. A new entry appended to `cookbook/_routes.json` pointing at the notebook and the target `docsPath`.
3. A best-effort logo download into `public/images/integrations/<slug>_icon.<ext>`. If fetching fails, leave a TODO for the user.

Do **not** run `scripts/update_cookbook_docs.sh` yourself — that regenerates many files and is slow (~10 min build). The user runs it when they're ready.

## Step 1 — Gather what you need, up front

Before writing anything, collect the following. Ask the user for what's missing using a single `AskUserQuestion` batch where possible. Some answers are mutually exclusive (pick-one); some can be inferred from context.

**Always ask (these determine the template and the routes entry):**

- **Integration name** — the human-readable name (e.g., "Pydantic AI", "Fireworks AI", "Temporal"). Used in the title and intro.
- **Slug** — kebab-case, used in the filename, logo path, and `docsPath`. Default to the name lowercased with spaces → hyphens, but confirm. Example: "Pydantic AI" → `pydantic-ai`; "Fireworks AI" → `fireworks-ai`.
- **Category** — one of: `model-providers`, `frameworks`, `gateways`, `other`. This is the `<category>` segment in `docsPath: "integrations/<category>/<slug>"`. Guidance:
  - `model-providers`: inference APIs (OpenAI-compatible or otherwise) — Anthropic, Cohere, Fireworks, Groq, Bedrock, Vertex, Gemini, etc.
  - `frameworks`: agent/app frameworks — LangChain, CrewAI, Pydantic AI, Google ADK, Temporal, Semantic Kernel, etc.
  - `gateways`: LLM proxies/routers — Portkey, LiteLLM proxy, TrueFoundry, OpenRouter, Kong AI, etc.
  - `other`: anything else — scraping (Firecrawl, Exa), UIs (Gradio, LibreChat), dev tools, etc.
- **Language** — `python` (default) or `js`. JS integrations use the filename prefix `js_integration_<slug>.ipynb` and commonly get a `-js` suffix in the slug when both exist (e.g., `anthropic-js`, `claude-agent-sdk-js`).
- **Instrumentation pattern** — pick one (this determines the template body). See `references/patterns.md` for full details and match it to the integration:
  - `openinference` — OpenInference instrumentor library (e.g., `openinference-instrumentation-google-adk`). Most common for agent frameworks.
  - `openai-drop-in` — The partner is OpenAI-compatible; use `from langfuse.openai import openai`. Common for inference providers (Fireworks, Groq, DeepSeek, etc.).
  - `framework-native` — Framework has built-in instrumentation hook (e.g., `Agent.instrument_all()` for Pydantic AI).
  - `otel-direct` — Partner emits OTel natively; configure an OTLP exporter pointing at Langfuse. Less common; used for things like Temporal, some MLflow setups.

**Ask if not obvious:**

- **Intro blurb about the partner** — one sentence ("What is X?"). If the user didn't give one and there's a URL, you can draft it and confirm.
- **Logo source** — if the user provided a URL, great; if not, see Step 4 for the fetch heuristic.
- **Install command, env vars beyond the Langfuse ones, and a minimal runnable example** — needed for the code cells. If missing, draft from docs and mark as `TODO: confirm`.

### How to ask

Use `AskUserQuestion` with options formatted as the four categories and four patterns. Keep the number of questions ≤ 4. If the user gave full context (e.g., they pasted a complete code example and mentioned the framework), skip questions you can answer confidently from context and just confirm in your response.

## Step 2 — Generate the notebook

You have two ways to create the `.ipynb`:

1. **Preferred: use the bundled builder script** `scripts/build_notebook.py`. It takes a structured JSON/YAML description of the cells and writes a properly formatted notebook. Using the script avoids subtle JSON errors (trailing commas, missing `"source"` arrays, line-split source strings) that break `nbconvert`.

   ```bash
   python3 <skill-dir>/scripts/build_notebook.py \
     --out cookbook/integration_<slug>.ipynb \
     --spec /tmp/<slug>_spec.json
   ```

   See the script's `--help` for the spec schema. There are examples at the bottom of `references/patterns.md`.

2. Fallback: write the `.ipynb` file directly. If you do this, open an existing notebook (e.g., `cookbook/integration_pydantic_ai.ipynb`) first and mirror its JSON shape exactly. Be careful: every `source` field is a list of strings, each ending in `\n` except the last; markdown cells carry `"metadata": {"vscode": {"languageId": "raw"}}`; code cells carry `"execution_count": null, "outputs": []`.

Whichever route you pick, the cell structure must match the house template.

### Notebook structure (the template)

Every integration page has the same skeleton. Section order matters because the MDX converter in `scripts/move_docs.py` reads the `NOTEBOOK_METADATA` comment from the top of the first cell and wraps everything between `STEPS_START` and `STEPS_END` in a `<Steps>` component.

**Cell 1 — markdown. Metadata + intro.**

The first line is a single-line HTML comment with all the page metadata. Attribute format is `key: "value"` (double-quoted), space-separated, on one line. Required keys:

```
<!-- NOTEBOOK_METADATA source: "⚠️ Jupyter Notebook" title: "<Page title>" sidebarTitle: "<Short nav label>" logo: "/images/integrations/<slug>_icon.<ext>" description: "<1-sentence SEO description>" category: "Integrations" -->
```

Then the page H1, a 1-sentence intro, and two blockquote callouts:

```markdown
# Integrate Langfuse with <Partner Name>

This notebook shows how to integrate **Langfuse** with **<Partner>** to [monitor / debug / trace / evaluate] your LLM application.

> **What is <Partner>?** [<Partner>](<partner url>) is <one sentence about the partner>.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open-source LLM engineering platform that helps teams trace, debug, and evaluate their LLM applications.
```

Title-writing notes: prefer "Observability for <Partner> with Langfuse" for model providers and inference APIs, "Integrate Langfuse with <Partner>" for frameworks, and "Trace <Partner> Workflows with Langfuse" for orchestration tools. Sidebar title is the short name (e.g., "Pydantic AI", "Fireworks AI", "Temporal").

**Cell 2 — markdown. Start of steps.**

```markdown
<!-- STEPS_START -->
## Step 1: Install Dependencies
```

**Cell 3 — code. Install.**

```python
%pip install langfuse <partner-package> -U
```

Use `-U` to upgrade. For JS notebooks, use `npm install` in a shell cell (see the JS examples in `cookbook/js_integration_*.ipynb`).

**Cell 4 — markdown. Env var setup prose.**

One short paragraph mentioning that keys come from Langfuse project settings, linking to [Langfuse Cloud](https://langfuse.com/cloud) and `https://langfuse.com/self-hosting`.

**Cell 5 — code. Env vars.**

Always include the three Langfuse vars in this exact shape (both regions, US commented out) plus whatever the partner needs:

```python
import os

# Get keys for your project from the project settings page: https://langfuse.com/cloud
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_BASE_URL"] = "https://cloud.langfuse.com" # 🇪🇺 EU region (API host)
# os.environ["LANGFUSE_BASE_URL"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region (API host)

# <Partner> API key
os.environ["<PARTNER>_API_KEY"] = "..."
```

**Cell 6 — markdown + cell 7 — code. Initialize Langfuse client with auth check.** (Skip this pair for the `openai-drop-in` pattern, which relies on the langfuse OpenAI wrapper instead.)

```python
from langfuse import get_client

langfuse = get_client()

# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

**Cells 8+ — Instrumentation + runnable example.** These are pattern-specific. See `references/patterns.md` for the exact cell bodies for each of the four patterns.

**Final steps cell — markdown. View traces.**

```markdown
## Step N: View Traces in Langfuse

After running the example, open [Langfuse Cloud](https://langfuse.com/cloud) to see the trace, including prompts, completions, tool calls, token usage, and latency.

![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-<slug>/<slug>-example-trace.png)

<!-- TODO: replace with your actual trace screenshot (upload to langfuse.com images) and example trace link -->
[Example trace in Langfuse](<example trace URL or placeholder>)

<!-- STEPS_END -->
```

**Last cell — markdown. LearnMore.**

```markdown
<!-- MARKDOWN_COMPONENT name: "LearnMore" path: "@/components-mdx/integration-learn-more.mdx" -->
```

For JS integrations use `@/components-mdx/integration-learn-more-js.mdx` instead.

### Why these shapes matter

`move_docs.py` does five specific transforms on the raw markdown that `nbconvert` produces:

1. Turns the top `NOTEBOOK_METADATA` HTML comment into YAML frontmatter.
2. Turns `STEPS_START`/`STEPS_END` into a `<Steps>` MDX component.
3. Turns `TABS_START`/`TABS_END` (if present) into `<Tabs>`.
4. Turns `CALLOUT_START`/`CALLOUT_END` (if present) into `<Callout>`.
5. Turns `MARKDOWN_COMPONENT`/`COMPONENT` comments into JSX imports + usages.

Anything you write outside these transforms flows through unchanged, so standard markdown works. The three most common mistakes are: metadata not on the very first line of the first cell, `STEPS_START` or `STEPS_END` missing, and single quotes instead of double quotes in the metadata attributes.

## Step 3 — Update `cookbook/_routes.json`

Read `cookbook/_routes.json`, append a new object to the JSON array, and write it back. Use this shape for integration pages:

```json
{
  "notebook": "integration_<slug>.ipynb",
  "docsPath": "integrations/<category>/<slug>",
  "isGuide": false
}
```

Notes:

- `<slug>` in `notebook` and in `docsPath` must match exactly.
- For JS integrations, use `"notebook": "js_integration_<slug>.ipynb"`; the slug in `docsPath` typically has a `-js` suffix if a Python version also exists (e.g., `anthropic` + `anthropic-js`, `claude-agent-sdk` + `claude-agent-sdk-js`).
- `isGuide: false` for dedicated integration pages. Set `isGuide: true` only if the user explicitly wants the notebook to also appear under `content/guides/cookbook/`. Most integration pages are `false`; a handful of integration-adjacent notebooks (`integration_anthropic.ipynb`, `integration_llama_index.ipynb`) are `true` because they double as general guides.
- If `docsPath` is omitted or `null`, the notebook is only published as a guide — not what you want for an integration page.
- Append the entry at the bottom of the array to keep diffs clean. Preserve 2-space indentation and the trailing newline. Be careful with the comma on the previous entry.

If you can edit JSON by hand, do that. If you'd rather not eyeball it, there's `scripts/add_route.py` in this skill that does a safe append.

## Step 4 — Fetch the logo

Heuristic, in order. Stop at the first one that succeeds:

1. If the user gave a URL to a logo file, download it directly.
2. Try the partner's marketing site favicon: `https://<partner-domain>/favicon.svg`, then `favicon.png`, then `/apple-touch-icon.png`.
3. Try a Clearbit-style lookup: `https://logo.clearbit.com/<partner-domain>` (returns a PNG).
4. Give up and leave a TODO.

Save to `public/images/integrations/<slug>_icon.<ext>` preserving the extension. SVG is preferred; PNG is fine. The `logo:` field in the notebook metadata needs to point at this path.

Use `curl -sSfL -o <dest> <url>` in bash. Check the result is non-empty and looks like a valid image before using it — if `curl` returns an HTML error page saved as `.svg`, that's worse than a missing file.

If the fetch fails, leave the notebook's `logo:` field pointing at the expected path anyway and tell the user they need to upload the logo manually.

## Step 5 — Summarize what you did

End your turn with a short summary listing:

- The notebook path
- The routes entry you added
- The logo status (fetched to path / TODO)
- Placeholders the user still needs to fill (trace screenshot URL, example trace link, anything you marked `TODO: confirm`)
- The command the user should run when ready: `bash scripts/update_cookbook_docs.sh` (run from the repo root)
- A reminder to check that the partner's `-U` install line makes sense and to run the notebook end-to-end once before publishing

## Reference files

- `references/patterns.md` — exact cell bodies for each of the four instrumentation patterns, with real examples from the existing notebooks.
- `references/routes-json-schema.md` — fields in `cookbook/_routes.json` and when to use `isGuide: true`.
- `references/notebook-template.md` — a fill-in-the-blanks version of the full notebook.

## Bundled scripts

- `scripts/build_notebook.py` — takes a spec JSON and produces a properly formatted `.ipynb`. Safer than hand-writing JSON.
- `scripts/add_route.py` — appends an entry to `cookbook/_routes.json` without breaking the existing formatting.
