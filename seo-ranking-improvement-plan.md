# SEO Ranking Improvement Plan for Langfuse Documentation

## Executive Summary

This plan analyzes **82 keywords** where Langfuse pages rank in positions 4-10 (low-hanging fruit). These are grouped by unique URL, prioritized by total search volume opportunity, and each page gets specific, actionable improvement recommendations.

The improvements fall into these categories:
1. **Title & meta description optimization** — many pages have titles/descriptions that don't contain the exact target keyword
2. **Content depth & topical coverage** — thin pages that need more substantive content to compete
3. **Heading structure (H2/H3)** — adding keyword-rich headings to improve semantic relevance
4. **Internal linking** — connecting related pages to strengthen topical authority
5. **Stale links & references** — fixing outdated references that hurt credibility
6. **FAQ sections** — adding structured FAQ content to capture "People also ask" SERP features

---

## Priority Tier 1: High Volume, High Impact

These pages target keywords with the most combined search volume and realistic ranking improvement potential.

---

### 1. `/docs/evaluation/evaluation-methods/llm-as-a-judge`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| llm as a judge | 1,400 | 9 |
| llm-as-a-judge | 100 | 8 |

**Total opportunity:** ~1,500 monthly searches

**Current state:** Very thorough and well-structured page. 367 lines of content with decision trees, step-by-step setup, and debugging. However, the page is heavily focused on how-to within Langfuse and doesn't cover the general concept of "LLM-as-a-Judge" as a methodology, which is what the informational search intent expects.

**Improvements:**
- [ ] **Add a conceptual introduction section** at the top (before the Langfuse-specific setup) explaining what "LLM-as-a-Judge" is as a general methodology — its origins, how it compares to human evaluation, when it's appropriate, common rubric patterns, etc. This is what users searching "llm as a judge" are looking for.
- [ ] **Expand the "Why use LLM-as-a-Judge?" section** with more depth: cite research papers (e.g., the original "Judging LLM-as-a-Judge" paper from Zheng et al.), discuss limitations and known biases (positional bias, verbosity bias, self-enhancement bias), and mitigation strategies.
- [ ] **Add an FAQ section** at the bottom to capture "People also ask" traffic:
  - "What is LLM-as-a-Judge evaluation?"
  - "How accurate is LLM-as-a-Judge compared to human evaluation?"
  - "What are the limitations of LLM-as-a-Judge?"
  - "What models work best as LLM judges?"
- [ ] **Update meta description** to be more keyword-rich: include "LLM-as-a-Judge" early in the description, and mention it's a comprehensive guide.
- [ ] **Add a comparison table** of LLM-as-a-Judge vs. human evaluation vs. deterministic metrics to provide unique, link-worthy content.

---

### 2. `/docs/evaluation/overview`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| llm evaluation metrics | 400 | 7 |

**Total opportunity:** ~400 monthly searches

**Current state:** Very thin page (~36 lines). It's essentially just a brief intro and links to sub-pages. This is a crucial landing page for the high-intent keyword "llm evaluation metrics" but contains almost no substantive content about evaluation metrics themselves.

**Improvements:**
- [ ] **Dramatically expand content** — this should be a comprehensive overview page. Add sections covering:
  - What are LLM evaluation metrics and why they matter
  - Categories of evaluation metrics (reference-based vs reference-free, automated vs human)
  - Common metrics explained: faithfulness, relevance, coherence, toxicity, hallucination rate, answer correctness, context precision, context recall
  - When to use which metric (use case table)
  - How Langfuse supports these metrics (connecting to evaluators, experiments, scores)
- [ ] **Update the title** to include "LLM Evaluation Metrics": e.g., `title: "LLM Evaluation Metrics & Methods | Langfuse"`
- [ ] **Update the meta description** to explicitly mention "LLM evaluation metrics" and list several metric types.
- [ ] **Add a visual overview** (diagram or table) showing the evaluation ecosystem: metrics → methods → experiments → dashboards.
- [ ] **Add internal links** to the LLM-as-a-Judge page, annotation queues, scores via SDK, custom dashboards, and RAGAS integration cookbook.
- [ ] **Add an FAQ section**: "What are the most important LLM evaluation metrics?", "How do I choose the right evaluation metric?", "What is the difference between online and offline evaluation?"

