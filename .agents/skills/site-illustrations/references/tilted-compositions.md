# Tilted line drawings: parts and compositions

## Pick a composition by the shape of the content

| The content is                                        | Draw it as                                                          | Original it follows         | Scene to copy |
| ----------------------------------------------------- | ------------------------------------------------------------------- | --------------------------- | ------------- |
| a named thing with a few items that each have a state | button, rows hanging off one trunk, a fainter parent behind         | Evaluation                  | `keys`        |
| an amount against a limit                             | button, hatched meter with marks, a callout row                     | Human Annotation            | `budget`      |
| a trend with one number that matters                  | chart flat on the floor, hatch under the line, dark tag on a cursor | Experiments, Cost & Latency | `spend`       |
| a list of things that are on or off                   | button, rows, a switch after each label                             | Human Annotation            | `models`      |
| several inputs that end in one result                 | chips wired into one bracketed result                               | Prompt Management           | `agents`      |
| steps in time, or nested costs                        | spans stepping along a dashed time axis, fading with distance       | Observability               | `tracing`     |
| equal options                                         | one slab with an equal cell per option                              | Security & compliance       | `hosting`     |
| one hub and many peers                                | button, peers wrapped into rows on its trunk                        | Evaluation                  | providers     |

If nothing fits, find the homepage original with the closest content and follow its arrangement. Do not invent a new arrangement before checking all seven exports and the slab.

Choosing between two that fit:

- Take the one no other card on the page uses. The homepage uses each arrangement once. The gateway page repeats the tree once (keys and providers) and changes what hangs off it: rows with a state, then peers without one. When every arrangement is taken, repeat the one used least, change what hangs off it, and name the repeat in the hand-over.
- When the rows are parts of one named thing, the button is that thing (`Gateway keys` over its keys, `AI Gateway` over its providers). When the rows are equals, the first one is the button (`openai:*`, `claude-code`, `opus $4.2k`). Take the name from the copy, and the card title only when the copy gives none. It is data in `content.ts`.
- The fainter parent row behind the button exists only when the copy names a parent (the key's team, `group`). The `keys` scene always draws it. Without a parent, write a new scene: `keys` without its first three calls (the parent row, its line and its square). Do not add an option to an existing scene for one card.
- Small captions (15 units) are for axis marks only, like `0s 1s 2s`.

## Parts

The same parts exist in the mock kit (`assets/tilted-mock.html`, plain JS, returns strings) and in the component (`components/gateway/GatewayFeatureSketch.tsx`, class `Scene`, returns React nodes). Coordinates are plane units; x grows to the upper right, y to the lower right.

| Part          | Call                                                | Notes                                                                                          |
| ------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Raised button | `block(x, y, segs, { w, h, center })`               | The hero. One per drawing. Width defaults to content plus 20 each side.                        |
| Outlined row  | `row(x, y, segs, { w, h, center, opacity, solid })` | Hugs its content unless `w` is set. `solid` hides lines that pass under it. Returns its width. |
| Slab          | `slab(x, y, cells, cellWidth, cellDepth)`           | One raised tile, equal cells along x, each a two-line label and two status dots.               |
| Loose text    | `put(x, yCentre, segs, { fs })`                     | Captions and axis labels, 15 units.                                                            |
| Line          | `line(d, stroke, dash)`                             | Path data in plane units. Use `H` and `V` only.                                                |
| Square        | `node(x, y, fill)`                                  | Where a line meets a box. Drawn above all rows.                                                |
| Branch        | `branch(x0, y, x1, tone)`                           | Trunk to row, tinted, ends in a square.                                                        |
| Callout       | `bracket(x, y, w, h)`                               | Bracket corners around a result.                                                               |
| Tag           | `tag(x, yTop, yBottom, yPoint, lines)`              | Dark two-line tag with a cursor line through a point.                                          |
| Floor line    | `rule(x0, y0, x1, y1)`                              | Long line that fades at both ends. Only under a slab.                                          |
| Extent        | `mark(x, y, z)`                                     | Grows the box the view is centred on. Call it for anything you push by hand.                   |

A line of content is a list of segments: `{ t, fill }` text, `{ dot: "ok" | "warn" | "error" | "none", end }`, `{ toggle: true | false, hero }`, `{ sp: n }` a gap of n characters. A dot leaves room for the value after it; set `end: true` when the dot is the last thing in the line.

Layers, back to front: floor grid, button shadows, plane (rows, lines, text), squares, raised parts. Push raised content last.

Constants: `SCALE 0.6`, `RAISE 16`, `FS 19.5`, `BLOCK_H 54`, `ROW_H 36`, `PITCH 54`, `IND 54`, `TX 18` (trunk), `FIRST_ROW 72`, padding `17` left and `14` right in rows, `20` in buttons.

## Adding a drawing to the gateway page

1. `components/gateway/content.ts`: add a member to the `FeatureSketch` union that names what the drawing shows, and the data on the card.
2. `components/gateway/GatewayFeatureSketch.tsx`: add a `draw…` function that lays the scene out flat, and a `case` in `draw`. It returns the view:

   | Key  | Meaning                                           | Default | Set it when                                                                  |
   | ---- | ------------------------------------------------- | ------- | ---------------------------------------------------------------------------- |
   | `px` | height of the drawing's box in CSS px             | 232     | the card is taller (the wide provider card uses 280)                         |
   | `rx` | how far the floor grid reaches sideways, in units | 300     | the card is in a two-column row (about 442 px wide): use 420. Wide card: 440 |
   | `ry` | how far the grid reaches up and down              | 250     | `px` is larger: the wide card uses 300                                       |

   Return `{}` for a card in the three-column row. After any change, look at the card's left and right ends: the grid must fade out before the card's edge and must not stop short of the drawing.

3. Mirror both in `assets/tilted-mock.html` so the mock stays the twin of the component.

## Drawing somewhere else on the site

`FeatureSketch` and `ProviderSketch` are the only exports today; `Scene` and `Drawing` are private to the gateway file. For a drawing on another page, move `Scene`, `Drawing`, `inner`, `rounded` and the constants into one shared file and import it from both places. Do not copy the kit, and do not write skewed shapes by hand.

## Sizing a drawing

- A card drawing is 232 px tall; the wide provider drawing is 280 px.
- At `SCALE` that is about 387 or 467 units of height. Width on screen is `0.94 * X + 0.5 * Y` units and height is `0.342 * X + 0.866 * Y + lift` for a layout X wide and Y deep. A wide layout climbs: 1000 units across rise 342.
- Keep a card drawing within about 440 units across so it fits a 292 px card without shrinking.
