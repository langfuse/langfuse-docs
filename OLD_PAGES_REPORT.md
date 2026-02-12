# Old Pages Report — Top 100 Least Recently Updated Pages

Generated: 2025-02-12

This report lists the 100 `.md` and `.mdx` pages in the `pages/` directory that have the **oldest last-commit date** in Git history. Use this to identify pages that may be dead, outdated, or in need of maintenance.

## Summary by Category

| Category | Count | Notes |
|---|---|---|
| Changelog | 38 | Immutable by nature — these are historical entries |
| FAQ | 20 | Many are thin (8-10 lines); may be candidates for consolidation or removal |
| Blog | 12 | Published posts — usually don't need updates, but some may reference outdated info |
| Security | 9 | Compliance/policy pages — may need periodic review |
| Guides / Videos | 8 | Video guides and cookbooks — some reference deprecated integrations |
| Integrations | 7 | **High priority** — may describe stale or unsupported integrations |
| Self-hosting | 1 | v2 docker-compose — superseded by v3 |
| Other | 5 | Index pages, 404, oss-friends |

---

## Recommended Focus Areas

### 1. Integrations (likely stale / unsupported)
These integration pages haven't been updated in a while and may reference deprecated tools or patterns:

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2025-07-14 | 40 | `pages/integrations/analytics/coval.mdx` | Coval Integration |
| 2025-07-14 | 41 | `pages/integrations/analytics/trubrics.mdx` | Trubrics Integration |
| 2025-07-14 | 108 | `pages/integrations/other/inferable.mdx` | Observability & Tracing for Inferable |
| 2025-07-14 | 118 | `pages/integrations/frameworks/mirascope.mdx` | Open Source Observability & Monitoring for Mirascope |
| 2025-07-14 | 44 | `pages/integrations/frameworks/ragas.mdx` | Langfuse Integration with Ragas |
| 2025-07-14 | 283 | `pages/integrations/frameworks/spring-ai.mdx` | Integrating Langfuse with Spring AI Using OpenTelemetry |
| 2025-07-14 | 28 | `pages/integrations/model-providers/amazon-bedrock-agents.mdx` | Integration: Amazon Bedrock Agents |

### 2. FAQ Pages (thin content / potentially removable)
Many FAQ pages are very short (8-10 lines) and may be better consolidated into main docs:

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2024-05-24 | 8 | `pages/faq/all/self-host-with-load-balancer.mdx` | Can I deploy multiple instances of Langfuse behind a load balancer? |
| 2024-05-24 | 10 | `pages/faq/tag/api.mdx` | FAQ: API |
| 2024-05-24 | 10 | `pages/faq/tag/cloud.mdx` | FAQ: Langfuse Cloud |
| 2024-05-24 | 10 | `pages/faq/tag/security.mdx` | FAQ: Security |
| 2024-05-24 | 10 | `pages/faq/tag/self-hosting.mdx` | FAQ: Self-hosting |
| 2024-05-24 | 10 | `pages/faq/tag/tracing.mdx` | FAQ: Tracing |
| 2024-05-27 | 10 | `pages/faq/tag/integration-langchain.mdx` | FAQ: Integration LangChain |
| 2024-05-28 | 10 | `pages/faq/tag/integration-openai.mdx` | FAQ: Integration OpenAI |
| 2024-06-06 | 18 | `pages/faq/all/upgrade-langfuse.mdx` | How do I upgrade my Langfuse account? |
| 2024-06-06 | 23 | `pages/faq/all/self-hosted-telemetry.mdx` | What kind of telemetry does Langfuse collect? |
| 2024-07-02 | 8 | `pages/faq/all/arm-images.mdx` | Are prebuilt ARM images available? |
| 2024-07-19 | 10 | `pages/faq/tag/product.mdx` | FAQ: Langfuse Product |
| 2024-08-06 | 10 | `pages/faq/tag/prompt-management.mdx` | FAQ: Prompt Management |
| 2024-09-29 | 118 | `pages/faq/tag/[tag].mdx` | FAQ: \<SsgTagName /> |
| 2024-12-09 | 15 | `pages/faq/all/debug-docker-deployment.mdx` | I cannot connect to my docker deployment, what should I do? |
| 2025-02-13 | 10 | `pages/faq/tag/case-studies.mdx` | Case Studies |
| 2025-02-13 | 30 | `pages/faq/all/huntr-langfuse-case-study.mdx` | How Huntr Uses Langfuse |
| 2025-02-13 | 35 | `pages/faq/all/ai-transparency-remberg-langfuse.mdx` | How Remberg Improves Transparency of AI Features with Langfuse |
| 2025-02-13 | 38 | `pages/faq/all/mava-langfuse-case-study.mdx` | How Mava Uses Langfuse |
| 2025-02-24 | 31 | `pages/faq/index.mdx` | Langfuse FAQ - Most Common Questions |

