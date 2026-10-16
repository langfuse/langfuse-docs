#!/usr/bin/env python3
"""Print image width and height using the Python standard library.

Usage: python3 .agents/skills/publish-customer-story/image-size.py <file>

Prints "<width> <height>" for PNG, JPEG, GIF, WebP, and SVG. SVG size comes
from viewBox, or from width and height on the root <svg> element. Works on
macOS and Linux. Exits non-zero when the size cannot be read.
"""

import re
import struct
import sys


def raster_size(data):
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return struct.unpack(">II", data[16:24])
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return struct.unpack("<HH", data[6:10])
    if data[:2] == b"\xff\xd8":
        index = 2
        while index + 8 < len(data) and data[index] == 0xFF:
            marker = data[index + 1]
            if marker in (0xC0, 0xC1, 0xC2):
                height, width = struct.unpack(">HH", data[index + 5 : index + 9])
                return width, height
            if marker in (0x01, 0xD8) or 0xD0 <= marker <= 0xD7:
                index += 2
            else:
                index += 2 + struct.unpack(">H", data[index + 2 : index + 4])[0]
        return None
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        chunk = data[12:16]
        if chunk == b"VP8X":
            width = 1 + int.from_bytes(data[24:27], "little")
            height = 1 + int.from_bytes(data[27:30], "little")
            return width, height
        if chunk == b"VP8 ":
            width, height = struct.unpack("<HH", data[26:30])
            return width & 0x3FFF, height & 0x3FFF
        if chunk == b"VP8L":
            bits = int.from_bytes(data[21:25], "little")
            return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
        return None
    return None


def svg_size(data):
    text = data.decode("utf-8", "replace")
    view_box = re.search(
        r'viewBox\s*=\s*["\']\s*[-+\d.eE]+\s+[-+\d.eE]+\s+([\d.eE]+)\s+([\d.eE]+)',
        text,
    )
    if view_box:
        return float(view_box.group(1)), float(view_box.group(2))
    width = re.search(r"<svg\b[^>]*\bwidth\s*=\s*[\"']\s*([\d.]+)", text)
    height = re.search(r"<svg\b[^>]*\bheight\s*=\s*[\"']\s*([\d.]+)", text)
    if width and height:
        return float(width.group(1)), float(height.group(1))
    return None


def format_number(value):
    number = float(value)
    if number.is_integer():
        return str(int(number))
    return str(number)


def main():
    if len(sys.argv) != 2:
        print(
            "usage: python3 .agents/skills/publish-customer-story/image-size.py <file>",
            file=sys.stderr,
        )
        return 2
    path = sys.argv[1]
    try:
        with open(path, "rb") as handle:
            data = handle.read()
    except OSError as error:
        print(f"could not read {path}: {error}", file=sys.stderr)
        return 1
    size = raster_size(data)
    if size is None:
        size = svg_size(data)
    if size is None:
        print(f"could not read image size: {path}", file=sys.stderr)
        return 1
    width, height = size
    print(f"{format_number(width)} {format_number(height)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
