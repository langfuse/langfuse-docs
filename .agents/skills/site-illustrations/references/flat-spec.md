# Flat boxed diagrams: spec from code

Every value is read from the code named next to it. The two originals are the homepage diagrams:

- `components/home/PlatformOverview.tsx` (PO): three bracket-cornered panels joined by elbow arrows.
- `components/home/academy-loop/AcademyRowVisual.tsx` (ARV): five step cards in a row with return paths.

A third diagram is built from the same pieces outside the homepage: `components/gateway/GatewayFlowDiagram.tsx`, the request flow on /gateway. It is the closest worked example for a new page. The last section lists what it had to decide for itself.

Shared pieces: `components/ui/corner-box.tsx` (CB), `components/home/diagram-arrows.tsx` (DA), `components/home/academy-loop/shared.tsx` (SH), bracket rules in `style.css` (CSS).

Do not copy from these:

- `components/academy/*Diagram.tsx`: an older family on a fixed canvas (2 px radius, hover-only brackets, 1.25 px lines, uppercase tags, one curved path).

## How they are built

HTML and Tailwind on a CSS grid. SVG only for arrowheads, icons and the wordmark. Both wrap in `not-prose`. Each has two drawings: a wide one (`hidden md:grid` or `hidden md:block`) and a compact one (`md:hidden`) that stacks vertically with down arrows. The wide drawing is never just scaled down for phones.

## Boxes

|                         | Value                                                                                                                              | Where                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| Border                  | 1 px `--line-structure` (`border border-line-structure`)                                                                           | CB:113, ARV:37-38      |
| Corner radius           | 0                                                                                                                                  | CB:110-113, ARV:37     |
| Fill                    | `--surface-bg` (`bg-surface-bg`)                                                                                                   | CB:110, ARV:37         |
| Shadow                  | none                                                                                                                               |                        |
| Padding                 | 16 px in panels (`p-4`), `p-3 sm:p-4` in cards that are links, 12 px in step cards (`p-3`)                                         | PO:163, PO:202, ARV:37 |
| Dividers inside a panel | `divide-y divide-line-structure`, `border-t border-line-structure`                                                                 | PO:163, PO:190         |
| Active box              | border becomes `--line-cta`, still 1 px, plus a green dot                                                                          | ARV:38                 |
| Hover                   | diagonal stripes, only on a box that is a link (`hoverStripes` inside `NextLink`); `transition-[background] duration-180 ease-out` | CB:115-116, PO:200-202 |

## Corner brackets

|                     | Value                                                                                                          | Where                           |
| ------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| How                 | one `::before` with four 8 × 8 mask images; no extra elements                                                  | CSS:836-875                     |
| Shape               | an L with 8 px arms, 1 px thick                                                                                | CSS:839-842                     |
| Colour              | `--line-cta`                                                                                                   | CSS:856                         |
| Position            | inset -1 px, so they sit on the box border                                                                     | CSS:850-853                     |
| Use                 | every panel and step card, always on: use `CornerBox`, or the class `corner-box-corners` on a bordered element | CB:113, ARV:37                  |
| No brackets on      | chips, icon tiles, label tags, the "new" tag                                                                   | PO:176, PO:223, PO:272, ARV:106 |
| Hide single corners | `corners` prop, `cornersFromNeighbors`, `cornersForGridCell`                                                   | CB:29-54, CB:98-102             |

## Type

| Role                      | Value                                                                                                                                                                         | Where         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Step card title           | F37 Analog (`font-analog`), `text-[20px] xl:text-[23px]`, medium, `--text-primary`, `leading-[1.05]`. For a box whose title is its whole content.                             | ARV:52-53     |
| Panel title               | Inter, `text-[15px]`, medium, `--text-primary`, `leading-tight`. For a box that also holds a description, chips or tiles.                                                     | PO:145        |
| Description               | Inter, `text-[13px]`, `--text-tertiary`, `leading-snug tracking-[-0.2px]`                                                                                                     | PO:153        |
| Small caption             | `MonoLabel`: Geist Mono, `text-[10px] leading-none`, `--text-tertiary`. The strings are written lowercase in the source; names and acronyms keep their case (`LLM-as-judge`). | SH:46, PO:137 |
| Section label above a row | Inter, `text-[13px]`, medium, `--text-primary`, inside `Highlight`, then a bracket line `h-2 border-x border-t border-line-structure`                                         | ARV:124-131   |

