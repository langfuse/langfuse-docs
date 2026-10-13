# External (non-maintainer) open PRs — langfuse-docs

Snapshot: 2026-10-13. **207 open PRs** total → 109 from repo collaborators, 17 from bots
(dependabot / claude / cursor), 5 from staff on internal branches, and **76 from outside
contributors** — the list below.

Mergeability was tested locally with `git merge-tree` against `origin/main`. Prettier was run
against each candidate's changed files with the repo's pinned version (3.8.3) for the
tier-1/tier-2 sets. The uniform `Vercel — Authorization required to deploy` failure on fork
PRs is a fork-permission artifact, not a real CI failure.

---

## Tier 1 — Safe to merge

Small, self-contained, merges cleanly, Prettier-clean, CLA signed. Each is a single-page or
single-file correctness fix.

| PR                                                           | Author       | Change                                                                                                                                                          | Size            |
| ------------------------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| [#3953](https://github.com/langfuse/langfuse-docs/pull/3953) | deepanshupal | Fixes a real bug: `\ # generate via: ...` inline comments inside backslash-continued `docker run` lines break the command. Moves them above the block.          | 1 file, +4/-2   |
| [#3958](https://github.com/langfuse/langfuse-docs/pull/3958) | jfagoagas    | Drops `font-variant-numeric: ordinal` from inline code styling, which was substituting ordinal glyphs in code spans.                                            | 1 file, -1      |
| [#3944](https://github.com/langfuse/langfuse-docs/pull/3944) | HardMax71    | Clarifies that the JS `mask` function only covers `langfuse.*` span attributes, not `ai.*` / `gen_ai.*` written by other instrumentations. Accurate and useful. | 1 file, +1/-1   |
| [#3691](https://github.com/langfuse/langfuse-docs/pull/3691) | skeptrunedev | Morph model-provider page update. Prettier-clean, merges cleanly.                                                                                               | 1 file, +65/-5  |
| [#3746](https://github.com/langfuse/langfuse-docs/pull/3746) | Blargian     | Fixes the hiring badge hover boundary — moves handlers onto the inner element and uses a CSS grid overlay so the label swap doesn't reflow.                     | 1 file, +26/-11 |

**One-line fixup before merging #3944:** its link to `#masking-with-opentelemetry` relies on
the auto-generated slug. `masking.mdx:288` has `## Masking with OpenTelemetry` without an
explicit `[#masking-with-opentelemetry]`, which the repo's anchor convention requires.

---

## Tier 2 — Safe in shape, but one fact needs a maintainer's confirmation

Small diffs, no structural risk. The blocker in each case is that only someone with access to
the server/SDK source can confirm the claim is correct.

| PR                                                           | Author        | Needs confirming                                                                                                                                                                  | Size            | Merge              |
| ------------------------------------------------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ------------------ |
| [#3986](https://github.com/langfuse/langfuse-docs/pull/3986) | j0shthomas    | That `SYSTEM MERGES` / `ALTER SETTINGS` / `SYSTEM SYNC REPLICA` map to MergeTree / SharedMergeTree / replicated as stated.                                                        | 1 file, +4      | clean              |
| [#3415](https://github.com/langfuse/langfuse-docs/pull/3415) | jorgehermo9   | The full `userId`/`sessionId` OTel source-attribute precedence list (adds `gen_ai.conversation.id`, metadata fallbacks, Vercel AI SDK keys) and that first-present-wins.          | 1 file, +16/-14 | clean              |
| [#4017](https://github.com/langfuse/langfuse-docs/pull/4017) | MarshallBear1 | That Juno is actually a Langfuse customer. Reference cell is "Langfuse Customer" (not a URL), so the Wayback-archive rule doesn't apply. **CLA is unsigned — that blocks merge.** | 1 file, +1      | clean              |
| [#3583](https://github.com/langfuse/langfuse-docs/pull/3583) | toyayuto      | The `system.*` grants v4 needs and the claim that a missing grant fails dual-write silently while ingestion still returns 207. Well-written; needs engineering sign-off.          | 1 file, +22     | conflict (trivial) |
| [#3261](https://github.com/langfuse/langfuse-docs/pull/3261) | CoderSufiyan  | Exact names/defaults of `LANGFUSE_QUEUE_METRICS_*` and the DogStatsD `DD_*` vars.                                                                                                 | 1 file, +23/-1  | conflict (trivial) |
| [#3071](https://github.com/langfuse/langfuse-docs/pull/3071) | boleg-dev     | Whether the API reference anchors are `#tag/observations` or `#tag/observationsv2`. Two-line fix.                                                                                 | 2 files, +2/-2  | conflict (trivial) |
| [#2841](https://github.com/langfuse/langfuse-docs/pull/2841) | markjm        | Product call, not a fact: should the documented Claude Code hook `os.fork()` + `setsid()` to avoid blocking the agent? Adds `CC_LANGFUSE_BACKGROUND`, default on.                 | 1 file, +13     | conflict           |

**Will fail the `format` CI job as-is** (verified with prettier 3.8.3):

- [#3832](https://github.com/langfuse/langfuse-docs/pull/3832) redis-phil — Redis Cloud config for self-hosting, +76/-2, merges clean. Author is Redis-affiliated.
- [#3129](https://github.com/langfuse/langfuse-docs/pull/3129) Sajith15 — JS v3→v4 migration guide expansion, +307/-20, merges clean. Large enough to want the SDK owner's review anyway.

---

## Tier 3 — Vendor / partner integration pages

All are the same shape: a new `content/integrations/**` page + `meta.json` entry + icon,
roughly 90–360 lines. Mechanically low-risk and mostly conflict-free. These are **not** a code
decision — each is a business call about whether Langfuse wants to list that vendor, and most
come from accounts affiliated with the vendor.

Merges clean: [#4022](https://github.com/langfuse/langfuse-docs/pull/4022) Laravel (axyr) ·
[#3996](https://github.com/langfuse/langfuse-docs/pull/3996) FlexAI ·
[#3980](https://github.com/langfuse/langfuse-docs/pull/3980) Lyceum ·
[#3947](https://github.com/langfuse/langfuse-docs/pull/3947) Grokified ·
[#3922](https://github.com/langfuse/langfuse-docs/pull/3922) Heabsy ·
[#3826](https://github.com/langfuse/langfuse-docs/pull/3826) AISIX ·
[#3437](https://github.com/langfuse/langfuse-docs/pull/3437) AISIX ·
[#3748](https://github.com/langfuse/langfuse-docs/pull/3748) Querit ·
[#3700](https://github.com/langfuse/langfuse-docs/pull/3700) Open Multi-Agent ·
[#3604](https://github.com/langfuse/langfuse-docs/pull/3604) UserVane ·
[#3540](https://github.com/langfuse/langfuse-docs/pull/3540) DeepSeek Harness ·
[#3393](https://github.com/langfuse/langfuse-docs/pull/3393) Neon AI Gateway ·
[#3296](https://github.com/langfuse/langfuse-docs/pull/3296) DaoXE ·
[#3223](https://github.com/langfuse/langfuse-docs/pull/3223) Eden AI ·
[#2992](https://github.com/langfuse/langfuse-docs/pull/2992) Auxen ·
[#2990](https://github.com/langfuse/langfuse-docs/pull/2990) Auxen ·
[#2977](https://github.com/langfuse/langfuse-docs/pull/2977) Tuning Engines ·
[#2964](https://github.com/langfuse/langfuse-docs/pull/2964) NoPII ·
[#2749](https://github.com/langfuse/langfuse-docs/pull/2749) Upsonic

Conflicted: [#3273](https://github.com/langfuse/langfuse-docs/pull/3273) Temporal ·
[#2864](https://github.com/langfuse/langfuse-docs/pull/2864) Snowflake Cortex ·
[#2821](https://github.com/langfuse/langfuse-docs/pull/2821) Streamlit ·
[#2795](https://github.com/langfuse/langfuse-docs/pull/2795) Rewind ·
[#2737](https://github.com/langfuse/langfuse-docs/pull/2737) langfuse-board ·
[#2701](https://github.com/langfuse/langfuse-docs/pull/2701) Genkit

### Duplicates to close

- **AISIX:** #3826 and #3437 add the identical three files. Pick one, close the other.
- **Auxen:** #2992 and #2990 are the same page; #2992 also adds the icon. Keep #2992.

### Possibly already superseded

Internal PR #3244 is titled _"add AG2, AgentGateway, and Genkit integration pages (community
PRs, review fixes applied)"_ — if that lands it supersedes
[#2632](https://github.com/langfuse/langfuse-docs/pull/2632) (AG2),
[#2550](https://github.com/langfuse/langfuse-docs/pull/2550) (AgentGateway) and
[#2701](https://github.com/langfuse/langfuse-docs/pull/2701) (Genkit). Worth resolving that
ordering before touching any of the three.

---

## Tier 4 — Cookbooks and guides (needs technical review)

Substantial notebooks or long-form guides. Correctness can't be judged from the diff shape, and
per the repo rules the `.ipynb` is the source of truth with `content/guides/cookbook/` generated
via `scripts/update_cookbook_docs.sh` — several of these hand-edit the generated output.

| PR                                                           | Author           | Topic                                                                     | Size                                             |
| ------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------- | ------------------------------------------------ |
| [#3981](https://github.com/langfuse/langfuse-docs/pull/3981) | XinyangWuEthz    | Annotation queue prioritization                                           | +2396                                            |
| [#3824](https://github.com/langfuse/langfuse-docs/pull/3824) | itisparas        | Observations API cost-by-user                                             | +868                                             |
| [#3820](https://github.com/langfuse/langfuse-docs/pull/3820) | roli-lpci        | Hermes Rubric                                                             | +137                                             |
| [#3795](https://github.com/langfuse/langfuse-docs/pull/3795) | elandesberg      | CJE experiment comparison                                                 | +723, conflict                                   |
| [#3752](https://github.com/langfuse/langfuse-docs/pull/3752) | Swpn0neel        | Bifrost                                                                   | +275, conflict                                   |
| [#3452](https://github.com/langfuse/langfuse-docs/pull/3452) | jw-ond           | Governed action metadata                                                  | +234                                             |
| [#3359](https://github.com/langfuse/langfuse-docs/pull/3359) | EmersonBraun     | AgentsKit                                                                 | +168, conflict                                   |
| [#3062](https://github.com/langfuse/langfuse-docs/pull/3062) | AryanBhansali-SE | RAG observability                                                         | +249, conflict                                   |
| [#2994](https://github.com/langfuse/langfuse-docs/pull/2994) | ejentum          | Ejentum cognitive harness                                                 | +212                                             |
| [#2878](https://github.com/langfuse/langfuse-docs/pull/2878) | JK-Amanda-Goo    | Gemini JS/TS (basic + multimodal)                                         | +574                                             |
| [#2766](https://github.com/langfuse/langfuse-docs/pull/2766) | SumitVermakgp    | RAIL Score evaluation                                                     | +630, conflict                                   |
| [#2689](https://github.com/langfuse/langfuse-docs/pull/2689) | BipinRimal314    | EU AI Act compliance guide                                                | +378 — legal/compliance claims, review carefully |
| [#2717](https://github.com/langfuse/langfuse-docs/pull/2717) | garyatwalAI      | NIST AI RMF metrics — adds a **28-file Python package** under `cookbook/` | +3539                                            |
| [#2653](https://github.com/langfuse/langfuse-docs/pull/2653) | garyatwalAI      | Regulatory compliance pipeline (overlaps #2717)                           | +868                                             |
| [#1452](https://github.com/langfuse/langfuse-docs/pull/1452) | aboavent         | Bedrock agents — 13 files incl. `requirements.txt`, core modules          | +3500, conflict                                  |

---

## Tier 5 — Site / build / component changes (not safe without real review)

| PR                                                           | Author          | Why it needs care                                                                                                                                                                 |
| ------------------------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#3217](https://github.com/langfuse/langfuse-docs/pull/3217) | orhund8z        | **Renders raw HTML from fetched self-hosting READMEs.** Touches `RenderedReadmeContent.tsx` + adds a dependency + lockfile. Needs an XSS review before anything else. Conflicted. |
| [#2998](https://github.com/langfuse/langfuse-docs/pull/2998) | GANESH-NADKARNI | Rewrites the changelog RSS route (`app/api/changelog-rss.xml/route.ts`). Merges clean, but it's a production route.                                                               |
| [#1421](https://github.com/langfuse/langfuse-docs/pull/1421) | sarah-inkeep    | Inkeep answer-confidence + dependency bump + lockfile. From Inkeep themselves. Conflicted.                                                                                        |
| [#3537](https://github.com/langfuse/langfuse-docs/pull/3537) | graphaelli      | Moves LibreChat to no-code builders — small (+10/-4) and sensible, but also edits a published blog post and the generated `data/generated/contributors.json`. Conflicted.         |
| [#2585](https://github.com/langfuse/langfuse-docs/pull/2585) | ouvreboite      | Rewrites the data-migration notebook (+571/-823). Operational script — needs the owner. Conflicted.                                                                               |
| [#1305](https://github.com/langfuse/langfuse-docs/pull/1305) | congnguyendinh0 | Vietnamese landing page + footer + `_meta.tsx`. A localisation strategy decision. Conflicted, old structure.                                                                      |

### Altalogy (contracted agency, not community)

Four site-wide changes from `tomaszantas`, all conflicted, all touching build/layout:
[#2849](https://github.com/langfuse/langfuse-docs/pull/2849) bundle-size optimization (15 files) ·
[#2858](https://github.com/langfuse/langfuse-docs/pull/2858) section-registry ownership (7 files) ·
[#2859](https://github.com/langfuse/langfuse-docs/pull/2859) OG-image redesign (10 files, adds a font binary) ·
[#2860](https://github.com/langfuse/langfuse-docs/pull/2860) feature-tab dots restyle ·
[#2711](https://github.com/langfuse/langfuse-docs/pull/2711) cookbook script → Fumadocs (52 files, draft).
These should be triaged with whoever commissioned the work, separately from community PRs.

---

## Tier 6 — Stale: written against the pre-Fumadocs `pages/` tree

The site moved to `content/` + Fumadocs, so these edit files that no longer exist. They can't be
merged — they need rewriting against the current structure, or closing with a pointer to the new
path. Most have been open 6–24 months.

| PR                                                           | Author        | Opened  | Note                                                                |
| ------------------------------------------------------------ | ------------- | ------- | ------------------------------------------------------------------- |
| [#2666](https://github.com/langfuse/langfuse-docs/pull/2666) | ouvreboite    | 2026-03 | 2-line Vertex AI trace-link fix — worth porting, it's a genuine fix |
| [#2632](https://github.com/langfuse/langfuse-docs/pull/2632) | VasiliyRad    | 2026-03 | AG2 page — see #3244 above                                          |
| [#2623](https://github.com/langfuse/langfuse-docs/pull/2623) | iamjjanga-ouo | 2026-03 | Claude Code token-usage tracking                                    |
| [#2560](https://github.com/langfuse/langfuse-docs/pull/2560) | daffaalex22   | 2026-02 | Webhook details for remote SDK experiments                          |
| [#2550](https://github.com/langfuse/langfuse-docs/pull/2550) | sebbycorp     | 2026-02 | AgentGateway — see #3244 above                                      |
| [#2470](https://github.com/langfuse/langfuse-docs/pull/2470) | doongsilee    | 2026-01 | OTel env vars in `components-mdx/` — small, worth porting           |
| [#2226](https://github.com/langfuse/langfuse-docs/pull/2226) | csicar        | 2025-10 | `LANGFUSE_WEBHOOK_WHITELISTED_*` env vars — 15 lines, worth porting |
| [#1876](https://github.com/langfuse/langfuse-docs/pull/1876) | rishiraj-tf   | 2025-08 | TrueFoundry update                                                  |
| [#857](https://github.com/langfuse/langfuse-docs/pull/857)   | Sohammhatre10 | 2024-10 | 27 files, 24 under `pages/`. Oldest open PR — close it.             |

### Drafts — not ready regardless

- [#3853](https://github.com/langfuse/langfuse-docs/pull/3853) benlangfeld — disabling model definitions on self-hosted (+67, 3 files incl. a changelog entry). Merges clean; looks close to done if the author marks it ready.
- [#1649](https://github.com/langfuse/langfuse-docs/pull/1649) hnykda — titled "[on hold]" by the author. Close it.

---

## Suggested order of work

1. **Merge the 5 in Tier 1** (add the explicit anchor for #3944). Fastest goodwill-per-minute.
2. **Close the 3 duplicates/dead PRs**: one of #3826/#3437, one of #2992/#2990, plus #1649 and #857.
3. **Resolve the #3244 question** so AG2 / AgentGateway / Genkit stop sitting in limbo.
4. **Spend one pass on Tier 2** — seven small PRs, each needing one factual yes/no from someone
   who knows the server. Highest-value cleanup available.
5. **Decide a vendor-page policy** for Tier 3. Nineteen conflict-free PRs are waiting on what is
   really one repeated judgment call.
6. **Security-review #3217** before it drifts further.
