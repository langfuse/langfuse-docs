# Concept links

Link a Langfuse concept the first time the story actually discusses it. The visible words stay the words already in the sentence: `[LLM-as-a-judge](/docs/evaluation/evaluation-methods/llm-as-a-judge)`.

Do not add a sentence just to hold a link. Do not link the same destination twice in one section. Do not link generic words (agent, quality, "trace" as a verb, "evaluation" as a vague noun).

Open the target file and confirm the path before using it. Docs move. If a path below 404s, use the page that replaced it and say so in the PR.

## Academy

Use these when the story is talking about the practice.

| The story says                                                          | Link                                 |
| ----------------------------------------------------------------------- | ------------------------------------ |
| AI engineering loop, closing the loop, evaluation loop                  | `/academy/ai-engineering-loop`       |
| Monitoring, watching production quality, cost, or latency as a practice | `/academy/monitoring`                |
| Error analysis                                                          | `/academy/monitoring/error-analysis` |
| Building or designing a dataset, what belongs in the test set           | `/academy/datasets`                  |
| Tracing as the way the team sees what the agent did                     | `/academy/tracing`                   |

Confirm `/academy/tracing` and `/academy/datasets` still exist. They are the lifecycle pages recent written stories use.

## Docs, and do not skip these

Whenever the story mentions one of these, link it. Do not treat it as too small to link.

| The story says                                                                   | Link                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------- |
| LLM-as-a-judge, LLM as a judge, LLM judge, model grading outputs                 | `/docs/evaluation/evaluation-methods/llm-as-a-judge`    |
| Code-based evals, code evaluators, deterministic evaluators authored in Langfuse | `/docs/evaluation/evaluation-methods/code-evaluators`   |
| Self-hosting, self-host, running Langfuse in their own infrastructure            | `/self-hosting`                                         |
| Annotation queues, human review queues, manual annotation in Langfuse            | `/docs/evaluation/evaluation-methods/annotation-queues` |

There is no Academy page for annotation queues. Link the docs page. If the same passage is about the error-analysis practice, also link error analysis on that phrase.

## Running experiments is a docs link

Do not link `/academy/experiments`.

Pick the docs page that matches how the team runs them:

| How they run them                     | Link                                                         |
| ------------------------------------- | ------------------------------------------------------------ |
| In the Langfuse UI                    | `/docs/evaluation/experiments/experiments-via-ui`            |
| From the SDK or application code      | `/docs/evaluation/experiments/experiments-via-sdk`           |
| In CI                                 | `/docs/evaluation/experiments/experiments-ci-cd`             |
| Via OpenTelemetry                     | `/docs/evaluation/experiments/experiments-via-opentelemetry` |
| Comparing runs                        | `/docs/evaluation/experiments/compare-experiments`           |
| "Experiments" with no mechanism named | `/docs/evaluation/core-concepts#experiments`                 |

The `#experiments` heading on that page must still be marked `[#experiments]`.

A Langfuse dataset as a product object (item count, a managed dataset, running a suite against it) links to `/docs/evaluation/experiments/datasets`. Use the Academy datasets link for the practice of building the set. One sentence can carry both only when it talks about both.

## Other product terms

Link the first mention to the current docs page when the story is about that feature. Confirm the file. Typical ones:

- Prompt management `/docs/prompt-management/overview`
- Playground `/docs/prompt-management/features/playground`
- Prompt composability `/docs/prompt-management/features/composability`
- Prompt labels and versions `/docs/prompt-management/features/prompt-version-control`
- Scores `/docs/evaluation/evaluation-methods/scores-via-sdk`
- Sessions `/docs/observability/features/sessions`
- Public API `/docs/api-and-data-platform/features/public-api`
- CLI `/docs/api-and-data-platform/features/cli`
- MCP server `/docs/api-and-data-platform/features/mcp-server`
- Agent skill `/docs/api-and-data-platform/features/agent-skill`
- OpenTelemetry `/integrations/native/opentelemetry`

Before you finish, click one Academy link and one docs link on the rendered story. Both must be clickable and land on the page you intended.
