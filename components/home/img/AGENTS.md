# Customer wordmarks

These SVGs are the homepage / enterprise / adopters / wrapped wordmarks. Signets, `*-mono.svg`, and `visuals/` are separate and not covered here.

## No padding

Crop every wordmark to its ink. The file must not sit on a padded shared canvas (the old `140×40` artboard).

- Set `viewBox` to the artwork bounds (a hairline buffer is fine; empty left/right/top/bottom space is not).
- Set `width` and `height` to the same values as the viewBox size, for example `viewBox="50.25 13.25 38.5 13.5"` with `width="38.5" height="13.5"`.
- Keep path coordinates in the original ~40-unit-tall canvas. Do not rescale the artwork to a new coordinate system. Display size is `inkHeight * (slotHeight / 40)` via `wordmarkDisplaySize` in `components/shared/wordmark.ts`. A newly exported 200×80 file will render several times too large.

CSS cannot trim SVG alpha. Do not compensate with crop tables, negative margins, or `object-contain` on a tall box.

## Adding a logo

1. Save a tight SVG in this folder (`lowercase-name.svg`).
2. Homepage / enterprise strip: import it in `components/shared/EnterpriseLogoGrid.tsx` and append a `companies` entry (`customerStoryPath` and `hidden` as needed).
3. `/users` explorer: import it in `components/customers/AdoptersExplorerWrapper.tsx` and add `{ src }` to `COMPANY_LOGOS`. No crop rect.
4. `/wrapped` tiles: import it in `components/wrapped/Customers.tsx` and size it with `wordmarkDisplaySize(logo, 32)`. Do not use `h-8 object-contain` on these files.

Spacing and alignment are CSS (`gap`, flex/grid centering). If a new logo looks gappy, the SVG still has padding — crop the file instead of adding per-logo math.