---

### 3. `/faq/all/chatbot-analytics`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| chatbot analytics | 300 | 5 |
| chatbot analytics tools | 90 | 6 |
| chatbot analytics platform | 70 | 9 |

**Total opportunity:** ~460 monthly searches

**Current state:** Decent article (~183 lines) but uses some outdated internal links (e.g., `/docs/tracing`, `/docs/scores/user-feedback`, `/docs/analytics/overview`, `/docs/scores/model-based-evals`). The code examples use older SDK patterns. The page title uses "Chatbot Monitoring" rather than "Chatbot Analytics."

**Improvements:**
- [ ] **Update the page title** to lead with the primary keyword: `title: "Chatbot Analytics: Monitor, Evaluate & Improve Your AI Chatbot"`
- [ ] **Fix outdated internal links** throughout the page:
  - `/docs/tracing` → `/docs/observability/overview`
  - `/docs/scores/user-feedback` → `/docs/evaluation/evaluation-methods/scores-via-ui` or user feedback page
  - `/docs/analytics/overview` → `/docs/metrics/overview`
  - `/docs/scores/model-based-evals` → `/docs/evaluation/evaluation-methods/llm-as-a-judge`
  - `/docs/scores/external-evaluation-pipelines` → update to current path
  - `/docs/prompts/get-started` → `/docs/prompt-management/get-started`
  - `/docs/get-started` → `/docs/observability/get-started`
- [ ] **Add a "Chatbot Analytics Tools" section** explicitly comparing categories of tools (observability platforms, A/B testing tools, feedback collection, etc.) to target the "chatbot analytics tools" keyword.
- [ ] **Add a "Chatbot Analytics Platform" section** explaining what to look for in a platform, with Langfuse positioned as a solution.
- [ ] **Update code examples** to use the latest SDK patterns (OTel-based SDK v3).
- [ ] **Add a section on key chatbot metrics** with specific examples: session duration, messages per session, user satisfaction score, resolution rate, escalation rate, cost per conversation.
- [ ] **Add structured FAQ** at the bottom targeting "People also ask" results.

---

### 4. `/docs/security-and-guardrails`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| llm guard | 300 | 4 |
| security guardrails | 80 | 9 |

**Total opportunity:** ~380 monthly searches

**Current state:** Good page (~190 lines) with a PII anonymization example. However, the title is "LLM Security & Guardrails" and doesn't explicitly mention "LLM Guard" as a concept. The page could benefit from more breadth covering different types of guardrails.

**Improvements:**
- [ ] **Update meta description** to include both "LLM Guard" and "security guardrails" keywords explicitly.
- [ ] **Expand the "Run-time security measures" section** with more detail on each library, especially LLM Guard — add a subsection dedicated to LLM Guard with setup instructions, since this is the primary keyword driving traffic.
- [ ] **Add a section on types of guardrails** with a comparison table: input guardrails, output guardrails, content filtering, PII detection, prompt injection detection, topic restriction. This provides the conceptual coverage users searching "security guardrails" are looking for.
- [ ] **Add more code examples** beyond PII — show prompt injection detection and toxicity filtering examples.
- [ ] **Add a comparison table** of guardrail libraries (LLM Guard, NeMo Guardrails, Lakera, Azure Content Safety) with features, pros/cons.
- [ ] **Add FAQ section**: "What is LLM Guard?", "How do guardrails work for LLMs?", "What are the best practices for LLM security?"
- [ ] **Fix stale link**: `/docs/tracing` → `/docs/observability/overview` (line 43)

---

