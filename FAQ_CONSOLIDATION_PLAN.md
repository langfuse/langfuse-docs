# FAQ Consolidation Plan

Generated: 2025-02-12

## Current State

The `pages/faq/` folder contains **84 files** (73 content pages in `faq/all/`, 10 tag pages in `faq/tag/`, plus `faq/index.mdx`).

### How it works today

- Each FAQ is a standalone `.mdx` file under `pages/faq/all/` with a `tags` frontmatter field.
- Tag pages (`pages/faq/tag/*.mdx`) are thin wrappers that render `<FaqPreview tags={["..."]} />` to show a filtered card list.
- A catch-all `pages/faq/tag/[tag].mdx` auto-generates tag pages for any tag that doesn't have a dedicated page.
- The `docs/` troubleshooting pages (e.g., `docs/observability/troubleshooting-and-faq.mdx`) also pull in FAQ content via the same `<FaqPreview>` component.
- The `faq/all/` pages are **hidden from the sidebar** (`display: "hidden"` in `_meta.tsx`), meaning they're only discoverable through the tag pages, troubleshooting pages, or search.

### Observations

1. **Many FAQ pages are very thin** (8-14 lines) and would be better served as sections within a larger page.
2. **Several pages are SEO-oriented "articles"** (tagged `[article]` or `[comparison]`) that are substantially longer and serve a different purpose than actual FAQs.
3. **Self-hosting troubleshooting FAQs** overlap heavily with the `self-hosting/troubleshooting-and-faq.mdx` page (which just embeds them via `<FaqPreview>`).
4. **Case study pages** feel out of place in a FAQ section.
5. **The tag page system adds complexity** but provides little value — each tag page is just a 10-line wrapper.

---

## Consolidation Plan

### Phase 1: Remove or Relocate Misplaced Content

These pages are not really FAQs and should be moved out of the FAQ section or removed entirely.

#### 1A. SEO "Article" Pages — Move to `/blog/` or Remove

These long-form articles were placed in FAQ for SEO purposes. They should either be moved to `/blog/` (with redirects) or removed if the content is stale and doesn't rank well.

| File | Lines | Title | Recommendation |
|---|---|---|---|
| `ai-research-assistant-monitoring.mdx` | 136 | Monitoring AI Research Assistants | **Remove** — Generic AI content, not Langfuse-specific enough |
| `chatbot-analytics.mdx` | 182 | Chatbot Monitoring with Advanced Observability | **Remove** — Generic content with Langfuse plugged in |
| `monitoring-ai-generated-content.mdx` | 60 | Monitoring AI-Generated Content | **Remove** — Generic content |
| `llm-observability.mdx` | 53 | What is LLM Observability & Monitoring? | **Move to blog** or **remove** — Conceptual article, not a FAQ |
| `llm-analytics-101.mdx` | 81 | LLM Analytics 101 | **Move to blog** or **remove** — Tutorial-style article |
| `challenges-of-building-llm-applications.mdx` | 22 | Common challenges of building LLM applications | **Remove** — Short, generic, better covered by docs overview |

#### 1B. Comparison Pages — Move to `/comparisons/` or Keep as-is

These are strategic SEO landing pages. They serve a clear purpose and are well-structured, but don't belong in "FAQ". Consider a dedicated `/comparisons/` route.

| File | Lines | Title | Recommendation |
|---|---|---|---|
| `langsmith-alternative.mdx` | 90 | Langfuse vs. LangSmith | **Move to `/comparisons/`** |
| `best-braintrustdata-alternatives.mdx` | 94 | Langfuse vs. Braintrust | **Move to `/comparisons/`** |
| `best-phoenix-arize-alternatives.mdx` | 96 | Langfuse vs. Arize AX / Phoenix | **Move to `/comparisons/`** |
| `best-galileo-ai-alternatives.mdx` | 103 | Langfuse vs. Galileo AI | **Move to `/comparisons/`** |

#### 1C. Case Studies — Move to `/blog/` or `/case-studies/`

These are guest posts / customer stories, not FAQs.

