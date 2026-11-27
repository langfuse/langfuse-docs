---
name: site-illustrations
description: >-
  Draw, redraw or review an illustration or diagram on langfuse.com so it
  cannot be told apart from the existing ones. Covers the two house styles:
  tilted line drawings on feature cards (homepage "All the tools" cards,
  /gateway feature cards, the Security slab) and flat boxed diagrams with
  bracket corners (homepage platform overview and loop). Use when adding or
  changing a card illustration or a diagram, porting a mock to React, or
  checking a drawing against the originals.
---

# Site illustrations

The site has two drawing styles. Pick one per drawing and never mix them.

|                  | Tilted line drawing                                                                  | Flat boxed diagram                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Use for          | a small scene inside a feature card                                                  | a page-wide explanation of a flow or a system, with text people read                        |
| Looks like       | a button and rows on a tilted floor grid                                             | square boxes with bracket corners, joined by arrows                                         |
| Originals        | `components/home/img/tools/*.png`, `components/home/img/visuals/visual-security.svg` | `components/home/PlatformOverview.tsx`, `components/home/academy-loop/AcademyRowVisual.tsx` |
| Code to build on | `components/gateway/GatewayFeatureSketch.tsx`                                        | `CornerBox`, `diagram-arrows`, `academy-loop/shared`                                        |
| Spec             | [references/tilted-spec.md](references/tilted-spec.md)                               | [references/flat-spec.md](references/flat-spec.md)                                          |

A wide flow does not suit the tilted floor: a layout 1000 units across climbs 342 units, so it needs a tall box and its text gets small. Use the flat style for those.

## How to work

1. **Open the original.** Find the existing drawing closest to yours and keep it on screen. Do not work from memory, and do not copy a coded imitation: `components/home/AiGatewayVisual.tsx` is drawn on a different plane than the exports.
2. **Read the spec and the rules** for your style before drawing anything. For tilted drawings also read [references/tilted-rules.md](references/tilted-rules.md) and pick a composition from [references/tilted-compositions.md](references/tilted-compositions.md).
3. **Compare early.** After the first render, set one piece next to the same piece of the original, enlarged, before you refine anything. The tilted kit already draws the parts, so render the whole scene first; do not spend a round on a lone button.
4. **Show it early**: the original and yours at the same scale on one page, plus today's version when you are replacing one. Get a yes from the person who owns the design before porting or polishing. With nobody to ask, stop there, hand over the page, and list every choice the originals did not settle.
5. **Keep the copy.** Every word the product copy gives the drawing stays, in its own case. A new label, a dropped label or a changed case needs the design owner's yes.
6. **Finish in the real page**: desktop width and 375 px, light and dark, no cropping, no sideways scroll. A mock cannot show this (its panel is a fixed 941 px), so it stays open until the port.

## Tools

Run every command from the repo root, with `K=.agents/skills/site-illustrations`. The dev server is `pnpm dev`, on port 3333.

| Command                                                    | Use                                                                                    |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `node $K/scripts/shoot.mjs URL_OR_FILE OUT.png [options]`  | screenshot of a page or of one element                                                 |
| `python3 $K/scripts/measure.py check FILE`                 | angles, lift and shadow of a tilted button against the limits: PASS or FAIL            |
| `python3 $K/scripts/measure.py block FILE`                 | the button's corners, to place a crop                                                  |
| `python3 $K/scripts/measure.py colors FILE`                | each accent colour's topmost pixel (a dot) and leftmost pixel (a connector square)     |
| `python3 $K/scripts/measure.py crop FILE OUT X Y W H ZOOM` | an enlarged detail, to set against the same detail of an original                      |
| `python3 $K/scripts/svg-parity.py MOCK PAGE`               | proves a React port draws what the mock drew                                           |
| `assets/compare.html`                                      | review page: pictures side by side at one scale; its options are in the file's comment |

`shoot.mjs` options: `--width N` (below 500 lays out as a phone), `--scale N`, `--dark`, `--selector CSS` (cuts the picture to that element). Without `--height` it covers the whole page.

Look at every picture you make (read the PNG). A check that printed numbers is not a check that the drawing looks right.

## Tilted drawings