### 5. `/docs/observability/overview`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| observability tracing | 150 | 9 |
| application tracing | 90 | 6 |
| application tracing tools | 60 | 6 |
| application traces | 50 | 10 |
| tracing observability | 30 | 7 |
| tracing solution | 30 | 9 |

**Total opportunity:** ~410 monthly searches

**Current state:** Relatively thin page (~38 lines). It's a short intro and a few getting-started links. For keywords like "application tracing" and "observability tracing" with informational intent, the page doesn't provide enough conceptual depth.

**Improvements:**
- [ ] **Expand significantly** — add substantive sections:
  - What is application tracing and why it matters for LLM apps
  - How tracing differs for LLM applications vs traditional applications
  - Key concepts: spans, traces, observations, distributed tracing
  - What to look for in a tracing solution (checklist/comparison)
  - How Langfuse tracing works (architecture overview)
- [ ] **Update the title tag** to include more target keywords: `title: "LLM Application Tracing & Observability (Open Source)"`
- [ ] **Update meta description** to include "application tracing", "observability", and "tracing solution" keywords.
- [ ] **Add a feature comparison table** of Langfuse tracing capabilities vs. other solutions to target "application tracing tools."
- [ ] **Add a "Why Langfuse for tracing" section** with concrete benefits: open-source, auto-instrumentation, multi-framework support, cost tracking, etc.
- [ ] **Add internal links** to related pages: data model, sessions, environments, trace IDs, sampling, SDK overview.
- [ ] **Add an FAQ section**: "What is application tracing?", "What is the difference between observability and tracing?", "What are the best application tracing tools?"

---

### 6. `/guides/cookbook/evaluation_of_rag_with_ragas`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| ragas metrics | 250 | 4 |
| ragas evaluation | 150 | 6 |
| ragas score | 10 | 4 |

**Total opportunity:** ~410 monthly searches

**Current state:** This is a generated cookbook page (from Jupyter notebook). It's a solid technical walkthrough but lacks conceptual depth about Ragas metrics themselves. The title is "Evaluation of RAG pipelines with Ragas" — doesn't mention "ragas metrics" directly.

**Improvements:**
- [ ] **Update the notebook title/metadata** to include "Ragas Metrics": e.g., `title: "Ragas Metrics: Evaluate RAG Pipelines with Langfuse"`
- [ ] **Add an introductory section** (in the notebook) explaining each Ragas metric in detail before diving into code: faithfulness, answer relevancy, context precision, context recall, harmfulness. Include what each metric measures, how it's calculated, and when to use it.
- [ ] **Update the meta description** to explicitly mention "ragas metrics", "ragas evaluation", and "ragas score".
- [ ] **Add a Ragas metrics comparison table** showing all available metrics, their input requirements, and typical use cases.
- [ ] **Ensure Ragas library version is current** — check if the code examples still work with the latest Ragas version.
- [ ] **Add a section on interpreting Ragas scores** — what's a good faithfulness score? What thresholds should teams aim for?
- [ ] **Link to the Ragas docs** more prominently and add Langfuse-specific context for each metric.

---

### 7. `/docs/metrics/features/custom-dashboards`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| customizable dashboards | 150 | 9 |
| customized dashboards | 60 | 6 |
| custom made dashboards | 30 | 10 |

**Total opportunity:** ~240 monthly searches

**Current state:** Well-structured page (~167 lines) with video demos and detailed feature descriptions. However, the title is "Custom Dashboards" and doesn't use the keyword variants "customizable" or "customized."

**Improvements:**
- [ ] **Update the title** to include keyword variants: `title: "Customizable Dashboards for LLM Applications"` or `title: "Custom & Customizable Dashboards"`
- [ ] **Update meta description** to use "customizable dashboards" and "customized dashboards" naturally.
- [ ] **Add a general intro section** about what customizable dashboards are and why they matter for LLM monitoring (before diving into Langfuse-specific features). This helps with the generic keyword intent.
- [ ] **Fix stale internal link** on line 101: `/docs/tracing-features/tags` → `/docs/observability/features/tags`
- [ ] **Fix stale internal link** on lines 12, 27: `/docs/tracing-data-model` → `/docs/observability/data-model`
- [ ] **Add more real-world dashboard screenshots** showing actual metric visualizations to increase engagement and reduce bounce rate.
- [ ] **Add a section on when to use custom dashboards** vs. the built-in Langfuse dashboards, with concrete examples for different team roles (engineering, product, leadership).

