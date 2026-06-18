---
name: langfuse-brand-guidelines
description: Langfuse brand guidelines - colors, typography, logo, icon, and voice for marketing materials, press, partner pages, and external-facing content. Use when designing anything that represents the Langfuse brand or applying logo/color/typography rules.
---

# Langfuse brand guidelines

Langfuse is the **open source AI engineering platform**. Teams use Langfuse to trace, evaluate, and improve LLM applications and AI agents in production. These guidelines cover the brand fundamentals for external-facing content. Official assets and a full download package are at [langfuse.com/brand](https://langfuse.com/brand).

## Logo and icon

The Langfuse trademark includes the Langfuse name and logo assets. **Do not**
modify these assets or use them in a way that suggests sponsorship, endorsement,
or confuses Langfuse with another brand.

Three asset families are available, each in light, dark, and monochrome
variants (SVG and PNG):

- **Icon** - the standalone mark. Color and monochrome.
  - `/brand-assets/icon/color/langfuse-icon.svg` (and `.png`)
  - `/brand-assets/icon/monochrome/langfuse-icon-monochrome.svg`
- **Wordmark - Langfuse** - the primary wordmark.
  - Light: `/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg` (and `.png`)
  - Dark (white): `/brand-assets/wordmark/Langfuse/dark/langfuse-wordart-white.svg` (and `.png`)
  - Monochrome: `/brand-assets/wordmark/Langfuse/monochrome/langfuse-wordart-monochrome.svg`
- **Wordmark - Langfuse by ClickHouse** - the co-branded lockup.
  - Light: `/brand-assets/wordmark/Langfuse by ClickHouse/light/langfuse-by-clickhouse.svg` (and `.png`)
  - Dark (white): `/brand-assets/wordmark/Langfuse by ClickHouse/dark/langfuse-by-clickhouse-white.svg` (and `.png`)
  - Monochrome: `/brand-assets/wordmark/Langfuse by ClickHouse/monochrome/langfuse-by-clickhouse-monochrome.svg`

Usage rules:

- Use the light wordmark on light backgrounds and the dark (white) wordmark on dark or photographic backgrounds.
- Use the monochrome variants when color reproduction is constrained (single-color print, embossing, watermarks).
- Maintain clear space around the logo and never stretch, recolor, or add effects to it.
- Download the complete package (all variants) from [langfuse.com/brand](https://langfuse.com/brand) (`/brand-assets.zip`).

## Color palette

Langfuse uses a warm, near-neutral palette with a high-energy yellow as the
primary call-to-action accent. Colors are defined as design tokens (see
[design-tokens.md](../design-system/references/design-tokens.md) for the
complete set, including dark mode). The brand-defining values:

| Role         | Light     | Dark      |
| ------------ | --------- | --------- |
| Background   | `#f6f6f3` | `#171714` |
| Primary text | `#222220` | `#e8e8e4` |
| CTA / accent | `#fbff81` | `#4c4d23` |
| Links        | `#4f39f6` | `#7b8ff8` |
| Code surface | `#333333` | `#0e0e0c` |
| Beige accent | `#f1ede1` | `#f1ede1` |

Principle: in product and site code, always reference the **semantic token**
(e.g. `surface-bg`, `text-primary`, `surface-cta-primary`) rather than a
hard-coded hex value, so light and dark modes stay in sync.

## Typography

- **Sans (UI and body):** Geist Sans (`--font-geist-sans`).
- **Mono (code):** Geist Mono (`--font-geist-mono`).

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
