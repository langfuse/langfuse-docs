#!/usr/bin/env python3
"""Prove that a React port draws exactly what the approved mock draws.

  svg-parity.py MOCK PAGE

MOCK and PAGE are URLs or local HTML files. Both are loaded in headless Chrome, every tilted drawing in
each is reduced to its elements, attributes and text, and the two lists are compared in page order.
Ignored on purpose: element ids, and the two known spellings of the button shadow's paint (a CSS variable
in the mock, utility classes in the component). Any other shadow paint counts as a difference.
Exit code 0 only if every pair is identical.
"""
import os
import re
import shutil
import subprocess
import sys
from html.parser import HTMLParser


def chrome():
    found = os.environ.get("CHROME")
    for c in ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "google-chrome", "chromium", "chromium-browser"):
        if found:
            break
        if os.path.exists(c) or shutil.which(c):
            found = c
    if not found:
        sys.exit("Chrome not found; set CHROME=/path/to/chrome")
    return found


def dom(target):
    if not re.match(r"^(https?|file):", target):
        path, _, query = target.partition("?")
        target = "file://" + os.path.abspath(path) + ("?" + query if query else "")
    args = [chrome(), "--headless=new", "--disable-gpu", "--window-size=1440,1600", "--virtual-time-budget=10000", "--dump-dom", target]
    return subprocess.run(args, capture_output=True, text=True).stdout


class Drawings(HTMLParser):
    """Collects the tokens of every top-level <svg> on a page. The parser never reports markup that sits
    inside a <script>, so a drawing in a template string is not counted."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.found, self.depth = [], 0

    def handle_starttag(self, tag, attrs):
        if tag == "svg":
            if not self.depth:
                self.found.append([])
            self.depth += 1
        if self.depth:
            self.found[-1].append(["<", tag, dict(attrs)])

    def handle_endtag(self, tag):
        if self.depth:
            self.found[-1].append([">", tag])
            if tag == "svg":
                self.depth -= 1

    def handle_data(self, data):
        if self.depth and data.strip():
            self.found[-1].append(["#", data.strip()])


def drawings(html):
    parser = Drawings()
    parser.feed(html)
    # every tilted drawing defines the 45 degree hatch pattern
    return [d for d in parser.found if any(t[0] == "<" and "rotate(45)" in " ".join(v or "" for v in t[2].values()) for t in d)]


# The button shadow is 8% black in light and 28% in dark, spelled two ways.
SHADOW_PAINT = (
    {"fill": "var(--shadow)", "opacity": "0.5"},  # the mock: --shadow is 16% or 56% black
    {"class": "fill-black opacity-[0.08] dark:opacity-[0.28]"},  # the component
)


def canon(tokens):
    ids = {}

    def cid(name):
        return ids.setdefault(name, f"id{len(ids)}")

    result = []
    for token in tokens:
        if token[0] != "<":
            result.append(tuple(token))
            continue
        attrs = dict(token[2])
        if token[1] == "polygon" and "filter" in attrs:
            paint = {key: attrs[key] for key in ("fill", "opacity", "class") if key in attrs}
            if paint in SHADOW_PAINT:
                for key in paint:
                    del attrs[key]
                attrs["paint"] = "button shadow"
        if "id" in attrs:
            attrs["id"] = cid(attrs["id"])
        for key, value in attrs.items():
            if value and "url(#" in value:
                attrs[key] = re.sub(r"url\(#([^)]+)\)", lambda m: f"url(#{cid(m.group(1))})", value)
        result.append(("<", token[1], tuple(sorted(attrs.items()))))
    return result


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    mock, page = drawings(dom(sys.argv[1])), drawings(dom(sys.argv[2]))
    print(f"mock drawings: {len(mock)} | page drawings: {len(page)}")
    different = 0
    for i, (a, b) in enumerate(zip(mock, page), 1):
        ca, cb = canon(a), canon(b)
        if ca == cb:
            print(f"  {i}: identical ({len(ca)} tokens)")
            continue
        different += 1
        print(f"  {i}: DIFFERENT ({len(ca)} vs {len(cb)} tokens)")
        shown = 0
        for p, q in zip(ca, cb):
            if p != q:
                print("     mock:", str(p)[:240])
                print("     page:", str(q)[:240])
                shown += 1
                if shown == 3:
                    break
    ok = not different and len(mock) == len(page) and mock
    print("RESULT:", f"all {len(mock)} identical" if ok else f"{different} differ, counts {len(mock)} vs {len(page)}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
