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

Turns the customer story's Google Doc into **`content/customers/<slug>.mdx`**
in the same pattern as `content/customers/dkb.mdx`, `canva.mdx`, and
`cresta.mdx`.

## Source

The source is the Google Doc linked from the Linear ticket. Export it as
`.docx` and read the article from that file, including its hyperlinks.

A plain-text read of the Doc drops inline images. Images are in `word/media`.
Place each one where the drawing sits in the document. Do not publish the
article without them.

Social posts, a "customer insights" block, and any quote marked for approval
are not the article. Keep them off the page.

## Draft fidelity

The article text goes in 1:1. Do not paraphrase, merge, tighten, or finish a
sentence. Do not pick one of two conflicting numbers.

You may fix only things that do not change meaning, and list each fix in the
PR description: stray punctuation, a missing quotation mark, an em dash (use
`-`), British spelling.

Flag anything that would add or choose meaning, and leave it unchanged until
asked. That includes an unfinished sentence, two different numbers for the
same fact, and a quote marked for approval. Put the flags in the PR
description and in a Linear comment.

## Summary

The first section is `## Summary [#summary]` with `<ImpactChart>`, the same
numbered two-column chart as `content/customers/dkb.mdx`.

- `impact` is the draft's summary sentence, unchanged.
- `area` is a short label. That is the only new wording.
- Do not add a second chart at the end unless the draft has a separate impact
  section.

## Quotes

- A `<CustomerQuote>` is only for a quote the draft explicitly marks as a
  callout (for example "CALL OUT QUOTE").
- If the draft marks one callout, that is the only `<CustomerQuote>` on the
  page. Every other quote stays inline, in the paragraph where the draft has
  it.
- If the draft marks none, do not invent callouts. Ask which quote is the
  callout.
- Frontmatter `customerQuote` (the users-index card) is that same marked
  callout. Do not pick a different quote for the card.
- Do not repeat the callout both inline and in `<CustomerQuote>`. Keep the
  lead-in sentence. The component carries the quote.
- A quote labeled for approval stays off the page. Flag it.

## Social posts

Post a LinkedIn draft and an X draft as a comment on the customer story's
Linear ticket. Do not put them in the MDX, and do not leave them only in the
pull request description.

- If the source draft has a Social section, use that copy. Fix typos only.
- If it does not, draft both from the story body and the marked callout. Do
  not pull in numbers that appear only in a side metrics table or the customer
  insights block.
- Include the public URL, `https://langfuse.com/users/<slug>`, once the slug
  is set.
- Keep the X post short enough for the post plus the URL. If the draft's X
  post is already too long, post it as written and flag the length.
- One comment is enough. Put each post in its own fenced block so it can be
  copied as it will be published.

## Before writing any file: collect missing input

**Do not guess.** If any item below is missing from the draft or the ticket,
ask explicitly and wait.

### Content and publishing

| Topic                 | Ask                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| **Company name**      | Legal/marketing name for copy and quotes                                                           |
| **Company website**   | Public URL for the `[Company](https://...)` link in **About &lt;Company&gt;**                      |
| **Slug**              | Filename: `<slug>.mdx` (lowercase, hyphens), e.g. `cresta` -> `cresta.mdx`                         |
| **Page title**        | H1 string for `BlogHeader` + YAML `title` (often "How &lt;Company&gt; ... with Langfuse")          |
| **Short description** | YAML `description` + `BlogHeader` description. Use the draft summary. Do not write a new sentence. |
| **Publish date**      | YAML `date` + `BlogHeader` `date` (e.g. `March 26, 2026`)                                          |
| **OG image**          | Optional `ogImage:` path; if unset, leave empty like other stories                                 |

Never put the customer name in the git branch. Do not put it in the pull
request title unless asked.

### Authors (BlogHeader `authors={["..."]}`)

| Topic                        | Ask                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Byline author(s)**         | Who should appear under the title (keys from `data/authors.json`)                                                                                                                                                                                                                   |
| **External / guest speaker** | If not in `authors.json`: collect name, title, optional socials, and **headshot path** under `public/images/people/` or `public/images/customers/<slug>/`, then **add an entry to `data/authors.json`** (see existing entries). Every `authors` key must resolve in `authors.json`. |

### Branding and users index card

| Topic                           | Ask                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Logos**                       | Paths for `customerLogo` and `customerLogoDark` (light + dark mode), usually under **`public/images/customers/<slug>/`** |
| **Pull quote**                  | `customerQuote` is the draft's marked callout, not a quote you choose. See **Quotes** above.                             |
| **Quote attribution**           | `quoteAuthor`, `quoteRole`, `quoteCompany`                                                                               |
| **Speaker headshot (optional)** | `quoteAuthorImage` for card/SEO if you use the same as Canva                                                             |
| **Show on /users**              | `showInCustomerIndex: true \| false`                                                                                     |

### Images (screenshots and diagrams)

1. **Folder**: **`public/images/customers/<slug>/`**
2. Take the images from the Doc and put each one in the section where the Doc
   has it. If an image labels itself as illustrative or sample data, the alt
   text says that.
3. Customer posts use **`<Frame fullWidth>`** around markdown images.
4. **Size each image by aspect ratio.** Measure with `file` or Python. Do not
   use `sips` (that exists only on macOS).
   - **Portrait / square** (ratio <= 1:1) -> `<div className="flex justify-center"><Frame fullWidth className="w-1/2">...</Frame></div>`
   - **Landscape** (~1.5:1) -> `<div className="flex justify-center"><Frame fullWidth className="w-2/3">...</Frame></div>`
   - **Panoramic** (> 2:1) -> `<Frame fullWidth className="w-full">...</Frame>`

