# Fill-in-the-blanks notebook template

This is the markdown-only view of a complete integration notebook. Each "cell" below is a separate cell in the .ipynb. Use this as a final check after generating a notebook — every integration page should look like this.

Placeholder convention: `<PARTNER>` for the human-readable name, `<partner>` for the slug (kebab-case), `<PARTNER_PKG>` for the PyPI name.

---

**Cell 1 — markdown**

```
<!-- NOTEBOOK_METADATA source: "⚠️ Jupyter Notebook" title: "Observability for <PARTNER> with Langfuse" sidebarTitle: "<PARTNER short>" logo: "/images/integrations/<partner>_icon.svg" description: "<SEO-friendly one-sentence description mentioning both Langfuse and <PARTNER>.>" category: "Integrations" -->

# Integrate Langfuse with <PARTNER>

This notebook shows how to integrate **Langfuse** with **<PARTNER>** to trace, debug, and evaluate your LLM application.

> **What is <PARTNER>?** [<PARTNER>](<partner-url>) is <one sentence about <PARTNER>>.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open-source LLM engineering platform that helps teams trace, debug, and evaluate their LLM applications.
```

**Cell 2 — markdown**

```
<!-- STEPS_START -->
## Step 1: Install Dependencies
```

**Cell 3 — code**

```
%pip install langfuse <PARTNER_PKG> -U
```

**Cell 4 — markdown**

```
## Step 2: Set Up Environment Variables

Get your Langfuse keys from the project settings in [Langfuse Cloud](https://langfuse.com/cloud) or set up [self-hosting](https://langfuse.com/self-hosting).
```

**Cell 5 — code**

```python
import os

# Get keys for your project from the project settings page: https://langfuse.com/cloud
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_BASE_URL"] = "https://cloud.langfuse.com" # 🇪🇺 EU region (API host)
# os.environ["LANGFUSE_BASE_URL"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region (API host)

# <PARTNER> API key
os.environ["<PARTNER>_API_KEY"] = "..."
```

**Cell 6 — markdown** *(skip for the OpenAI drop-in pattern)*

```
With the environment variables set, initialize the Langfuse client. `get_client()` picks up the env vars above and returns a client bound to your project.
```

**Cell 7 — code** *(skip for the OpenAI drop-in pattern)*

```python
from langfuse import get_client

langfuse = get_client()

# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

**Cells 8+ — pattern-specific instrumentation + runnable example**

See `references/patterns.md` for the four patterns. Each pattern defines what goes in these cells.

**Cell N − 1 — markdown (end of steps)**

```
## Step N: View Traces in Langfuse

After running the example, open [Langfuse Cloud](https://langfuse.com/cloud) to see the full trace including prompts, completions, tool calls, token usage, and latency.

![Example <PARTNER> trace in Langfuse](https://langfuse.com/images/cookbook/integration-<partner>/<partner>-example-trace.png)

[Example trace in Langfuse](<TODO: paste a public example trace URL from your Langfuse Cloud project>)

<!-- STEPS_END -->
```

**Cell N — markdown (learn more component)**

```
<!-- MARKDOWN_COMPONENT name: "LearnMore" path: "@/components-mdx/integration-learn-more.mdx" -->
```

For JS integrations, use `@/components-mdx/integration-learn-more-js.mdx` instead.

---

## Pre-flight checklist

Before considering the notebook done, verify:

- [ ] Metadata comment is on the very first line of the first cell (no blank line before).
- [ ] All metadata attributes use double quotes.
- [ ] `logo:` points to `/images/integrations/<partner>_icon.<ext>` and the file actually exists there (or you've left a TODO).
- [ ] `sidebarTitle` is short enough to fit in the nav (≤ ~15 chars is ideal).
- [ ] `<!-- STEPS_START -->` appears exactly once.
- [ ] `<!-- STEPS_END -->` appears exactly once, after the final step.
- [ ] Both Langfuse regions (EU + commented US) appear in the env var cell.
- [ ] The final markdown cell is the `LearnMore` component.
- [ ] `cookbook/_routes.json` has a matching entry with `docsPath: "integrations/<category>/<slug>"`.
- [ ] The slug in `_routes.json` matches the filename and the `logo:` path exactly.
