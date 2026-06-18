# Components

Langfuse UI is built on [shadcn/ui](https://ui.shadcn.com) with Tailwind CSS.
Components are composed from the shared design tokens
([design-tokens.md](design-tokens.md)) so they theme automatically in light and
dark mode.

## How tokens map to components

shadcn/ui components read the HSL semantic variables, so styling a component is
a matter of choosing the right variant rather than passing colors:

- Surfaces / cards: `bg-card`, `bg-popover`, or the layered `surface-1` / `surface-2` tokens.
- Text: `text-foreground`, with `text-muted-foreground` for secondary copy, or the `text-primary` / `text-secondary` / `text-tertiary` token scale.
- Borders and dividers: `border-border` or the `line-*` tokens.
- Focus rings: `ring` token.

## Buttons

- **Primary CTA:** the high-energy yellow `surface-cta-primary` with `text-primary`. Reserve for the single most important action on a view.
- **Secondary:** `secondary` / `secondary-foreground` (neutral gray surface).
- **Ghost / icon:** transparent with `surface-button-grey` on hover; icon color from `--button-icon-color`.
- Radius: `rounded-md` by default.

## Cards and panels

- Base panel: `surface-1`; nested or raised panel: `surface-2`.
- Use `line-structure` for the outer border and `line-divider-dash` for internal dashed separators.
- Radius: `rounded-lg`.

## Code blocks and terminals

- Background: `surface-code` (dark in both themes) with `surface-code-grey` for inline variants.
- Syntax accents: `text-code-orange`, `text-code-pink`, `text-code-blue`; secondary code text uses `text-code-secondary`.
- Border: `line-code-border`. Copy buttons use `surface-code-button`.
- Font: `font-mono` (Geist Mono).

## Callouts

Map intent to the callout tokens: `callout-info`, `callout-warning`,
`callout-error`, `callout-success`, `callout-idea`. Keep the icon and accent
color consistent with the intent.

## Implementation rules

- Use existing shadcn/ui components and patterns before building bespoke ones.
- Never hard-code colors; use semantic tokens (see `tailwind.config.js` and `style.css`).
- Build mobile-first, then layer responsive breakpoints.
- Stick to the radius scale (`rounded-sm` / `rounded-md` / `rounded-lg`).
