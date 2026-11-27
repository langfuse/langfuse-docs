# Tilted line drawings: measured spec

Every number here was measured from the designers' files. Re-measure before changing one; never estimate by eye.

## Originals

| File                                                                                      | What it is                                                            |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `components/home/img/tools/evaluation.png`, `observability.png`, `prompt.png`             | Homepage card drawings, 576 px wide                                   |
| `components/home/img/tools/playground.png`, `experiments.png`, `human.png`, `metrics.png` | Homepage card drawings, 428 px wide                                   |
| `components/home/img/visuals/visual-security.svg`                                         | The compliance slab as a vector file: exact matrix, strokes and fills |

`components/home/AiGatewayVisual.tsx` is a coded imitation, not an original. Its plane runs 25° / 54° and is squashed to 0.85 in depth. Do not copy its numbers.

## Units and scale

- One plane unit is one pixel of the PNG exports.
- The drawings show at 0.6 CSS px per unit (a 576 px export in a 343 px card). The kit calls this `SCALE`.
- To measure a screenshot against an export, take it at device scale factor 1.6667 (1 / 0.6), so one unit is one pixel again.

## Projection

|                        | Value                                  | Source                                        |
| ---------------------- | -------------------------------------- | --------------------------------------------- |
| Matrix                 | `0.939942 -0.341333 0.500853 0.865532` | `visual-security.svg`, every `transform`      |
| Kit matrix             | `0.94 -0.342 0.5 0.866`                | rounded from the above                        |
| Plane x                | 20° up-right, unit length 1            | `measure.py block evaluation.png` prints 19.9 |
| Plane y                | 60° down-right, unit length 1          | same command prints 59.9                      |
| Angle between the axes | 80°                                    | 20 + 60                                       |

Neither axis is squashed. Everything on the floor shares this one matrix: boxes, text, tags, dots, switches, charts.

## The raised button

|                       | Value                                                                                                                    | Source                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Top face              | 184 × 52 units (the kit uses 180 × 54 to sit on the grid)                                                                | `measure.py block evaluation.png`: 185.1 wide, 53.3 deep, outline included |
| Lift                  | 16 units, straight up on screen                                                                                          | same command: `lift 16.0 px`; `human.png` prints 15.0                      |
| Outline               | dark, 2 units, on the outer silhouette only (six corners)                                                                | 3x crop of `evaluation.png`; `#404039` in `visual-security.svg`            |
| Top face fill         | near white, `#fefefe`                                                                                                    | pixel at 150,215 in `evaluation.png`                                       |
| Side faces            | about the floor colour, `#f5f5f2` / `#f4f4f1`                                                                            | pixels at 147,242 and 250,236                                              |
| Inner edges           | thin and faint; `#CFCFC9` in the slab file                                                                               | `visual-security.svg`                                                      |
| Shadow                | reaches about 15 units straight below the lower edges, at most 6% darker than the floor, nothing to the left             | `measure.py shadow evaluation.png`                                         |
| Shadow, which exports | `evaluation.png`, `human.png` and `playground.png` have the soft shadow; the raised span in `observability.png` has none | 5x crops below each button                                                 |
| Label                 | centred, on the plane                                                                                                    | 7x crop: letter stems run along plane y                                    |

The slab in `visual-security.svg` differs from a button in three ways: its front face is one step darker (`#EDEDE8`, `--surface-1`), its lift is larger (about 19 of its own units), and it has no blurred shadow.

## Text

|                                    | Value                                         | Source                                                            |
| ---------------------------------- | --------------------------------------------- | ----------------------------------------------------------------- |
| Family and weight                  | Geist Mono, regular (400)                     | template match on "Evaluators"; the site itself loads Medium only |
| Size                               | 19.5 to 20 units, which is 11.7 CSS px at 0.6 | "Evaluators" is 10 characters across 120.6 px                     |
| Small captions                     | 15 units, 9 CSS px. Nothing smaller.          | captions in `human.png`                                           |
| Placement                          | on the plane, same matrix as the boxes        | stems of `E` and `l` measure about 120° from horizontal           |
| Dark text colour in the exports    | `#222220` (`--text-primary`)                  | `visual-security.svg` fills                                       |
| Dark text colour in coded drawings | `--text-secondary` (`#3d3d38`)                | design decision, see `tilted-rules.md` rule 5                     |
| Label grey                         | `#a7a7a0`, `--text-disabled`                  | child row labels in `evaluation.png`                              |

