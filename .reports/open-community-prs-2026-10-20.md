# Open non-maintainer PRs — langfuse/langfuse-docs

_Snapshot: 2026-10-20. 211 open PRs total; **99 from non-maintainers** (83 human + 16 bot)._

"Maintainer" = anyone with collaborator access on the repo (45 accounts). Three recurring
contributors who look Langfuse-affiliated but have **no** repo access are counted as
non-maintainers here: `tomaszantas` (5 PRs), `felixkrrr` (3), `milanagm` (1).

## How this was assessed

- Merge-cleanliness: `git merge-tree` of each PR head against current `origin/main`.
- Size/scope: diffstat against the PR's own merge base.
- CLA: `license/cla` commit status.
- Format + H1: Prettier `--check` and an H1 count run locally over each candidate's changed files.

**Two things worth knowing up front:**

1. **CI does not run on fork PRs.** The only check run on these is Cursor Bugbot. The
   `format`, `check_h1` and `build-and-check-links` jobs never execute, so "no red CI" means
   nothing here — hence the local checks above. (`Vercel: Authorization required to deploy`
   on fork PRs is also normal, not a failure.)
2. **An unsigned CLA is a hard merge blocker** and affects ~22 otherwise-clean PRs.

---

## Tier 1 — Safe to merge

Small, scoped, merges clean, CLA signed, passes Prettier and the H1 check locally.

