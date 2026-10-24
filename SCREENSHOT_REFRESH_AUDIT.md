# Screenshot and recording refresh audit

Audit date: 2026-10-02

## Scope and decision rule

This audit covers product UI screenshots and gif-style recordings referenced across `langfuse.com`, excluding assets used only on the homepage (`/`). It excludes logos, diagrams, photos, and third-party product UI unless a Langfuse workflow is the subject.

An old screenshot is not automatically wrong. Historical changelog and blog screenshots often document the UI that shipped at the time; replacing them can rewrite the historical record. The refresh backlog therefore prioritizes screenshots in current documentation, integrations, FAQs, and marketing pages. Historical content should only be refreshed when the same asset is reused by current documentation, the media is broken, or the page claims to show the current UI.

Status definitions:

- **Refresh**: visibly incompatible with the current product, contains obsolete naming, exposes personal data, or uses a legacy format that violates current media guidance.
- **Verify**: likely stale based on age or navigation generation, but requires comparison with the current Cloud UI.
- **Keep**: current enough, or intentionally historical.

## Inventory summary

| Area                                                      |                  Inventory |  Strong refresh candidates | Notes                                               |
| --------------------------------------------------------- | -------------------------: | -------------------------: | --------------------------------------------------- |
| Integrations                                              |     121 unique screenshots |                         13 | 58 more need visual verification; 24 appear current |
| Docs and self-hosting                                     |     102 unique screenshots |                        20+ | Mixed v2, v3, and v4 UI                             |
| Blog, changelog, guides, FAQ, marketing, customer stories | 621 referenced image paths | 12 current-page priorities | Most changelog images are historical OG images      |
| Animated media                                            |          239 unique assets |         24 referenced GIFs | 317 references; 54 assets are reused                |

No animated asset is homepage-only. Two animated assets used on the homepage are also used elsewhere, so they remain in the inventory.

## Refresh backlog: current docs and self-hosting

| Priority | Page(s)                                                                                               | Asset(s)                                                                                                                                        | What is shown                                                           | Recovery clues                                                    | Reason                                                             |
| -------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| P0       | `/docs/observability/features/alerts`, `/docs`                                                        | `/images/docs/monitors-list.png`                                                                                                                | Monitor list in project `langfuse-docs`, including “GPT-5.5 Total Cost” | Project `langfuse-docs`; UI footer `v3.194.0`                     | Feature is now named Alerts, but screenshot says “Monitors (Beta)” |
| P0       | `/docs/observability/features/sessions`, `/docs/observability/data-model`                             | `/images/docs/session.png`                                                                                                                      | Session replay for `lf.docs.conversation.0ktPPvd`                       | Trace prefix `c4256bda`; project `langfuse-docs`                  | Legacy session UI and old Langfuse 2.0 context                     |
| P0       | `/docs/observability/features/releases-and-versioning`                                                | `/images/blog/update-august-2023/release.jpg`, `/images/blog/update-august-2023/version.jpg`                                                    | Trace release and generation version labels                             | Trace `chat`; prompt `prompt-2`                                   | 2023 trace UI; metadata includes a real email address              |
| P0       | `/docs/evaluation/experiments/experiments-via-ui`, `/docs/evaluation/experiments/experiments-via-sdk` | `navigate-to-dataset.png`, `trigger-process.png`, `trigger-process-2.png`, `configure_dataset_run.png`, `trigger-remote-experiment-{1,2,3}.png` | Dataset experiment setup and remote trigger flow                        | Dataset `dogs`; project `fuselage-1`; user Felix Krauth           | Explicit `v3.87.1` UI and legacy evaluation navigation             |
| P0       | `/docs/evaluation/experiments/datasets`                                                               | `/images/docs/datasets-overview.png`                                                                                                            | Dataset overview                                                        | Dataset `capital_cities`                                          | 2024 dataset UI                                                    |
| P0       | `/docs/observability/features/log-levels`                                                             | `/images/docs/trace-log-level.png`                                                                                                              | Warning-level retrieval span                                            | Trace `qa`; span `retrieval`                                      | 2024 trace detail layout                                           |
| P0       | `/self-hosting/administration/ui-customization`                                                       | `/images/docs/ui-customization-logo.png`, `/images/docs/ui-customization-links.png`                                                             | Custom logo and sidebar links                                           | Organization `Seed Org`; project `llm-app`; `v2.79.0 EE`          | v2 shell and obsolete settings layout                              |
| P1       | `/docs/evaluation/overview`, `/docs/evaluation/scores/score-analytics`                                | `score-analytics-full-dashboard.png`, `score-analytics-boolean-single.png`, `score-analytics-boolean-compare.png`                               | Score analytics dashboards                                              | Project `launchweek-4`; score `has_hallucination-EVAL`            | Old navigation and Beta label                                      |
| P1       | `/docs/observability/features/multi-modality`                                                         | `multi-modal-trace-image.*`, `multi-modal-trace-audio.*`, `multi-modal-trace-attachment.*`                                                      | Media previews in trace details                                         | 2024 capture set                                                  | Legacy trace detail layout                                         |
| P1       | `/docs/prompt-management/overview`                                                                    | `/images/docs/prompt-management.png`                                                                                                            | Prompt version editor                                                   | Prompt `qa-answer-with-context-chat` v70; project `langfuse-docs` | Pre-v4 sidebar                                                     |
| P1       | `/docs/prompt-management/features/playground`                                                         | `playground-overview.png`, `playground-variables.png`, `playground-model-selection.png`                                                         | Playground windows and variables                                        | Project `docs-examples`; models `gpt-4.1`, `o4-mini`              | Older playground chrome                                            |
| P1       | `/docs/metrics/overview`                                                                              | `/images/docs/llm-analytics.png`                                                                                                                | Project dashboard                                                       | Project `langfuse-docs`; 1.77K traces                             | Older dashboard navigation                                         |

