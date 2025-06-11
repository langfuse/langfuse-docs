# Python SDK v3 Documentation Update List

## 1. Integration Pages Requiring OTEL Endpoint Updates

These pages still instruct users to set `OTEL_EXPORTER_OTLP_ENDPOINT` as an environment variable, which is no longer needed in SDK v3:

### Python-based integrations:
- `pages/docs/integrations/google-adk.md`
- `pages/docs/integrations/smolagents.md`
- `pages/docs/integrations/strands-agents.md`
- `pages/docs/integrations/openaiagentssdk/openai-agents.md`
- `pages/docs/integrations/openaiagentssdk/example-evaluating-openai-agents.md`
- `pages/docs/integrations/other/agno-agents.md`
- `pages/docs/integrations/llama-index/example-js-llamaindex.md` (JS example, but shows Python pattern)

### Non-Python integrations (may still need OTEL endpoint):
- `pages/docs/integrations/spring-ai.mdx` (Java)
- `pages/docs/integrations/quarkus-langchain4j.mdx` (Java)
- `pages/docs/integrations/pipecat.mdx`

### OpenTelemetry documentation:
- `pages/docs/opentelemetry/get-started.mdx`
- `pages/docs/opentelemetry/example-python-sdk.md`
- `pages/docs/opentelemetry/example-openllmetry.md`
- `pages/docs/opentelemetry/example-arize.md`
- `pages/docs/opentelemetry/example-openlit.md`

## 2. Pages with `parent_observation_id` References

These pages use the old parameter name that should be updated to `parent_span_id` in SDK v3 context:

- `pages/docs/sdk/python/decorators.mdx` (has `langfuse_parent_observation_id`)
- `pages/docs/sdk/python/low-level-sdk.md`
- `pages/docs/integrations/openai/python/assistants-api.md`
- `pages/docs/integrations/llama-index/deprecated/get-started.mdx`
- `pages/docs/tracing-features/masking.mdx`
- `pages/docs/tracing-features/tags.mdx`
- `pages/docs/tracing-features/users.mdx`
- `pages/docs/tracing-features/metadata.mdx`
- `pages/docs/tracing-features/sessions.mdx`

## 3. Remaining `Langfuse()` Constructor Updates

These pages show simple `Langfuse()` initialization that could be updated to `get_client()`:

### Blog posts (lower priority):
- `pages/blog/update-2023-09.mdx`
- `pages/blog/update-2023-08.mdx`

### Changelog entries (should remain as historical reference):
- `pages/changelog/2024-07-04-query-traces-via-sdks.mdx`
- `pages/changelog/2024-07-11-non-numeric-scores-api.mdx`
- `pages/changelog/2025-02-05-public-api-wrapper-sdks.mdx`

### Example pages showing migration between environments:
- `pages/guides/cookbook/example_data_migration.md` (uses source/dest clients - should remain)
- `pages/guides/cookbook/example_external_evaluation_pipelines.md` (remote client - should remain)

### Pages with simple initialization:
- `pages/docs/query-traces.mdx`
- `pages/docs/scores/external-evaluation-pipelines.md`

## 4. Pages with SDK v2 Tab Examples

These pages have tabs showing both v2 and v3 examples - ensure v3 examples are correct:

- `pages/docs/query-traces.mdx`
- `pages/docs/datasets/get-started.mdx`
- `pages/docs/tracing.mdx`
- `pages/docs/model-usage-and-cost.mdx`
- `pages/docs/prompts/get-started.mdx`
- `pages/docs/scores/custom.mdx`
- `pages/docs/integrations/openai/python/get-started.mdx`
- `pages/docs/integrations/langchain/tracing.mdx`
- `pages/docs/tracing-features/environments.mdx`
- `pages/docs/tracing-features/sampling.mdx`
- `pages/docs/tracing-features/masking.mdx`

## 5. Integration-Specific Updates

### LiteLLM:
- `pages/docs/integrations/litellm/tracing.mdx` - States "LiteLLM relies on the Langfuse Python SDK v2"

### LlamaIndex deprecated pages:
- All pages under `pages/docs/integrations/llama-index/deprecated/` should have clear notices about using OTEL-based integration

## 6. Documentation Already Updated ✅

These pages already have SDK v3 support or clear migration notices:

- Pages with `_**Note:** This notebook utilizes the Langfuse OTel Python SDK v3` notices
- Integration pages for: CrewAI, AutoGen, Pydantic AI, LangGraph, LlamaIndex, Semantic Kernel
- Core SDK documentation under `pages/docs/sdk/python/sdk-v3.mdx`

## 7. Priority Order for Updates

1. **High Priority**: Integration pages with OTEL endpoint instructions (Python-based)
2. **Medium Priority**: Pages with `parent_observation_id` references
3. **Low Priority**: Blog posts and changelog entries
4. **Optional**: Historical references and migration examples

## 8. Testing Recommendations

After updates, verify:
1. All Python examples use `from langfuse import ...` (not `from langfuse.decorators`)
2. Context methods use `langfuse.*` (not `langfuse_context.*`)
3. OTEL endpoint is only set for non-Python integrations or raw OTEL examples
4. Parameter names match SDK v3 conventions (`parent_span_id` instead of `parent_observation_id`)

## 9. Notebook Files (.ipynb) Requiring OTEL Endpoint Updates

These notebook files still set `OTEL_EXPORTER_OTLP_ENDPOINT`:

### Python notebooks that should be updated to SDK v3:
- `cookbook/integration_smolagents.ipynb`
- `cookbook/integration_openai-agents.ipynb`
- `cookbook/integration_google_adk.ipynb`
- `cookbook/integration_aws_strands_agents.ipynb`
- `cookbook/integration_agno_agents.ipynb`
- `cookbook/example_evaluating_openai_agents.ipynb`

### OpenTelemetry example notebooks (may keep OTEL endpoint):
- `cookbook/otel_integration_python_sdk.ipynb`
- `cookbook/otel_integration_openllmetry.ipynb`
- `cookbook/otel_integration_openlit.ipynb`
- `cookbook/otel_integration_arize.ipynb`

### JavaScript notebook (not Python, different handling):
- `cookbook/js_integration_llamaindex.ipynb`

## Summary

Total pages requiring updates:
- **Python integration docs**: 7 pages
- **Python notebooks**: 6 notebooks
- **OpenTelemetry docs**: 5 pages
- **OpenTelemetry notebooks**: 4 notebooks
- **Pages with parameter name updates**: 9 pages
- **Other updates**: Various low-priority pages

Note: The core SDK v2 patterns (`from langfuse.decorators`, `langfuse_context`) have already been successfully updated across all documentation.