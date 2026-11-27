---
name: homepage-illustrations
description: >-
  Draw or edit the tilted line illustrations on the marketing pages (homepage
  feature cards: AI Gateway, Evaluation, Prompt Management, Playground, ...;
  Security slab) so they match the designer originals in components/home/img.
  Use when adding a card illustration, changing AiGatewayVisual, or redrawing
  one of those originals in code.
---

# Homepage illustrations

The marketing diagrams are drawn on one tilted plane. The originals are design
exports: `components/home/img/tools/*.png` (feature cards) and
`components/home/img/visuals/*.svg`. A coded illustration must be
indistinguishable from them. Build it with the kit in
`components/home/illustrations/axo.tsx`, then prove it against an original
(see Verify). `components/home/AiGatewayVisual.tsx` is the one coded
illustration in production; it is an output of this recipe, not a reference.

## Method

1. Lay the diagram out flat, in plane units, as if seen from above. Never draw
   skewed shapes by hand, and never tilt HTML with CSS transforms.
2. Wrap flat shapes in `<AxoPlane origin>`; it applies the one tilt matrix.
3. Draw in this order: grid, wires, chips and frames, nodes, raised blocks,
   then nodes that sit on a block's foot.
4. Render it beside an original and compare.

## The tilt

- Plane x runs up-right at -20 degrees, plane y runs down-right at +60 degrees.
- Both axes have the same length. No other skew or rotation. The design's own
  matrix is `matrix(0.939942 -0.341333 0.500853 0.865532 x y)`.

## Scale

Every original uses the same design units at its own scale. The kit bakes in
0.75 (`EX`, `EY`), the scale of the large cards. When redrawing an original,
measure its grid pitch first: pitch / 24 is its scale.

| Originals                                                                               | Scale       | Grid pitch on screen | Label on screen                  |
| --------------------------------------------------------------------------------------- | ----------- | -------------------- | -------------------------------- |
| Large cards: Observability, Evaluation, Prompt Management (576 px exports)              | 0.75        | 18                   | 9.75                             |
| Small cards: Playground, Experiments, Human Annotation, Cost & Latency (428 px exports) | 0.67 to 0.8 | 16                   | 8 block label, 6 to 6.5 captions |
| Security slab (SVG)                                                                     | 0.91        | none                 | 8.9, two lines                   |

"On screen" is svg units: one export pixel at 1x (the PNGs are 2x). For
another scale, wrap the drawing in an outer `scale()` or pass `size` and
`tracking` to `AxoText`.

## Sizes (plane units)

| Thing                                                | Value                                                     |
| ---------------------------------------------------- | --------------------------------------------------------- |
| Grid                                                 | 24 cells, about 14 x 10 of them in a card, hard edge      |
| Label                                                | Geist Mono Regular 13; one character is 7.8 wide          |
| Caption or tag                                       | 0.72 to 0.8 of the label                                  |
| Label baseline                                       | box centre + 4.65                                         |
| Label inset from box edge                            | 12; 18.65 inside a frame                                  |
| Hairline (chip and frame borders, inner block edges) | 0.6                                                       |
| Grid line                                            | 0.8                                                       |
| Wire                                                 | 1.2; dashed wire 0.85 with dashes 3 2                     |
| Node (square where a wire meets a box)               | 3.4                                                       |
| Status dot                                           | radius 2.1 in a row, 3 in a frame; halo 1.45 wider at 35% |
| Chip                                                 | 36.6 high (main), 23.4 high (result row, pitch 33.6)      |
| Frame corner marks                                   | arms 8.3, wire weight, centred on the frame edge          |
| Gap from a block's foot to the frame below it        | 24                                                        |

Raised block, in svg units because it is drawn after the tilt: lift 7.35
(exports vary 6.65 to 7.5), silhouette 0.87, inner edges 0.42, shadow 3.5
down, blur 2.5, 8.5% black. The shadow does not scale with the drawing. A
block is as high as a main chip.

Small cards track their labels by about -3.5% of the size. Large cards do not.

## Colours