Mock first, then port. The mock is one standalone HTML file, so a change shows in seconds. The React component and its data live in `components/gateway/`; on a branch without that folder the mock is the only kit. It loads Geist Mono from Google Fonts; when the font is missing it shows a red bar, and nothing on that page can be judged.

### Mock

```bash
mkdir -p /tmp/sketch && cp $K/assets/tilted-mock.html $K/assets/compare.html /tmp/sketch/
```

In `/tmp/sketch/tilted-mock.html`, add your scene to `draw` and a card with its data to a card list. `cardsTop` is the three-column row: the scene returns `{}`. `cardsBottom` is the two-column rows: the scene returns `{ rx: 420 }`. A ninth card sits alone in a half-empty row; that is fine in a mock.

```bash
node $K/scripts/shoot.mjs "/tmp/sketch/tilted-mock.html?only=1" /tmp/sketch/light.png --width 941 --scale 1                  # all cards, light
node $K/scripts/shoot.mjs "/tmp/sketch/tilted-mock.html?only=2" /tmp/sketch/dark.png --width 941 --scale 1                   # all cards, dark
node $K/scripts/shoot.mjs "/tmp/sketch/tilted-mock.html?card=9" /tmp/sketch/card.png --selector .card --scale 3              # your card, to look at
node $K/scripts/shoot.mjs "/tmp/sketch/tilted-mock.html?card=9&only=2" /tmp/sketch/card-dark.png --selector .card --scale 3  # the same, dark
node $K/scripts/shoot.mjs "/tmp/sketch/tilted-mock.html?card=9" /tmp/sketch/unit.png --selector .sketch --scale 1.6667       # the drawing alone, one plane unit per pixel
python3 $K/scripts/measure.py check /tmp/sketch/unit.png
```

`?card=N` counts cards in page order: the wide provider card is 1, the last gateway card is 8, a card appended to `cardsBottom` is 9. The wide card's drawing is `.wideSketch`.

Before you show the mock:

1. `measure.py check` prints `RESULT: all pass`. It reads the raised button, so the button must stand alone. `NOT CHECKED` (exit 2) means the scene has no button, has a slab, or a dark line touches the button, as in `spend`, `hosting` and `agents`. Then compare by eye and say it was not measured. The check reads the light theme only.
2. Set three details against the original at 7x. `unit.png` and the exports are both at one unit per pixel, so every crop is `110 70 7`:

   | Detail                  | In `components/home/img/tools/evaluation.png` | In yours: X Y from                                     |
   | ----------------------- | --------------------------------------------- | ------------------------------------------------------ |
   | button corner           | `120 190`                                     | `block`: the leftmost corner, minus 14 and 21          |
   | row with its dot        | `293 209`                                     | `colors`: an accent's topmost pixel, minus 55 and 31   |
   | connector meeting a row | `226 338`                                     | `colors`: the accent's leftmost pixel, minus 50 and 35 |

   ```bash
   python3 $K/scripts/measure.py crop components/home/img/tools/evaluation.png /tmp/sketch/orig-corner.png 120 190 110 70 7
   python3 $K/scripts/measure.py crop /tmp/sketch/unit.png /tmp/sketch/mine-corner.png X Y 110 70 7
   ```

3. Walk the thirteen rules in [references/tilted-rules.md](references/tilted-rules.md), in both themes.
4. Build the review page, shoot it, and open it for the design owner. When you are replacing a drawing, shoot today's the same way (`--selector`, `--scale 1.6667`) and add it as a third `img=`.

   ```bash
   cp components/home/img/tools/evaluation.png /tmp/sketch/
   node $K/scripts/shoot.mjs "/tmp/sketch/compare.html?title=Rate%20limits&img=Original|evaluation.png&img=New|unit.png" /tmp/sketch/review.png --width 1100 --scale 1 --selector body
   open "file:///tmp/sketch/compare.html?title=Rate%20limits&img=Original|evaluation.png&img=New|unit.png"
   ```

### Port

Only after the mock has its yes.