### 3. Guides & Video Pages
These may reference outdated workflows or deprecated tools:

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2024-12-18 | 30 | `pages/guides/videos/external-evaluation-pipelines.mdx` | External Evaluation Pipelines |
| 2024-12-18 | 35 | `pages/guides/videos/llm-as-a-judge-eval-on-dataset-experiments.mdx` | LLM-as-a-Judge Evaluators for Dataset Experiments |
| 2024-12-18 | 38 | `pages/guides/videos/webinar-observability-llm-systems.mdx` | Webinar: Traceability and Observability in Multi-Step LLM Systems |
| 2025-03-07 | 11 | `pages/guides/cookbook/index.mdx` | Langfuse Cookbook |
| 2025-05-18 | 89 | `pages/guides/videos/beginners-guide-to-rag-evaluation.mdx` | Beginner's Guide to RAG Evaluation with Langfuse and Ragas |
| 2025-06-17 | 164 | `pages/guides/cookbook/otel_integration_mlflow.md` | MLflow Integration via OpenTelemetry |
| 2025-07-14 | 110 | `pages/guides/cookbook/integration_llama-index-callback.md` | Cookbook LlamaIndex Integration |
| 2025-07-14 | 433 | `pages/guides/cookbook/langfuse_sdk_performance_test.md` | Langfuse SDK Performance Test |

### 4. Self-hosting (v2 — likely superseded)

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2024-12-20 | 101 | `pages/self-hosting/v2/docker-compose.mdx` | Local Deployment (v2, docker compose) |

### 5. Blog Posts (oldest, may reference outdated features)

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2024-02-19 | 31 | `pages/blog.mdx` | (blog index) |
| 2024-07-05 | 92 | `pages/blog/product-analytics-for-LLM-apps.mdx` | Launch YC |
| 2025-04-03 | 178 | `pages/blog/2025-02-20-the-agent-deep-dive-open-deep-research.mdx` | The Agent Deep Dive: David Zhang's Open Deep Research |
| 2025-04-15 | 115 | `pages/blog/announcing-our-seed-round.mdx` | Langfuse raises $4M |
| 2025-05-21 | 381 | `pages/blog/2025-05-21-customizable-dashboards.mdx` | How we Built Scalable & Customizable Dashboards |
| 2025-05-24 | 200 | `pages/blog/2025-05-19-launch-week-3.mdx` | Langfuse Launch Week #3 |
| 2025-06-30 | 75 | `pages/blog/2025-05-31-langfuse-may-update.mdx` | Langfuse May Update |
| 2025-07-06 | 99 | `pages/blog/2025-06-30-langfuse-june-update.mdx` | Langfuse June Update |
| 2025-07-14 | 142 | `pages/blog/uptrain-integration.mdx` | Langfuse adds >20 evals with UpTrain.ai integration |
| 2025-07-14 | 81 | `pages/blog/2025-02-28-langfuse-february-update.mdx` | Langfuse February Update |
| 2025-07-14 | 95 | `pages/blog/2025-03-31-langfuse-march-update.mdx` | Langfuse March Update |
| 2025-07-14 | 99 | `pages/blog/2024-09-langfuse-proxy.mdx` | Should you use an LLM Proxy to Build your Application? |