---

## Priority Tier 2: Medium Volume, Good Potential

---

### 8. `/blog/2025-10-21-testing-llm-applications`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| llm testing | 200 | 6 |

**Total opportunity:** ~200 monthly searches

**Current state:** Good blog post (~298 lines) with practical examples. Title is "Testing for LLM Applications: A Practical Guide" which is close but doesn't lead with "LLM Testing."

**Improvements:**
- [ ] **Update the title** to lead with the primary keyword: `title: "LLM Testing: A Practical Guide to Automated Testing for LLM Applications"`
- [ ] **Update meta description** to include "LLM testing" prominently.
- [ ] **Add a broader introduction** about the landscape of LLM testing — categories of tests (unit, integration, end-to-end), testing frameworks, and where Langfuse fits.
- [ ] **Add a section comparing LLM testing tools** — Langfuse experiments, Promptfoo, DeepEval, Ragas, etc.
- [ ] **Add FAQ section**: "How do you test LLM applications?", "What is LLM testing?", "How to automate LLM testing?"
- [ ] **Add internal links** to evaluation overview, experiments via SDK, datasets pages.

---

### 9. `/guides/cookbook/example_intent_classification_pipeline`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| intent classification | 150 | 4 |

**Total opportunity:** ~150 monthly searches. Position 4 is very close to top 3!

**Current state:** Generated cookbook page. Technical walkthrough with both supervised and unsupervised approaches. Title is "Guide - Building an intent classification pipeline."

**Improvements:**
- [ ] **Update the title/metadata** to lead with "Intent Classification": `title: "Intent Classification for LLM Applications with Python"`
- [ ] **Update meta description** to focus on "intent classification" and mention both supervised and unsupervised approaches.
- [ ] **Add a conceptual introduction** explaining what intent classification is, why it's important, and common approaches — this helps match the informational intent of searchers.
- [ ] **Add a visual diagram** showing the intent classification pipeline flow.
- [ ] **Update the notebook to use the latest SDK** — currently uses `langfuse<3.0.0` which is outdated.
- [ ] **Add a section on practical applications** — customer support routing, chatbot intent detection, query categorization.

---

### 10. `/blog/2024-07-ai-agent-observability-with-langfuse`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| agent monitoring | 150 | 10 |

**Total opportunity:** ~150 monthly searches

**Current state:** Good comprehensive blog post about AI agent observability. Title is "AI Agent Observability with Langfuse" — doesn't use "agent monitoring."

**Improvements:**
- [ ] **Update the title and H1** to include "agent monitoring": `title: "AI Agent Monitoring & Observability with Langfuse"`
- [ ] **Update meta description** to include "agent monitoring" keyword.
- [ ] **Add a dedicated "Agent Monitoring" section** that specifically covers monitoring agents in production: key metrics to track, alerting, dashboards for agent performance.
- [ ] **Update the date/content** — the blog post date shows March 2025, ensure all framework versions and integration references are current.
- [ ] **Add links to newer integrations** — OpenAI Agents SDK, CrewAI, Google ADK if available.
- [ ] **Fix stale internal links**: `/docs/tracing`, `/docs/datasets/overview`, `/docs/model-usage-and-cost`, `/docs/scores/overview` → update to current paths.

---

### 11. `/faq/all/what-is-LCEL`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| langchain expression language | 100 | 9 |
| lcel langchain | 100 | 9 |

**Total opportunity:** ~200 monthly searches

**Current state:** Very thin page (~29 lines). Just a brief description with pros/cons lists. Not nearly enough content to compete for these keywords.

