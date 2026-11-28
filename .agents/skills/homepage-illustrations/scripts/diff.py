# diff.py original.png redraw.png out_prefix  -> stats + side-by-side + amplified diff
import sys, numpy as np
from PIL import Image
orig, red, out = sys.argv[1:4]
card = (246, 246, 243)
o = Image.open(orig).convert('RGBA'); bg = Image.new('RGBA', o.size, card + (255,)); bg.alpha_composite(o); o = bg.convert('RGB')
r = Image.open(red).convert('RGB')
if r.size != o.size: print('size mismatch', o.size, r.size); r = r.resize(o.size, Image.BICUBIC)
a = np.array(o).astype(float); b = np.array(r).astype(float)
d = np.abs(a - b).max(2)
print("mean abs diff %.2f | px>12: %.2f%% | px>40: %.2f%% | px>90: %.2f%%" % (np.abs(a-b).mean(), (d > 12).mean()*100, (d > 40).mean()*100, (d > 90).mean()*100))
amp = np.clip(255 - d*4, 0, 255).astype(np.uint8)
W, H = o.size
sheet = Image.new('RGB', (W*3 + 20, H), (255, 0, 255))
sheet.paste(o, (0, 0)); sheet.paste(r, (W + 10, 0)); sheet.paste(Image.fromarray(np.stack([amp]*3, -1)), (2*W + 20, 0))
sheet.save(out + '_sheet.png')
if len(sys.argv) > 4:
    x0, y0, x1, y1 = map(int, sys.argv[4].split(',')); z = int(sys.argv[5]) if len(sys.argv) > 5 else 3
    co = o.crop((x0, y0, x1, y1)).resize(((x1-x0)*z, (y1-y0)*z), Image.LANCZOS); cr = r.crop((x0, y0, x1, y1)).resize(((x1-x0)*z, (y1-y0)*z), Image.LANCZOS)
    s2 = Image.new('RGB', (co.width*2 + 10, co.height), (255, 0, 255)); s2.paste(co, (0, 0)); s2.paste(cr, (co.width + 10, 0)); s2.save(out + '_zoom.png')
