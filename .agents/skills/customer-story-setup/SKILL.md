---
name: customer-story-setup
description: >-
  Converts draft customer-story Markdown into Langfuse website MDX (Fumadocs),
  collects missing metadata and assets, wires meta.json and authors. Use when
  adding or converting a customer case study, user story, or /users page, or
  when the user mentions customer story setup, cresta/canva-style posts, or
  CustomerStoryCTA/BlogHeader for customers.
---

> **Single source of truth:** maintain this skill under
> **`.agents/skills/customer-story-setup/`** only. Claude and Cursor load
> projected copies under **`.claude/skills/customer-story-setup`** and
> **`.cursor/skills/customer-story-setup`**.

# Customer story setup (MD -> MDX)

Turns a plain **Markdown draft** into **`content/customers/<slug>.mdx`** in the
same pattern as `content/customers/canva.mdx` and `cresta.mdx`.

## Before writing any file: collect missing input

**Do not guess.** If any item below is missing from the user's draft or
message, **ask explicitly** and wait for answers (or confirm defaults).

### Content & publishing

| Topic | Ask |
|--------|-----|
| **Company name** | Legal/marketing name for copy and quotes |
| **Company website** | Public URL for the `[Company](https://...)` link in **About &lt;Company&gt;** |
| **Slug** | Filename: `<slug>.mdx` (lowercase, hyphens), e.g. `cresta` -> `cresta.mdx` |
| **Page title** | H1 string for `BlogHeader` + YAML `title` (often "How &lt;Company&gt; ... with Langfuse") |
| **Short description** | YAML `description` + `BlogHeader` description (SEO/social; 1-2 sentences) |
| **Publish date** | YAML `date` + `BlogHeader` `date` (e.g. `March 26, 2026`) |
| **OG image** | Optional `ogImage:` path; if unset, leave empty like other stories |

### Authors (BlogHeader `authors={["..."]}`)

| Topic | Ask |
|--------|-----|
| **Byline author(s)** | Who should appear under the title (keys from `data/authors.json`) |
| **External / guest speaker** | If not in `authors.json`: collect name, title, optional socials, and **headshot path** under `public/images/people/` or `public/images/customers/<slug>/`, then **add an entry to `data/authors.json`** (see existing entries). Every `authors` key must resolve in `authors.json`. |

### Branding & Users index card

| Topic | Ask |
|--------|-----|
| **Logos** | Paths for `customerLogo` and `customerLogoDark` (light + dark mode), usually under **`public/images/customers/<slug>/`** |
| **Pull quote** | `customerQuote` (short, for grid card) |
| **Quote attribution** | `quoteAuthor`, `quoteRole`, `quoteCompany` |
| **Speaker headshot (optional)** | `quoteAuthorImage` for card/SEO if you use the same as Canva |
| **Show on /users** | `showInCustomerIndex: true|false` |

### Images (screenshots & diagrams)

Produce a **numbered checklist** for the user (and keep it in the PR
description if useful):

1. **Folder**: **`public/images/customers/<slug>/`**
2. For each asset: **filename**, **purpose**, **where it appears** (section + suggested alt text)
3. Remind: customer posts use **`<Frame fullWidth>`** around markdown images, e.g. `![Alt](mdc:/images/customers/<slug>/file.png)` per site conventions
4. **Size each image by aspect ratio** (run `sips -g pixelWidth -g pixelHeight <file>` to get dimensions):
   - **Portrait / square** (ratio <= 1:1) -> `<div className="flex justify-center"><Frame fullWidth className="w-1/2">...</Frame></div>`
   - **Landscape** (~1.5:1) -> `<div className="flex justify-center"><Frame fullWidth className="w-2/3">...</Frame></div>`
   - **Panoramic** (> 2:1) -> `<Frame fullWidth className="w-full">...</Frame>` (no centering wrapper needed)

If the draft says "screenshot here" without files, **list placeholders** in
MDX with consistent paths so the user can drop files in later.

