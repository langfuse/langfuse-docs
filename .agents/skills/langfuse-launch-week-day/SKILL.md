---
name: langfuse-launch-week-day
description: Unveil a daily feature on the Langfuse Launch Week landing page (/launch-week-N). Use this skill whenever the user wants to ship a Launch Week day — add a new day-X unveiling section, update the docs banner, re-date or badge a changelog, and draft social copy. Triggers include "day 2 / day 3 / day N of launch week", "unveil today's launch", "promote <feature> on /launch", "publish today's changelog with launch week badge", "update the banner for tomorrow's drop", or any change that flips one of the locked schedule cards into the live state.
---

# Launch Week day-unveiling skill

This skill captures the recurring pattern for shipping one day of Langfuse Launch Week on the docs site. Each day's release touches the same six surfaces in the same order. The job is mostly mechanical once the inputs are known.

## What ships every day

1. **`/launch-week-N` landing page** — append a `DayXUnveiling` section (after the Schedule), and flip the Day X card in the Schedule from locked → live.
2. **Docs banner** (`components/layout/Banner.tsx`) — top banner across all docs reads the new day's headline and links to `/launch`.
3. **Changelog post** — re-date if needed, add the `badge: Launch Week N 🚀` front-matter, ensure the body follows the changelog house style.
4. **Redirect** for the changelog if the slug changed.
5. **Internal links** updated wherever the old slug was referenced.
6. **Social drafts** for X, LinkedIn, and HN/Reddit, written in the project's voice (no AI slop, no em dashes, no "re-launch" framing).

Each is covered below with the exact patterns to copy.

---

## Step 1 — Collect inputs

Before touching files, gather the following. Use a single `AskUserQuestion` batch where possible:

- **Launch Week number** (e.g., `5`). The current page lives at `components/launch-week-N/`. If only one is in the repo, use that.
- **Day number** (1–5) and **launch date** (e.g., `Monday, May 25, 2026`).
- **Feature title** — short, user-outcome framing. Example: *"Experiments in CI/CD"*, not *"GitHub Action integration"*.
- **Changelog URL** — must already exist in `content/changelog/`. Confirm the slug.
- **Docs URL** — the canonical docs page for the feature. Required for the secondary CTA.
- **GitHub URL** — repo, action, or PR if relevant. Optional third CTA.
- **Walkthrough video** — `https://static.langfuse.com/docs-videos/<name>.mp4`. If not ready, leave a placeholder (see "Video placeholder" below) and ship without; replace later.
- **"Re-launch" framing rule** — by default, **never describe a release as a re-launch even if it actually is one.** Treat every day as a fresh release.

If the changelog post does not exist yet, create it first (see "Changelog conventions") before wiring it into the landing page.

---

## Step 2 — Update the landing page

Edit `components/launch-week-N/LaunchWeek5Landing.tsx` (substitute the real component name for your N).

### 2a. Flip the day in the `DAYS` array

The array drives the Schedule cards. Each entry is one of two shapes:

```tsx
// Locked (default state)
{ n: "02", weekday: "Tuesday", date: "May 26", hint: "Built for agents" }

// Live (after the day ships)
{
  n: "02",
  weekday: "Tuesday",
  date: "May 26",
  title: "Agent enablement via Skills",
  href: "/changelog/2026-05-26-agent-skills",
}
```

The `DayCard` component reads the `href` to decide between the lock icon and the green `Live` pulse, and wraps the whole card in `<Link>` when `href` is set. Don't edit `DayCard` for new days — just update the data.

### 2b. Add a `DayXUnveiling` component

Define a new function in the same file, **before** `LaunchWeek5Landing`, using this template (substitute X, the title, body, video URL, and links):

