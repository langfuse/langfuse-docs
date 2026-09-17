---
name: add-customer-to-user-list
description: >-
  Add or update a company in the Langfuse /users adopters table. Use when the
  user asks to add a customer, adopter, or company to the users list, /users
  page, or adopters table — including "add X to the user list", "list as
  Langfuse Customer", or pasting a public blog/job/case-study link to cite.
  Always check for an existing user story before choosing the Reference cell.
---

> **Single source of truth:** maintain this skill under
> **`.agents/skills/add-customer-to-user-list/`** only. Claude and Cursor load
> projected copies under **`.claude/skills/add-customer-to-user-list`** and
> **`.cursor/skills/add-customer-to-user-list`**.

# Add a customer to the users list

Adds or updates one row in the public adopters table on `/users`.

**Do not write a customer story in this skill.** If the user wants a full
`/users/<slug>` case study, use
[`customer-story-setup`](../customer-story-setup/SKILL.md) first, then come
back here to link it.

## Canonical file

| What                             | Where                                                                       |
| -------------------------------- | --------------------------------------------------------------------------- |
| Adopters table (source of truth) | `components-mdx/adopters-table.mdx`                                         |
| Rendered on                      | `/users` (`content/customers/index.mdx`) and the handbook customers chapter |

The handbook imports the same table (`<AdoptersTable />`). Editing the MDX
file updates both pages. Do **not** duplicate the table elsewhere.

## Before writing any file

Collect what you can from the request. Ask only for what is still missing:

1. **Company name** — public marketing name
2. **Company website** — used in the Company column
3. **Use case** — optional; write one if a user story or external link exists
4. **External reference URL** — optional public source (blog, job post, DPA, talk)

Then **always** check for a user story. Do not skip this step.

## Always check: is there a user story?

Search the working tree **and** `origin/main` (this branch may be behind):

- `content/customers/meta.json` → `pages` (skip `"index"`)
- `content/customers/*.mdx` — match company name, legal name, or obvious slug
  variants (`hugging-face` vs `huggingface`, `merckgroup` vs `merck`)
- Frontmatter `showInCustomerIndex` and `quoteCompany` if the filename is unclear

The public URL is `/users/<slug>` where `<slug>` is the MDX filename without
`.mdx`.

| Result                            | Reference column (last)       | Use case column (middle)                                                                                                                    |
| --------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **User story exists**             | `[User Story](/users/<slug>)` | Brief summary of **how they use Langfuse** from the story (or the user's wording if they gave one)                                          |
| **No story, external link given** | Briefly named link, see below | Brief summary of the Langfuse use case from that source                                                                                     |
| **No story, no external link**    | `Langfuse Customer`           | Short product/industry line if the user gave one; otherwise a concise public description of the company. Do not invent a Langfuse use case. |

Never write `Langfuse Customer` when a user story exists. Prefer the user
story over an external link when both exist.

## External reference links

When the user (or a public source they pointed at) provides a URL and there is
**no** user story:

1. Open the page and read enough to understand the Langfuse mention.
2. **Middle column:** one short use-case phrase (sentence case), focused on
   what they do with Langfuse or their AI product — not a full company bio.
3. **Last column:** a short link label plus the URL, matching existing rows.

Link-label examples already in the table:

`Blogpost`, `Tech Blogpost`, `AWS Blogpost`, `LinkedIn Post`, `Job Description`,
`Case Study`, `Client Story`, `Documentation`, `Release Notes`, `Research Paper`,
`Source Code`, `Conference Talk`, `Conference Deck`, `Privacy Policy`,
`Data Processing Addendum`, `Subprocessor List`, `IT White Paper`,
`Technical Memorandum`, `Open Source Catalog`, `OSS LLMOps Stack`,
`Partner Newsletter`

Pick the closest label. Include a date only when it helps (`Blogpost from 12/23/2025`).

When other rows for similar sources include an archive, add one:

```md
[Tech Blogpost](https://example.com/post) ([Archive](https://web.archive.org/web/...))
```

Do not block the edit if no archive URL is available.

## Row format

Insert **alphabetically by company display name** (the visible name, not the
domain). Update an existing row instead of adding a duplicate.

```md
| [Company](https://www.example.com/) | Short use-case phrase | Langfuse Customer |
```

```md
| [Company](https://www.example.com/) | Short use-case phrase | [User Story](/users/<slug>) |
```

```md
| [Company](https://www.example.com/) | Short use-case phrase | [Tech Blogpost](https://example.com/post) ([Archive](https://web.archive.org/web/...)) |
```

- Company cell: markdown link to the official site. Add a parenthetical only
  when the table already does that for subsidiaries (`(Wix)`, `(Toyota Group)`).
- Use case: sentence case; keep it to one line; American English; no em dashes
  (use a regular hyphen or an em-dash character only if neighboring rows do).
- Preserve the existing column padding so the table stays aligned.
- One H1 per markdown file already exists in consumers; do not add a `# ` heading
  to the table file.

## Optional companion updates (only if they already apply)

Do these only when the company is already on that surface, or the user asks:

| Surface                   | File                                       | When                                                                                      |
| ------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Handbook featured bullets | `content/handbook/chapters/customers.mdx`  | Company is in the curated list; add `[(Read Story)](/users/<slug>)` if a story exists     |
| Homepage logo grid        | `components/shared/EnterpriseLogoGrid.tsx` | Logo is already in the grid and a story exists → set `customerStoryPath: "/users/<slug>"` |
| Wrapped customers         | `components/wrapped/Customers.tsx`         | Same: move to `companiesWithStories` and `{ type: "story", name: "..." }`                 |

Do **not** add a homepage logo in this skill. That needs a designed 140×40 SVG
and is a separate request.

## Out of scope

- Creating `content/customers/<slug>.mdx` or editing `content/customers/meta.json`
  → `customer-story-setup`
- Designing or replacing homepage logos
- Inventing public citations or claiming a user story that does not exist

## Checklist

- [ ] Searched `content/customers/` and `origin/main` for a user story
- [ ] Reference is `User Story`, a described external link, or `Langfuse Customer`
- [ ] Use case is a brief, sourced summary (not a long paragraph)
- [ ] Company cell links to the official website
- [ ] Row is alphabetical and not a duplicate
- [ ] Table column alignment preserved
- [ ] `pnpm run format` if you edited Prettier-covered files
