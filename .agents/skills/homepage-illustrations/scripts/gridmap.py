# gridmap.py png y_phase x_phase [cell] : strength of grid lines over the plane (1x units), '.' = outside image
import sys, numpy as np
from PIL import Image
from prof import load, profile, M
LUM = np.array([0.299, 0.587, 0.114])
path = sys.argv[1]; yph, xph = float(sys.argv[2]), float(sys.argv[3]); cell = float(sys.argv[4]) if len(sys.argv) > 4 else 18.0
img = load(path); H, W = img.shape[:2]
def inside(x, y):
    p = M @ np.array([x, y]) * 2; return 4 < p[0] < W-5 and 4 < p[1] < H-5
def strength(axis, pos, b0, b1):
    a, rgb = profile(img, axis, pos-3, pos+3, b0, b1, step=0.05, n=40); lum = rgb @ LUM
    base = np.median(np.concatenate([lum[:30], lum[-30:]])); m = (a > pos-0.9) & (a < pos+0.9)
    return (base - lum[m]).sum()*0.05
xs = np.arange(-108, 250, 27)
print("x-dir lines (rows: plane y of line; cols: plane x)   ", " ".join("%4d" % x for x in xs))
for n in range(0, 18):
    y = yph + cell*n; row = []
    for x in xs:
        row.append("%4.1f" % strength('y', y, x+3, x+12) if inside(x+3, y) and inside(x+12, y) else "   .")
    print("  y=%6.1f                                            " % y, " ".join(row))