### Docs links (optional but recommended)

Ask whether to add **sparse** internal links. **Default policy:** only link
**major** product concepts (match what we used on Cresta):

- [Observability overview](/docs/observability/overview)
- [Prompt management](/docs/prompt-management/overview) and/or [Playground](/docs/prompt-management/features/playground)
- [Scores](/docs/evaluation/evaluation-methods/scores-via-sdk)
- [Self-hosting](/self-hosting)
- [OpenTelemetry](/integrations/native/opentelemetry)
- [Experiments](/docs/evaluation/core-concepts#experiments)
- [LLM-as-a-judge](/docs/evaluation/evaluation-methods/llm-as-a-judge)
- [Prompt version control](/docs/prompt-management/features/prompt-version-control)

Do **not** pepper every noun with links. Use paths from **`llms-docs.txt` /
available-internal-links** rule so links resolve.

---

## MDX structure to produce

1. **YAML frontmatter** at top: `title`, `date`, `description`, `ogImage`,
   `tag: customer-story`, `author` (display string if needed), `customerLogo`,
   `customerLogoDark`, optional quote fields, `showInCustomerIndex`.
2. **Imports**: `BlogHeader`, `CustomerQuote` (if quote), `ImpactChart` (if
   impact section), `CustomerStoryCTA`; use `Frame` for images (global in MDX).
3. **`BlogHeader`**: `title`, `description`, `customerLogo`, `authors`, `date`;
   optional `image` for hero.
4. **Body headings**: **One conceptual H1 only** (from `BlogHeader`). Body uses
   **`##`** and **`###`**; do not skip levels.
5. **Quote block**: `<CustomerQuote quote="..." name="..." role="..." company="..." />`
   - align `role` / `company` with frontmatter so the byline reads "Name, Role at Company"
   - avoid duplicating company name in `role`
6. **Images**: size by aspect ratio (see checklist item 4 under Images above)
   - portrait/square -> `w-1/2` centered
   - landscape -> `w-2/3` centered
   - panoramic -> `w-full`
7. **Closing**: `<ImpactChart items={[{ area, impact }, ...]} />` (optional)
   then `<CustomerStoryCTA />`.

**Reference implementations:** `content/customers/canva.mdx`,
`content/customers/cresta.mdx`.

---

## Repo wiring (after MDX exists)

1. **`content/customers/meta.json`**
   - Add `"<slug>"` to the `pages` array (with `"index"` first).
   - **Order matters** for layout: the Users grid and homepage carousel are
     sorted by **`sortCustomerStoriesByMetaOrder`** in
     `lib/sortCustomerStoriesByMeta.ts`, which reads this list. Place the slug
     where the card should appear (e.g. last in the list = bottom-right in a
     2-column grid).

2. **Authors**
   - If new author: add to `data/authors.json` (key must match `BlogHeader`
     `authors`).

3. **Assets**
   - Logos and story images under **`public/images/customers/<slug>/`**.

---

## Checklist before finishing

- [ ] All required fields collected from user (or documented as TBD)
- [ ] `authors` keys exist in `data/authors.json`
- [ ] `meta.json` includes slug in desired order
- [ ] Image checklist given to user with folder path
- [ ] Company website link in About section
- [ ] Docs links only where agreed; no broken internal URLs
- [ ] Replace all em dashes with regular hyphens (`-`) - the linter will do this anyway; better to do it upfront
- [ ] Follow `AGENTS.md` / `documentation-pages.mdc`: one H1 via BlogHeader, American English, accessible alt text

---

## Quick YAML skeleton (adapt fields)

```yaml
---
title: "..."
date: ...
description: ...
ogImage:
tag: customer-story
author: ...
customerLogo: "/images/customers/<slug>/...-light.png"
customerLogoDark: "/images/customers/<slug>/...-dark.png"
customerQuote: "..."
quoteAuthor: "..."
quoteRole: "..."
quoteCompany: "..."
showInCustomerIndex: true
---
```
