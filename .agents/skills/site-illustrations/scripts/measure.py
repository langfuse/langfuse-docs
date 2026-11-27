#!/usr/bin/env python3
"""Measure a tilted line illustration (an original export or a screenshot of your drawing).

No dependencies. Reads 8-bit PNG (grey, RGB, RGBA or palette, not interlaced).

  measure.py check  FILE                      block and shadow against the limits below; PASS or FAIL per line
  measure.py block  FILE                      corners, edge angles and lift of the raised button
  measure.py shadow FILE                      how far the button's shadow reaches and how dark it is
  measure.py colors FILE                      the saturated accent colours, with their topmost and leftmost pixel
  measure.py crop   FILE OUT X Y W H [ZOOM]   cut a region out, enlarged ZOOM times without smoothing

FILE is one drawing on the light floor at one plane unit per pixel: an original export, or a screenshot
of one card taken at device scale 1.6667. check, block and shadow read the largest dark shape, so they
only mean something when the raised button stands alone (no dark line or tag touching it).

check exits 0 when every line passes, 1 when one fails, 2 when the picture has no free-standing button.
"""
import collections
import colorsys
import math
import struct
import sys
import zlib

FLOOR = (246, 246, 243)  # --surface-bg, used where the export is transparent

# Limits for `check`. The originals read 19.9 to 20.0, 59.5 to 59.9 and a lift of 14 to 16; kit drawings
# read 19.9 to 20.0, 59.8 to 60.3 and 16 to 18 (the lift is a hull edge and includes the 2-unit outline).
# The shadow is evaluation.png's: about 15 px, 6%.
LIMITS = {
    "plane x": (19.5, 20.5, "deg"),
    "plane y": (59.0, 61.0, "deg"),
    "lift": (14.0, 19.0, "px"),
    "shadow reach": (12.0, 18.0, "px"),
    "shadow darkest": (4.0, 8.0, "%"),
    "shadow to the left": (0.0, 5.0, "of 255"),
}


