<!--
  Static template for the public Langfuse design page (served at
  https://langfuse.com/design.md). The live design.md is generated from this
  template by scripts/sync-design-tokens.js, which replaces the DESIGN_TOKENS
  placeholder below with design tokens read from the live app theme.
  Edit this template; never edit the generated design.md.
-->

# Langfuse Design

> Langfuse's design and brand system - logo, typography, color palette,
> design tokens, and product UI patterns. Langfuse is the open source AI
> engineering platform. Brand assets and the full download package live at
> https://langfuse.com/brand.

## Guidelines

Langfuse is the **open source AI engineering platform**. Teams use Langfuse to trace, evaluate, and improve LLM applications and AI agents in production. These guidelines cover the brand fundamentals for external-facing content. Official assets and a full download package are at [langfuse.com/brand](https://langfuse.com/brand).

### Logo and icon

The Langfuse trademark includes the Langfuse name and logo assets. **Do not**
modify these assets or use them in a way that suggests sponsorship, endorsement,
or confuses Langfuse with another brand.

Three asset families are available, each in light, dark, and monochrome
variants (SVG and PNG):

- **Icon** - the standalone mark. Color and monochrome.
  - [Color (SVG)](https://langfuse.com/brand-assets/icon/color/langfuse-icon.svg) / [Color (PNG)](https://langfuse.com/brand-assets/icon/color/langfuse-icon.png)
  - [Monochrome (SVG)](https://langfuse.com/brand-assets/icon/monochrome/langfuse-icon-monochrome.svg)
- **Wordmark - Langfuse** - the primary wordmark.
  - [Light (SVG)](https://langfuse.com/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg) / [Light (PNG)](https://langfuse.com/brand-assets/wordmark/Langfuse/light/langfuse-wordart.png)
  - [Dark / white (SVG)](https://langfuse.com/brand-assets/wordmark/Langfuse/dark/langfuse-wordart-white.svg) / [Dark / white (PNG)](https://langfuse.com/brand-assets/wordmark/Langfuse/dark/langfuse-wordart-white.png)
  - [Monochrome (SVG)](https://langfuse.com/brand-assets/wordmark/Langfuse/monochrome/langfuse-wordart-monochrome.svg)
- **Wordmark - Langfuse by ClickHouse** - the co-branded lockup.
  - [Light (SVG)](https://langfuse.com/brand-assets/wordmark/Langfuse%20by%20ClickHouse/light/langfuse-by-clickhouse.svg) / [Light (PNG)](https://langfuse.com/brand-assets/wordmark/Langfuse%20by%20ClickHouse/light/langfuse-by-clickhouse.png)
  - [Dark / white (SVG)](https://langfuse.com/brand-assets/wordmark/Langfuse%20by%20ClickHouse/dark/langfuse-by-clickhouse-white.svg) / [Dark / white (PNG)](https://langfuse.com/brand-assets/wordmark/Langfuse%20by%20ClickHouse/dark/langfuse-by-clickhouse-white.png)
  - [Monochrome (SVG)](https://langfuse.com/brand-assets/wordmark/Langfuse%20by%20ClickHouse/monochrome/langfuse-by-clickhouse-monochrome.svg)

Usage rules:

- Use the light wordmark on light backgrounds and the dark (white) wordmark on dark or photographic backgrounds.
- Use the monochrome variants when color reproduction is constrained (single-color print, embossing, watermarks).
- Maintain clear space around the logo and never stretch, recolor, or add effects to it.
- Download the complete package (all variants) from [langfuse.com/brand](https://langfuse.com/brand).

## Color palette

Langfuse uses a warm, near-neutral palette with a high-energy yellow as the
primary call-to-action accent. Colors are defined as design tokens, never
hard-coded hex. The brand-defining roles map to these tokens:

| Role                      | Token                    |
| ------------------------- | ------------------------ |
| Page background           | `--surface-bg`           |
| Primary text              | `--text-primary`         |
| CTA / accent (the yellow) | `--surface-cta-primary`  |
| Links                     | `--text-links`           |
| Code surface              | `--surface-code`         |
| Warm beige accent         | `--surface-beige-accent` |

The exact light and dark values for every token are listed in the Design tokens
section below, generated from the live app theme. Always reference the
**semantic token** rather than a hard-coded hex value, so light and dark modes
stay in sync.

## Typography

- **Sans (UI and body):** Tailwind `font-sans` / `--font-sans`.
- **Mono (code):** `font-mono` / `--font-mono`.
- **Display (serif accent):** `font-analog` / `--font-analog`.

The exact font families and weights backing these utilities are listed in the
Design tokens section below, generated from the live app theme.

Use sentence case for headlines, section headings, and hero copy by default.
Keep title case only for short standalone navigation/UI labels where it reads
more naturally (e.g. "Get Started"). Always preserve proper nouns, acronyms,
and official product names (Langfuse, ClickHouse, OpenTelemetry).

## Voice and positioning

- **Who we are:** the open source AI engineering platform, part of ClickHouse. Vendor-neutral and built on [OpenTelemetry](https://langfuse.com/integrations/native/opentelemetry). Available as Langfuse Cloud or self-hosted at production scale.
- **What we help teams do:** trace, evaluate, and improve LLM applications and AI agents - across observability, prompt management, and evaluations.
- **Tone:** helpful and conversational, not marketing copy. Be specific - name actual features, metrics, and commands. Lead with what's now possible rather than past limitations. Avoid filler headings like "Why This Matters" or "Key Benefits."
- **Open by default:** MIT-licensed core, public [handbook](https://langfuse.com/handbook/chapters/story), and an integrated, open tooling layer.

Channels: [GitHub](https://github.com/langfuse), [X/Twitter](https://x.com/langfuse), [LinkedIn](https://linkedin.com/company/langfuse).

## Design tokens

The complete Langfuse design token set, generated directly from the live app
theme so it always matches production. Every token below has a light value and,
where defined, a dark value. Always reference the semantic token in code, never
a raw value.

<!-- DESIGN_TOKENS -->

Brand asset library and full download package: https://langfuse.com/brand