## Refresh backlog: integrations

| Priority | Page                                                  | Asset(s)                                                                     | What is shown                                   | Public trace or recovery clue                                                                                                                                        | Reason                                            |
| -------- | ----------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| P0       | `/integrations/model-providers/openai-py`             | `/images/docs/openai-error.png`                                              | Failed generation named `will-error`            | Prompt/span name `will-error`                                                                                                                                        | November 2023 trace UI                            |
| P0       | `/integrations/model-providers/openai-assistants-api` | `/images/docs/openai-assistants-trace.png`                                   | `run_math_tutor` assistant trace                | [Public trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/b3b7b128-5664-4f42-9fab-31999da9e2f1); project `docs-examples`                    | May 2024 trace detail UI; asset is embedded twice |
| P0       | `/integrations/model-providers/ollama`                | `integration-ollama-llama-trace.png`, `integration-ollama-mistral-trace.png` | Ollama generations                              | Trace IDs `6ad58e47-3bff-4287-9a96-af85d2627ea4`, `85693874-9ddb-4fd4-a386-0031933cb784`; project `cloramnkj0002jz088vzn1ja4`                                        | August 2024 trace UI                              |
| P1       | `/integrations/frameworks/mirascope`                  | `/images/cookbook/integration_mirascope_simple.png`                          | Book recommendation generation                  | [Public trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/794523f3-fb98-47fa-96f6-04f99dae862a); prompt `recommend_book`                    | October 2024 capture                              |
| P1       | `/integrations/model-providers/amazon-bedrock`        | `bedrock-converse-trace.png`                                                 | Bedrock Converse trace                          | [Public trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/f01a828c-fed1-45e1-b836-cd74c331597d); trace name `examples_bedrock_converse_api` | October 2024 capture                              |
| P1       | `/integrations/other/milvus`                          | `/images/docs/milvus-llamaindex-example-trace.png`                           | Milvus/LlamaIndex trace                         | [Public trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/2b26fc72-044f-4b0b-a3c3-485328975161)                                             | October 2024 capture                              |
| P1       | `/integrations/other/inferable`                       | `inferable-langfuse-trace.png`, `inferable-langfuse-eval.png`                | Inferable trace and evaluation                  | No public link; recover from page example names                                                                                                                      | December 2024 capture                             |
| P1       | `/integrations/no-code/vapi`                          | Credential/setup and example trace PNGs                                      | Vapi setup and voice trace                      | [Public trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/50163c14-9784-4cb9-b18e-23e924d0bb66)                                             | December 2024 capture; includes partner UI        |
| P1       | `/integrations/no-code/openwebui`                     | Setup and add-pipeline PNGs                                                  | OpenWebUI pipeline setup                        | Page trace link is newer than setup captures                                                                                                                         | 2024 partner UI requires coordinated re-recording |
| P0       | `/integrations/other/gradio`                          | `gradio-traces-in-langfuse.gif`                                              | Gradio conversation followed by Langfuse traces | [Public session](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/sessions/5c0b8d01-cbcb-4650-be50-c6e4ca0ce093)                                         | Legacy GIF; replace with MP4                      |

The remaining 80-ish integration screenshots should not be bulk-replaced without visual comparison. Twenty-two are early-2025 captures that probably predate the observations-first UI, while 58 have insufficient evidence beyond age. Recent 2026 captures for GitHub Copilot, Anthropic JS, TypeSafe, Qwen, LiveKit, EverOS, and ElevenLabs are likely current.

## Refresh backlog: FAQ and marketing