| PR                                                           | Author        | Change                                                                                                        | Size              |
| ------------------------------------------------------------ | ------------- | ------------------------------------------------------------------------------------------------------------- | ----------------- |
| [#4074](https://github.com/langfuse/langfuse-docs/pull/4074) | Haarris       | Exclude dormant v4 backfill rows from the v3→v4 pre-check                                                     | 1 file, +6/−2     |
| [#4072](https://github.com/langfuse/langfuse-docs/pull/4072) | RaphaelFakhri | Unwrap callouts containing code blocks in plain-Markdown output — **ships with a unit test**                  | 2 files, +30/−1   |
| [#3953](https://github.com/langfuse/langfuse-docs/pull/3953) | deepanshupal  | Fix shell line continuations in container run examples                                                        | 1 file, +4/−2     |
| [#3944](https://github.com/langfuse/langfuse-docs/pull/3944) | HardMax71     | Say which attributes the JS mask covers                                                                       | 1 file, +1/−1     |
| [#3415](https://github.com/langfuse/langfuse-docs/pull/3415) | jorgehermo9   | Document all sessionId/userId OTel source attributes                                                          | 1 file, +16/−14   |
| [#3746](https://github.com/langfuse/langfuse-docs/pull/3746) | Blargian      | Fix hiring-badge hover boundary — Vercel preview is green                                                     | 1 file, +26/−11   |
| [#4049](https://github.com/langfuse/langfuse-docs/pull/4049) | HardMax71     | Correct public-API filter-condition semantics; same one-line fix propagated across 7 docs pages + 3 notebooks | 10 files, +21/−22 |
| [#3465](https://github.com/langfuse/langfuse-docs/pull/3465) | claude[bot]   | Tags vs. metadata guidance, factored into `components-mdx/`                                                   | 3 files, +15      |

Caveat on all eight: they're content/behaviour correctness claims, so someone still has to
agree the statement is _true_. Nothing structural stands in the way.

## Tier 2 — Mechanically ready, needs a product/editorial decision

Clean merge, CLA signed, format and H1 clean. These are almost all **third-party vendors adding
their own integration page**, so merging is a listing decision, not a code decision.

**New integration / provider pages** (new page + `meta.json` + icon):

| PR                                                           | Author       | Integration                                          | Size          |
| ------------------------------------------------------------ | ------------ | ---------------------------------------------------- | ------------- |
| [#4066](https://github.com/langfuse/langfuse-docs/pull/4066) | sadfun       | Pethost self-hosted deployment                       | 3 files, +50  |
| [#4053](https://github.com/langfuse/langfuse-docs/pull/4053) | Javihaus     | GroundLens                                           | 3 files, +87  |
| [#3996](https://github.com/langfuse/langfuse-docs/pull/3996) | sundar-flex  | FlexAI model provider                                | 5 files, +357 |
| [#3980](https://github.com/langfuse/langfuse-docs/pull/3980) | mahir-lyceum | Lyceum model provider                                | 6 files, +344 |
| [#3947](https://github.com/langfuse/langfuse-docs/pull/3947) | imfaisii     | Grokified model provider                             | 3 files, +115 |
| [#3922](https://github.com/langfuse/langfuse-docs/pull/3922) | kafomichev   | Heabsy model provider                                | 3 files, +95  |
| [#3826](https://github.com/langfuse/langfuse-docs/pull/3826) | Yilialinn    | AISIX AI Gateway                                     | 3 files, +166 |
| [#3437](https://github.com/langfuse/langfuse-docs/pull/3437) | moonming     | AISIX AI Gateway — **duplicate of #3826**, close one | 3 files, +145 |

**Content updates and cookbooks:**

| PR                                                           | Author         | Change                                      | Note                                                |
| ------------------------------------------------------------ | -------------- | ------------------------------------------- | --------------------------------------------------- |
| [#4031](https://github.com/langfuse/langfuse-docs/pull/4031) | sipa-echo-zaoa | Update pydantic-ai instrumentation examples | +118/−27 of example code — verify it runs           |
| [#3832](https://github.com/langfuse/langfuse-docs/pull/3832) | redis-phil     | Redis Cloud config for self-hosting         | ⚠️ **fails Prettier** — run `pnpm run format` first |
| [#3824](https://github.com/langfuse/langfuse-docs/pull/3824) | itisparas      | Observations API cost-by-user cookbook      | +868, notebook + `_routes.json` present             |
| [#3820](https://github.com/langfuse/langfuse-docs/pull/3820) | roli-lpci      | Hermes Rubric integration cookbook          | +137                                                |
| [#3981](https://github.com/langfuse/langfuse-docs/pull/3981) | XinyangWuEthz  | Annotation queue prioritization cookbook    | +2396 — large, review executed outputs              |

**Repo tooling / infra** (not site content — different reviewer):

- [#3900](https://github.com/langfuse/langfuse-docs/pull/3900) milanagm — `integration-docs` agent skill, 5 files +327. Vercel green.
- [#3351](https://github.com/langfuse/langfuse-docs/pull/3351) claude[bot] — move CI to Blacksmith runners, 3 workflows +8/−8. A vendor/cost call.

**Dependabot, clean merge:**

- [#3089](https://github.com/langfuse/langfuse-docs/pull/3089) uv, [#3933](https://github.com/langfuse/langfuse-docs/pull/3933) tornado, [#2755](https://github.com/langfuse/langfuse-docs/pull/2755) pygments — dev tooling only, trivial.
- [#4013](https://github.com/langfuse/langfuse-docs/pull/4013) sharp 0.34.5→0.35.5.
- [#4012](https://github.com/langfuse/langfuse-docs/pull/4012) katex 0.16.47→**0.18.2** — two majors on a render-path dep; eyeball a math-heavy page.

## Tier 3 — Blocked on CLA

Merge clean, but `license/cla` is unsigned, so they cannot be merged as-is. Mostly needs a
nudge on the thread.

[#4022](https://github.com/langfuse/langfuse-docs/pull/4022) Laravel ·
[#4017](https://github.com/langfuse/langfuse-docs/pull/4017) Juno adopters row (one line; also an
unverified "Langfuse Customer" claim to confirm) ·
[#3748](https://github.com/langfuse/langfuse-docs/pull/3748) Querit ·
[#3700](https://github.com/langfuse/langfuse-docs/pull/3700) Open Multi-Agent ·
[#3691](https://github.com/langfuse/langfuse-docs/pull/3691) Morph ·
[#3604](https://github.com/langfuse/langfuse-docs/pull/3604) UserVane ·
[#3540](https://github.com/langfuse/langfuse-docs/pull/3540) DeepSeek Harness ·
[#3393](https://github.com/langfuse/langfuse-docs/pull/3393) Neon gateway ·
[#3296](https://github.com/langfuse/langfuse-docs/pull/3296) DaoXE ·
[#3223](https://github.com/langfuse/langfuse-docs/pull/3223) Eden AI ·
[#3129](https://github.com/langfuse/langfuse-docs/pull/3129) JS v3→v4 migration guide (+307) ·
[#2998](https://github.com/langfuse/langfuse-docs/pull/2998) changelog RSS feed ·
[#2994](https://github.com/langfuse/langfuse-docs/pull/2994) Ejentum cookbook ·
[#2992](https://github.com/langfuse/langfuse-docs/pull/2992) + [#2990](https://github.com/langfuse/langfuse-docs/pull/2990) Auxen (**duplicates**) ·
[#2977](https://github.com/langfuse/langfuse-docs/pull/2977) Tuning Engines ·
[#2964](https://github.com/langfuse/langfuse-docs/pull/2964) NoPII ·
[#2878](https://github.com/langfuse/langfuse-docs/pull/2878) Gemini JS cookbooks ·
[#2749](https://github.com/langfuse/langfuse-docs/pull/2749) Upsonic ·
[#2689](https://github.com/langfuse/langfuse-docs/pull/2689) EU AI Act guide (+378)

Two in this group have their own problems beyond the CLA:

- [#3452](https://github.com/langfuse/langfuse-docs/pull/3452) jw-ond (CLA _is_ signed) — hand-edits
  `content/guides/cookbook/*.mdx` with **no notebook source**. That directory is generated; per
  `AGENTS.md` rule 3 this needs a `cookbook/*.ipynb` instead. Ask for a rework.
- [#2653](https://github.com/langfuse/langfuse-docs/pull/2653) garyatwalAI — adds a notebook but no
  `cookbook/_routes.json` entry, so it would never render.
- [#2717](https://github.com/langfuse/langfuse-docs/pull/2717) garyatwalAI — 28 files, +3539: a whole
  Python package under `cookbook/`, not a cookbook. Scope question, not a merge.

## Tier 4 — Needs work: merge conflicts

**45 PRs** conflict with `main`. Not safe to merge without the author (or a maintainer) resolving.

- _Lockfile-only, trivial to rebase:_ dependabot [#3486](https://github.com/langfuse/langfuse-docs/pull/3486) [#3484](https://github.com/langfuse/langfuse-docs/pull/3484) [#3471](https://github.com/langfuse/langfuse-docs/pull/3471) [#3383](https://github.com/langfuse/langfuse-docs/pull/3383) [#3347](https://github.com/langfuse/langfuse-docs/pull/3347) [#2953](https://github.com/langfuse/langfuse-docs/pull/2953) [#2495](https://github.com/langfuse/langfuse-docs/pull/2495).
- _Small content, worth rescuing:_ [#3583](https://github.com/langfuse/langfuse-docs/pull/3583) ClickHouse grants (+22) · [#3261](https://github.com/langfuse/langfuse-docs/pull/3261) StatsD scaling (+23) · [#3071](https://github.com/langfuse/langfuse-docs/pull/3071) metrics/observations links (+2/−2) · [#2841](https://github.com/langfuse/langfuse-docs/pull/2841) claude-code tracing (+13) · [#2470](https://github.com/langfuse/langfuse-docs/pull/2470) JS OTel env vars (+26) · [#3537](https://github.com/langfuse/langfuse-docs/pull/3537) LibreChat recategorisation (+10/−4).
- _Integration/cookbook additions needing a rebase:_ [#3795](https://github.com/langfuse/langfuse-docs/pull/3795) CJE · [#3752](https://github.com/langfuse/langfuse-docs/pull/3752) Bifrost · [#3359](https://github.com/langfuse/langfuse-docs/pull/3359) AgentsKit · [#3273](https://github.com/langfuse/langfuse-docs/pull/3273) Temporal TS · [#3217](https://github.com/langfuse/langfuse-docs/pull/3217) readme-embed · [#3062](https://github.com/langfuse/langfuse-docs/pull/3062) RAG cookbook · [#2864](https://github.com/langfuse/langfuse-docs/pull/2864) Snowflake Cortex · [#2821](https://github.com/langfuse/langfuse-docs/pull/2821) Streamlit · [#2795](https://github.com/langfuse/langfuse-docs/pull/2795) Rewind · [#2766](https://github.com/langfuse/langfuse-docs/pull/2766) RAIL Score · [#2737](https://github.com/langfuse/langfuse-docs/pull/2737) langfuse-board · [#2701](https://github.com/langfuse/langfuse-docs/pull/2701) Genkit · [#2585](https://github.com/langfuse/langfuse-docs/pull/2585) data-migration script.
- _Large site-code work (tomaszantas), conflicted and months stale:_ [#2859](https://github.com/langfuse/langfuse-docs/pull/2859) OG redesign (+1139) · [#2849](https://github.com/langfuse/langfuse-docs/pull/2849) bundle-size (15 files) · [#2858](https://github.com/langfuse/langfuse-docs/pull/2858) section-registry · [#2860](https://github.com/langfuse/langfuse-docs/pull/2860) feature-tab dots · [#2711](https://github.com/langfuse/langfuse-docs/pull/2711) cookbook-script Fumadocs port (52 files, draft). These need an owner decision, not a merge.

## Tier 5 — Dead against the Fumadocs migration: close these

`pages/` no longer exists on `main`. These PRs only touch it, so they cannot be merged — they'd
need rewriting against `content/`. Several are 1–2 years old.

[#2666](https://github.com/langfuse/langfuse-docs/pull/2666) ·
[#2627](https://github.com/langfuse/langfuse-docs/pull/2627) (draft) ·
[#2625](https://github.com/langfuse/langfuse-docs/pull/2625) (draft) ·
[#2623](https://github.com/langfuse/langfuse-docs/pull/2623) ·
[#2560](https://github.com/langfuse/langfuse-docs/pull/2560) ·
[#2550](https://github.com/langfuse/langfuse-docs/pull/2550) ·
[#2414](https://github.com/langfuse/langfuse-docs/pull/2414) ·
[#2226](https://github.com/langfuse/langfuse-docs/pull/2226) ·
[#1876](https://github.com/langfuse/langfuse-docs/pull/1876) ·
[#1649](https://github.com/langfuse/langfuse-docs/pull/1649) (draft, "on hold") ·
[#1452](https://github.com/langfuse/langfuse-docs/pull/1452) ·
[#1305](https://github.com/langfuse/langfuse-docs/pull/1305) ·
[#857](https://github.com/langfuse/langfuse-docs/pull/857) (27 files, Oct 2024)

A couple carry content still worth having — notably [#2226](https://github.com/langfuse/langfuse-docs/pull/2226)
(`LANGFUSE_WEBHOOK_WHITELISTED_*` env vars, 15 lines) and
[#2666](https://github.com/langfuse/langfuse-docs/pull/2666) (a broken Vertex AI trace link).
Cheaper to re-apply by hand than to ask for a rebase.

## Suggested order of work

1. Merge Tier 1 (8 PRs).
2. Close the duplicates: #3437 or #3826 (AISIX), #2990 or #2992 (Auxen).
3. Close Tier 5 with a short note pointing at the `content/` structure; first port #2226 and #2666 by hand.
4. Post a CLA reminder on Tier 3 — that single gate unblocks ~22 PRs.
5. Decide the vendor-listing policy once, then clear Tier 2's integration pages in a batch.
