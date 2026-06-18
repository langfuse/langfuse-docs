---
name: langfuse-marketing-pages
description: Langfuse marketing and content page conventions - page structure, shared content sections, and writing style for the langfuse.com website and docs. Use when authoring or laying out marketing pages, landing pages, blog/changelog entries, or docs content.
---

# Langfuse marketing pages

Conventions for building and writing pages on [langfuse.com](https://langfuse.com).
The site is a Next.js app with MDX/Markdown content; pages combine prose with
reusable React components. Apply the [brand
guidelines](../brand-guidelines/SKILL.md) and [design
system](../design-system/SKILL.md) throughout.

## Page structure

- **One H1 per page.** Use a single top-level `#` heading, then nest with `##`, `###` in order without skipping levels.
- **Lead with value.** Open with what the reader can now do, then show 2-3 concrete examples before deeper detail.
- **Sentence case headings.** Use sentence case for headlines and section headings; keep title case only for short standalone labels (e.g. "Get Started").
- **Front matter.** Content pages start with YAML front matter (`title`, `description`) for SEO and routing.

## Shared content sections

Compose pages from reusable building blocks rather than bespoke markup:

- **Hero** - product name, one-line value proposition, primary CTA on `surface-cta-primary`.
- **Feature sections** - observability, prompt management, and evaluations are the three product pillars; describe them in terms of what teams accomplish.
- **Social proof / customers** - logos and customer stories.
- **CTA blocks** - a single, clear primary action per view.
- Reusable MDX components live in `components-mdx/`; reusable React components in `components/`. Prefer these (and shadcn/ui) over one-off implementations.

## Visual assets

- Wrap images in a `<Frame>` component for consistent styling and provide descriptive alt text.
- Use `.mp4` video (hosted on `static.langfuse.com/docs-videos`), never `.gif`.
- Embed YouTube via `https://www.youtube-nocookie.com` to avoid cookies and tracking.
- Use brand logos and icons from the [brand assets](https://langfuse.com/brand); never recolor or modify them.

## Writing style

- Helpful and conversational, not marketing fluff. Be specific - name real features, metrics, and commands.
- Frame positively: describe what's now possible, not past limitations. Avoid filler headings like "Why This Matters."
- American English, consistent punctuation, grammatically correct.
- Preserve proper nouns and product names (Langfuse, ClickHouse, OpenTelemetry).

## Links

- Use descriptive link text, never "click here."
- For deep links to a section anchor, define the anchor explicitly on the heading with `[#anchor]` at the end of the heading line.
- Keep internal links pointing at real pages or anchors.