| Priority | Page                                    | Asset(s)                                                                               | What is shown                            | Recovery clues                                             | Reason                                                       |
| -------- | --------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| P0       | `/faq/all/manage-score-configs`         | `/images/docs/scoreconfigs.png`, `add_new_score_config.png`, `modify_score_config.png` | Score config list, creation, and editing | Project `langfuse-docs`; versions `v3.86.1` and `v3.113.0` | Current FAQ uses v3 settings UI; one image is embedded twice |
| P0       | `/cn`, `/kr`                            | `/images/docs/chinese-example-trace.png`, `/images/docs/korean-example-trace.png`      | Localized trace detail examples          | Chinese trace dated 2024-02-12; tag `Chat Competition`     | Legacy trace detail UI on current marketing pages            |
| P1       | `/support`                              | `/images/support/in-app-support.png`                                                   | Support drawer in project settings       | Project `demo project`; `v3.108.0`                         | Verify support entry point in v4                             |
| P1       | `/faq/all/unwanted-http-database-spans` | `/images/docs/faq-unwanted-http-database-spans.png`                                    | Repeated `GET` spans in traces table     | `v3.153.0`; PROD-US                                        | Content remains useful, but navigation is v3                 |

## Historical content policy

Do not automatically refresh screenshots that only appear in dated changelog or historical blog posts. For example, the v2 organization home in the August 2024 changelog and 2023 dashboard GIFs accurately represent those releases. Instead:

1. Keep the historical media when it still loads and the page is clearly dated.
2. Replace GIF with MP4 only when format, accessibility, or delivery is a problem; preserve the historical UI content.
3. Refresh a shared asset when current docs reuse it, then give the historical page its own archived copy if necessary.
4. Add a “current documentation” link when a historical workflow is materially different today.

## Animated media backlog

There are 24 referenced GIFs:

- Seven 2023 changelog GIFs covering human evaluation, public trace links, exports, filters, navigation, and dashboards.
- Fifteen blog GIFs covering 2023 product updates, chatbot demos, feedback, users, costs, and the March 2025 redesign.
- `/images/changelog/2024-04-26-evals-config.gif`.
- `/images/changelog/2025-06-16-prompt-management-folders.gif`.
- `/images/docs/score-manual.gif`.
- The Gradio integration GIF and the cookbook “add traces to dataset” GIF.

The count exceeds 24 when grouped bullets are expanded because some blog and cookbook references overlap. The machine inventory should be the source of truth before migration.

Recommended treatment:

- Convert historical GIFs to MP4 without changing their content when they are intentionally archival.
- Re-record current documentation and integration workflows in the latest Cloud UI.
- Do not recreate YouTube talks or customer videos; they are external editorial media.
- Keep all new captures at 16:9, preferably 1920×1080 source with a safe crop for readable UI.

## Capture workflow tested

The public `run_math_tutor` trace proved that public trace links are sufficient to recover realistic data without access to a private example project.

Recommended workflow:

1. Resolve the source: public trace/session URL first; otherwise use trace ID, session ID, prompt name, dataset name, project name, and visible timestamps.
2. Open the current Cloud UI at 1440×810 or 1920×1080.
3. Choose the view that communicates the concept: Tree for hierarchy, Graph for agent flow, or a focused detail panel for input/output.
4. Hide browser chrome and crop empty space. The tested crop enlarged the useful UI by about 20%.
5. Record native clicks when teaching an interaction. Use short fades between fully loaded states when the goal is a compact looping overview.
6. Encode MP4/H.264 at 1920×1080, 30 fps, muted, with a 8–15 second target for gif-style loops.
7. Validate with `ffprobe`: exact 16:9 dimensions, expected duration, and no accidental long recording.
8. Run independent visual review for legibility, active-state consistency, loaders/errors, pointer behavior, empty space, overlays, and private data.
9. Reject the asset before human review if any automated check fails.

The first raw test exposed a workflow failure: screen recording remained active while browser automation ran, producing seven- to eight-minute files with address-bar navigation and dead time. Trimming, cropping, and independent review caught this. The reviewed prototypes use clean, fully loaded states and pass the visual check.

## Human review queue

Use a pull request as the durable review queue. One row per asset:

| Field                    | Purpose                                                  |
| ------------------------ | -------------------------------------------------------- |
| Page URL and source file | Locate every use                                         |
| Old asset                | Side-by-side comparison                                  |
| Candidate asset          | Proposed replacement                                     |
| What it shows            | Trace, prompt, dataset, settings, or workflow            |
| Source locator           | Public URL or project + object IDs/names                 |
| Capture metadata         | Date, viewport, zoom/crop, Cloud region                  |
| Automated checks         | 16:9, dimensions, duration, format, visual-review result |
| Human status             | Pending, approved, changes requested, blocked            |
| Notes                    | Requested crop, data, theme, or redaction changes        |

Batch reviews by workflow rather than by page. A single trace screenshot may be reused on several pages, and refreshing it once should update every dependent page deliberately.

## Proposed rollout order

1. Run a pilot on the OpenAI Assistants trace, Alerts/Monitors, and one prompt-management screen.
2. Refresh P0 current docs, FAQ, marketing, and integration assets.
3. Refresh P1 assets after product-owner verification.
4. Migrate legacy GIF delivery, preserving historical content where appropriate.
5. Review early-2025 integration screenshots in batches by shared example project.
6. Re-audit current pages after replacements and track historical-only media separately.
