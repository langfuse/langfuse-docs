#!/usr/bin/env python3
"""Prove that a React port draws exactly what the approved mock draws.

  svg-parity.py MOCK PAGE

MOCK and PAGE are URLs or local HTML files. Both are loaded in headless Chrome, every tilted drawing in
each is reduced to its elements, attributes and text, and the two lists are compared in page order.
Ignored on purpose: element ids, and how the button shadow gets its colour (a CSS variable in the mock,
utility classes in the component). Exit code 0 only if every pair is identical.
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


def drawings(html):
    # every tilted drawing defines the 45 degree hatch pattern; script source is not markup
    html = re.sub(r"<script\b.*?</script>", "", html, flags=re.S)
    return [m for m in re.findall(r"<svg\b.*?</svg>", html, flags=re.S) if "rotate(45)" in m]


class Tokens(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.out = []

    def handle_starttag(self, tag, attrs):
        self.out.append(["<", tag, dict(attrs)])

    def handle_endtag(self, tag):
        self.out.append([">", tag])

    def handle_data(self, data):
        if data.strip():
            self.out.append(["#", data.strip()])


def canon(svg):
    parser = Tokens()
    parser.feed(svg)
    ids = {}

    def cid(name):
        return ids.setdefault(name, f"id{len(ids)}")

    result = []
    for token in parser.out:
        if token[0] != "<":
            result.append(tuple(token))
            continue
        attrs = dict(token[2])
        if token[1] == "polygon" and "filter" in attrs:
            for key in ("fill", "opacity", "class"):
                attrs.pop(key, None)
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
