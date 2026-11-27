# Profile across lines in plane coordinates. usage: prof.py png axis a0 a1 b0 b1 [thr]
#  axis=y : walk along plane y from a0..a1, averaging over plane x in b0..b1 (finds edges that run along x)
#  axis=x : walk along plane x from a0..a1, averaging over plane y in b0..b1
import sys, numpy as np
from PIL import Image
AX, AY = np.deg2rad(-20.0), np.deg2rad(60.0)
M = np.column_stack([[np.cos(AX), np.sin(AX)], [np.cos(AY), np.sin(AY)]])
def load(path, card=(246,246,243)):
    im = Image.open(path).convert('RGBA'); bg = Image.new('RGBA', im.size, card+(255,)); bg.alpha_composite(im)
    return np.array(bg).astype(float)[..., :3]
def sample(img, pts):               # pts: (...,2) plane coords -> rgb bilinear
    p = pts @ M.T * 2.0
    x, y = p[..., 0], p[..., 1]
    H, W = img.shape[:2]
    x = np.clip(x, 0, W-1.001); y = np.clip(y, 0, H-1.001)
    x0 = np.floor(x).astype(int); y0 = np.floor(y).astype(int); fx = (x-x0)[..., None]; fy = (y-y0)[..., None]
    return (img[y0, x0]*(1-fx)*(1-fy) + img[y0, x0+1]*fx*(1-fy) + img[y0+1, x0]*(1-fx)*fy + img[y0+1, x0+1]*fx*fy)
def profile(img, axis, a0, a1, b0, b1, step=0.05, n=60):
    a = np.arange(a0, a1, step); b = np.linspace(b0, b1, n)
    A, B = np.meshgrid(a, b, indexing='ij')
    pts = np.stack([B, A], -1) if axis == 'y' else np.stack([A, B], -1)
    rgb = sample(img, pts)
    return a, np.median(rgb, axis=1)
def runs(a, rgb, thr=2.0):
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    k = int(4/ (a[1]-a[0]))
    base = np.array([np.median(lum[max(0,i-k):i+k+1]) for i in range(len(lum))])
    dev = lum - base
    out = []; i = 0
    while i < len(a):
        if abs(dev[i]) > thr:
            j = i
            while j < len(a) and abs(dev[j]) > thr and np.sign(dev[j]) == np.sign(dev[i]): j += 1
            seg = slice(i, j); m = i + int(np.argmax(np.abs(dev[seg])))
            half = np.abs(dev[seg]) >= abs(dev[m])/2
            w = half.sum()*(a[1]-a[0])
            c = (a[seg][half].mean())
            out.append((round(float(c),2), round(float(w),2), '#%02x%02x%02x' % tuple(int(round(v)) for v in rgb[m]), round(float(dev[m]),1)))
            i = j
        else: i += 1
    return out
if __name__ == '__main__':
    path, axis = sys.argv[1], sys.argv[2]
    a0, a1, b0, b1 = map(float, sys.argv[3:7]); thr = float(sys.argv[7]) if len(sys.argv) > 7 else 2.0
    img = load(path)
    a, rgb = profile(img, axis, a0, a1, b0, b1)
    for r in runs(a, rgb, thr): print("  at %7.2f  width %5.2f  colour %s  dev %6.1f" % r)
