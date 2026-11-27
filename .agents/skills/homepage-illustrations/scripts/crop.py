import sys, numpy as np
from PIL import Image, ImageDraw
from flatten import flatten
path, k, out = sys.argv[1], float(sys.argv[2]), sys.argv[3]
x0, y0, x1, y1 = [float(v) for v in sys.argv[4].split(',')]
im, _ = flatten(path, k, ticks=False, crop=(x0, y0, x1, y1))
d = ImageDraw.Draw(im)
for x in range(int(np.ceil(x0)), int(x1)+1):
    u = (x-x0)*k
    L = 16 if x % 10 == 0 else (9 if x % 5 == 0 else 4)
    d.line([(u,0),(u,L)], fill=(255,0,0,255))
    if x % 10 == 0: d.text((u+2, 16), str(x), fill=(255,0,0,255))
for y in range(int(np.ceil(y0)), int(y1)+1):
    v = (y-y0)*k
    L = 16 if y % 10 == 0 else (9 if y % 5 == 0 else 4)
    d.line([(0,v),(L,v)], fill=(255,0,0,255))
    if y % 10 == 0: d.text((18, v-5), str(y), fill=(255,0,0,255))
im.convert('RGB').save(out); print(im.size)
