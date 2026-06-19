---
name: langfuse-design-system
description: Langfuse design system - product UI patterns, design tokens, component conventions, and UI heuristics for building interfaces consistent with the Langfuse website and product. Use when implementing UI in the langfuse-docs site or any Langfuse-branded surface.
---

# Langfuse design system

The Langfuse design system is implemented with Tailwind CSS and
[shadcn/ui](https://ui.shadcn.com) on top of a set of semantic design tokens.
This document covers UI heuristics; see the references for the full token and
component detail:

- [Design tokens](references/design-tokens.md) - the complete color, typography, and radius token set (light and dark). This file is auto-generated from `style.css` and `app/layout.tsx` by `scripts/sync-design-tokens.js`; run `pnpm sync-design-tokens` to refresh it. Treat it, not this document, as the source of truth for exact values.
- [Components](references/components.md) - component patterns and how tokens map to shadcn/ui.

## Before using these tokens (required)

The token reference is generated from the live app theme and can go stale.
Regenerate it before reading or applying any color, font, typography, or radius
value:

```sh
pnpm sync-design-tokens
```

Only rely on [references/design-tokens.md](references/design-tokens.md) after
running this.

## Core principles

- **Semantic tokens only.** Never hard-code color values in markup. Use the semantic tokens (`bg-surface-bg`, `text-primary`, `surface-cta-primary`, etc.) or the shadcn variables (`bg-background`, `text-foreground`, `border-border`). This keeps light and dark mode automatically consistent.
- **Two themes, one source.** Every token has a light value (`:root`) and a dark value (`:root[class~="dark"]`). Design against the token, not the rendered color.
- **Mobile-first responsive.** Build layouts mobile-first and layer in `md:`/`lg:` breakpoints.
- **Reuse shadcn/ui.** Prefer existing shadcn/ui patterns and components over bespoke ones.

## Surfaces and elevation

Backgrounds are layered with a small set of surface tokens rather than ad-hoc
grays:

- `surface-bg` - base page background.
- `surface-1`, `surface-2` - progressively raised panels and cards.
- `surface-code` / `surface-code-grey` - code blocks and terminals.
- `surface-cta-primary` - the high-energy yellow used for primary CTAs.
- `surface-beige-accent` - warm accent blocks.

Borders and separators use the `line-*` tokens (`line-structure`,
`line-divider-dash`, `line-cta`, `line-code-border`).

## Text hierarchy

Use the text tokens to express hierarchy instead of opacity hacks:
`text-primary` > `text-secondary` > `text-tertiary` > `text-disabled`. Links use
`text-links`. In code blocks, the `text-code-*` tokens provide syntax accents
(orange, pink, blue).

## Radius

A single base radius (`--radius`) drives the scale: `rounded-lg`, `rounded-md`,
and `rounded-sm`. Prefer these over arbitrary radii. See the
[design tokens](references/design-tokens.md) reference for the resolved values.

## Typography in UI

- Body and UI: `font-sans`.
- Code and monospaced data: `font-mono`.
- Display / serif accent: `font-analog`.
- Headings in sentence case; reserve title case for short standalone labels.

The exact font families and weights backing these utilities are resolved from
`app/layout.tsx` and listed in the
[design tokens](references/design-tokens.md) reference, so they never drift from
the app.