| Role                                                       | Value                                                                   |
| ---------------------------------------------------------- | ----------------------------------------------------------------------- |
| Hairlines, grey wires, grey nodes                          | `--line-structure`                                                      |
| Block silhouette, dark wires and nodes, frame corner marks | `--line-cta`                                                            |
| Muted label                                                | `--text-disabled`                                                       |
| Strong label                                               | `--text-primary`                                                        |
| Secondary value, tag label                                 | `--text-tertiary` (tags sit on `--surface-2`)                           |
| Badge                                                      | `--surface-bg` text on `--surface-code`                                 |
| Coloured value                                             | `--text-code-orange`                                                    |
| Grid                                                       | `#efede5`                                                               |
| Chip, frame and panel fill                                 | `#f4f4f1`                                                               |
| Block sides                                                | whatever is behind the drawing: `--surface-bg`, or `#f4f4f1` on a panel |
| Block top                                                  | `#fefefe` (reads `#fcfcfc` under an export's grain)                     |
| Good                                                       | `#00a63e`                                                               |
| Bad                                                        | `--text-code-pink`                                                      |

## Rules

- One label size per role. Emphasis comes from colour (muted against strong),
  never from weight. Only captions and tags are smaller.
- Chips and frames are outlined, not tinted: their fill is two levels off the
  background, just enough to hide the grid behind them.
- Only a raised block gets the dark outline, and only on its silhouette. The
  edges where its top meets its sides are hairlines.
- A raised block is white on top, its sides are the background colour, and it
  casts a soft shadow straight down. Prompt Management is the one export
  without the shadow.
- One block per drawing carries the subject (Playground compares two). The
  result it produces sits in a frame with corner marks, joined by a dark wire
  with a dark node on the block's foot.
- Grey wires for context, dark for the main path, a colour only for a status.
  Coloured wires fade from `--line-structure` at the trunk to the colour at
  the node, 1.3 wide. Nodes are optional: Playground has none.
- The grid is a rectangle of cells with no fade. Where its edge falls on a
  cell line, that line is half width. The image edge may crop it.
- Long text does not belong on the plane. Labels are a word or two; put
  sentences in flat captions beside the drawing.

## Backing panel

Four exports sit on a panel: a rounded rect (radius 2, `#f4f4f1`) with a tilted
sheet of the same colour carrying the grid, under a faint paper grain. The
grain also sits on chips. Code does not reproduce grain; use the flat colours
above. New coded drawings skip the panel and sit on the card, as Prompt
Management does.

## Slab variant (Security)

`img/visuals/visual-security.svg` is the same family with a lighter look: a
thick slab of four tiles on a few fading ground lines.

- Scale 0.91. Every line is one design pixel.
- Tiles 120 x 68 design units, corner radius 2, top `#fbfbf9`, border
  `--line-structure`; left face `--surface-bg`, front face `--surface-1`;
  silhouette `--line-cta`; no shadow; depth about 20.
- Two status dots per tile, radius 2, each in a hairline ring instead of a
  halo.
- Labels in `--text-primary`, two lines, top-left, with a plain zero
  (`font-feature-settings: "ss09"`).
- No grid: six `--line-structure` lines continue the slab's edges on the
  ground and fade out radially.

## Sizing in a card

The card exports render at 0.947 CSS px per svg unit on desktop. Give a coded
illustration a `viewBox` that makes it land on the same factor in its
container, so text and lines are the same size as in the neighbouring cards.
`AiGatewayVisual` uses `0 0 409 232` in a 387 x 220 box.

## Verify

No check proves a drawing matches. Redraw against an original and measure.

1. Add a temporary route, for example `app/illustration-lab/<name>/page.tsx`,
   that renders the drawing in a box of the export's 1x size on `#f6f6f3`.
   Delete the route before committing.
2. Screenshot that box at 2x.
3. Compare with the scripts in `scripts/` (Python 3 with PIL and numpy; run
   them from inside the folder):
   - `flatten.py <png> <zoom> <out.png> [x0,y0,x1,y1]` un-tilts an image so
     boxes are axis-aligned and text is upright, with a ruler. `crop.py` does
     the same with a finer ruler. Units are export pixels at 1x along the
     plane axes; divide by the original's scale for plane units.
   - `prof2.py`, `col.py`, `ink.py`, `gridmap.py` read edge positions and
     weights, colours, text size and grid strength in those units, on the
     original and on your screenshot alike. Matching numbers beat eyeballing.
   - `diff.py <original.png> <render.png> <out-prefix> [crop] [zoom]` prints
     the difference and writes side-by-side sheets.
4. Export pixel centres sit half a pixel off: a redraw of a PNG export uses
   `origin = { x: 0.25, y: 0.25 }`. An SVG original needs no offset.

Known limits of the scripts:

- Take a label's size from glyph height and from character advance. Advance
  alone misreads tracked text, and `ink.py` only fits advances of 5.3 to 6.6.
- `gridmap.py` assumes an 18 px pitch.
- Edge positions drift by 0.1 to 0.2 next to a shadow or a colour step.
- Read the alpha channel for a panel's shape and corner radius.

Paper grain alone leaves a mean difference of about 1.2 to 1.6 against a PNG
export; that is the floor. Against an SVG original the floor is 0.

`references/` holds redraws that reach the floor for Evaluation, Prompt
Management, Playground, Human Annotation and Security. Read the one closest to
your drawing before you start.