## The one accent

`--surface-cta-primary` (light `#fbff81`, dark `#4c4d23`). Never a border or a text colour.

| Use                              | Value                                                                                                                                                                                            | Where      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Highlighter behind a short label | `Highlight`: `px-1 -mx-1`, a band over the lower part of the text: `linear-gradient(transparent 55%, color-mix(in oklab, var(--surface-cta-primary) 80%, transparent) 55% 95%, transparent 95%)` | SH:65-68   |
| "new" tag                        | `shrink-0 bg-surface-cta-primary px-1.5 py-0.5 font-mono text-[10px] leading-none text-text-primary`, no border, no radius                                                                       | PO:223     |
| Accent icon tile                 | `h-6 w-6 border border-line-structure bg-surface-cta-primary`                                                                                                                                    | PO:289-292 |

## Status dot

`PulseDot` (SH:76-88): 6 px circle at `right-2 top-2`. Active: `--callout-success` with a halo `0 0 0 3px color-mix(in oklab, var(--callout-success) 25%, transparent)`. Idle: `--text-disabled`, no halo.

## Connectors

|                 | Value                                                                                                                                               | Where           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Line            | 1 px, `--line-cta` (`h-px bg-line-cta` or `w-px`), solid, never dashed                                                                              | DA:57, PO:335   |
| Arrowhead       | filled triangle, 8 × 8 svg, `viewBox 0 0 10 10`, right = `M 0 0 L 10 5 L 0 10 Z`, fill `--line-cta`; one path per direction, never rotated          | DA:6-18         |
| Tip             | touches the target's edge; the head overlaps its line by 1 px                                                                                       | DA:57-61        |
| Straight arrow  | `HArrow` / `VArrow` fill a gutter: 24 px between step cards, 44 px between panels                                                                   | ARV:157, PO:385 |
| Elbows          | right angles only, drawn in the gutter; spine at 50%, branches at the row centres                                                                   | PO:330-382      |
| Split and merge | `SplitConnector`: one line in, a spine, one arrow per row. `MergeConnector`: one line per row, a spine, one arrow out. Both are built for two rows. | PO:358-382      |
| Junction square | 5 × 5 px, `--line-cta`, centred on the source box's edge, only where a line splits                                                                  | PO:346          |
| Return path     | U shape below the row in an 84 px strip, depths 26 and 64 px, legs nudged 10 px apart so two paths never share a line                               | ARV:170-188     |
| Label on a line | `border border-line-structure bg-surface-bg px-2 py-1` box centred on the line, text `MonoLabel` in `--text-secondary`, lowercase                   | ARV:106-109     |

## Chips and tiles

| Piece         | Classes                                                                                                                                                                                                                                                                                                            | Where      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Outlined chip | `block border border-line-structure px-2 py-1 text-[13px] leading-none text-text-secondary`; row `flex flex-wrap gap-1.5`                                                                                                                                                                                          | PO:266-273 |
| Dark chip     | `block bg-surface-code py-1.5 text-center font-mono text-[12px] font-medium text-text-code-secondary`; row `grid grid-cols-4 gap-1.5`                                                                                                                                                                              | PO:306-311 |
| Icon tile     | `flex h-6 w-6 items-center justify-center border border-line-structure bg-surface-1`, 14 px image; row `flex flex-wrap gap-1.5`. A file with empty space around its mark needs a larger image so the mark matches its neighbours. A black mark needs `dark:brightness-0 dark:invert`, or it vanishes in dark mode. | PO:171-182 |

## Layout

