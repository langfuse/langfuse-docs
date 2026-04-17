#!/usr/bin/env python3
"""Build a Langfuse integration notebook from a structured spec.

The Jupyter notebook JSON format is easy to get subtly wrong (trailing commas,
missing source arrays, un-split source strings). This script takes a spec and
emits a notebook that matches the shape of the existing
`cookbook/integration_*.ipynb` files exactly.

Spec schema (JSON):

{
  "title_metadata": {                    # required
    "title": "...",                      # H1 in docs
    "sidebar_title": "...",              # short nav label
    "logo": "/images/integrations/<slug>_icon.svg",
    "description": "...",                # SEO description
    "category": "Integrations"           # always "Integrations" for integration pages
  },
  "intro": {                             # required
    "page_title": "# Integrate Langfuse with ...",
    "one_liner": "This notebook walks through ...",
    "partner_blurb": "> **What is X?** [X](url) is ...",
    "langfuse_blurb": "> **What is Langfuse?** [Langfuse](https://langfuse.com) is ..."
  },
  "install": "%pip install langfuse <pkg> -U",  # required. the actual install code line.
  "env_extra": [                         # optional. list of {key, value, comment?}
    {"key": "OPENAI_API_KEY", "value": "sk-proj-..."}
  ],
  "skip_client_init": false,             # optional. default false. set true for openai-drop-in pattern.
  "steps": [                             # optional additional instrument/example steps
    {"markdown": "### Step 3: ...", "code": "..."},
    {"markdown": "### Step 4: ...", "code": "..."}
  ],
  "trace_image_path": "https://langfuse.com/images/cookbook/integration-<slug>/trace.png",
  "example_trace_url": "TODO: paste a public trace URL",  # or a real URL
  "learn_more_variant": "python"         # "python" (default) or "js"
}

Usage:
    python build_notebook.py --out cookbook/integration_X.ipynb --spec /tmp/X.json
    python build_notebook.py --help
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


def _split_source(text: str) -> list[str]:
    """Split a string into the Jupyter 'source' list-of-strings form.

    Each element except the last ends in '\\n'. An empty string produces [].
    """
    if not text:
        return []
    lines = text.split("\n")
    # All lines except the last get "\n" appended. If the original ended with
    # "\n", the last entry is "" which we drop.
    out = [l + "\n" for l in lines[:-1]]
    if lines[-1]:
        out.append(lines[-1])
    return out


def _md_cell(text: str) -> dict[str, Any]:
    return {
        "cell_type": "markdown",
        "metadata": {"vscode": {"languageId": "raw"}},
        "source": _split_source(text),
    }


def _code_cell(text: str) -> dict[str, Any]:
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": _split_source(text),
    }


def _metadata_comment(meta: dict[str, str]) -> str:
    """Render the NOTEBOOK_METADATA comment with attributes in the canonical order.

    Keeps double-quoted values on a single line (required by move_docs.py parser).
    """
    order = ["source", "title", "sidebarTitle", "logo", "description", "category"]
    parts = [f'{k}: "{meta[k]}"' for k in order if k in meta]
    return "<!-- NOTEBOOK_METADATA " + " ".join(parts) + " -->"


def _env_var_block(extras: list[dict[str, str]]) -> str:
    lines = [
        "import os",
        "",
        "# Get keys for your project from the project settings page: https://cloud.langfuse.com",
        'os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."',
        'os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."',
        'os.environ["LANGFUSE_BASE_URL"] = "https://cloud.langfuse.com" # 🇪🇺 EU region',
        '# os.environ["LANGFUSE_BASE_URL"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region',
    ]
    if extras:
        lines.append("")
        for e in extras:
            c = f"  # {e['comment']}" if e.get("comment") else ""
            lines.append(f'os.environ["{e["key"]}"] = "{e["value"]}"{c}')
    return "\n".join(lines)


def _client_init_cells() -> list[dict[str, Any]]:
    md = (
        "With the environment variables set, initialize the Langfuse client. "
        "`get_client()` picks up the env vars above and returns a client bound to your project.\n"
    )
    code = (
        "from langfuse import get_client\n"
        "\n"
        "langfuse = get_client()\n"
        "\n"
        "# Verify connection\n"
        "if langfuse.auth_check():\n"
        '    print("Langfuse client is authenticated and ready!")\n'
        "else:\n"
        '    print("Authentication failed. Please check your credentials and host.")'
    )
    return [_md_cell(md), _code_cell(code)]


def _view_traces_cell(spec: dict[str, Any], step_n: int) -> dict[str, Any]:
    title_meta = spec["title_metadata"]
    img = spec.get("trace_image_path") or "https://langfuse.com/images/cookbook/integration-SLUG/trace.png"
    url = spec.get("example_trace_url") or "TODO: paste a public example trace URL from cloud.langfuse.com"
    partner_short = title_meta.get("sidebarTitle") or title_meta.get("sidebar_title") or "Partner"
    text = (
        f"## Step {step_n}: View Traces in Langfuse\n"
        "\n"
        "After running the example, open your [Langfuse dashboard](https://cloud.langfuse.com) "
        "to see the full trace including prompts, completions, tool calls, token usage, and latency.\n"
        "\n"
        f"![Example {partner_short} trace in Langfuse]({img})\n"
        "\n"
        f"[Example trace in Langfuse]({url})\n"
        "\n"
        "<!-- STEPS_END -->"
    )
    return _md_cell(text)


def _learn_more_cell(variant: str) -> dict[str, Any]:
    path = "@/components-mdx/integration-learn-more.mdx"
    if variant == "js":
        path = "@/components-mdx/integration-learn-more-js.mdx"
    return _md_cell(f'<!-- MARKDOWN_COMPONENT name: "LearnMore" path: "{path}" -->')


def build(spec: dict[str, Any]) -> dict[str, Any]:
    tm = spec["title_metadata"]
    # normalize keys: allow snake_case or camelCase in the spec
    normalized = {
        "source": tm.get("source", "⚠️ Jupyter Notebook"),
        "title": tm["title"],
        "sidebarTitle": tm.get("sidebarTitle") or tm.get("sidebar_title"),
        "logo": tm["logo"],
        "description": tm["description"],
        "category": tm.get("category", "Integrations"),
    }
    if not normalized["sidebarTitle"]:
        raise ValueError("title_metadata.sidebarTitle (or sidebar_title) is required")

    intro = spec["intro"]
    cell1 = (
        _metadata_comment(normalized)
        + "\n\n"
        + intro["page_title"].lstrip()  # should start with '# '
        + "\n\n"
        + intro["one_liner"]
        + "\n\n"
        + intro["partner_blurb"]
        + "\n\n"
        + intro["langfuse_blurb"]
    )

    cells: list[dict[str, Any]] = [_md_cell(cell1)]

    # Step 1: install
    cells.append(_md_cell("<!-- STEPS_START -->\n## Step 1: Install Dependencies"))
    cells.append(_code_cell(spec["install"]))

    # Step 2: env vars
    cells.append(
        _md_cell(
            "## Step 2: Set Up Environment Variables\n"
            "\n"
            "Get your Langfuse keys from the project settings at https://cloud.langfuse.com "
            "or set up [self-hosting](https://langfuse.com/self-hosting)."
        )
    )
    cells.append(_code_cell(_env_var_block(spec.get("env_extra") or [])))

    # Optional client init pair
    if not spec.get("skip_client_init", False):
        cells.extend(_client_init_cells())

    # Caller-provided instrumentation + example steps
    for step in spec.get("steps") or []:
        if step.get("markdown"):
            cells.append(_md_cell(step["markdown"]))
        if step.get("code"):
            cells.append(_code_cell(step["code"]))

    # Final "view traces" step. Its number is 3 (for drop-in) or 4 (otherwise) + number of custom steps.
    base_step = 3 if spec.get("skip_client_init") else 3
    # The install is step 1, env vars is step 2, then client init (not a numbered step), then custom steps.
    # We count the number of "### Step N:" or "## Step N:" markdown prefixes in spec.steps to derive N.
    custom_step_count = 0
    for s in spec.get("steps") or []:
        md = s.get("markdown") or ""
        if md.lstrip().startswith(("## Step", "### Step")):
            custom_step_count += 1
    final_step_n = 2 + custom_step_count + 1
    cells.append(_view_traces_cell(spec, final_step_n))

    # Learn more
    cells.append(_learn_more_cell(spec.get("learn_more_variant", "python")))

    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3",
            },
            "language_info": {
                "name": "python",
            },
        },
        "nbformat": 4,
        "nbformat_minor": 5,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", required=True, help="output .ipynb path")
    parser.add_argument("--spec", required=True, help="path to spec JSON")
    parser.add_argument("--stdin", action="store_true", help="read spec from stdin instead of --spec (spec still required but ignored)")
    args = parser.parse_args()

    if args.stdin:
        spec = json.load(sys.stdin)
    else:
        with open(args.spec, "r", encoding="utf-8") as f:
            spec = json.load(f)

    nb = build(spec)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
