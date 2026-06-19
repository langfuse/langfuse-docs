---
name: langfuse-design
description: Langfuse design and brand system - logo, typography, color palette, design tokens, voice, and product UI patterns. Use when designing or building anything Langfuse-branded (UI, marketing pages, press/partner assets) or when applying Langfuse colors, fonts, or component patterns. Always regenerates design tokens from the live app theme first so values are never stale.
disable-model-invocation: true
---

# Langfuse design skill

Langfuse's design and brand system: logo, typography, color palette, design
tokens, voice, and product UI patterns.

## Before using this skill (required)

The design tokens in this skill (colors, fonts, typography, radius) are
**generated from the live app theme** and can go stale. Before reading or
applying any token value, regenerate the reference so you are working from the
current source of truth:

```sh
pnpm sync-design-tokens
```

This reads `style.css` (Tailwind v4 `@theme` + `:root` light/dark tokens) and
`app/layout.tsx` (fonts) and rewrites
[design-system/references/design-tokens.md](design-system/references/design-tokens.md).
Only rely on the token reference **after** running it.

If the command fails (for example, the skill is used outside the langfuse-docs
checkout, where `style.css` and `app/layout.tsx` are unavailable), treat the
committed token values as potentially outdated and verify against the app
before use.

## Guidelines

- [Brand guidelines](brand-guidelines/SKILL.md) - colors, typography, logo, icon, and voice for press, partner pages, and external-facing content.
- [Design system](design-system/SKILL.md) - component patterns, [design tokens](design-system/references/design-tokens.md), [components](design-system/references/components.md), and product UI heuristics.
- [Marketing pages](marketing-pages/SKILL.md) - page structure, shared primitives, and content sections.

Brand asset library and full download package: https://langfuse.com/brand
