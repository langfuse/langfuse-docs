---
name: add-yourself-to-team-langfuse
description: Add a new team member to Langfuse's canonical team data and shared team table. Use when onboarding a new employee who needs to appear on the website team, press, about, careers, or handbook pages.
allowed-tools: Read, Edit
---

Add a new team member to Langfuse. Ask the user for the following information before proceeding:

1. **Full name** (including any special characters, e.g. umlauts)
2. **Role/title** (e.g. "Growth & Developer Relations")
3. **GitHub username** (e.g. from https://github.com/username)
4. **LinkedIn URL** (e.g. https://www.linkedin.com/in/handle/)
5. **X/Twitter handle** (e.g. from https://x.com/handle) — optional
6. **Profile photo** — remind them to add it to `public/images/people/<key>.jpg`

Once you have the information, update the following source files:

---

### 1. `data/authors.json`

Add a new entry at the end (before the closing `}`). Use a lowercase, no-special-chars version of the name as the key (e.g. `annabellschafer`):

```json
"<key>": {
  "firstName": "<first name>",
  "name": "<full name>",
  "title": "<role>",
  "image": "/images/people/<key>.jpg",
  "twitter": "<twitter handle>",   // omit if not provided
  "github": "<github username>",   // omit if not provided
  "linkedin": "<linkedin handle>"  // omit if not provided
}
```

---

### 2. `components-mdx/team-members.mdx`

This is the canonical website team list. It is rendered by the press, about,
careers, and handbook team pages. Append a new table row at the end:

```md
| **<Full Name>** | <Role> | [Twitter](https://x.com/<twitter>), [LinkedIn](https://www.linkedin.com/in/<linkedin>/), [GitHub](https://github.com/<github>) |
```

Omit any social links that were not provided.

---

### 3. Confirm shared usage

Do **not** add team rows directly to any other
page. Those pages should import and render the canonical component:

```mdx
import TeamMembers from "@/components-mdx/team-members.mdx";

<TeamMembers />
```

If a page has a hand-written team table or list, replace it with the shared
`TeamMembers` import instead of adding another copy. Please do a quick search for some team members to confirm that there are no copies of this table.