### 6. Security Pages

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2025-05-02 | 15 | `pages/security/iso27001.mdx` | ISO 27001 Compliance |
| 2025-05-02 | 15 | `pages/security/soc2.mdx` | SOC 2 Type II Compliance |
| 2025-05-02 | 26 | `pages/security/whistleblowing.mdx` | Whistleblowing |
| 2025-05-02 | 29 | `pages/security/penetration-testing.mdx` | Penetration Testing |
| 2025-05-03 | 25 | `pages/security/vulnerability-management.mdx` | Vulnerability Management |
| 2025-05-03 | 26 | `pages/security/policies.mdx` | Policies |
| 2025-05-03 | 8 | `pages/security/manage-personal-data.mdx` | Managing Personal Data |
| 2025-05-06 | 23 | `pages/security/gdpr.mdx` | GDPR Compliance |
| 2025-05-21 | 24 | `pages/security/networking.mdx` | Networking |

### 7. Changelog (oldest entries)
Changelogs are historical records and typically don't need updates. Listed for completeness:

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2023-10-07 | 13 | `pages/changelog/2023-07-19-launch.mdx` | Launch |
| 2023-10-07 | 13 | `pages/changelog/2023-08-14-public-demo-project.mdx` | Public access to Q&A chatbot project |
| 2023-10-09 | 12 | `pages/changelog/2023-10-03-complex-filters.mdx` | Complex filters |
| 2023-10-09 | 14 | `pages/changelog/2023-10-05-faster-navigation.mdx` | Navigate quickly between traces |
| 2023-10-30 | 13 | `pages/changelog/2023-10-30-ragas-cookbook.mdx` | RAGAS cookbook to evaluate RAG pipelines |
| 2023-12-16 | 12 | `pages/changelog/2023-11-15-semantic-releases.mdx` | Semantic releases |
| 2023-12-16 | 13 | `pages/changelog/2023-12-12-rename-and-transfer-projects.mdx` | Rename and transfer projects |
| 2024-03-04 | 12 | `pages/changelog/2024-02-29-performance-improvement-ui.mdx` | Upto 50x faster loading time of UI tables |
| 2024-05-23 | 13 | `pages/changelog/2024-05-23-dark-mode.mdx` | Dark Mode |
| 2024-07-03 | 33 | `pages/changelog/2024-07-03-models-api.mdx` | Models API |
| 2024-09-28 | 19 | `pages/changelog/2024-09-20-aws-marketplace.mdx` | Langfuse on AWS Marketplace |
| 2024-11-20 | 28 | `pages/changelog/2024-11-17-llms-txt.mdx` | llms.txt |
| 2024-11-29 | 38 | `pages/changelog/2024-11-28-google-vertex-ai-support-playground-evals.mdx` | Google Vertex AI support for LLM Playground and Evaluations |
| 2024-12-09 | 17 | `pages/changelog/2024-04-13-images-on-docker-hub.mdx` | Docker images on Docker Hub |
| 2025-02-15 | 23 | `pages/changelog/2025-02-14-oss-llmops-stack.mdx` | Open Source LLMOps Stack |
| 2025-02-25 | 26 | `pages/changelog/2025-02-25-claude-3-7-support.mdx` | Claude 3.7 Sonnet support |
| 2025-03-03 | 53 | `pages/changelog/2025-03-03-langfuse-java-client.mdx` | Langfuse Java Client |
| 2025-03-04 | 12 | `pages/changelog/2025-03-04-dataset-items-duplicate-and-add-to-many.mdx` | Dataset items: Duplicate and add to many |
| 2025-03-31 | 22 | `pages/changelog/2025-03-31-gemini-2.5-pro-exp-support.mdx` | Playground support for Gemini 2.5 Pro Experimental |
| 2025-04-15 | 15 | `pages/changelog/2024-08-15-deployment-as-porter-add-on.mdx` | Deployment via Porter |
| 2025-04-15 | 24 | `pages/changelog/2025-04-15-4.1-support.mdx` | OpenAI 4.1 support |
| 2025-04-17 | 28 | `pages/changelog/2025-04-16-o3-o4-mini-support.mdx` | OpenAI o3 and o4-mini integration |
| 2025-05-02 | 17 | `pages/changelog/2024-04-10-ISO-27001-certification.mdx` | ISO 27001 certification |
| 2025-05-02 | 23 | `pages/changelog/2024-04-30-SOC-2-Type-2-certification.mdx` | SOC 2 Type II certification |
| 2025-05-22 | 24 | `pages/changelog/2025-05-22-claude-4-support.mdx` | Claude Sonnet and Opus 4 support |
| 2025-06-11 | 24 | `pages/changelog/2025-06-10-o3-pro-support.mdx` | OpenAI o3-pro support |
| 2025-06-25 | 31 | `pages/changelog.mdx` | (changelog index) |
| 2025-06-30 | 18 | `pages/changelog/2025-06-23-exports-datasets-audit-logs.mdx` | Exports of Datasets and Audit Logs |
| 2025-06-30 | 41 | `pages/changelog/2025-06-28-agentic-onboarding-and-docs-mcp.mdx` | Agentic Onboarding & Docs MCP Server |
| 2025-07-14 | 13 | `pages/changelog/2023-08-30-integration-langchain-js.mdx` | Langchain integration (Javascript) |
| 2025-07-14 | 19 | `pages/changelog/2023-11-13-support-for-langchain-expression-language.mdx` | Support for Langchain Expression Language (LCEL) |
| 2025-07-14 | 27 | `pages/changelog/2024-04-08-langchain-streaming-and-batch.mdx` | Support for LangChain async, batch and streaming interfaces |
| 2025-07-14 | 28 | `pages/changelog/2024-05-29-openai-assistants.mdx` | New Cookbook: Tracing OpenAI Assistants API |
| 2025-07-14 | 39 | `pages/changelog/2024-10-11-bedrock-support-playground-evals.mdx` | Amazon Bedrock support for LLM Playground and Evaluations |
| 2025-07-14 | 40 | `pages/changelog/2024-08-08-openai-structured-outputs.mdx` | Tracing of OpenAI Structured Outputs |
| 2025-07-14 | 49 | `pages/changelog/2024-03-05-uptrain-integration.mdx` | Uptrain.ai integration (cookbook) |
| 2025-07-14 | 60 | `pages/changelog/2024-04-21-openai-integration-JS-SDK.mdx` | OpenAI SDK integration for JS/TS SDK |
| 2025-07-14 | 77 | `pages/changelog/2025-06-27-improved-json-handling-langchain-prompts.mdx` | Improved JSON Handling in LangChain Prompts |

