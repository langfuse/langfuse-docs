# Open community PRs in langfuse-docs

Snapshot: 2026-11-17. 239 open PRs in total; **91 are from non-Langfuse contributors** (16 bot PRs listed separately; PRs from Langfuse staff and recurring internal contributors are excluded).

How "non-Langfuse" was determined: author is not a repo collaborator (any role) **and** has no merged commits on `main`. `felixkrrr`, `milanagm` and `FroeMic` were filtered out on that basis even though they are not collaborators.

Two things apply to nearly all of these and are not repeated per row:

- **Vercel preview shows `Authorization required to deploy` and the GitHub Actions checks (`format`, `check_h1`, `check_middle_dot`, `build-and-check-links`) have not run.** Fork PRs need a maintainer to approve the workflow run, so a green CI signal does not exist for any of them yet. Treat "safe to merge" below as "safe to approve CI on, then merge if green", not "merge blind".
- **Merge-conflict status was computed locally** against `origin/main` with `git merge-tree`. 45 of the 91 conflict today.

---

## 1. Safe to merge — small, scoped, merges clean

Single-page or mechanical docs fixes. All merge cleanly and have the CLA signed unless noted.

| PR                                                           | Author       | Size         | What it does                                                                                                                   | Note                                                                                 |
| ------------------------------------------------------------ | ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| [#3953](https://github.com/langfuse/langfuse-docs/pull/3953) | deepanshupal | +4/-2, 1f    | Moves `# generate via: openssl rand -hex 32` off the `\`-continued `docker run` lines, where it broke the command              | Clear bug fix, copy-pasteable result                                                 |
| [#3944](https://github.com/langfuse/langfuse-docs/pull/3944) | HardMax71    | +1/-1, 1f    | Says the JS `mask` only covers `langfuse.observation.*` / `langfuse.trace.*`, not `ai.*` / `gen_ai.*` attributes               | Accuracy fix; confirm the claim with an SDK owner                                    |
| [#4181](https://github.com/langfuse/langfuse-docs/pull/4181) | Lushiyao5    | +10/-10, 8f  | Replaces nonexistent `update_current_observation()` with `update_current_span()` in 3 cookbooks + truefoundry page             | Mechanical; edits both `.ipynb` and the generated `.mdx` consistently                |
| [#4130](https://github.com/langfuse/langfuse-docs/pull/4130) | Lushiyao5    | +19/-19, 19f | Repoints external links that 404 after third-party doc restructures                                                            | Mechanical; 19 files but one-line-each                                               |
| [#4180](https://github.com/langfuse/langfuse-docs/pull/4180) | Lushiyao5    | +6/-2, 2f    | Describes what the Claude Agent SDK instrumentation actually captures (AGENT span + TOOL children, no per-turn LLM spans)      | Good accuracy fix; verify the "no per-turn generations" claim                        |
| [#4074](https://github.com/langfuse/langfuse-docs/pull/4074) | Haarris      | +6/-2, 1f    | Adds `AND (args->>'envGate') IS NULL` to the v3→v4 pre-upgrade check so the dormant `v4_step_*` rows don't look like a blocker | Needs a self-hosting owner to confirm the envGate detail — it is load-bearing advice |
| [#4256](https://github.com/langfuse/langfuse-docs/pull/4256) | AngelP17     | +1/-0, 1f    | Documents `LANGFUSE_S3_SOCKET_IDLE_TIMEOUT_MS` in the config table                                                             | Verify default (`2000`) against core; row is long but matches the table              |
| [#3415](https://github.com/langfuse/langfuse-docs/pull/3415) | jorgehermo9  | +16/-14, 1f  | Lists all OTel source attributes Langfuse maps to `sessionId` / `userId`                                                       | Factual check against the mapping code                                               |
| [#4185](https://github.com/langfuse/langfuse-docs/pull/4185) | pkc-zyy      | +49/-10, 2f  | Documents `gen_ai.input.messages` / `gen_ai.output.messages` mapping (OTel + Spring AI pages)                                  | Factual check                                                                        |
| [#4319](https://github.com/langfuse/langfuse-docs/pull/4319) | YunMori      | +42/-44, 2f  | Clarifies span filtering and root-span guidance (FAQ + OTel index)                                                             | Largest of this group; still doc-only, single topic                                  |
| [#4195](https://github.com/langfuse/langfuse-docs/pull/4195) | docfitdev    | +25/-0, 2f   | Documents the `runBatchEvaluation` MCP tool and `batch_action_id` on batch run outputs                                         | **Verify the tool and field actually exist** before merging                          |
| [#4141](https://github.com/langfuse/langfuse-docs/pull/4141) | mautini      | +11/-1, 1f   | Documents "Fetch models from endpoint" on LLM connections                                                                      | Reads like it was written from the shipped UI; confirm the feature is live           |

**Blocked on a signature / draft, otherwise trivial:**

- [#4017](https://github.com/langfuse/langfuse-docs/pull/4017) — MarshallBear1, +1 line, adds Juno to the adopters table. **CLA not signed.** Reference cell is "Langfuse Customer", so the Wayback rule in CLAUDE.md does not apply, but someone has to confirm Juno is in fact a customer.
- [#4199](https://github.com/langfuse/langfuse-docs/pull/4199) — adity982, +6, warning callout for the 10,000-character dataset JSON Schema limit. **Still a draft.** Verify the limit, then ask for ready-for-review.

**Trivial but needs a rebase first (conflicts today):**

- [#3071](https://github.com/langfuse/langfuse-docs/pull/3071) — boleg-dev, +2/-2, metrics/observations reference links
- [#3583](https://github.com/langfuse/langfuse-docs/pull/3583) — toyayuto, +22, ClickHouse system-table grants for v4
- [#2841](https://github.com/langfuse/langfuse-docs/pull/2841) — markjm, +13, Claude Code hook no longer blocks Claude from finishing
- [#4049](https://github.com/langfuse/langfuse-docs/pull/4049) — HardMax71, +21/-22 across 10 files, public-API filter semantics ("a filter condition replaces only the fixed parameter for the same field"). Mechanical but touches generated cookbook `.mdx`.
- [#4184](https://github.com/langfuse/langfuse-docs/pull/4184) — saruar-dev, +11, "Nace (Drex) upstream preset" for decision-model evaluators. Small, but the preset name has no public footprint; confirm it is a real Langfuse preset, not a vendor insert.

---

## 2. Content additions needing an editorial decision, not just a review

Each adds a **new page or cookbook for a third-party product**. The code may be fine; the question is whether Langfuse wants the page at all, and whether it follows the integration-page rules in CLAUDE.md (opening visual, `content/integrations/` placement, `meta.json` entry, logo asset, evergreen phrasing).

**Recognizable products — worth reviewing on the merits:**

| PR                                                           | Author            | Size         | Product                                                                                 |
| ------------------------------------------------------------ | ----------------- | ------------ | --------------------------------------------------------------------------------------- |
| [#4094](https://github.com/langfuse/langfuse-docs/pull/4094) | pierrebrunelle    | +296, 4f     | Pixeltable (OpenTelemetry)                                                              |
| [#4022](https://github.com/langfuse/langfuse-docs/pull/4022) | axyr              | +196, 4f     | Laravel                                                                                 |
| [#2701](https://github.com/langfuse/langfuse-docs/pull/2701) | dmeremyanin       | +135, 4f     | Genkit — conflicts                                                                      |
| [#3393](https://github.com/langfuse/langfuse-docs/pull/3393) | mezotv            | +156, 2f     | Neon AI Gateway                                                                         |
| [#4117](https://github.com/langfuse/langfuse-docs/pull/4117) | rishi-raj-jain    | +34, 1f      | Neon Object Storage, added to the existing blobstorage page (smallest of the group)     |
| [#3832](https://github.com/langfuse/langfuse-docs/pull/3832) | redis-phil        | +76/-2, 1f   | Redis Cloud config, added to the existing cache page                                    |
| [#3223](https://github.com/langfuse/langfuse-docs/pull/3223) | MVS-source        | +167/-2, 5f  | Eden AI gateway (also touches `components/home/Integrations.tsx`)                       |
| [#3273](https://github.com/langfuse/langfuse-docs/pull/3273) | ofeliacode        | +217, 2f     | Temporal TypeScript — conflicts                                                         |
| [#3540](https://github.com/langfuse/langfuse-docs/pull/3540) | ralf0131          | +158, 3f     | DeepSeek Harness                                                                        |
| [#3752](https://github.com/langfuse/langfuse-docs/pull/3752) | Swpn0neel         | +275, 3f     | Bifrost — conflicts                                                                     |
| [#2864](https://github.com/langfuse/langfuse-docs/pull/2864) | navnitshukla      | +803/-8, 5f  | Snowflake Cortex REST API — conflicts                                                   |
| [#2821](https://github.com/langfuse/langfuse-docs/pull/2821) | umutdinceryananer | +790, 11f    | Streamlit — conflicts; also adds `examples/streamlit-demo/` and edits `.gitignore`      |
| [#2749](https://github.com/langfuse/langfuse-docs/pull/2749) | IremOztimur       | +130, 4f     | Upsonic                                                                                 |
| [#3691](https://github.com/langfuse/langfuse-docs/pull/3691) | skeptrunedev      | +65/-5, 1f   | Morph inference tracing (edits the existing Morph page)                                 |
| [#2878](https://github.com/langfuse/langfuse-docs/pull/2878) | JK-Amanda-Goo     | +574, 2f     | JS/TS Google Gemini cookbooks (basic + multimodal)                                      |
| [#4031](https://github.com/langfuse/langfuse-docs/pull/4031) | sipa-echo-zaoa    | +118/-27, 2f | Pydantic AI instrumentation examples refresh                                            |
| [#3129](https://github.com/langfuse/langfuse-docs/pull/3129) | Sajith15          | +307/-20, 1f | Expands the JS/TS v3→v4 migration guide — large single-page rewrite, needs an SDK owner |
| [#2737](https://github.com/langfuse/langfuse-docs/pull/2737) | cocolocow         | +89, 2f      | langfuse-board — conflicts                                                              |

**Unfamiliar / no public footprint — likely vendor self-promotion; verify the product exists before merging:**

I spot-checked a few names on the web and found nothing for signafAIde, SealedRun, Heabsy or EmpirioLabs. The shape is consistent across this cluster: a first-time account, a brand-new page plus a `meta.json` row and a logo file, no other repo history.

| PR                                                           | Author         | Size        | Claimed product                                                                    |
| ------------------------------------------------------------ | -------------- | ----------- | ---------------------------------------------------------------------------------- |
| [#4429](https://github.com/langfuse/langfuse-docs/pull/4429) | aimetech-admin | +116, 3f    | signafAIde span processor                                                          |
| [#4298](https://github.com/langfuse/langfuse-docs/pull/4298) | kyuminjo       | +318, 5f    | PopNow model provider                                                              |
| [#4288](https://github.com/langfuse/langfuse-docs/pull/4288) | glanitcom      | +125, 3f    | SealedRun                                                                          |
| [#4128](https://github.com/langfuse/langfuse-docs/pull/4128) | rocosen        | +661, 5f    | FlashData research tool                                                            |
| [#4096](https://github.com/langfuse/langfuse-docs/pull/4096) | Adam-Dalloul   | +325, 5f    | EmpirioLabs                                                                        |
| [#4083](https://github.com/langfuse/langfuse-docs/pull/4083) | Haarris        | +110, 3f    | CacheCanary                                                                        |
| [#4066](https://github.com/langfuse/langfuse-docs/pull/4066) | sadfun         | +50/-1, 3f  | Pethost deployment (also edits `content/self-hosting/index.mdx`)                   |
| [#4053](https://github.com/langfuse/langfuse-docs/pull/4053) | Javihaus       | +87, 3f     | GroundLens — conflicts                                                             |
| [#3996](https://github.com/langfuse/langfuse-docs/pull/3996) | sundar-flex    | +357, 5f    | FlexAI                                                                             |
| [#3980](https://github.com/langfuse/langfuse-docs/pull/3980) | mahir-lyceum   | +344, 6f    | Lyceum                                                                             |
| [#3922](https://github.com/langfuse/langfuse-docs/pull/3922) | kafomichev     | +95, 3f     | Heabsy                                                                             |
| [#3826](https://github.com/langfuse/langfuse-docs/pull/3826) | Yilialinn      | +166, 3f    | AISIX AI Gateway — conflicts                                                       |
| [#3437](https://github.com/langfuse/langfuse-docs/pull/3437) | moonming       | +145, 3f    | AISIX AI Gateway — **duplicate of #3826**, same files, different author; conflicts |
| [#3820](https://github.com/langfuse/langfuse-docs/pull/3820) | roli-lpci      | +137, 2f    | Hermes Rubric cookbook                                                             |
| [#3748](https://github.com/langfuse/langfuse-docs/pull/3748) | ethan7zhanghx  | +498, 4f    | Querit search observability                                                        |
| [#3700](https://github.com/langfuse/langfuse-docs/pull/3700) | JackChen-me    | +151, 3f    | Open Multi-Agent                                                                   |
| [#3604](https://github.com/langfuse/langfuse-docs/pull/3604) | koshea         | +111, 3f    | UserVane — conflicts                                                               |
| [#3359](https://github.com/langfuse/langfuse-docs/pull/3359) | EmersonBraun   | +168, 4f    | AgentsKit — conflicts                                                              |
| [#3296](https://github.com/langfuse/langfuse-docs/pull/3296) | seven7763      | +153, 3f    | DaoXE multi-protocol gateway                                                       |
| [#2994](https://github.com/langfuse/langfuse-docs/pull/2994) | ejentum        | +212, 1f    | ejentum cognitive harness cookbook                                                 |
| [#2992](https://github.com/langfuse/langfuse-docs/pull/2992) | ai-auxen       | +111, 3f    | Auxen as model provider — conflicts                                                |
| [#2990](https://github.com/langfuse/langfuse-docs/pull/2990) | ai-auxen       | +126, 2f    | Auxen integration page — **duplicate of #2992**, same author; conflicts            |
| [#2977](https://github.com/langfuse/langfuse-docs/pull/2977) | cerebrixos     | +101/-1, 4f | Tuning Engines gateway                                                             |
| [#2964](https://github.com/langfuse/langfuse-docs/pull/2964) | evdevlead      | +197, 3f    | NoPII gateway                                                                      |
| [#2795](https://github.com/langfuse/langfuse-docs/pull/2795) | risjai         | +160, 2f    | Rewind time-travel debugger — conflicts                                            |
| [#2766](https://github.com/langfuse/langfuse-docs/pull/2766) | SumitVermakgp  | +630, 2f    | RAIL Score evaluation cookbook — conflicts                                         |

**Large cookbooks and guides — real review needed, not quick merges:**

- [#3981](https://github.com/langfuse/langfuse-docs/pull/3981) — XinyangWuEthz, **+2396**, annotation queue prioritization cookbook
- [#3824](https://github.com/langfuse/langfuse-docs/pull/3824) — itisparas, +868, Observations API cost-by-user cookbook
- [#3795](https://github.com/langfuse/langfuse-docs/pull/3795) — elandesberg, +723, CJE experiment-comparison cookbook — conflicts
- [#2653](https://github.com/langfuse/langfuse-docs/pull/2653) — garyatwalAI, +868, regulatory compliance evaluation pipeline cookbook (notebook only, no `_routes.json` entry)
- [#3452](https://github.com/langfuse/langfuse-docs/pull/3452) — jw-ond, +234, governed action metadata cookbook (`.mdx` only, no source notebook — violates the cookbook workflow rule)
- [#3062](https://github.com/langfuse/langfuse-docs/pull/3062) — AryanBhansali-SE, +249, RAG observability cookbook — conflicts
- [#2689](https://github.com/langfuse/langfuse-docs/pull/2689) — BipinRimal314, +378, EU AI Act compliance guide. Single new page, merges clean, but it is legal/compliance copy on langfuse.com — needs a deliberate sign-off, not a docs review.
- [#4341](https://github.com/langfuse/langfuse-docs/pull/4341) — bunny1278, +72, GitLab CI and Jenkins examples on the existing experiments CI/CD page. Smallest here and merges clean; borderline category 1 if the snippets check out.

---

## 3. Site code, infra and tooling — not docs, needs an engineer

| PR                                                           | Author          | Size               | What it touches                                                                                                                                                      |
| ------------------------------------------------------------ | --------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [#2859](https://github.com/langfuse/langfuse-docs/pull/2859) | tomaszantas     | +1139/-152, 10f    | OG image redesign: `app/api/og/route.tsx`, `lib/og-url.ts`, fonts, generated PNGs — conflicts                                                                        |
| [#2849](https://github.com/langfuse/langfuse-docs/pull/2849) | tomaszantas     | +252/-216, 15f     | Bundle-size optimization across home/wrapped components — conflicts                                                                                                  |
| [#2858](https://github.com/langfuse/langfuse-docs/pull/2858) | tomaszantas     | +57/-28, 7f        | Section-registry ownership, navbar/layout — conflicts                                                                                                                |
| [#2860](https://github.com/langfuse/langfuse-docs/pull/2860) | tomaszantas     | +32/-27, 1f        | Feature-tabs dot restyle — conflicts                                                                                                                                 |
| [#2711](https://github.com/langfuse/langfuse-docs/pull/2711) | tomaszantas     | +174/-106, **52f** | Cookbook script → Fumadocs, mass `.mdx`→`.md` renames — conflicts                                                                                                    |
| [#2998](https://github.com/langfuse/langfuse-docs/pull/2998) | GANESH-NADKARNI | +72/-2, 2f         | Adds `app/api/changelog-rss.xml/route.ts` — merges clean, but it is a new public endpoint                                                                            |
| [#3217](https://github.com/langfuse/langfuse-docs/pull/3217) | orhund8z        | +60/-1, 3f         | `RenderedReadmeContent.tsx` renders **raw HTML** from fetched READMEs, plus a new dependency in `package.json`/`pnpm-lock.yaml` — conflicts. Review the XSS surface. |
| [#3900](https://github.com/langfuse/langfuse-docs/pull/3900) | milanagm\*      | +327, 5f           | Adds `.agents/skills/integration-docs/` — process change, not content                                                                                                |
| [#3537](https://github.com/langfuse/langfuse-docs/pull/3537) | graphaelli      | +10/-4, 7f         | Moves LibreChat to no-code builders; touches `lib/redirects.js` and `data/generated/contributors.json` — conflicts                                                   |
| [#1305](https://github.com/langfuse/langfuse-docs/pull/1305) | congnguyendinh0 | +179, 3f           | Vietnamese landing page + `FooterMenu.tsx` — conflicts, and built on the removed `pages/` tree                                                                       |
| [#3853](https://github.com/langfuse/langfuse-docs/pull/3853) | benlangfeld     | +67, 3f            | Disabling model definitions on self-hosted — **draft**, includes a backdated changelog entry (`2026-09-18`); conflicts                                               |

\* `milanagm` has 14 commits on `main`; included here because the PR changes repo tooling, not because the author is external.

---

## 4. Stale — built on the removed `pages/` tree, needs a rewrite before anything else

The repo moved to Fumadocs and `content/`. These still edit `pages/`, which no longer exists, so they cannot be merged or even meaningfully reviewed as-is. Several are good ideas that someone should port.

| PR                                                           | Author        | Size           | Worth porting?                                               |
| ------------------------------------------------------------ | ------------- | -------------- | ------------------------------------------------------------ |
| [#2666](https://github.com/langfuse/langfuse-docs/pull/2666) | ouvreboite    | +2/-3, 2f      | Yes — a 2-line broken trace link fix in Vertex AI docs       |
| [#2623](https://github.com/langfuse/langfuse-docs/pull/2623) | iamjjanga-ouo | +32, 1f        | Yes — token usage tracking in the Claude Code hook           |
| [#2560](https://github.com/langfuse/langfuse-docs/pull/2560) | daffaalex22   | +212/-10, 1f   | Maybe — webhook details for remote SDK experiments           |
| [#2632](https://github.com/langfuse/langfuse-docs/pull/2632) | VasiliyRad    | +263, 1f       | Maybe — AG2 framework integration                            |
| [#2550](https://github.com/langfuse/langfuse-docs/pull/2550) | sebbycorp     | +428, 1f       | Maybe — AgentGateway integration                             |
| [#1876](https://github.com/langfuse/langfuse-docs/pull/1876) | rishiraj-tf   | +89/-158, 3f   | Maybe — TrueFoundry update (note #4181 also edits that page) |
| [#1649](https://github.com/langfuse/langfuse-docs/pull/1649) | hnykda        | +8/-10, 1f     | Author marked it `[on hold]` — close or revive               |
| [#857](https://github.com/langfuse/langfuse-docs/pull/857)   | Sohammhatre10 | +2391/-51, 27f | Close — from 2024/25, touches 27 removed files               |

Also effectively stale, though not on `pages/`:

- [#1452](https://github.com/langfuse/langfuse-docs/pull/1452) — aboavent, **+3500/-136**, 13 files, adds a Python module tree under `cookbook/core/`. Conflicts; out of scope for a docs repo as structured.
- [#2585](https://github.com/langfuse/langfuse-docs/pull/2585) — ouvreboite, +571/-823, rewrites `cookbook/example_data_migration.ipynb`. Conflicts; needs the notebook owner.

---

## 5. Bot PRs (16, excluded from the counts above)

- **Dependabot (13):** #4421 tornado, #4013 sharp, #4012 katex, #3486 nanoid, #3484 mermaid, #3471 postcss, #3383 next, #3347 sharp, #3089 uv, #2953 @protobufjs/utf8, #2755 pygments, #2495 @modelcontextprotocol/sdk. Note #4013 and #3347 are both sharp bumps; #3383 bumps `next`, which the repo's own `AGENTS.md` block warns is a breaking-change-heavy dependency.
- **cursor[bot] (2):** #2627, #2625 — both "fix stale documentation" on `public-api` / `query-via-sdk`, overlapping scope.
- **claude[bot] (1):** #3465 tags vs. metadata guidance; #3351 (Blacksmith runners) is also claude[bot].

---

## Suggested order of work

1. Merge-ready today, pending a CI approval run: #3953, #4181, #4130, #3944, #4180, #4074, #4256, #3415, #4185, #4319.
2. Quick unblocks: ask #4017 to sign the CLA, ask #4199 to undraft, ask #3071 / #3583 / #2841 / #4049 to rebase.
3. Decide the policy question behind category 2's second table — 26 PRs are waiting on "do we accept vendor-authored integration pages for products we can't verify?" One decision closes or merges most of them.
4. Close out category 4 with a short note pointing at the `content/` move, keeping #2666 and #2623 as ports.
