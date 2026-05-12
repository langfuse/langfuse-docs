---
description: Monthly audit of #notifications-website-feedback in Slack and PR with doc fixes
argument-hint: "[lookback, e.g. 1m, 6w, 6m — default: 6w]"
allowed-tools:
  - Bash
  - Read
  - Edit
  - Write
  - Glob
  - Grep
  - mcp__0457debe-f09d-443a-914a-850c4a2d0509__slack_read_channel
  - mcp__0457debe-f09d-443a-914a-850c4a2d0509__slack_search_channels
  - mcp__0457debe-f09d-443a-914a-850c4a2d0509__slack_search_public
  - mcp__github__create_pull_request
---

# Review website feedback

You are running the recurring monthly **website-feedback review** for the
`langfuse/langfuse-docs` repo. The goal is to turn user "thumbs down" feedback
on docs.langfuse.com into concrete documentation fixes.

## Inputs

- `$ARGUMENTS` — optional lookback window (e.g. `1m`, `6w`, `6m`). If empty,
  use **6 weeks** (a little longer than the cadence so we never miss items
  that arrived just after the last run).
- Slack channel: **#notifications-website-feedback** (`C0995RY6SAF`). Bot
  messages from the n8n workflow live here as Slack attachments — content
  is in the attachment body, not the message `text` field. When searching
  via `slack_search_public`, pass `include_bots: true` and read with
  `slack_read_channel` rather than relying on the search result text.

## Procedure

1. **Compute the time window.** Use `date -d "$ARGUMENTS ago" +%s` (default
   6w) to derive the `oldest` Unix timestamp.

2. **Pull feedback.** Iterate `slack_read_channel` on `C0995RY6SAF` with
   that `oldest`, paginating until the channel is drained or you have
   ~2 months of data. Each item is one bot post containing `Page:` and
   `Feedback: positive|negative` lines and an optional free-text `Comment:`.

3. **Bot-spam guard.** Treat as bot spam (and ignore for actioning purposes,
   but still mention in the analysis) any of the following patterns:
   - Comments that are exactly 30 mixed-case alphanumeric characters with no
     spaces.
   - Bursts of ≥10 votes on the same page within a few minutes that include
     both positive and negative votes from the same source.
   - Heavy concentration on `/security`, `/security/nda`, `/security/gdpr`,
     `/security/privacy-faq`, `/library` (these were the historical targets;
     re-evaluate if patterns shift).

4. **Two thresholds for acting** (the user's rules):
   - **(A)** A page receives surprisingly many *real* downvotes relative to
     the rest of the corpus.
   - **(B)** A specific negative comment is substantive enough to guide an
     edit (concrete missing info, broken example, wrong code, UI step
     missing, etc.).

   If a page hits **both**, prioritize it. If only (B), still act if the fix
   is small and confident.

5. **Map pages → repo files.** URLs map to `content/...mdx` under this repo.
   Examples:
   - `/docs/...` → `content/docs/...mdx`
   - `/faq/all/...` → `content/faq/all/...mdx`
   - `/integrations/...` → `content/integrations/...mdx`
   - `/self-hosting/...` → `content/self-hosting/...mdx`
   - Cookbook pages (`/guides/cookbook/...`) are generated from notebooks in
     `cookbook/` — see `scripts/update_cookbook_docs.sh`. **Do not edit the
     generated `.md` files; edit the source notebook and regenerate.**

6. **Scope the edits conservatively.** Only land changes you can write
   confidently from docs alone. Defer items needing product changes, SDK
   bug fixes, competitive intel, or external repo updates — but list them
   in the PR description so the team sees them.

7. **Branch + PR.**
   - Create a fresh branch named `claude/review-website-feedback-<short-id>`
     off `main`. Generate `<short-id>` as 6 random alphanumeric chars (e.g.
     via `openssl rand -hex 3`).
   - Commit with a single descriptive message that lists the files touched
     and the user-visible improvement for each.
   - Push with `git push -u origin <branch>` (retry up to 4× with exponential
     backoff on network errors).
   - Open a PR via `mcp__github__create_pull_request` against `base: main`.
     Repo: `langfuse/langfuse-docs`.

8. **PR body structure.** Use the same sections as PR #2935:
   - Summary of the audit period
   - "What I found" (bot-spam vs. real signal, with a small table of
     multi-user complaints)
   - "What this PR changes" (file-by-file, each linked to the specific user
     comment that motivated it)
   - "Items I deliberately deferred" (so the team can pick them up)
   - "Test plan" (`pnpm dev`, `pnpm run link-check`, spot-checks)

## Output to the user (in chat)

Before opening the PR, post a short summary to the chat with:
- Audit window used
- Number of feedback items in window, split positive/negative
- Top 3–5 pages by real-downvote count
- The list of files this run will edit, and why

Then open the PR and reply with the PR URL.

## Style guidance

- Sentence case for headings ("Managing tags in the Langfuse UI"), preserve
  proper nouns (Langfuse, OpenTelemetry, etc.).
- Don't introduce `.gif` files; use `.mp4` from `static.langfuse.com/docs-videos`.
- Don't introduce hard-coded color values; use Tailwind semantic tokens.
- One H1 per markdown file; never skip heading levels.
- Avoid adding emojis.
- See `CLAUDE.md` for the full repo style guide.