| File | Lines | Title | Recommendation |
|---|---|---|---|
| `huntr-langfuse-case-study.mdx` | 30 | How Huntr Uses Langfuse | **Move** to blog or case studies section |
| `ai-transparency-remberg-langfuse.mdx` | 35 | How Remberg Improves Transparency with Langfuse | **Move** to blog or case studies section |
| `mava-langfuse-case-study.mdx` | 38 | How Mava Uses Langfuse | **Move** to blog or case studies section |

#### 1D. Marketing / Product Overview Pages — Remove or Merge into Docs

These overlap with existing docs pages and provide little additional value.

| File | Lines | Title | Recommendation |
|---|---|---|---|
| `fifteen-questions-langfuse-answered.mdx` | 124 | 19 Questions about Langfuse Answered | **Remove** — Rehashes docs content, links are stale (e.g., references `/docs/scores/overview`, `/docs/analytics/overview`) |
| `ten-reasons-to-use-langfuse.mdx` | 30 | Ten Reasons to Use Langfuse | **Remove** — Marketing copy, better on landing page |
| `self-hosting-langfuse.mdx` | 21 | How can I self-host Langfuse? | **Remove** — Just links to `/self-hosting` with no added value |
| `packages-depending-on-langfuse.mdx` | 16 | Which packages are using Langfuse? | **Remove** — Auto-generated list, could go on integrations page |
| `what-is-prompt-engineering.mdx` | 26 | What is prompt engineering? | **Remove** — Generic educational content, not Langfuse-specific |
| `what-is-LCEL.mdx` | 28 | What is LangChain Expression Language? | **Remove** — LangChain documentation, not a Langfuse FAQ |

---

### Phase 2: Merge Related Self-Hosting Troubleshooting FAQs

There are **16 self-hosting tagged FAQs**. Many of these are short (8-15 lines) and describe specific error messages. They should be consolidated into a single comprehensive troubleshooting page at `self-hosting/troubleshooting-and-faq.mdx` (which currently is just a thin wrapper that embeds them).

**Proposed consolidated sections:**

#### "Self-Hosting Troubleshooting" (merge into `self-hosting/troubleshooting-and-faq.mdx`)

| Current File | Lines | Proposed Section Heading |
|---|---|---|
| `debug-docker-deployment.mdx` | 15 | Connection Issues |
| `self-hosting-502-504-network-errors.mdx` | 14 | Intermittent 502/504 Errors |
| `self-hosting-socket-usage-at-capacity.mdx` | 11 | Socket Usage at Capacity |
| `self-hosting-javascript-heap-out-of-memory.mdx` | 17 | JavaScript Heap Out of Memory |
| `self-hosting-timezone-errors.mdx` | 10 | Timezone Configuration |
| `self-hosting-missing-events-after-ingestion.mdx` | 22 | Missing Events After Ingestion |
| `self-hosting-clickhouse-handling-failed-migrations.mdx` | 32 | ClickHouse Failed Migrations |
| `self-hosting-postgresql-table-ownership-migration-failures.mdx` | 38 | PostgreSQL Table Ownership Issues |
| `data-retention-timeouts-and-errors.mdx` | 13 | Data Retention Job Timeouts |
| `self-host-with-load-balancer.mdx` | 8 | Running Behind a Load Balancer |
| `arm-images.mdx` | 8 | ARM Image Availability |
| `self-hosted-telemetry.mdx` | 23 | Telemetry in Self-Hosted Deployments |
| `compatibility-langfuse-ui-and-python-sdk.mdx` | 8 | SDK / UI Version Compatibility |

**Keep as standalone** (too substantial or specialized to inline):
| Current File | Lines | Reason |
|---|---|---|
| `self-hosting-queue-management-bullmq-admin-api.mdx` | 180 | Detailed admin guide with API examples — keep standalone |

---

### Phase 3: Merge Related Platform / Account Management FAQs

Several short platform & administration FAQs can be consolidated into a single "Account & Platform FAQ" page.

**Proposed: "Account & Access Management" (new merged page or inline into `docs/administration/troubleshooting-and-faq.mdx`)**