def load(path):
    data = open(path, "rb").read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        sys.exit(f"{path}: not a PNG")
    pos, idat, palette, trns = 8, b"", None, None
    while pos < len(data):
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            w, h, depth, ctype, _, _, interlace = struct.unpack(">IIBBBBB", body)
        elif kind == b"PLTE":
            palette = body
        elif kind == b"tRNS":
            trns = body
        elif kind == b"IDAT":
            idat += body
        pos += 12 + length
    if depth != 8 or interlace:
        sys.exit(f"{path}: only 8-bit, non-interlaced PNG is supported")
    channels = {0: 1, 2: 3, 3: 1, 6: 4, 4: 2}[ctype]
    stride = w * channels
    raw = zlib.decompress(idat)
    rows, prev = [], bytearray(stride)
    for y in range(h):
        f = raw[y * (stride + 1)]
        cur = bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for i in range(stride):
            a = cur[i - channels] if i >= channels else 0
            b = prev[i]
            c = prev[i - channels] if i >= channels else 0
            if f == 1:
                cur[i] = (cur[i] + a) & 255
            elif f == 2:
                cur[i] = (cur[i] + b) & 255
            elif f == 3:
                cur[i] = (cur[i] + ((a + b) >> 1)) & 255
            elif f == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                cur[i] = (cur[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append(cur)
        prev = cur

    def pixel(x, y):
        o = x * channels
        r = rows[y]
        if ctype == 6:
            return r[o], r[o + 1], r[o + 2], r[o + 3]
        if ctype == 2:
            return r[o], r[o + 1], r[o + 2], 255
        if ctype == 0:
            return r[o], r[o], r[o], 255
        if ctype == 4:
            return r[o], r[o], r[o], r[o + 1]
        i = r[o]
        return palette[3 * i], palette[3 * i + 1], palette[3 * i + 2], (trns[i] if trns and i < len(trns) else 255)

    return w, h, pixel


def luma(p):
    """Brightness of a pixel once it is laid over the floor colour."""
    k = p[3] / 255
    r, g, b = (p[i] * k + FLOOR[i] * (1 - k) for i in range(3))
    return 0.299 * r + 0.587 * g + 0.114 * b


def hull(points):
    pts = sorted(set(points))

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower, upper = [], []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def simplify(h, tolerance=6.0):
    h = h[:]
    changed = True
    while changed and len(h) > 3:
        changed = False
        for i in range(len(h)):
            a, b, c = h[i - 1], h[i], h[(i + 1) % len(h)]
            turn = abs((math.degrees(math.atan2(c[1] - b[1], c[0] - b[0]) - math.atan2(b[1] - a[1], b[0] - a[0])) + 180) % 360 - 180)
            if turn < tolerance or math.hypot(b[0] - a[0], b[1] - a[1]) < 3:
                h.pop(i)
                changed = True
                break
    return h


def outline(w, h, pixel, dark=110):
    """The largest connected dark shape, the raised button's outline: its hull corners and its pixels."""
    is_dark = [[pixel(x, y)[3] > 200 and luma(pixel(x, y)) < dark for x in range(w)] for y in range(h)]
    seen = [[False] * w for _ in range(h)]
    best = []
    for y in range(h):
        for x in range(w):
            if is_dark[y][x] and not seen[y][x]:
                comp, queue = [], collections.deque([(x, y)])
                seen[y][x] = True
                while queue:
                    cx, cy = queue.popleft()
                    comp.append((cx, cy))
                    for dx in (-1, 0, 1):
                        for dy in (-1, 0, 1):
                            nx, ny = cx + dx, cy + dy
                            if 0 <= nx < w and 0 <= ny < h and is_dark[ny][nx] and not seen[ny][nx]:
                                seen[ny][nx] = True
                                queue.append((nx, ny))
                if len(comp) > len(best):
                    best = comp
    if not best:
        sys.exit("no dark outline found")
    return simplify(hull(best)), best


def edges(h):
    for i in range(len(h)):
        a, b = h[i], h[(i + 1) % len(h)]
        dx, dy = b[0] - a[0], b[1] - a[1]
        yield a, b, math.hypot(dx, dy), math.degrees(math.atan2(-dy, dx))


def fitted(shape, a, b):
    """Angle of the stroke between corners a and b, from a line fitted through its dark pixels.
    Two corner points alone are a pixel off at each end, which is a degree on a 54 px edge."""
    length = math.hypot(b[0] - a[0], b[1] - a[1])
    ux, uy = (b[0] - a[0]) / length, (b[1] - a[1]) / length
    pts = []
    for x, y in shape:
        along = (x - a[0]) * ux + (y - a[1]) * uy
        across = (x - a[0]) * uy - (y - a[1]) * ux
        if 0.2 * length <= along <= 0.8 * length and abs(across) <= 3:
            pts.append((x, y))
    if len(pts) < 12:
        return None
    mx, my = sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts)
    sxx = sum((p[0] - mx) ** 2 for p in pts)
    syy = sum((p[1] - my) ** 2 for p in pts)
    sxy = sum((p[0] - mx) * (p[1] - my) for p in pts)
    return math.degrees(-0.5 * math.atan2(2 * sxy, sxx - syy)) % 180


def faces(hl, shape):
    """Long edges of the outline, sorted into plane x, plane y and the vertical lift."""
    xs, ys, lifts = [], [], []
    for a, b, length, angle in edges(hl):
        if length < 12:
            continue
        folded = angle % 180
        if not 85 <= folded <= 95:
            folded = fitted(shape, a, b) or folded
        if 5 < folded < 40:
            xs.append((length, folded))
        elif 100 < folded < 140:
            ys.append((length, 180 - folded))
        elif 85 <= folded <= 95:
            lifts.append(length)
    return xs, ys, lifts


def standalone(hl, xs, ys, lifts):
    """True when the largest dark shape is a raised button and nothing else."""
    return bool(xs and ys and lifts) and len(hl) <= 10 and 17 < max(xs)[1] < 23 and max(lifts) < 24


NOT_A_BUTTON = (
    "  WARNING: the largest dark shape is not a free-standing raised button. The scene has none, its hero is a\n"
    "  slab, or a dark line or tag touches the button. These numbers mean nothing here."
)


def cmd_block(path):
    w, h, pixel = load(path)
    hl, shape = outline(w, h, pixel)
    xs, ys, lifts = faces(hl, shape)
    print(f"{path}: {w}x{h}, outline corners {hl}")
    if not standalone(hl, xs, ys, lifts):
        print(NOT_A_BUTTON)
    if xs:
        print(f"  plane x runs {max(xs)[1]:.1f} deg up-right, top face {max(xs)[0]:.1f} px wide")
    if ys:
        print(f"  plane y runs {max(ys)[1]:.1f} deg down-right, top face {max(ys)[0]:.1f} px deep")
    if lifts:
        print(f"  lift {max(lifts):.1f} px")
    if xs and ys:
        print(f"  width : depth = {max(xs)[0] / max(ys)[0]:.2f}")


def shadow(w, h, pixel, hl):
    """Darkening against the floor in one column below the middle of the button's lower edge, and in one row
    left of its left corner. Only a like-for-like reading: a row or a line in that column changes it."""
    floor = sorted(luma(pixel(x, y)) for y in range(0, h, 7) for x in range(0, w, 7) if pixel(x, y)[3] == 255)
    base = floor[len(floor) * 3 // 4]
    bottom = max(((a, b) for a, b, _, angle in edges(hl) if 5 < angle % 180 < 40), key=lambda e: e[0][1] + e[1][1])
    mx, my = (bottom[0][0] + bottom[1][0]) // 2, (bottom[0][1] + bottom[1][1]) // 2
    left = min(p[0] for p in hl)
    ly = [p[1] for p in hl if p[0] == left]
    below = [round(base - luma(pixel(mx, y)), 1) for y in range(my + 3, min(h, my + 33), 3)]
    side = [round(base - luma(pixel(x, (min(ly) + max(ly)) // 2)), 1) for x in range(left - 3, max(0, left - 33), -3)]
    reach = next((3 * (i + 1) for i, v in enumerate(below) if v < 3), 30)
    darkest = max(below[:max(1, reach // 3)])
    return base, below, side, reach, darkest


def cmd_shadow(path):
    w, h, pixel = load(path)
    hl, shape = outline(w, h, pixel)
    base, below, side, reach, darkest = shadow(w, h, pixel, hl)
    print(f"{path}: floor brightness {base:.0f}")
    if not standalone(hl, *faces(hl, shape)):
        print(NOT_A_BUTTON)
    print(f"  darkening straight below the lower edge, every 3 px: {below}")
    print(f"  darkening left of the left edge, every 3 px:         {side}")
    print(f"  shadow reaches about {reach} px below, darkest {darkest:.0f} of 255 ({darkest / 255 * 100:.0f}%)")


def cmd_check(path):
    w, h, pixel = load(path)
    hl, shape = outline(w, h, pixel)
    xs, ys, lifts = faces(hl, shape)
    print(f"{path}: {w}x{h}")
    if not standalone(hl, xs, ys, lifts):
        print(NOT_A_BUTTON.replace("WARNING", "NOT CHECKED"))
        sys.exit(2)
    _, _, side, reach, darkest = shadow(w, h, pixel, hl)
    got = {
        "plane x": max(xs)[1],
        "plane y": max(ys)[1],
        "lift": max(lifts),
        "shadow reach": reach,
        "shadow darkest": darkest / 255 * 100,
        "shadow to the left": max(side[2:] or [0]),
    }
    failed = False
    for name, value in got.items():
        lo, hi, unit = LIMITS[name]
        ok = lo <= value <= hi
        failed = failed or not ok
        print(f"  {'PASS' if ok else 'FAIL'}  {name:<19}{value:5.1f} {unit:<7} (limit {lo:g} to {hi:g})")
    print("RESULT: " + ("FAIL" if failed else "all pass"))
    sys.exit(1 if failed else 0)


def save(path, w, h, rows):
    def chunk(kind, body):
        return struct.pack(">I", len(body)) + kind + body + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF)

    raw = b"".join(b"\x00" + r for r in rows)
    head = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    with open(path, "wb") as f:
        f.write(b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", head) + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b""))


def cmd_crop(src, out, x, y, w, h, zoom=1):
    W, H, pixel = load(src)
    x, y = max(0, x), max(0, y)
    w, h = min(w, W - x), min(h, H - y)
    if w <= 0 or h <= 0:
        sys.exit(f"{src} is {W}x{H}; the region lies outside it")
    rows = []
    for j in range(h):
        line = bytearray()
        for i in range(w):
            p = pixel(x + i, y + j)
            k = p[3] / 255
            line += bytes(round(p[c] * k + FLOOR[c] * (1 - k)) for c in range(3)) * zoom
        rows += [bytes(line)] * zoom
    save(out, w * zoom, h * zoom, rows)
    print(f"{out}: {w * zoom}x{h * zoom} ({w}x{h} from {x},{y} at {zoom}x)")


def cmd_colors(path):
    w, h, pixel = load(path)
    count, first, leftmost = collections.Counter(), {}, {}
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixel(x, y)
            if a < 250:
                continue
            _, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if s > 0.55 and v > 0.4:
                c = f"#{r:02x}{g:02x}{b:02x}"
                count[c] += 1
                first.setdefault(c, (x, y))
                if c not in leftmost or x < leftmost[c][0]:
                    leftmost[c] = (x, y)
    print(f"{path}: saturated colours")
    for c, n in count.most_common(6):
        print(f"  {c}  {n} px, topmost at {first[c]}, leftmost at {leftmost[c]}")


if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args) == 2 and args[0] == "check":
        cmd_check(args[1])
    elif len(args) in (7, 8) and args[0] == "crop":
        cmd_crop(args[1], args[2], *(int(a) for a in args[3:]))
    elif len(args) == 2 and args[0] == "block":
        cmd_block(args[1])
    elif len(args) == 2 and args[0] == "shadow":
        cmd_shadow(args[1])
    elif len(args) == 2 and args[0] == "colors":
        cmd_colors(args[1])
    else:
        sys.exit(__doc__)