### 8. Other Pages

| Last Updated | Lines | File | Title |
|---|---|---|---|
| 2024-12-08 | 14 | `pages/404.mdx` | 404: Page Not Found |
| 2025-02-24 | 8 | `pages/index.mdx` | Langfuse - Open Source LLM Engineering Platform |
| 2025-05-02 | 55 | `pages/oss-friends.mdx` | OSS Friends |

---

## Recommendations

### Candidates for Removal
1. **FAQ tag pages** (`pages/faq/tag/*.mdx`) — These are mostly 10-line template pages. Consider whether this FAQ tag system is still needed.
2. **Thin FAQ content pages** — `self-host-with-load-balancer`, `arm-images`, `upgrade-langfuse`, `debug-docker-deployment` — very short, potentially duplicating self-hosting docs.
3. **`pages/self-hosting/v2/docker-compose.mdx`** — v2 is superseded; redirect to v3 docs.
4. **`pages/blog/uptrain-integration.mdx`** and **`pages/changelog/2024-03-05-uptrain-integration.mdx`** — UpTrain.ai may no longer be actively maintained.
5. **`pages/integrations/analytics/coval.mdx`** and **`pages/integrations/analytics/trubrics.mdx`** — Check if these integrations are still relevant.

### Candidates for Review / Update
1. **Integration pages** — All 7 integration pages should be reviewed for accuracy against current SDK versions.
2. **Security pages** — Last updated May 2025; should be reviewed periodically for compliance accuracy.
3. **Case study pages** — The Huntr, Remberg, and Mava case studies haven't been touched since Feb 2025.
4. **`pages/blog/product-analytics-for-LLM-apps.mdx`** — Last updated July 2024; the oldest non-changelog content page.

### Safe to Keep (no action needed)
- **Changelog entries** — These are historical records and don't need updating.
- **Blog posts** — Published content that remains a historical record (though some may benefit from "updated" banners if they reference deprecated features).
- **`pages/404.mdx`** and **`pages/index.mdx`** — Core pages, just haven't needed edits.
