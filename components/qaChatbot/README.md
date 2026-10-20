# QA chatbot experiments

This folder contains the local scripts for seeding QA chatbot datasets and running Langfuse experiments against the production-managed chatbot prompt.

Run commands from the repository root:

```bash
cd /Users/annabellschafer/langfuse-docs
```

## Folder layout

```text
components/qaChatbot/
  datasets/      Dataset seed scripts.
  evaluators/    Product evaluator setup scripts.
  experiments/   Experiment runners.
  shared/        Shared Langfuse config and message helpers.
```

The live chatbot component files remain in the root of this folder.

## Environment files

Use one env file per Langfuse project:

```text
components/qaChatbot/.env_sample_project
components/qaChatbot/.env_eu
components/qaChatbot/.env_us
components/qaChatbot/.env_jp
```

Each env file must provide a Langfuse base URL, public key, and secret key. The scripts accept either generic names like `LANGFUSE_BASE_URL`, `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, or the region-specific names already used in these files.

Default workflow: try changes in `.env_sample_project` first, note the result, then roll out to other regions only after explicit instruction.

## Add a cloud region

For experiment scripts, adding a new region usually does not require code changes. Create a new env file with generic Langfuse keys:

```bash
cp components/qaChatbot/.env_sample_project components/qaChatbot/.env_new_region
```

```bash
LANGFUSE_BASE_URL=https://new-region.cloud.langfuse.com
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
```

Seed both datasets:

```bash
pnpm qa-chatbot:seed-general -- components/qaChatbot/.env_new_region
pnpm qa-chatbot:seed-sdk-grounding -- components/qaChatbot/.env_new_region
```

Create missing product evaluators and experiment rules:

```bash
pnpm qa-chatbot:general-experiment -- components/qaChatbot/.env_new_region --setup-product-evaluators-only
pnpm qa-chatbot:setup-sdk-grounding-evaluators -- components/qaChatbot/.env_new_region
```

Run a first smoke experiment:

```bash
pnpm qa-chatbot:general-experiment -- components/qaChatbot/.env_new_region --models gpt-4.1
pnpm qa-chatbot:sdk-grounding-experiment -- components/qaChatbot/.env_new_region --models gpt-4o-mini
```

No code changes are needed for one-off seeding and experiments when the new env file uses the generic `LANGFUSE_*` names above.

## Seed datasets

Seed the general QA dataset:

```bash
pnpm qa-chatbot:seed-general -- components/qaChatbot/.env_sample_project
```

Seed the SDK integration docs-grounding dataset:

```bash
pnpm qa-chatbot:seed-sdk-grounding -- components/qaChatbot/.env_sample_project
```

The seed scripts upsert datasets and stable item IDs, so rerunning them updates existing datasets instead of creating duplicates.

## Run experiments

Run the general QA chatbot experiment:

```bash
pnpm qa-chatbot:general-experiment -- components/qaChatbot/.env_sample_project
```

Run the SDK integration docs-grounding experiment:

```bash
pnpm qa-chatbot:sdk-grounding-experiment -- components/qaChatbot/.env_sample_project
```

Pass models as a comma-separated list:

```bash
pnpm qa-chatbot:sdk-grounding-experiment -- components/qaChatbot/.env_sample_project \
  --models gpt-5,gpt-5.6-terra,gpt-5.6-sol
```

Compare prompt labels:

```bash
pnpm qa-chatbot:general-experiment -- components/qaChatbot/.env_sample_project \
  --models gpt-4.1 \
  --prompt-labels production,candidate-v3
```

Compare prompt versions:

```bash
pnpm qa-chatbot:general-experiment -- components/qaChatbot/.env_sample_project \
  --models gpt-4.1 \
  --prompt-versions 1,2
```

## Common options

Both experiment runners support:

```text
--env-file <path>
--dataset-name <name>
--models <model-a,model-b>
--prompt-labels <label-a,label-b>
--prompt-versions <version-a,version-b>
--run-series <name>
--max-concurrency <number>
--mcp-url <url>
```

The general QA runner also supports:

```text
--setup-product-evaluators-only
--skip-product-evaluators
```

`--setup-product-evaluators-only` creates or updates the Langfuse product LLM-as-a-judge evaluators without running dataset items.

Set up SDK integration docs-grounding product evaluators and rules:

```bash
pnpm qa-chatbot:setup-sdk-grounding-evaluators -- components/qaChatbot/.env_sample_project
```

## Package scripts

```bash
pnpm qa-chatbot:seed-general
pnpm qa-chatbot:seed-sdk-grounding
pnpm qa-chatbot:setup-sdk-grounding-evaluators
pnpm qa-chatbot:general-experiment
pnpm qa-chatbot:sdk-grounding-experiment
```

## Shared config

[shared/flow_config.ts](./shared/flow_config.ts) contains the managed prompt name and message normalization helpers used by the experiment runners.