|                       | Value                                                                                                                                                                            | Where                                                                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Step row              | five equal columns with 24 px arrow gutters                                                                                                                                      | ARV:147-157                                                                 |
| Panels                | `grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)_44px_minmax(0,1.2fr)]`; a middle column of two rows has `gap-4`                                                                     | PO:385-392                                                                  |
| Page width            | homepage: 680 px from `md`, 840 px from `xl`. Elsewhere the host decides: on /gateway the column is `max-w-[960px]` in a `pattern-bg` section.                                   | `components/home/HomeSection.tsx:40`, `content/marketing/gateway.mdx:49-54` |
| Page behind the boxes | homepage: the same `--surface-bg` as the boxes, so only borders show. On other pages the page can be `--surface-1`, and the boxes then read as lighter cards. Shoot it and look. | pixel samples of both pages                                                 |
| Compact               | `flex flex-col`, arrows become `VArrow` rows, pairs sit in `grid grid-cols-2 gap-2`                                                                                              | PO:422-453, ARV:198-271                                                     |

## Pieces to import

| Piece                                                        | From                                    |
| ------------------------------------------------------------ | --------------------------------------- |
| `CornerBox`, `cornersFromNeighbors`, `cornersForGridCell`    | `@/components/ui`                       |
| `ArrowHead`, `HArrow`, `VArrow`, `ARROW_COLOR`, `ARROW_HEAD` | `@/components/home/diagram-arrows`      |
| `MonoLabel`, `Highlight`, `PulseDot`                         | `@/components/home/academy-loop/shared` |

File-local today, so copy the pattern rather than the import: `Eyebrow`, `Title`, `Detail`, `Line`, `Junction`, `SplitConnector`, `MergeConnector` (PO:135-382); `StepCard`, `ReturnPath`, `PhaseBracket` (ARV:19-134). If a third diagram needs one of them, move it to a shared file first.

## Rules that hold in both originals

1. Boxes: 1 px `--line-structure`, fill `--surface-bg`, square corners, no shadow.
2. Panels and cards carry the 8 px bracket corners in `--line-cta`; small pieces inside them do not.
3. At most one accent, `--surface-cta-primary`, as a highlighter band, a small tag or a tile fill. It is optional: design review took the band off the gateway flow diagram.
4. Colours are tokens. No hex values inside a diagram.
5. Captions are mono 10 px in `--text-tertiary`; titles are medium weight in `--text-primary`.
6. Lines are 1 px `--line-cta`, solid, straight or right-angled, and end in a filled 8 px triangle whose tip touches the box.
7. A line leaves and enters at the middle of a box edge. Lines meet only at a split or merge spine in a gutter; two separate paths never share a segment (the loop's return paths are nudged 10 px apart).
8. A label on a line is a small bordered `--surface-bg` box with lowercase mono text.
9. Only the status dot is round.
10. There is a separate compact drawing for narrow widths: below `md` on the homepage, below a 768 px container on /gateway.

## What the homepage originals do not settle

Neither homepage diagram shows these. The gateway flow diagram went through design review with the choices below, so they are precedent, not rules. When your diagram meets one of these questions, name your choice in the hand-over and ask the design owner.

| Question                                                                                                                          | What the gateway flow diagram does                                                                                                   |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| A boundary that holds cards (Langfuse around AI Gateway and tracing). The originals only divide a panel into sections with lines. | a `CornerBox` panel with two `CornerBox` cards inside, brackets on all three                                                         |
| Where an arrow ends when it means a card inside a boundary                                                                        | at the middle of the boundary's edge. Design review asked for the three panels centred on one line, and the arrows run on that line. |
| Lines from more than two boxes into one                                                                                           | the boxes go into one panel with a single arrow: clients as chips, providers one per row with their icons                            |
| An icon and a name as a panel's heading                                                                                           | a 24 px icon tile and a panel title in one row                                                                                       |
| Lowercasing a caption that the page's copy writes with a capital                                                                  | lowercase through CSS, the source string unchanged; this is a copy change, so ask                                                    |
| Column ratios and fluid widths outside the homepage                                                                               | `0.7fr 44px 1fr 44px 0.7fr` in a 960 px column; the wide layout shows from a 768 px container (`@3xl`), the stacked one below it     |