## Rows

Measured on the child rows of `evaluation.png`.

|                                        | Value                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------- |
| Depth                                  | 34 units (the kit uses 36, one grid cell)                               |
| Pitch                                  | 49 units (the kit uses 54, one and a half cells)                        |
| Indent from the button's left edge     | 53 units (kit: 54)                                                      |
| First row below the button's footprint | 20 units (kit: 18)                                                      |
| Border                                 | 1 px light grey, `--line-structure`; fill barely lighter than the floor |
| Content                                | label, dot, value, packed from the left; the row hugs its content       |
| Padding                                | 17 left, 16 label to dot centre, 15 dot centre to value, 14 right       |

## Dots, connectors, grid

|                        | Value                                                      | Source                                                                     |
| ---------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| Dot                    | radius 4 units with a faint halo; lies on the plane        | `evaluation.png`; projected circles in `visual-security.svg`               |
| Green                  | `#00A63E` (`--color-green-600`)                            | `visual-security.svg`; `measure.py colors evaluation.png` prints `#06a742` |
| Pink                   | `#d05376` (`--text-code-pink`)                             | `measure.py colors evaluation.png`                                         |
| Trunk                  | light grey, 1.5 units, down plane y at x = 22 (kit: 18)    | 3x crop of `evaluation.png`                                                |
| Branch                 | along plane x, grey at the trunk and tinted toward the row | same crop                                                                  |
| Square on the row edge | 6 units, in the branch colour, drawn over the row border   | same crop                                                                  |
| Floor grid             | 36-unit squares, faint, even under the whole drawing       | grid period 35.5 px across plane x                                         |

## What the checks read

Run from the repo root. `M=.agents/skills/site-illustrations/scripts/measure.py`. `python3 $M check FILE` prints the lines below with PASS or FAIL. It reads the largest dark shape, so it needs a raised button that stands alone.

| Picture                                        | Plane x      | Plane y      | Lift     | Shadow       | Note                                                        |
| ---------------------------------------------- | ------------ | ------------ | -------- | ------------ | ----------------------------------------------------------- |
| `evaluation.png`                               | 19.9         | 59.9         | 16       | 15 px, 6%    | all pass; the reference for the shadow                      |
| `observability.png`                            | 20.0         | 59.7         | 16       | none         | the raised span has no blurred shadow in this export        |
| `human.png`                                    | 20.0         | 59.5         | 15       | not readable | text sits in the measured column                            |
| `playground.png`                               | 19.9         | 59.8         | 14       | not readable | the trunk sits in the measured column                       |
| `prompt.png`, `experiments.png`, `metrics.png` |              |              |          |              | `NOT CHECKED`: no free-standing button                      |
| kit: providers, keys, budget, models, tracing  | 19.9 to 20.0 | 59.8 to 60.3 | 16 to 18 | 15 px, 6%    | all pass                                                    |
| kit: spend, agents, hosting                    |              |              |          |              | `NOT CHECKED`: no button, a dark line on the button, a slab |

Limits in `check`: plane x 19.5 to 20.5, plane y 59 to 61, lift 14 to 19 px, shadow reach 12 to 18 px, darkest 4 to 8%, at most 5 of 255 to the left.

- The lift is the height of the hull's vertical edge and includes the 2-unit outline, so a 16-unit lift reads 16 to 18.
- The shadow is read in one column of pixels below the middle of the button's lower edge. A row, a line or text in that column spoils the reading, which is why only `evaluation.png` passes among the exports. Kit buttons keep the first 15 px of that column clear; the first row's border sits about 18 px down, after the reading has stopped.
- Angles come from a line fitted through each stroke's pixels and repeat to about 0.3 degrees between screenshots.
- Measure the light theme only. `check` assumes the light floor.
- `block` can list one to three extra corners where the outline's joins are rounded, and its width and depth read within 2 px. Use it to place crops, not to judge sizes.
