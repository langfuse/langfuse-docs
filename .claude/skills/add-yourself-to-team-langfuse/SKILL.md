---
name: add-yourself-to-team-langfuse
description: Add a new team member to all relevant Langfuse team pages. Use when onboarding a new employee who needs to appear on the team/press pages.
allowed-tools: Read, Edit
---

Add a new team member to Langfuse. Ask the user for the following information before proceeding:

1. **Full name** (including any special characters, e.g. umlauts)
2. **Role/title** (e.g. "Growth & Developer Relations")
3. **GitHub username** (e.g. from https://github.com/username)
4. **LinkedIn URL** (e.g. https://www.linkedin.com/in/handle/)
5. **X/Twitter handle** (e.g. from https://x.com/handle) — optional
6. **Profile photo** — remind them to add it to `public/images/people/<key>.jpg`

Once you have the information, update the following 3 files:

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

Append a new list item at the end:

```md
- <Full Name>, [@<twitter>](https://x.com/<twitter>), [GitHub](https://github.com/<github>), [LinkedIn](https://www.linkedin.com/in/<linkedin>/)
```

Omit any social links that were not provided.

---

### 3. `content/marketing/press.mdx`

Append a new row to the team table (after the last `|` row):

```md
| **<Full Name>** | <Role> | [Twitter](https://x.com/<twitter>)<br/>[LinkedIn](https://www.linkedin.com/in/<linkedin>/)<br/>[GitHub](https://github.com/<github>) |
```

Omit any social links that were not provided.
