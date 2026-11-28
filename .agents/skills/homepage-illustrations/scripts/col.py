import sys, numpy as np
from prof import load, sample
LUM = np.array([0.299, 0.587, 0.114])
def hexc(v): return '#%02x%02x%02x' % tuple(int(round(x)) for x in v)
def region(img, x0, y0, x1, y1, n=40):
    X, Y = np.meshgrid(np.linspace(x0, x1, n), np.linspace(y0, y1, n))
    rgb = sample(img, np.stack([X, Y], -1)).reshape(-1, 3); lum = rgb @ LUM
    sat = rgb.max(1) - rgb.min(1)
    return hexc(np.median(rgb, 0)), hexc(rgb[np.argmin(lum)]), hexc(rgb[np.argmax(lum)]), hexc(rgb[np.argmax(sat)])
img = load(sys.argv[1])
for spec in sys.argv[2:]:
    name, vals = spec.split('=')
    x0, y0, x1, y1 = map(float, vals.split(','))
    med, dk, lt, st = region(img, x0, y0, x1, y1)
    print("  %-22s median %s  darkest %s  lightest %s  most-saturated %s" % (name, med, dk, lt, st))
