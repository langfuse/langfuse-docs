# Un-project a design PNG back to the flat plane so boxes are axis-aligned and text is upright.
import sys, numpy as np
from PIL import Image, ImageDraw
AX, AY = np.deg2rad(-20.0), np.deg2rad(60.0)
EX = np.array([np.cos(AX), np.sin(AX)]); EY = np.array([np.cos(AY), np.sin(AY)])
M = np.column_stack([EX, EY])            # plane(design px) -> image(design px)
Mi = np.linalg.inv(M)
def flatten(path, k=4, card=(246,246,243), ticks=True, crop=None):
    im = Image.open(path).convert('RGBA')
    bg = Image.new('RGBA', im.size, card + (255,)); bg.alpha_composite(im); im = bg
    W, H = im.size
    corners = np.array([[0,0],[W,0],[W,H],[0,H]]) / 2.0
    pl = corners @ Mi.T
    x0, y0 = np.floor(pl.min(0)); x1, y1 = np.ceil(pl.max(0))
    if crop: x0, y0, x1, y1 = crop
    ow, oh = int((x1-x0)*k), int((y1-y0)*k)
    # output (u,v) -> plane (u/k+x0, v/k+y0) -> image px = 2*M*plane
    A = 2*M/k; c = 2*M @ np.array([x0, y0])
    out = im.transform((ow, oh), Image.AFFINE, (A[0,0], A[0,1], c[0], A[1,0], A[1,1], c[1]), resample=Image.BICUBIC, fillcolor=(255,0,255,255))
    if ticks:
        d = ImageDraw.Draw(out)
        for x in range(int(np.ceil(x0/10)*10), int(x1), 10):
            u = (x-x0)*k; L = 14 if x % 50 == 0 else 6
            d.line([(u,0),(u,L)], fill=(255,0,0,255))
            if x % 50 == 0: d.text((u+2, 14), str(x), fill=(255,0,0,255))
        for y in range(int(np.ceil(y0/10)*10), int(y1), 10):
            v = (y-y0)*k; L = 14 if y % 50 == 0 else 6
            d.line([(0,v),(L,v)], fill=(255,0,0,255))
            if y % 50 == 0: d.text((16, v-5), str(y), fill=(255,0,0,255))
    return out, (x0, y0, x1, y1)
if __name__ == '__main__':
    path = sys.argv[1]; k = float(sys.argv[2]) if len(sys.argv) > 2 else 4
    crop = tuple(float(v) for v in sys.argv[4].split(',')) if len(sys.argv) > 4 else None
    out, bb = flatten(path, k, crop=crop)
    out.convert('RGB').save(sys.argv[3] if len(sys.argv) > 3 else 'flat.png')
    print('plane bbox', bb, 'out size', out.size)