**Improvements:**
- [ ] **Significantly expand the content**:
  - Add a detailed explanation of LCEL syntax with code examples
  - Show how to build a simple chain with LCEL
  - Compare LCEL vs. traditional LangChain chain building
  - Add a section on LCEL and Langfuse — how to trace LCEL chains
  - Add real-world use cases
- [ ] **Fix the broken heading** on line 15: "Advantages of LCEL (LangChain Expression Language" — missing closing parenthesis.
- [ ] **Add code examples** showing LCEL patterns with Langfuse tracing.
- [ ] **Add internal links** to the LangChain integration page, cookbook examples.
- [ ] **Add FAQ section**: "What is LCEL?", "Is LCEL required to use LangChain?", "How does LCEL compare to standard Python?"

---

### 12. `/self-hosting/security/authentication-and-sso`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| self hosted sso | 90 | 6 |
| selfhosted sso | 20 | 4 |

**Total opportunity:** ~110 monthly searches

**Improvements:**
- [ ] **Update title/meta description** to include "self-hosted SSO" as a keyword.
- [ ] **Add a conceptual intro** about why self-hosted SSO matters (security, compliance, enterprise requirements).
- [ ] **Add a comparison** of SSO providers supported (SAML, OIDC) with setup complexity ratings.
- [ ] **Add FAQ section**: "How to set up SSO for self-hosted applications?", "What SSO providers are supported?"

---

### 13. `/integrations/frameworks/langchain`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| langchain tracing | 80 | 5 |
| langchain callbacks | 40 | 8 |
| langchain tracer | 30 | 8 |
| langchain callback | 20 | 6 |
| langchain callback manager | 0 | 9 |

**Total opportunity:** ~170 monthly searches

**Current state:** Very comprehensive integration page (~920+ lines). Well-structured with Python/JS tabs and multiple examples.

**Improvements:**
- [ ] **Update meta description** to include "langchain tracing", "langchain callbacks" more prominently.
- [ ] **Add a dedicated "LangChain Callbacks" section** early in the page that explains the callback mechanism, since multiple keywords target this concept.
- [ ] **Add a "LangChain Tracing" heading** (H2) near the top to capture that keyword more explicitly.
- [ ] **Add a brief comparison** of Langfuse's LangChain integration vs. LangSmith tracing.
- [ ] **Add FAQ section**: "How do LangChain callbacks work?", "What is LangChain tracing?", "How to debug LangChain applications?"

---

### 14. `/self-hosting/deployment/infrastructure/clickhouse`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| hosted clickhouse | 100 | 9 |
| clickhouse configuration | 50 | 7 |
| clickhouse/clickhouse-server | 40 | 9 |
| clickhouse azure | 30 | 8 |
| clickhouse server | 20 | 9 |

**Total opportunity:** ~240 monthly searches

**Improvements:**
- [ ] **Update title** to include more keywords: `title: "ClickHouse Server Configuration & Hosting for Langfuse"`
- [ ] **Add sections on different hosting options** — self-managed ClickHouse server, ClickHouse Cloud, Azure ClickHouse, AWS ClickHouse — to capture the "hosted clickhouse" and "clickhouse azure" keywords.
- [ ] **Add ClickHouse configuration best practices** — recommended settings, performance tuning, common gotchas.
- [ ] **Add FAQ section**: "How to host ClickHouse?", "What is ClickHouse configuration?", "How to run ClickHouse on Azure?"

---

## Priority Tier 3: Branded/Integration Keywords (Niche but Valuable)

These target branded product keywords where Langfuse ranks for integration pages. The improvement strategy is different — it's about ensuring the page provides genuine value to someone searching for these products.

---

### 15. `/integrations/no-code/flowise`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| flowise | 3,900 | 7 |

**Current state:** Short page (~94 lines). Basic integration guide.

