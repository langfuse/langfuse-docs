# Langfuse November 2026 update: sources

Window: November 1 to November 27, 2026 (run on 2026-11-27; the October edition went out from Loops on Nov 6 as "October Product Update 2026").
Already sent to the same list this month: "Langfuse launches AI Gateway" (Nov 9) and "Introducing: Langfuse Topics" (Nov 26), so both get short recap sections here, not a re-launch.

## a) Features and product changes (langfuse.com/changelog)

| Date | Title | URL | One-liner |
| --- | --- | --- | --- |
| Nov 2 | Send Langfuse alerts to PagerDuty | https://langfuse.com/changelog/2026-11-02-pagerduty-integration | Alerts, project notifications, and prompt changes as PagerDuty events; US and EU accounts. |
| Nov 3 | Continue observations queries that would otherwise time out | https://langfuse.com/changelog/2026-11-03-observations-api-continuation | Short or empty pages can carry a continuation cursor; keep paging until `meta.cursor` is absent. |
| Nov 3 | Skill Management in Langfuse | https://langfuse.com/changelog/2026-11-03-skill-management | Beta announcement (already the October lead feature). Beta badge removed in v4.85.0. |
| Nov 4 | Launching the Langfuse AI Gateway | https://langfuse.com/changelog/2026-11-04-ai-gateway-public-beta | Public beta: swap base URL and key, per-user gateway keys, cost per user/key/model, every call traced. |
| Nov 6 | See when token usage is missing | https://langfuse.com/changelog/2026-11-06-retiring-tokenization | Automatic tokenization retired; generation header flags missing usage with fix guidance. |
| Nov 6 | Connect your S3 buckets with an IAM role | https://langfuse.com/changelog/2026-11-06-s3-iam-role-auth | Blob exports and External Media Storage can assume an IAM role (Enterprise). |
| Nov 10 | Call Amazon Bedrock models through the AI Gateway | https://langfuse.com/changelog/2026-11-10-ai-gateway-bedrock | Bedrock as gateway provider. |
| Nov 10 | Call OpenRouter, Vercel AI Gateway, and xAI models through the AI Gateway | https://langfuse.com/changelog/2026-11-10-ai-gateway-openrouter-vercel-xai | Three more providers. |
| Nov 10 | Run code evaluators on your own executor | https://langfuse.com/changelog/2026-11-10-code-evaluators-on-your-own-executor | Self-hosted: `LANGFUSE_CODE_EVAL_DISPATCHER=external` sends evaluations to your HTTP executor. |
| Nov 11 | Route AI Gateway connections through your own endpoint | https://langfuse.com/changelog/2026-11-11-ai-gateway-custom-base-url | Custom base URL for OpenAI and Anthropic connections. |
| Nov 11 | Call decision models through the AI Gateway | https://langfuse.com/changelog/2026-11-11-ai-gateway-openai-decisions | OpenAI Decisions API served at `/openai/v1/decisions`. |
| Nov 11 | Create embeddings through the AI Gateway | https://langfuse.com/changelog/2026-11-11-ai-gateway-openai-embeddings | OpenAI Embeddings API at `/openai/v1/embeddings`. |
| Nov 11 | Set the default evaluation model and run batch evaluations via MCP | https://langfuse.com/changelog/2026-11-11-default-evaluation-model-and-batch-evaluation-via-mcp | New MCP tools: get/set/delete default evaluation model, `runBatchEvaluation`. |
| Nov 12 | Call Microsoft Azure and Google AI Studio models through the AI Gateway | https://langfuse.com/changelog/2026-11-12-ai-gateway-azure-google-ai-studio | Two more providers. |
| Nov 13 | Restrict models per AI Gateway key | https://langfuse.com/changelog/2026-11-13-ai-gateway-key-model-restrictions | Model patterns such as `openai-prod:*` per gateway key. |
| Nov 13 | Call Google Vertex AI models through the AI Gateway | https://langfuse.com/changelog/2026-11-13-ai-gateway-vertex-ai | Gemini and open models on Vertex AI (Chat Completions endpoint). |
| Nov 13 | Evaluate with Gemini decision models | https://langfuse.com/changelog/2026-11-13-gemini-decision-model-evaluators | `gemini-decision-1` via Google AI Studio connection. |
| Nov 17 | Read-access audit logs | https://langfuse.com/changelog/2026-11-17-read-access-audit-logs | Record who read traces, observations, scores, sessions, experiments (UI, API, MCP). |
| Nov 18 | Connect Amazon Bedrock with an IAM role | https://langfuse.com/changelog/2026-11-18-bedrock-iam-role-auth | Bedrock LLM connections assume an IAM role (Enterprise). |
| Nov 19 | Cap AI Gateway spend with budgets | https://langfuse.com/changelog/2026-11-19-ai-gateway-budgets | Budgets per key, per user, defaults, and organization-wide. |
| Nov 19 | Disable public sharing of traces and sessions | https://langfuse.com/changelog/2026-11-19-disable-public-sharing | Org setting plus `LANGFUSE_DISABLE_PUBLIC_SHARING` for self-hosted. |
| Nov 20 | Redesigned trace view | https://langfuse.com/changelog/2026-11-20-redesigned-trace-view | Many small steps; before/after video; same layout in full page, peek, small screens. |
| Nov 24 | Cluster your traces into topics | https://langfuse.com/changelog/2026-11-24-topics | Topics public beta: Intent, Sentiment, Outcome, Issues facets; live maps and snapshots. |
| Nov 25 | Reset AI Gateway budget spend and set warnings | https://langfuse.com/changelog/2026-11-25-ai-gateway-budget-warnings-and-resets | Reset spend without changing limits; 85% and 95% email warnings. |
| Nov 25 | Manage decision-model evaluators via the API | https://langfuse.com/changelog/2026-11-25-decision-model-evaluators-api | `type: "decision_model"` on `/api/public/v2/evaluators`. |
| Nov 26 | Langfuse skills via MCP | https://langfuse.com/changelog/2026-11-26-mcp-bundled-skills | MCP server bundles the official Langfuse agent skills via the MCP Skills extension. |
| Nov 26 | Filter observations by numeric metadata values | https://langfuse.com/changelog/2026-11-26-numeric-metadata-filters | `>`, `<`, `>=`, `<=`, `=` on metadata in table, dashboards, alerts, API, MCP. |
| Nov 27 | Organization-level model definitions | https://langfuse.com/changelog/2026-11-27-organization-model-definitions | Define model prices once per organization; project > org > Langfuse defaults. |