```tsx
function Day2Unveiling() {
  return (
    <section
      id="day-2"
      className="lw5-section pt-[80px] pb-10 scroll-mt-24"
    >
      <div className="flex flex-col items-start gap-3.5 mb-8">
        <div className="lw5-eyebrow">Day 02 · Tuesday, May 26, 2026</div>
        <h2 className="lw5-h2 max-w-[26ch]">
          <span className="lw5-highlight">Agent enablement via Skills.</span>
        </h2>
        <p className="lw5-body">
          {/* 2-3 short sentences. Specific over abstract. Lead with what's
              possible. No em dashes. No "re-launch". No AI slop. */}
        </p>
      </div>

      <div className="w-full max-w-[920px] mb-8">
        <Video
          src="https://static.langfuse.com/docs-videos/<name>.mp4"
          aspectRatio={16 / 9}
          className="rounded border border-line-structure"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="lw5-btn-wrap">
          <Link
            className="lw5-btn lw5-btn-primary"
            href="/changelog/<new-slug>"
          >
            <span>Read the changelog</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
        <span className="lw5-btn-wrap">
          <Link className="lw5-btn lw5-btn-secondary" href="/docs/<path>">
            <span>Get started in docs</span>
            <span className="lw5-kbd">↗</span>
          </Link>
        </span>
        {/* Optional third CTA — only if there's a relevant repo or external link */}
      </div>
    </section>
  );
}
```

Then register it in `LaunchWeek5Landing` **after** the Schedule and after any previously released `DayN_Unveiling` sections, so the page reads top-to-bottom as Hero → Schedule → Day 1 → Day 2 → ... → Day N.

```tsx
export function LaunchWeek5Landing() {
  return (
    <div className="lw5-page">
      <LaunchWeek5Styles />
      <div className="max-w-[1440px] mx-auto">
        <Hero />
        <Schedule />
        <Day1Unveiling />
        <Day2Unveiling /> {/* new */}
      </div>
    </div>
  );
}
```

### 2c. Video placeholder (only if the .mp4 isn't ready)

If the walkthrough video is not finished, swap the `<Video>` block for this static placeholder so the section still ships visually:

```tsx
<div
  className={`${cornerBoxBase} relative w-full max-w-[920px] aspect-video bg-surface-1 flex items-center justify-center overflow-hidden mb-8`}
>
  <div
    aria-hidden
    className="lw5-grid-bg absolute inset-0 opacity-50 pointer-events-none"
  />
  <div className="relative flex flex-col items-center gap-3 text-text-tertiary">
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10,8 16,12 10,16" fill="currentColor" />
    </svg>
    <div className="font-mono text-[11px] uppercase tracking-[.1em]">
      Walkthrough video coming soon
    </div>
  </div>
</div>
```

Replace it with the real `<Video>` block as soon as the .mp4 is available — do not leave the placeholder live past the day's release.

---

## Step 3 — Update the docs banner

