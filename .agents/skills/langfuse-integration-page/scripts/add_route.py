#!/usr/bin/env python3
"""Safely append a new entry to `cookbook/_routes.json`.

The file is a JSON array of objects with fields `notebook`, `docsPath`, and
`isGuide`. This script:
- validates the file parses cleanly before and after
- refuses to duplicate an existing `notebook` entry
- preserves 2-space indentation and a trailing newline

Usage:
    python add_route.py --routes cookbook/_routes.json \
        --notebook integration_mastra.ipynb \
        --docs-path integrations/frameworks/mastra \
        --is-guide false
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--routes", required=True, help="path to cookbook/_routes.json")
    p.add_argument("--notebook", required=True, help="notebook filename, e.g. integration_mastra.ipynb")
    p.add_argument("--docs-path", required=True, help="docsPath value, e.g. integrations/frameworks/mastra. Pass 'null' to use JSON null.")
    p.add_argument("--is-guide", default="false", choices=["true", "false"], help="isGuide value (default false)")
    p.add_argument("--dry-run", action="store_true", help="print the new file to stdout instead of writing")
    args = p.parse_args()

    routes_path = Path(args.routes)
    with open(routes_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        print(f"Error: {routes_path} is not a JSON array", file=sys.stderr)
        return 1

    # Duplicate check
    for entry in data:
        if isinstance(entry, dict) and entry.get("notebook") == args.notebook:
            print(f"Error: notebook {args.notebook!r} is already in routes", file=sys.stderr)
            return 1

    new_entry = {
        "notebook": args.notebook,
        "docsPath": None if args.docs_path.lower() == "null" else args.docs_path,
        "isGuide": args.is_guide == "true",
    }
    data.append(new_entry)

    rendered = json.dumps(data, indent=2, ensure_ascii=False) + "\n"
    if args.dry_run:
        sys.stdout.write(rendered)
    else:
        with open(routes_path, "w", encoding="utf-8") as f:
            f.write(rendered)
        print(f"Appended {args.notebook} -> {args.docs_path} (isGuide={args.is_guide}) to {routes_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