## b) GitHub releases (langfuse/langfuse, v4.73.0 to v4.88.0, Nov 3 to Nov 26)

Feature bullets not covered by a changelog entry (candidates for Fixes & Improvements):

- UX: Filter search bar suggests field values while typing (v4.84.0, #20537)
- UX: Cmd+K offers Halo for unmatched queries (v4.83.0, #20301)
- UX: Collapse large filter value groups (v4.83.0, #20114)
- UX: Searchable organization and project switcher (v4.76.0, #14211)
- UX: Toggle the sidebar from its right border (v4.87.0, #20881)
- Sessions: Chronological session list view (v4.76.0, #19650); session tab in trace peek view (#19301); custom view persistence (v4.81.0, #19736); unified session and trace view for session table (v4.85.0, #20373); sticky session navigation in messages view (v4.88.0, #20964)
- Datasets: Filter dataset items by status (v4.81.0, #20186)
- Annotation queues: Navigate between items from the single item view (v4.83.0, #20120); sort queue list by name or creation time (#20424); show all scores on queue items (v4.84.0, #20491); embed updated session view (#19225)
- API keys: Developer preset, Ingestion renamed to Application (v4.82.0, #20201); onboarding key created as a named Developer key (v4.88.0, #20603); key masking in UI (v4.80.0, #20151)
- MCP: `batchCreateScores` (v4.83.0, #20453); `batchCreateAnnotationQueueItems` (v4.84.0, #20477); charts rendered inline as an interactive MCP App (v4.86.0, #20727, #20797); numeric metadata filters in observation tools (#20751); serve the 2026-07-28 MCP protocol revision (#20384)
- Prompts: Remove labels from a prompt version via API and MCP (v4.80.0, #20126)
- Skills: Skill management out of beta (v4.85.0, #20715); version automations (v4.73.0, #19296); filter skills by SKILL.md frontmatter keys (#19996); Halo entry points to create, edit, improve skills (#20179); unsaved drafts kept in sessionStorage (#20122)
- Evals: Mark the evaluated observation in the sample trace view (v4.87.0, #20810); keyed state for OpenAI and Gemini decision evaluators (#20695); trace-level transcript evaluators UI (v4.86.0, #20741, likely preview)
- Monitors: Alert messages show metric value and unit (v4.77.0, #19872); new monitor automation dialog (#19448); SUBSTITUTE_OK no-data mode (#19981)
- Scores: Score config details shown from the add score menu (v4.78.0, #19997); default score configs seeded on project creation (#19911)
- Gateway (not yet in changelog): guardrails UI, regex guardrails, Bedrock Guardrails provider, redact action (v4.87.0/v4.88.0); Show traces action from Budgets and Gateway keys tables (v4.86.0); HTTP/2 to Web; per-org rate limits raised to 10k req/min on paid plans (v4.75.0); gateway shipped in self-hosted docker compose (v4.76.0)
- Topics (not yet in changelog): filter tracing table by topic, topics column (v4.80.0); cost estimate before setup (v4.85.0); Topics on self-hosted (v4.85.0); public API, MCP and Halo access (v4.76.0)
- Infra: JWT authentication mode for ClickHouse Cloud (v4.88.0, #19893); smaller web and worker images (v4.75.0, #16862); core data export includes settings and feature tables (v4.79.0, #20011)
- Perf: Native OTEL batch processing speedups (v4.85.0); prompt dependency graph loads level by level (v4.81.0); experiment score lookups bounded by start time (v4.82.0)
- Admin API: transfer projects between organizations (v4.74.0, #19587)
- Data: Legacy traces export gets opt-in field groups (v4.73.0, v3.227.0)

SDKs: Python SDK v5.2.0 (Nov 5), JS/TS SDK v6.1.1 (Nov 2). No new majors.

## c) New integrations

- PagerDuty: https://langfuse.com/integrations/other/pagerduty (Nov 3)
- Sarvam AI (Vercel AI SDK and LiveKit): https://langfuse.com/integrations/model-providers/sarvam (Nov 16)
- Coding agents via the AI Gateway (no plugin or hook needed): Claude Code and Claude Desktop, Codex, GitHub Copilot CLI and app, OpenCode, pi: https://langfuse.com/changelog/2026-11-04-ai-gateway-public-beta#coding-agents (Nov 4)
- Gateway provider pages: OpenAI, Anthropic, Amazon Bedrock, OpenRouter, Vercel AI Gateway, xAI, Microsoft Azure, Google AI Studio, Google Vertex AI (see changelog above)
- Fireworks AI integration page updated (Nov 3), not new.

## d) Blog posts

- Nov 4: How Teams in Regulated Industries Get AI Agents into Production, Annabell: https://langfuse.com/blog/2026-11-04-regulated-industries-ai-agents-production
- Nov 9: Langfuse launches AI Gateway (announcement): https://langfuse.com/blog/introducing-gateway
- Nov 18: Designing the Langfuse AI Gateway, Hassieb and Tobias (why Rust, why pass provider APIs through): https://langfuse.com/blog/2026-11-11-building-the-langfuse-ai-gateway
- Nov 19: Comfortable with being uncomfortable, Trang (design in an AI-forward team, behind the trace view redesign): https://langfuse.com/blog/2026-11-19-comfortable-with-being-uncomfortable
- Nov 19: Evaluating proactive agents, Annabell: https://langfuse.com/blog/2026-11-19-evaluating-proactive-agents
- Nov 24: Langfuse launches Topics (announcement): https://langfuse.com/blog/introducing-topics
- Oct 31: Langfuse October Update (newsletter as blog post): https://langfuse.com/blog/2026-10-31-langfuse-october-update

Customer story (Nov 20): Criteo, "How Criteo uses Langfuse to evaluate and optimize AI agents across 20 teams": https://langfuse.com/users/criteo. Quote: "At Criteo, we make decisions based on data. Evaluation through Langfuse is key to that." (Clément Charnay, Senior Software Development Engineer, Criteo). Python and C# agents, shared evaluation framework.

## e) Events

- Langfuse Community Town Hall Q4 2026, Nov 12 (online). Recording: https://www.youtube.com/watch?v=1PxJrd6NFck
- Montreal meetup, Nov 26 (past): https://luma.com/4812th4n
- Berlin team Christmas party, Dec 9 at the office: https://luma.com/langfuse-zzwn (team event; not confirmed for the newsletter)
- NOT VERIFIED: Luma (api.lu.ma) and langfuse.com/events were not reachable from this session, so upcoming December events (for example an AWS re:Invent presence) need a manual check.

## f) Job openings

NOT VERIFIED: jobs.ashbyhq.com and clickhouse.com are not reachable from this session's network. The list below is the one sent in the October edition (Nov 6) and must be checked against https://clickhouse.com/company/careers?search=langfuse before sending.

- Senior Product Engineer (US-East), Senior Backend Engineer (US-East), Product Manager, Senior Product Engineer, Integrations, Head of Marketing: https://clickhouse.com/company/careers?search=langfuse
- Senior Product Engineer: https://jobs.ashbyhq.com/clickhouse/0087feaa-a275-427d-bf4a-14a508708687
- Senior Backend Engineer: https://jobs.ashbyhq.com/clickhouse/31500bec-b690-4795-b4d6-0dce06a4c180
- Senior Cloud Infrastructure Engineer: https://jobs.ashbyhq.com/clickhouse/cf36e6db-3939-4ff0-8bcf-a3bb200d9e46
- Senior Software Engineer, SDK: https://jobs.ashbyhq.com/clickhouse/2344ae13-045c-4513-ad01-94189029c46e
- Developer Relations Engineer, Events & Community: EMEA https://jobs.ashbyhq.com/clickhouse/49953f5a-271a-492f-a8be-50b8f028fbd7, AMER https://jobs.ashbyhq.com/clickhouse/7b0174fe-f124-4db2-923f-7028f39d6be9

## g) Other company updates

- Nov 9: ClickHouse announced its platform expansion alongside the AI Gateway launch.
- Langfuse Cloud v4 cutover was announced for Nov 16; v4.82.0 (Nov 17) mentions "brownout and extended-deadline" banner copy, so the final state needs confirming before any mention.