**Improvements:**
- [ ] **Add a more detailed "What is Flowise?" section** with features, use cases, and why someone would use Flowise (this serves the informational intent of people searching "flowise").
- [ ] **Add screenshots** of Flowise + Langfuse in action.
- [ ] **Expand the integration guide** with more use cases and troubleshooting tips.
- [ ] **Add a section on monitoring Flowise applications** — key metrics, common issues, optimization tips.
- [ ] **Update meta description** to be more descriptive about Flowise itself, not just the integration.

---

### 16. `/integrations/other/promptfoo`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| promptfoo | 3,000 | 6 |

**Current state:** Good integration page (~151 lines) but focused narrowly on prompt management integration.

**Improvements:**
- [ ] **Add a comprehensive "What is Promptfoo?" section** — explain the tool's full capabilities (red teaming, vulnerability scanning, evaluations) to match the informational intent.
- [ ] **Expand the integration coverage** — show how Langfuse tracing data can be used with Promptfoo evaluations, not just prompt management.
- [ ] **Add comparison section** — how Promptfoo + Langfuse complement each other.
- [ ] **Add more code examples** showing end-to-end workflows.

---

### 17. `/integrations/no-code/lobechat`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| lobechat | 1,800 | 6 |

**Current state:** Short integration page (~88 lines).

**Improvements:**
- [ ] **Add a comprehensive "What is LobeChat?" section** — features, capabilities, and why it's popular.
- [ ] **Add more detail on what Langfuse captures** from LobeChat — specific metrics, trace structure, what insights you can gain.
- [ ] **Add troubleshooting section** — common issues when integrating LobeChat with Langfuse.
- [ ] **Add use cases** — "Why monitor LobeChat with Langfuse?" with concrete examples.

---

### 18. `/faq/all/llm-analytics-101`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| llm analytics | 60 | 5 |

**Current state:** Older article (~82 lines). References gpt-3.5-turbo and uses outdated SDK patterns and links.

**Improvements:**
- [ ] **Update all internal links** to current paths
- [ ] **Update code examples** to use current SDK
- [ ] **Update model references** from gpt-3.5-turbo to current models
- [ ] **Expand the metrics section** with more detailed examples and screenshots
- [ ] **Add a section on LLM analytics tools** and where Langfuse fits in the landscape
- [ ] **Add dashboard screenshots** from Langfuse showing real analytics views

---

### 19. `/integrations/frameworks/haystack`

**Keywords:**
| Keyword | Volume | Position |
|---------|--------|----------|
| haystack python | 50 | 7 |
| python haystack | 30 | 6 |
| pip install haystack | 10 | 6 |

**Total opportunity:** ~90 monthly searches

**Improvements:**
- [ ] **Add a more comprehensive "What is Haystack?" section** — explain the framework, its key features, when to use it
- [ ] **Add a section on Haystack components** — pipelines, agents, retrievers, and how they appear in Langfuse traces
- [ ] **Include `pip install` instructions** more prominently since people are searching for that
- [ ] **Add FAQ**: "How to install Haystack?", "What is Haystack Python framework?"

---

## Priority Tier 4: Quick Wins (Minimal Effort, Some Gain)

These are smaller fixes that can be done quickly:

### 20. `/docs/ask-ai`
- **Keyword:** "aask ai" (typo query), Vol 150, Pos 7
- **Fix:** Update title and meta description: `title: "Ask AI - Langfuse AI Assistant"`, `description: "Ask AI questions about Langfuse features, integrations, and best practices using our AI assistant."`
- This is primarily a typo keyword so limited optimization possible, but ensuring the title/description are strong helps.

### 21. `/docs/observability/features/trace-ids-and-distributed-tracing`
- **Keywords:** "tracer id" (50, pos 7), "tracing id" (20, pos 1, already great)
- **Fix:** Add a brief intro explaining what a trace ID / tracer ID is in general terms before diving into Langfuse specifics.

### 22. `/docs/prompt-management/features/folders`
- **Keyword:** "prompt folder" (20, pos 4)
- **Fix:** Update title to include "prompt folder" if not already present. Add brief conceptual intro about organizing prompts in folders.

