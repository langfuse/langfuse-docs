# Docs translations

The docs are written in English. A weekly GitHub Action translates them into French, Japanese, Korean, and Spanish with Claude and opens one pull request for all languages.

Only the Japanese Academy (`i18n/ja/academy/`, served at `/academy/japan`) is on langfuse.com today. The machine translations are not served yet. Routing (`/ja/docs/...`), hreflang, sitemaps, and the language switcher will follow in a separate change.

## How it works

- [`config.json`](./config.json) lists the languages, the model, and which content is translated (`include` / `exclude`). Pages in `neverTranslate` (legal, contractual, and billing pages) always stay English-only, even if `include` covers them.
- [`glossary.yaml`](./glossary.yaml) holds the required translation of each Langfuse and industry term, the terms that stay in English, and style rules per language. It is sent with every request. Native speakers own it.
- [`scripts/translate/translate.mjs`](../scripts/translate/translate.mjs) translates new and changed pages:
  - Front matter, imports, code blocks, and lines with only JSX tags are replaced by placeholders, so the model never sees or changes code.
  - Only the `title`, `description`, `sidebarTitle`, `shortTitle`, and `seoTitle` front matter fields are translated.
  - Every translated heading gets the English anchor (`[#anchor]`), so deep links work in every language.
  - Each translation is checked for intact placeholders, headings, link targets, and inline code, and must compile as MDX. Failed checks are sent back to the model for a correction.
  - When an English page changes, the model gets the previous English version and the existing translation, and reuses the existing translation for unchanged passages. Edits that reviewers make in a translation pull request survive later runs.
- Translations are written to `i18n/<lang>/`, mirroring `content/`, for example `i18n/ja/docs/observability/overview.mdx`. `i18n/<lang>/.translation-lock.json` records which version of each English page was translated.

## Human translations

A lock entry with `"human": true` marks a human translation. The workflow never changes it, not even with `force`, however small the English change. Instead, the pull request lists the human translations whose English page changed since, so the translator can update them.

The Japanese Academy, maintained by GAO, Inc., is a human translation. Academy pages that have no Japanese version yet are machine translated; the translator can replace them and mark them `human` too.

After updating a human translation, set its `source` in the lock file to the current English version (`git hash-object content/<path>`) and update `translatedAt` in the page's front matter.

To protect a machine translation that a reviewer rewrote by hand, set `"human": true` on its lock entry.

## Contributing

- Edit the English page in `content/`. Do not create or edit pages in `i18n/<lang>/` by hand outside a translation pull request; the next run translates your change.
- To change how a term is translated, edit `glossary.yaml`. Existing pages pick up the change the next time they are translated, or run the workflow with `force` and `paths` to re-translate specific pages.
- To review a translation, comment on or edit the files in the weekly translation pull request.

## Running it

The workflow runs every Monday and can be started manually from the Actions tab with `languages`, `paths`, `limit`, and `force` inputs. It needs the `ANTHROPIC_API_KEY` secret. It syncs the workshop pages from `langfuse/langfuse-workshop` before translating, because they are not committed.

Locally:

```bash
ANTHROPIC_API_KEY=... node scripts/translate/translate.mjs --lang ja --paths content/docs/observability/overview.mdx
```

Use `--dry-run` to list what would be translated and estimate the input size, `--limit` to cap the number of pages, and `--force` to re-translate unchanged machine translations. Run `pnpm workshop:sync` first to include the workshop.