If the draft says "screenshot here" and the Doc has no file, list a
placeholder path so the user can drop the file in later.

### Docs links

Keep every hyperlink that is already in the Google Doc, on the same words. Do
not point a linked phrase at a different page than the Doc does.

Also link these concepts. Do not ask first. Link the first mention, and link
again when a later section discusses that concept at length. Do not link the
same concept twice in one paragraph, and do not link words inside a customer's
quotation.

- **AI engineering loop** -> [/academy/ai-engineering-loop](/academy/ai-engineering-loop)
- **Observability** -> [/docs/observability/overview](/docs/observability/overview)
- **Tracing** -> [/docs/observability/overview](/docs/observability/overview)
- **Evaluation / evals** -> [/docs/evaluation/overview](/docs/evaluation/overview)
- **Prompt management** -> [/docs/prompt-management/overview](/docs/prompt-management/overview)
- **Self-hosting** -> [/self-hosting](/self-hosting)

Leave other product nouns unlinked unless that feature is what the paragraph
is about (for example scores, datasets, annotation queues, or cost). Use paths
from **`llms-docs.txt` / available-internal-links** so every link resolves.

---

## MDX structure to produce

1. **YAML frontmatter** at top: `title`, `date`, `description`, `ogImage`,
   `tag: customer-story`, `author` (display string if needed), `customerLogo`,
   `customerLogoDark`, optional quote fields, `showInCustomerIndex`.
2. **Imports**: `BlogHeader`, `CustomerQuote` (if a callout is marked),
   `ImpactChart`, `CustomerStoryCTA`. `Frame` is global in MDX.
3. **`BlogHeader`**: `title`, `description`, `customerLogo`, `authors`, `date`.
   Optional `image` for a hero.
4. **Body headings**: one conceptual H1 only (from `BlogHeader`). Body uses
   `##` and `###`. Do not skip levels.
5. **`## Summary`**: `<ImpactChart>`. See **Summary** above.
6. **Quote block**: one `<CustomerQuote>`, and only for the marked callout.
   - `<CustomerQuote quote="..." name="..." role="..." company="..." />`
   - Align `role` and `company` with frontmatter so the byline reads "Name, Role at Company".
   - Do not repeat the company name inside `role`.
   - Other quotes stay inline.
7. **Images**: size by aspect ratio. See **Images** above.
8. **Closing**: `<CustomerStoryCTA />`. No second `ImpactChart` unless the
   draft has a separate impact section.

**Reference implementations:** `content/customers/dkb.mdx` (summary chart),
`content/customers/canva.mdx`, `content/customers/cresta.mdx`.

---

## Repo wiring (after MDX exists)

1. **`content/customers/meta.json`**
   - Add `"<slug>"` to the `pages` array (`"index"` stays first).
   - Order is the users index order. `CustomerStoriesHero` takes the first six
     stories in that list that are shown on the index and have a
     `customerQuote`. Those six are the headline carousel.
   - Put the new slug after that headline set. Do not insert it at the front,
     and do not move it into the six, unless the user asks for a headline
     story.

2. **Authors**
   - If the byline author is new, add them to `data/authors.json`. The key
     must match `BlogHeader` `authors`.

3. **Assets**
   - Logos and story images under **`public/images/customers/<slug>/`**.

4. **Users / adopters list**
   - Add or update the company with
     [`add-customer-to-user-list`](../add-customer-to-user-list/SKILL.md) so
     the Reference cell is `[User Story](/users/<slug>)`.
   - The `/users` explorer looks up three maps in
     `components/customers/AdoptersExplorerWrapper.tsx` by the exact company
     label in the table. Add the light logo to `COMPANY_LOGOS`, a short public
     description (not the use-case sentence) to `COMPANY_DESCRIPTIONS`, and
     the company name to `COMPANIES_WITH_DOCUMENTED_USE_CASES`.

---

## Checklist before finishing

- [ ] Article text matches the Google Doc, including its images and links
- [ ] Meaning-changing problems are flagged and left unchanged (unfinished sentences, conflicting numbers, quotes for approval)
- [ ] `## Summary` is an `ImpactChart` whose impact cells are the draft's summary sentences
- [ ] The story is outside the headline six in `meta.json`, unless a headline slot was requested
- [ ] Linear ticket has a comment with the LinkedIn draft and the X draft
- [ ] The only `<CustomerQuote>` is the marked callout, and `customerQuote` is that same quote
- [ ] `authors` keys exist in `data/authors.json`
- [ ] Adopters table row exists, and the explorer has a logo, description, and documented use case for that exact company label
- [ ] Company website link in the About section
- [ ] Doc links are preserved. The core concepts in **Docs links** are linked. No broken internal URLs
- [ ] Em dashes replaced with `-`
- [ ] One H1 via BlogHeader, American English, alt text on every image
- [ ] The branch name does not contain the customer name
- [ ] CI on the pull request is green, and every review comment is answered

## After the pull request is open

Stay with the pull request until it is done.

- Wait until CI is green. If a check fails, fix it and push again.
- Read every review comment, including bot comments. Reply on the thread, and
  change the page when the comment is right.
- Do not stop at the first green commit if a later push or a new comment is
  still open.

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
