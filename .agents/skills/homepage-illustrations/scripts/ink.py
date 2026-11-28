import sys, numpy as np
from prof import load, sample
LUM = np.array([0.299, 0.587, 0.114])
img = load(sys.argv[1])
for spec in sys.argv[2:]:
    name, vals = spec.split('='); x0, y0, x1, y1 = map(float, vals.split(','))
    xs = np.arange(x0, x1, 0.05); ys = np.arange(y0, y1, 0.05)
    X, Y = np.meshgrid(xs, ys); lum = sample(img, np.stack([X, Y], -1)) @ LUM
    bg = np.median(lum); ink = np.clip(bg - lum, 0, None)
    col = ink.sum(0); row = ink.sum(1)
    cth = col.max()*0.08; rth = row.max()*0.15
    cx = xs[col > cth]; ry = ys[row > rth]
    c = col - col.mean(); ac = np.correlate(c, c, 'full')[len(c)-1:]
    lo, hi = int(4.5/0.05), int(7.5/0.05); adv = (lo + np.argmax(ac[lo:hi]))*0.05
    # refine with multiples
    best = max(np.arange(5.3, 6.6, 0.01), key=lambda a: sum(ac[int(round(a*m/0.05))] for m in range(1, int((x1-x0-8)/a)) if int(round(a*m/0.05)) < len(ac)))
    print("  %-14s ink x %.2f..%.2f (w %.2f)  ink y %.2f..%.2f (h %.2f)  advance~%.2f (multi-fit %.2f)" % (name, cx.min(), cx.max(), cx.max()-cx.min(), ry.min(), ry.max(), ry.max()-ry.min(), adv, best))