### 23. `/self-hosting/deployment/infrastructure/blobstorage`
- **Keywords:** "s3 blob storage" (60, pos 4), "s3 blob" (20, pos 4)
- **Fix:** Update title/description to mention "S3 blob storage". Add intro section about what blob storage is and why it's needed.

### 24. `/self-hosting/deployment/docker-compose`
- **Keywords:** "docker compose ui" (50, pos 9), "running docker compose" (20, pos 9), "self hosted docker" (20, pos 9)
- **Fix:** Add a brief general intro about Docker Compose deployment. Ensure the title mentions "Docker Compose" prominently.

### 25. `/self-hosting/deployment/infrastructure/cache`
- **Keyword:** "redis environment variables" (60, pos 9)
- **Fix:** Add a section or heading specifically about Redis environment variables with a clear table of all supported env vars.

### 26. `/guides/cookbook/evaluation_with_langchain`
- **Keyword:** "langchain evaluation" (80, pos 7)
- **Fix:** Update title/metadata to lead with "LangChain Evaluation". Add conceptual intro about evaluating LangChain applications.

### 27. `/faq/all/best-phoenix-arize-alternatives`
- **Keywords:** "arize phoenix" (1000, pos 12 — dropped), "phoenix arize" (250, pos 11)
- **Fix:** These have dropped out of top 10. Refresh content with updated comparisons, current features, and recent developments. Ensure the page is comprehensive and up-to-date.

---

## Cross-Cutting Recommendations

These improvements should be applied across all pages:

### 1. Fix Stale Internal Links
Many pages reference old URL structures. A systematic link audit and update is needed:
- `/docs/tracing` → `/docs/observability/overview`
- `/docs/tracing-features/*` → `/docs/observability/features/*`
- `/docs/scores/*` → `/docs/evaluation/evaluation-methods/*`
- `/docs/analytics/overview` → `/docs/metrics/overview`
- `/docs/prompts/*` → `/docs/prompt-management/*`
- `/docs/datasets/overview` → `/docs/evaluation/experiments/datasets`
- `/docs/get-started` → `/docs/observability/get-started`
- `/docs/tracing-data-model` → `/docs/observability/data-model`

### 2. Add Structured Data / FAQ Sections
Many of these keywords trigger "People also ask" in SERP features. Adding FAQ sections at the bottom of pages (using proper heading structure) helps capture these featured snippets.

### 3. Improve Meta Descriptions
Many pages have generic meta descriptions. Each should:
- Include the primary target keyword within the first 60 characters
- Be 150-160 characters total
- Include a clear value proposition
- End with a call to action or unique differentiator

### 4. Strengthen Internal Linking
Create a web of related content by linking between:
- Evaluation overview ↔ LLM-as-a-Judge ↔ Core concepts ↔ Experiments
- Observability overview ↔ Tracing features ↔ SDK docs ↔ Integration pages
- Chatbot analytics ↔ LLM analytics ↔ Custom dashboards ↔ Agent monitoring

### 5. Update Outdated Code Examples
Several pages use `gpt-3.5-turbo` and older SDK patterns. Updating to current models and SDKs improves credibility and reduces bounce rate.

---

## Implementation Priority

| Priority | Pages | Est. Effort | Est. Impact |
|----------|-------|-------------|-------------|
| P0 | Evaluation overview, LLM-as-a-Judge, Observability overview | High | Very High |
| P1 | Chatbot analytics, Security & guardrails, RAGAS cookbook | Medium | High |
| P2 | Custom dashboards, LLM testing blog, Intent classification, LCEL FAQ | Medium | Medium |
| P3 | Integration pages (Flowise, LobeChat, Promptfoo, LangChain, Haystack) | Medium | Medium |
| P4 | Quick wins (Ask AI, trace IDs, folders, blobstorage, docker-compose, cache) | Low | Low |
| P5 | Cross-cutting (link fixes, meta descriptions, code updates) | Medium | Medium |
