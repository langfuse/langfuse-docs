---
name: langfuse-design-system
description: Langfuse design system - product UI patterns, design tokens, component conventions, and UI heuristics for building interfaces consistent with the Langfuse website and product. Use when implementing UI in the langfuse-docs site or any Langfuse-branded surface.
---

# Langfuse design system

The Langfuse design system is implemented with Tailwind CSS and
[shadcn/ui](https://ui.shadcn.com) on top of a set of semantic design tokens.
This document covers UI heuristics; see the references for the full token and
component detail:

- [Design tokens](references/design-tokens.md) - the complete color, typography, and radius token set (light and dark).
- [Components](references/components.md) - component patterns and how tokens map to shadcn/ui.

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

A single base radius (`--radius: 0.5rem`) drives the scale: `rounded-lg`
(`--radius`), `rounded-md` (`--radius - 2px`), `rounded-sm` (`--radius - 4px`).
Prefer these over arbitrary radii.

## Typography in UI

- Body and UI: `font-sans` (Geist Sans).
- Code and monospaced data: `font-mono` (Geist Mono).
- Headings in sentence case; reserve title case for short standalone labels.