| Current File | Lines | Proposed Section |
|---|---|---|
| `where-are-langfuse-api-keys.mdx` | 16 | Finding Your API Keys |
| `where-is-my-project.mdx` | 33 | Finding Your Project (EU vs US, email) |
| `cannot-see-organization.mdx` | 42 | Cannot See Organization |
| `inviting-in-langfuse.mdx` | 40 | Inviting Team Members |
| `forgot-password.mdx` | 18 | Password Reset |
| `delete-account-langfuse.mdx` | 20 | Deleting Your Account |
| `enforcing-2fa.mdx` | 8 | Enforcing Two-Factor Authentication |
| `sso-har-file-export.mdx` | 57 | SSO Troubleshooting (HAR Export) |
| `limit-access-to-internal-users.mdx` | 18 | Restricting Access to Internal Users |
| `managing-different-environments.mdx` | 32 | Managing Different Environments |

**Proposed: "Billing & Pricing" (small merged page)**

| Current File | Lines | Proposed Section |
|---|---|---|
| `upgrade-langfuse.mdx` | 18 | Upgrading Your Plan |
| `cutting-costs.mdx` | 51 | Reducing Your Bill |

---

### Phase 4: Merge Related Observability FAQs

**Proposed: Merge into `docs/observability/troubleshooting-and-faq.mdx`**

| Current File | Lines | Proposed Section |
|---|---|---|
| `missing-traces.mdx` | 23 | Traces Not Appearing |
| `empty-trace-input-and-output.mdx` | 393 | **Keep standalone** — Very comprehensive guide |
| `enable-disable-tracing.mdx` | 26 | Enabling/Disabling Tracing |
| `aws-lambda-and-serverless-functions.mdx` | 26 | Serverless Functions (AWS Lambda, etc.) |
| `costs-tokens-langfuse.mdx` | 18 | Tracking Costs & Tokens |
| `tracing-data-updates.mdx` | 55 | Updating Traces & Observations |

**Keep standalone** (substantial, self-contained guides):
| Current File | Lines | Reason |
|---|---|---|
| `existing-otel-setup.mdx` | 686 | Comprehensive OTel integration guide |
| `existing-sentry-setup.mdx` | 206 | Detailed Sentry setup guide |

---

### Phase 5: Merge Related Evaluation FAQs

**Proposed: Merge into `docs/evaluation/troubleshooting-and-faq.mdx`**

| Current File | Lines | Proposed Section |
|---|---|---|
| `what-are-scores.mdx` | 60 | What Are Scores? |
| `evaluating-sessions-conversations.mdx` | 30 | Evaluating Sessions/Conversations |
| `langfuse-evaluators-on-dataset-runs.mdx` | 16 | Using Evaluators on Dataset Runs |

**Keep standalone** (substantial, self-contained):
| Current File | Lines | Reason |
|---|---|---|
| `manage-score-configs.mdx` | 101 | Detailed config management guide |
| `retrieve-experiment-scores.mdx` | 199 | Detailed API/SDK walkthrough |
| `llm-as-a-judge-migration.mdx` | 190 | Comprehensive migration guide |

---

### Phase 6: Merge Related Prompt Management FAQs

**Proposed: Merge into `docs/prompt-management/troubleshooting-and-faq.mdx`**

| Current File | Lines | Proposed Section |
|---|---|---|
| `prompt-management-langfuse.mdx` | 10 | Managing Prompts (intro) |
| `link-prompt-management-with-tracing.mdx` | 11 | Linking Prompts to Traces |
| `how-to-measure-prompt-performance.mdx` | 14 | Measuring Prompt Performance |
| `error-handling-and-timeouts.mdx` | 49 | Retries & Timeouts When Fetching Prompts |

**Keep standalone** (substantial):
| Current File | Lines | Reason |
|---|---|---|
| `old-prompt-version-caching.mdx` | 66 | Detailed caching behavior explanation |
| `using-external-templating-libraries.mdx` | 36 | Specific integration guide (Jinja, Liquid) |
| `conditional-prompt-embedding.mdx` | 54 | Detailed dynamic selection guide |

