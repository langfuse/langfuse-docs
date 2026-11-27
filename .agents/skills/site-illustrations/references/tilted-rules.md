# Tilted line drawings: rules

Each rule comes from a design review of coded drawings against the originals. "Rejected" names what was drawn first and sent back. Check every rule before showing a drawing to anyone.

## 1. Work from the originals

Open the export that is closest to what you draw (`tilted-spec.md` lists them) and keep it next to your render.

- Rejected: a first version matched `AiGatewayVisual.tsx`, a coded imitation. Its plane is 5° steeper and squashed, so every row read as crooked.
- Check: `measure.py check` on a screenshot of your card at scale 1.6667 prints `RESULT: all pass`.

## 2. One plane, and everything lies on it

Boxes, text, tags, dots, switches and charts share the one matrix. Lay the drawing out flat in plane units and let the kit tilt it.

- Rejected: text that was only rotated onto the baseline. The letters no longer matched the skew of the button under them.
- Rejected: status dots drawn as screen circles. On the plane a circle is a slightly flattened ellipse.
- Rejected: a chart standing upright. Charts lie flat on the floor like the Experiments original.
- Check: in a 7x crop (`measure.py crop … 7`), letter stems run parallel to the short edge of their box. Kit parts lie on the plane by construction; look hardest at any shape you added by hand.

## 3. The button has a dark stroke on the outside only

Dark outline around the six-corner silhouette. Inside it everything is faint: a near-white top, sides about the floor colour, hairline inner edges.

- Rejected: dark strokes on every edge, and grey side faces. It read as a grey slab.
- Rejected: a long thin strip (about 7:1) as the button. The original is about 3.5:1 with a deep top face.

## 4. The shadow is barely there

The button's whole silhouette, dropped 8 units straight down, blurred by 5, at about 8% black. It shows as a soft band under the lower edges.

- Rejected three times: a shadow drawn from the floor footprint, pushed left, with a wide blur. It showed as a smudge at the left corner.
- Check: `measure.py check` passes its three shadow lines (reach 12 to 18 px, darkest 4 to 8%, nothing to the left). `evaluation.png` reads 15 px and 6%.

## 5. Text is regular weight and dark grey

Geist Mono 400. Main size 19.5 units, captions 15, nothing smaller.

| Text                                   | Colour             | Kit name | Example                          |
| -------------------------------------- | ------------------ | -------- | -------------------------------- |
| a value, the button's label            | `--text-secondary` | `C.ink`  | `active`, `Gateway keys`         |
| a label that has a value after it      | `--text-disabled`  | default  | `maria`, `warning`               |
| a name that is the row's whole content | `--text-tertiary`  | `C.mid`  | `OpenAI`, `codex`, `anthropic:*` |

- Rejected: the site's Medium weight. The originals are set in regular and Medium reads heavy and squat.
- Decided in review: dark grey (`--text-secondary`) instead of the exports' near-black, at the regular weight. Do not go lighter than 400 to compensate.
- The component loads the regular weight itself (`next/font/google`); the site's `--font-mono` is Medium.

## 6. Rows hug their content, packed from the left

Label, dot, value in sequence with the measured padding (17, 16, 15, 14). The row is as wide as its content.

- Rejected: fixed-width rows with the value pushed to the right edge. They read as stretched strips with a hole in the middle.
- Size a fixed-width column for its longest realistic label; never truncate.

## 7. Connectors are thin, square-cornered, and end in a square on top of the box

1.5 units, light grey. A branch fades from grey at the trunk to its tone. The 6-unit square sits on the box edge and is drawn after the box.

- Rejected: squares drawn before the rows, so the row fill covered half of each.
- Rejected: curves. Lines run along plane x or plane y only.
- A line never crosses a row. Stop it at the row and resume after (see the time axis in the tracing scene).
- Dashes are for axes and chart guides only, never for a connector or a state.

## 8. Colour carries state, sparingly

One accent per row. Values of the same kind share one colour.

| State                                           | Colour                      | Kit name         |
| ----------------------------------------------- | --------------------------- | ---------------- |
| good, active, passing                           | green `--color-green-600`   | `ok`             |
| failed, revoked, over a limit                   | pink `--text-code-pink`     | `error`          |
| close to a limit, a warning, an amount of money | orange `--text-code-orange` | `warn`, `C.warn` |
| no state                                        | grey `--text-disabled`      | `none`           |

A row without a state keeps a grey dot when its neighbours have dots, so the values line up (`ci-release` in the keys scene). Something inactive, waiting or not reached is that same row: a grey dot and its value in words. Do not fade or dash it; fading shows distance (rule 10), not state.

- Rejected: three values of the same kind in three colours (orange, black, grey).
- Colours come from tokens only, so both themes work. The one literal is `#fff` inside masks, where it means "visible", not a colour.

## 9. The floor grid is even, and pieces sit on it

36-unit squares under the whole drawing, easing off only toward the far corners. The button's footprint starts on a grid corner, the first row at 72, rows on a 54 pitch, indent 54, trunk at 18. A width you set by hand (a button, a fixed column, a meter, a chart) is a multiple of 18. A row that hugs its content keeps the width its text gives it: rule 6 wins over the grid.

- Rejected: a grid that faded in a blob around the centre. Pieces ended up floating outside it.
- Rejected: a darker floor rectangle behind the art. It showed as a box.
- The originals do not sit on the grid everywhere either. Balance matters more than snapping every edge.

## 10. One hero, a few supporting pieces, centred

A drawing has one raised element, two to four flat ones, and at most one callout. It is centred on the floor and balanced left to right.

- Rejected: small sparse clusters in a corner of the card.
- Rejected: two equal options drawn as a button with the other option hanging under it. Equal things get one slab with equal cells.
- Things recede by opacity (0.7, then 0.6), never by blur. A chart eases off with distance from its tagged point; the tag stays crisp.

## 11. Fixed size, never cropped

Drawings show at `SCALE` and shrink only when the card is narrower or shorter than the drawing. No cropping, no sideways scroll.

- Check the real page at desktop width and at 375 px. The mock cannot show this (its panel is a fixed 941 px), so the rule stays open until the port.

## 12. Keep the copy

Every word the product copy gives a drawing stays, in its own case. A supporting label that is not in the copy needs a yes from the design owner first. Labels are data in `content.ts`, never strings inside a draw function.

- Rejected: a version that added about fifteen labels and an invented data series to look richer.

## 13. Show early, in pairs

Put the original and your drawing side by side at the same scale (`assets/compare.html`), and include today's version when you are replacing one. A new card has no today's version: show the original and yours. Show a first result within minutes; do not measure in silence for long.
