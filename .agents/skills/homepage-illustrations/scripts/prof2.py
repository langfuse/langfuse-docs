import sys, numpy as np
from prof import load, profile
LUM = np.array([0.299, 0.587, 0.114])
def edges(path, axis, a0, a1, b0, b1, thr=1.2, card=(246,246,243)):
    img = load(path, card)
    a, rgb = profile(img, axis, a0, a1, b0, b1, step=0.02, n=80)
    lum = rgb @ LUM; st = a[1]-a[0]; k = int(3/st)
    base = np.array([np.median(lum[max(0,i-k):i+k+1]) for i in range(len(lum))])
    dev = lum - base; i = 0; res = []
    while i < len(a):
        if abs(dev[i]) > thr:
            j = i
            while j < len(a) and abs(dev[j]) > thr*0.4 and np.sign(dev[j]) == np.sign(dev[i]): j += 1
            seg = slice(i, j); m = i + int(np.argmax(np.abs(dev[seg])))
            w = dev[seg]; c = float((a[seg]*np.abs(w)).sum()/np.abs(w).sum())
            res.append((c, float(np.abs(w).sum()*st), '#%02x%02x%02x' % tuple(int(round(v)) for v in rgb[m]), float(base[m]), float(lum[m])))
            i = j
        else: i += 1
    return res
if __name__ == '__main__':
    path, axis = sys.argv[1], sys.argv[2]; a0, a1, b0, b1 = map(float, sys.argv[3:7])
    thr = float(sys.argv[7]) if len(sys.argv) > 7 else 1.2
    for c, integ, col, base, lm in edges(path, axis, a0, a1, b0, b1, thr):
        # equivalent widths for candidate true colours
        ws = "  w@222220=%.2f w@404039=%.2f w@cfcfc9=%.2f w@a7a7a0=%.2f" % tuple(integ/max(1e-6, base-v) for v in (33.8, 61.5, 206.3, 166.2))
        print("  at %7.2f  integral %6.1f  peak %s (bg lum %.0f)%s" % (c, integ, col, base, ws))