---

### Phase 7: Merge Related API FAQs

**Proposed: Single "API Troubleshooting" section in docs**

| Current File | Lines | Proposed Section |
|---|---|---|
| `api-limits.mdx` | 48 | API Limits |
| `api-524-http-errors.mdx` | 25 | 524 Timeout Errors |
| `report-feedback-bug.mdx` | 10 | Reporting Issues |
| `langfuse-support.mdx` | 10 | Getting Support |

---

### Phase 8: Simplify the Tag System

After consolidation, the tag pages become unnecessary since the troubleshooting pages in `docs/` already serve as category landing pages.

**Remove all dedicated tag pages:**
- `faq/tag/api.mdx`
- `faq/tag/cloud.mdx`
- `faq/tag/security.mdx`
- `faq/tag/self-hosting.mdx`
- `faq/tag/tracing.mdx`
- `faq/tag/integration-langchain.mdx`
- `faq/tag/integration-openai.mdx`
- `faq/tag/product.mdx`
- `faq/tag/prompt-management.mdx`
- `faq/tag/case-studies.mdx`
- `faq/tag/[tag].mdx`

The `<FaqPreview>` component and tag system can remain for use in the `docs/*/troubleshooting-and-faq.mdx` pages, but the standalone tag pages add no value.

---

### Phase 9: Simplify the FAQ Index

After consolidation, update `faq/index.mdx` to:
1. Remove the category-based `<FaqIndex />` (since tag pages are gone)
2. Keep the "Ask AI" section
3. Add direct links to the relevant troubleshooting pages in docs
4. Keep the GitHub Discussions section

---

## Summary: Net Effect

| Metric | Before | After |
|---|---|---|
| Total FAQ files | 84 | ~25-30 |
| Standalone pages (faq/all/) | 73 | ~15-20 (substantial guides kept standalone) |
| Tag pages (faq/tag/) | 11 | 0 |
| Pages removed entirely | 0 | ~12 (articles, marketing, generic content) |
| Pages moved to other sections | 0 | ~7 (comparisons, case studies) |
| Pages merged into docs troubleshooting | 0 | ~35-40 |

### Pages to Keep Standalone in `faq/all/`

These pages are substantial enough to justify remaining as standalone FAQ entries:

| File | Lines | Why Keep |
|---|---|---|
| `empty-trace-input-and-output.mdx` | 393 | Comprehensive debugging guide |
| `existing-otel-setup.mdx` | 686 | Definitive OTel integration guide |
| `existing-sentry-setup.mdx` | 206 | Detailed Sentry guide |
| `manage-score-configs.mdx` | 101 | Full config management walkthrough |
| `retrieve-experiment-scores.mdx` | 199 | Detailed API examples |
| `llm-as-a-judge-migration.mdx` | 190 | Comprehensive migration guide |
| `self-hosting-queue-management-bullmq-admin-api.mdx` | 180 | Detailed admin API reference |
| `old-prompt-version-caching.mdx` | 66 | Explains nuanced caching behavior |
| `using-external-templating-libraries.mdx` | 36 | Specific integration guide |
| `conditional-prompt-embedding.mdx` | 54 | Dynamic prompt selection guide |
| `openai-assistant-api.mdx` | 26 | Integration-specific guide |
| `custom-langchain-run-names.mdx` | 57 | Integration-specific guide |
| `cutting-costs.mdx` | 51 | Actionable billing guide |

### Redirects

Every removed or merged page MUST have a redirect in `next.config.mjs` pointing to the new location of the content. This preserves SEO value and prevents broken links.

---

## Implementation Order

1. **Phase 1** (relocate/remove): Lowest risk, biggest cleanup. Start here.
2. **Phase 8** (remove tag pages): Quick win after Phase 1 reduces content.
3. **Phase 2** (self-hosting merge): Highest volume of thin pages.
4. **Phase 3** (platform/account merge): Straightforward consolidation.
5. **Phases 4-7** (docs merges): Can be done incrementally per docs section.
6. **Phase 9** (simplify FAQ index): Final step after all merges are complete.