1. Add the data to `components/gateway/content.ts` and a `draw…` function to `components/gateway/GatewayFeatureSketch.tsx`. Same calls, same numbers as the mock.
2. Copy your mock back over `assets/tilted-mock.html`, so the mock stays the twin of the component.
3. Prove the port draws what was approved. N is the number of drawings on the page:

   ```bash
   python3 $K/scripts/svg-parity.py "$K/assets/tilted-mock.html?only=1" "http://127.0.0.1:3333/gateway"
   # RESULT: all N identical
   ```

4. Shoot the real page at `--width 1440` and `--width 375` and read both.

The rules reviewers send drawings back for, in order of how often:

- Only the button's outer silhouette is dark. Inner edges and side faces are faint.
- The shadow is barely visible and sits straight below the button, never to the side.
- Text lies on the plane with the boxes, in the regular weight, dark grey.
- Rows hug their content: label, dot, value packed from the left.
- The floor grid is even under the whole drawing and pieces sit on it.
- The little square at the end of a connector sits on top of the row edge.
- Equal options are one slab with equal cells, not one thing under another.
- Charts lie flat on the floor.

## Flat diagrams

There is no mock step: build in React from the existing pieces and look at the page. `components/gateway/GatewayFlowDiagram.tsx` is a worked example outside the homepage. Shoot the two originals first and keep them open:

```bash
node $K/scripts/shoot.mjs http://127.0.0.1:3333/ /tmp/overview.png --selector 'figure[aria-label="How AI calls flow through Langfuse"]'
node $K/scripts/shoot.mjs http://127.0.0.1:3333/ /tmp/loop.png --selector 'figure[aria-label="The AI engineering loop from the Langfuse Academy"]'
```

1. Lay out the boxes on a CSS grid with gutters for the arrows (24 px between cards, 44 px between panels). Boxes in one row share one height, or when their heights differ, one centre line that the arrows run on.
2. Panels and cards are `CornerBox`. Chips, tiles and tags inside them are plain bordered elements.
3. Arrows are `HArrow` and `VArrow`. Elbows are 1 px `bg-line-cta` spans with an `ArrowHead` at the end.
4. Captions are `MonoLabel`. A diagram has at most one yellow accent, a `Highlight` band or one small tag, and may have none.
5. Write the compact drawing for screens below `md` as its own layout.
6. Wrap it in a `figure` and give it one text alternative, not two: either the visible boxes with an `aria-label` on the figure and `aria-hidden` connectors, or an `sr-only` `figcaption` with the visual layouts `aria-hidden`.

Check against the ten rules in [references/flat-spec.md](references/flat-spec.md), then read its last section: what the originals do not settle. Shoot your diagram at `--width 1440` and `--width 375`, light and `--dark`, and crop one corner of a box and one arrow tip next to the same detail of an original.

## Before you hand over

- `pnpm exec prettier --experimental-cli --check <your files>` prints `All matched files use Prettier code style!`.
- `pnpm exec tsc --noEmit -p .` prints nothing and exits 0. Quote the exit code.
- `git add -N <new files> && pnpm run lint:middle-dot`: the check reads tracked files only.
- Tilted: the `measure.py check` result and the `svg-parity.py` result, quoted.
- The review page: the original, today's version when there is one, and yours, at one scale.
- What you did not check, and every choice the originals did not settle, said plainly.

## Files

| File                                                                   | Use                                                                            |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [references/tilted-spec.md](references/tilted-spec.md)                 | measured values and where each comes from; what the checks read on each export |
| [references/tilted-rules.md](references/tilted-rules.md)               | thirteen rules, each with what was rejected and how to check                   |
| [references/tilted-compositions.md](references/tilted-compositions.md) | which arrangement fits which content; the kit's parts                          |
| [references/flat-spec.md](references/flat-spec.md)                     | values, pieces and rules of the flat style, with file and line                 |
| `assets/tilted-mock.html`                                              | standalone twin of the tilted component, with all eight gateway scenes         |
| `assets/compare.html`                                                  | side-by-side review page                                                       |
| `scripts/shoot.mjs`                                                    | screenshots through headless Chrome; needs Node 22 or newer                    |
| `scripts/measure.py`                                                   | check, block, shadow, colors, crop; no dependencies                            |
| `scripts/svg-parity.py`                                                | compares the drawings in a mock and a page, element by element                 |