Open `components/layout/Banner.tsx` and **replace** (don't add) the day-X banner. Only one banner shows at a time. Pattern:

```tsx
<FumadocsBanner
  id="fd-top-banner-launch-week-N-day-X"   // bump per day so dismissed banners re-appear
  height="2rem"
  className="bg-black text-white [&_a]:text-white [&_button]:text-white"
>
  <Link href="/launch">
    <span className="sm:hidden">
      Launch Week N · Day X: <Short Title> →
    </span>
    <span className="hidden sm:inline">
      Langfuse Launch Week N · Day X: <Full Title> →
    </span>
  </Link>
</FumadocsBanner>
```

Always link to `/launch` (which redirects to `/launch-week-N`). The unique `id` per day matters: Fumadocs persists "dismiss" state by `id`, so users who closed yesterday's banner still see today's.

---

## Step 4 — Changelog conventions

The changelog post is the canonical source of truth for the day's release. The Day X CTA on the landing page links to it, and the `badge` field feeds the changelog index and post header.

### Required front-matter

```yaml
---
date: 2026-MM-DD                       # Must equal the launch day
badge: Launch Week 5 🚀                # Exact string. Matches LW4 convention.
title: "<Feature name>"
description: <One sentence, user-outcome framing>
author: <Name>
ogImage: /images/changelog/<slug>.png  # OG image
canonical: /docs/<path>                # Docs URL for SEO consolidation
---
```

The `badge` field is read by `ChangelogHeader.tsx` (renders as a pill near the title) and `ChangelogIndex.tsx` (shows as a tag on the index). Match the existing convention: `Launch Week N 🚀` with the rocket emoji.

### Body house-style (from project CLAUDE.md)

- Title describes what the user can now do, not an abstract concept. "Filter Observations by Tool Calls" > "Simplify for Scale". Never use the "Feature Name: Rephrasing of Feature Name" format.
- Lead with what's now possible. Don't highlight past limitations.
- Follow the intro immediately with 2-3 concrete example use cases — don't put them under a separate "Use cases" heading.
- Be specific: name actual filters, metrics, commands.
- Use `.mp4` videos (uploaded to `static.langfuse.com/docs-videos/`) interleaved with text. Never `.gif`.
- One H1 per file (the title), then subsections in order — don't skip heading levels.
- For YouTube embeds, use `https://www.youtube-nocookie.com/embed/<id>`, never `youtube.com`.

### Re-dating

If the changelog was scheduled with a future date that has now passed (or shifted), rename the file to today's date:

```
content/changelog/2026-05-05-experiment-ci-cd-gates.mdx
→ content/changelog/2026-05-25-experiment-ci-cd-gates.mdx
```

Use `git mv` so the rename is preserved. Update the `date:` front-matter to match. Then add a redirect (next step).

---

## Step 5 — Redirects

If you renamed a changelog file (Step 4), add a redirect from the old slug. The old URL may have been live on main for days — anyone who shared, bookmarked, or indexed it should still land on the post.

Edit `lib/redirects.js`. Find the existing themed array for the feature (e.g., `experimentsCiCdRedirects202605`) and append to it. If no themed array fits, add to `nonPermanentRedirects` near `/launch`:

```js
const experimentsCiCdRedirects202605 = [
  ["/guides/experiments-ci-cd", "/docs/evaluation/experiments/experiments-ci-cd"],
  // Changelog re-dated to YYYY-MM-DD for Launch Week N Day X. The old slug
  // was live on main for ~NN days, so anyone who bookmarked or shared the
  // URL should keep landing on the new one.
  [
    "/changelog/2026-05-05-experiment-ci-cd-gates",
    "/changelog/2026-05-25-experiment-ci-cd-gates",
  ],
];
```

The array's themed name is intentional — `lib/redirects.js` groups related redirects so they're easy to find and clean up. Don't dump everything into the top-level array.

Also grep the repo for any other reference to the old slug and update those links:

```bash
grep -rln "<old-slug>" /home/user/langfuse-docs --include="*.mdx" --include="*.tsx" 2>/dev/null | grep -v node_modules
```

Common hit: the monthly update blog posts (e.g., `content/blog/YYYY-MM-DD-langfuse-<month>-update.mdx`) often forward-reference upcoming changelog posts.

---

## Step 6 — Social drafts

Three drafts per day. Put them in the PR body (one fenced block per platform) so the team can copy-paste.

### Voice rules (apply to every draft and every other word of marketing copy in this PR)

- **No em dashes (—)** anywhere. Use periods, commas, or short sentences.
- **No AI slop**: avoid "elevate", "unleash", "robust", "seamless", "powerful", "leverage", "supercharge", "game-changing", "revolutionary", "We're excited to announce", "Imagine being able to", "...and more", "in today's fast-paced world".
- **No "re-launch" framing**, even when it's accurate. Present every day as a fresh release.
- **Specific over abstract.** Name the actual filter, metric, command, or behavior. "Fails the workflow when scores drop below your threshold" beats "Improves quality assurance".
- **Short sentences.** If a sentence has two ideas, split it.
- **One link per platform**: X uses `langfuse.com/launch`; LinkedIn ends with both `langfuse.com/launch` and the GitHub URL on their own lines; HN/Reddit body links the GitHub repo inline and `langfuse.com/launch` at the bottom.

### X (≤280 characters)

Template (260 chars including link):

```
Day X of Langfuse Launch Week N: a <one-sentence "what">. <one sentence "what happens"> <one sentence "what's tracked">.

langfuse.com/launch
```

Example (Day 1):

```
Day 1 of Langfuse Launch Week 5: a GitHub Action that runs your Langfuse experiments on every PR. Fails the workflow when scores drop below your threshold. Posts the result as a PR comment. Tracks the run in Langfuse.

langfuse.com/launch
```

### LinkedIn (3-4 short paragraphs)

```
Day X of Langfuse Launch Week N.

<One paragraph "why this matters" framed as a concrete problem someone shipping AI faces — not abstract value. Two-three sentences max.>

<One paragraph "what the new thing does" with specific verbs: runs, tests, fails, posts, tracks. Mention the place in the workflow it lives (PR, dashboard, CLI, etc.).>

<Optional one-line "why now" or quick setup detail — e.g., "Five minutes to set up. Slots into whatever CI you already use.">

Get started: langfuse.com/launch
Source: github.com/langfuse/<repo>
```

### Hacker News / Reddit

```
Title: <Short specific headline, sentence case, no emojis. "Langfuse Experiment Action: gate PRs on LLM regression scores", not "Show HN: 🚀 Introducing...">

Body:
<Paragraph 1 — what it does, in concrete terms. 3-4 sentences.>

<Paragraph 2 — how it fits the existing workflow (PR comments, CI checks, dashboards). 2-3 sentences.>

It's open source: https://github.com/langfuse/<repo>

The action is part of Langfuse Launch Week N, <X> days of releases this week: https://langfuse.com/launch
```

---

## Step 7 — Verify locally

Before pushing, sanity-check the four URLs in dev:

```bash
pnpm dev
# wait for "Ready in" then:

# 1. Landing page renders with the new day's content
curl -s http://127.0.0.1:3333/launch-week-N | grep -oE "Day 0X|<feature title>|<video filename>" | sort -u

# 2. /launch redirect still works
curl -sI http://127.0.0.1:3333/launch | grep -i "location"
# → location: /launch-week-N

# 3. New changelog URL returns 200
curl -sI http://127.0.0.1:3333/changelog/<new-slug> | head -1

# 4. Old changelog slug redirects (if renamed)
curl -sIL http://127.0.0.1:3333/changelog/<old-slug> | grep -E "HTTP|location"
# → 307 or 308, then 200 on the new slug
```

Don't run `pnpm build` for routine day releases — it takes ~10 minutes. The dev-server checks above plus Vercel's preview deploy are sufficient.

---

## Step 8 — PR conventions

- **Branch**: `claude/launch-week-N-day-X` (kebab-case, e.g., `claude/launch-week-5-day-2`).
- **Base**: target `main` directly, not the previous day's PR. Each day ships independently.
- **Title**: `feat(launch-week-N): day X — <feature title>` (em dash here is fine; it's a git commit, not marketing copy).
- **Body**: 
  - Short "What changed" bullet list (landing page, banner, changelog, redirect).
  - Three fenced code blocks for X / LinkedIn / HN drafts.
  - Test plan checklist mirroring Step 7.

---

## Known pitfalls

These came up shipping previous days. Watch for them.

### Tweet embeds during static prerender

Pages with `<Tweet>` embeds can break the Vercel build with `TypeError: c is not iterable` if Twitter's syndication API omits empty entity arrays from a response. The fix lives in `components/Tweet.tsx` (a `normalizeTweetEntities` helper that defaults `hashtags`, `urls`, `user_mentions`, `symbols` to `[]` before passing the tweet to `<EmbeddedTweet>`). If a Day X page introduces a new `<Tweet>` embed and the build fails on that page, confirm `Tweet.tsx` still has the normalize helper — don't try to wrap with try/catch in the page itself; the failure isn't reliably catchable in streaming SSR.

### Vercel build cache poisoning

If Vercel keeps failing with the same minified stack across pushes — and `Restored build cache from previous deployment` shows the same cache ID every time — the cache is poisoned. Resolution: "Redeploy without cache" via the Vercel dashboard (Deployments → ⋯ → Redeploy → uncheck "Use existing Build Cache"). My local `next build` succeeded in this state; only Vercel was affected.

### Banner dismiss state

`<FumadocsBanner id="...">` persists "dismissed" state in localStorage keyed by `id`. If you reuse yesterday's `id`, users who dismissed it won't see today's banner. Always bump the `id` (e.g., `fd-top-banner-launch-week-5-day-3`).

### Re-launch framing

If the user mentions a feature is a "re-launch" or "v2 of something we shipped before", **drop that context for all user-facing copy**. Treat it as a fresh release. The framing rule is product-led, not editorial — confirm with the user before deviating.

### Section ordering

The page reads top-to-bottom as Hero → Schedule → Day 1 → Day 2 → ... → Day N. Don't put the latest day at the top; new days append. The Schedule's `Live` cards link to anchor `#day-X` for jump-down navigation.

### Naming the unveiling section's id

Use `id="day-X"` (kebab, single digit). The `DayCard` link `href="/changelog/..."` does not need the anchor; the Schedule's "Live" pulse plus the changelog link is enough. Add the `id` only if you want the schedule cards to scroll-jump within the page instead (current code links out to the changelog, which is what we want for completed days).
