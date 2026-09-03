// @ts-check

/**
 * @typedef {Object} SkillWorkflow
 * @property {string} id
 * @property {string} name
 * @property {string} label
 * @property {string} description
 * @property {string} path
 * @property {string} githubUrl
 * @property {string} prompt
 * @property {string} preview
 */

const SKILL_REPO_URL = "https://github.com/langfuse/skills";
const SKILL_REPO_TREE_URL = `${SKILL_REPO_URL}/tree/main/skills/langfuse`;
const SKILL_INSTALL_COMMAND =
  'npx skills add langfuse/skills --skill "langfuse"';

const SKILL_AGENTS = [
  { name: "Claude Code", icon: "/images/integrations/anthropic_icon.png" },
  { name: "Cursor", icon: "/images/integrations/cursor_icon.png" },
  { name: "Codex", icon: "/images/integrations/openai_icon.svg" },
  { name: "VS Code", icon: "/images/integrations/vscode_icon.svg" },
  {
    name: "GitHub Copilot",
    icon: "/images/integrations/github_copilot_icon.svg",
  },
  { name: "OpenCode", icon: "/images/integrations/opencode_icon.svg" },
];

function githubFile(path) {
  return `https://github.com/langfuse/skills/blob/main/${path}`;
}

const SKILL_WORKFLOWS = [
  {
    id: "langfuse",
    name: "langfuse",
    label: "Core skill",
    description:
      "The entrypoint your agent loads first — when to use Langfuse, how to fetch docs, and which playbook to open next.",
    path: "skills/langfuse/SKILL.md",
    githubUrl: githubFile("skills/langfuse/SKILL.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and help me use Langfuse in this project.",
    preview: `---
name: langfuse
description: >-
  Interact with Langfuse and access its documentation:
  tracing, monitoring, creating datasets, running
  experiments, and evaluating AI applications.
---

# Langfuse

This skill helps you use Langfuse effectively across
common workflows: instrumenting applications, migrating
prompts, debugging traces, and accessing data
programmatically.

## Core principles

1. Documentation first — fetch current docs before
   writing code. Langfuse updates frequently.
2. CLI for data access — use \`langfuse-cli\` when
   querying or modifying Langfuse data.
3. Best practices by use case — read the relevant
   reference before asking for more details.
4. Use the latest Langfuse SDK and API versions
   unless the user specifies otherwise.

## Use-case references

- instrumenting an app → references/instrumentation.md
- building an eval dataset → references/create-dataset.md
- migrating prompts → references/prompt-migration.md
- setting up evals → references/setting-up-evals.md
- judge calibration → references/judge-calibration.md
- error analysis → references/error-analysis.md
- CI/CD experiment gates → references/ci-cd.md
`,
  },
  {
    id: "instrumentation",
    name: "instrumentation",
    label: "Add tracing",
    description:
      "Instrument an existing function or application so traces, nesting, and attributes land in a useful shape.",
    path: "skills/langfuse/references/instrumentation.md",
    githubUrl: githubFile("skills/langfuse/references/instrumentation.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to add tracing to this application following best practices.",
    preview: `---
name: langfuse-instrumentation
description: Instrument an existing function or
  application with Langfuse tracing.
---

# Instrument an application

Follow Langfuse's tracing best practices so the
resulting traces are useful for debugging, evaluation,
and cost tracking — not just a dump of spans.

## Before you write code

1. Fetch current instrumentation docs. Do not implement
   from memory.
2. Identify the user-facing unit of work. That becomes
   the trace, not every internal helper.
3. Name observations after what they do
   (\`retrieve-docs\`, \`draft-reply\`), not the library.

## What good looks like

- One trace per user request or agent turn
- Nested generations, tool calls, and retrievals
- Meaningful input and output on each observation
- userId, sessionId, tags, and metadata that
  evaluators and dashboards can filter on

See [What does a good trace look like?](https://langfuse.com/docs/observability/best-practices)
`,
  },
  {
    id: "setting-up-evals",
    name: "setting-up-evals",
    label: "Set up evals",
    description:
      "Find the real measurement gap in your project, then pick the metric and evaluator that fit the data.",
    path: "skills/langfuse/references/setting-up-evals.md",
    githubUrl: githubFile("skills/langfuse/references/setting-up-evals.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and use it to set up evals for this application. Guide me through choosing the right evaluation approach.",
    preview: `---
name: langfuse-setting-up-evals
description: Set up evaluation by finding gaps across
  signal capture, monitoring, and evaluator metrics.
---

# Setting up evals

Act as executor and teacher. Do the work and explain
why the approach fits the user's goal and data.

## Find the measurement gap

Before advising:

- Inspect representative traces and present concrete
  findings before asking about metrics.
- Inventory existing datasets, evaluators, and scores.
- Identify what is already surfaced through errors or
  logged data, and what genuinely needs an evaluator.

Do not add an evaluator that duplicates an existing
error or logged signal.

## Define the metric set

- Start from user or product outcomes visible in data
- Prefer application-specific, actionable signals
- Do not propose generic metrics such as helpfulness,
  quality, or hallucination
- Wait for the user to confirm the metric set before
  implementing anything

## Build the evaluator

Choose the evaluator type from the data, not by
defaulting to an LLM-as-a-judge. If a judge is the
right fit, calibrate it before treating it as ready.
`,
  },
  {
    id: "create-dataset",
    name: "create-dataset",
    label: "Build a dataset",
    description:
      "Turn production traces or failing cases into a dataset you can experiment and regress against.",
    path: "skills/langfuse/references/create-dataset.md",
    githubUrl: githubFile("skills/langfuse/references/create-dataset.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and create a dataset from the failing traces in this project.",
    preview: `---
name: langfuse-create-dataset
description: Create or improve an evaluation dataset
  from production traces or known edge cases.
---

# Create a dataset

A useful dataset is small, specific, and tied to a
decision you want to make — not a dump of every trace.

## When to use this

- You have failing or surprising production traces
- You want a regression set before changing a prompt
- You need ground-truth labels for a judge

## Workflow

1. Name the dataset after the behavior it tests
   (\`refund-edge-cases\`, not \`eval-set-1\`).
2. Pull candidate traces with the CLI. Prefer items
   with a clear expected outcome.
3. Write \`input\` and \`expectedOutput\` so a later
   experiment can score without extra context.
4. Add only items that change a decision. Duplicates
   and near-duplicates waste experiment budget.
5. Share the dataset URL and suggest a first
   experiment or evaluator.
`,
  },
  {
    id: "prompt-migration",
    name: "prompt-migration",
    label: "Migrate prompts",
    description:
      "Move hardcoded prompts from the codebase into Langfuse Prompt Management without breaking the app.",
    path: "skills/langfuse/references/prompt-migration.md",
    githubUrl: githubFile("skills/langfuse/references/prompt-migration.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and migrate the prompts in this codebase to Langfuse prompt management.",
    preview: `---
name: langfuse-prompt-migration
description: Migrate prompts from a codebase into
  Langfuse Prompt Management.
---

# Migrate prompts

Move prompts out of source so you can version, label,
and A/B test them without a deploy.

## Workflow

1. Find every prompt string, template, and system
   message in the repo. List them before changing
   anything.
2. Create each prompt in Langfuse with a stable name
   and a production label.
3. Replace the hardcoded string with a fetch + compile
   using the current SDK. Keep a fallback.
4. Link the prompt to the observation that uses it so
   traces stay inspectable.
5. Do not invent variables or restructure the prompt
   while migrating. Behavior should stay the same.

Fetch the current prompt management docs before
writing SDK code — the client APIs change.
`,
  },
  {
    id: "prompt-engineering",
    name: "prompt-engineering",
    label: "Iterate on prompts",
    description:
      "Change, debug, or tune a prompt with versioning, labels, and a way to tell whether the edit helped.",
    path: "skills/langfuse/references/prompt-engineering.md",
    githubUrl: githubFile("skills/langfuse/references/prompt-engineering.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and help me iterate on the system prompt in this repo.",
    preview: `---
name: langfuse-prompt-engineering
description: Create or change a prompt, including
  small edits and debugging.
---

# Iterate on a prompt

Treat every edit as a versioned experiment, not a
silent rewrite in source.

## Workflow

1. Load the current prompt from Langfuse, not from
   memory or a stale local copy.
2. Restate the change the user wants and the failure
   it is meant to fix.
3. Save a new version. Do not overwrite production
   until you have evidence.
4. Run the prompt against a dataset or a handful of
   representative traces.
5. Compare outputs side by side and report what
   improved, what regressed, and what is still open.
6. Promote the version with a label only after the
   user agrees.
`,
  },
  {
    id: "judge-calibration",
    name: "judge-calibration",
    label: "Calibrate a judge",
    description:
      "Check whether an LLM-as-a-judge agrees with your human labels before you trust it in production.",
    path: "skills/langfuse/references/judge-calibration.md",
    githubUrl: githubFile("skills/langfuse/references/judge-calibration.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and calibrate my LLM-as-a-judge against the human labels in this dataset.",
    preview: `---
name: langfuse-judge-calibration
description: Calibrate an LLM-as-a-Judge against
  dataset ground truth and report agreement.
---

# Judge calibration

Validate judge outputs against human labels using the
smallest reliable workflow for the user's goal.

## 1. Choose the mode

- Simple: accuracy only. Use this when the user wants
  a quick "does this judge basically match?".
- Advanced: confusion matrix, precision, recall, F1.
  Use this for production monitoring or automation.

## 2. Run the experiment

1. Confirm the dataset, judge prompt, model, and
   allowed labels.
2. Run the judge on each dataset item as a Langfuse
   experiment. Never pass \`expectedOutput\` into the
   judge — that leaks the answer.
3. Compare the judge output to the human label.
4. Report valid rows, invalid-label count, accuracy,
   and a one-sentence recommendation.

If agreement is weak, iterate the judge prompt on
dev rows only, then re-run.
`,
  },
  {
    id: "error-analysis",
    name: "error-analysis",
    label: "Find failure modes",
    description:
      "Inspect traces and cluster hidden failure modes instead of guessing what to evaluate.",
    path: "skills/langfuse/references/error-analysis.md",
    githubUrl: githubFile("skills/langfuse/references/error-analysis.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and analyze recent traces for hidden failure modes.",
    preview: `---
name: langfuse-error-analysis
description: Systematically inspect traces and
  cluster recurring failure modes.
---

# Error analysis

Do not start from a generic taxonomy. Read traces,
then name the failures that actually appear.

## Workflow

1. Pull a recent slice of traces or a filtered set
   (errors, low scores, a single user cohort).
2. Open enough examples to see repetition. Quote
   concrete inputs and outputs, not summaries.
3. Cluster similar failures. Give each cluster a
   name the team can act on
   (\`wrong-refund-tool\`, \`stale-policy-quote\`).
4. Estimate how often each cluster shows up and
   how costly it is.
5. Recommend the next measurement: a dataset, a
   code evaluator, or a calibrated judge — not all
   three at once.

If the user already knows the failure, skip clustering
and go straight to capturing it as a dataset.
`,
  },
  {
    id: "user-feedback",
    name: "user-feedback",
    label: "Capture feedback",
    description:
      "Record thumbs, ratings, and implicit signals as scores so they show up on traces and in dashboards.",
    path: "skills/langfuse/references/user-feedback.md",
    githubUrl: githubFile("skills/langfuse/references/user-feedback.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and help me capture user thumbs-up/down as scores on traces.",
    preview: `---
name: langfuse-user-feedback
description: Capture user feedback as scores on
  traces and observations.
---

# Capture user feedback

Thumbs, ratings, and implicit signals are scores.
Attach them to the observation the user actually
saw, not a parent that hides the detail.

## Workflow

1. Decide the signal: explicit (👍/👎, 1–5) or
   implicit (copy, edit, regenerate, escalate).
2. Pick a stable score name (\`user-feedback\`,
   \`copied-output\`) and a config so the UI knows
   the type.
3. Write the score from the application with the
   trace or observation id. Include a comment when
   the user typed one.
4. Verify a score lands on a recent trace before
   calling the work done.

These scores become filters, dashboard metrics, and
candidates for evaluation datasets.
`,
  },
  {
    id: "ci-cd",
    name: "ci-cd",
    label: "Gate in CI",
    description:
      "Run Langfuse experiments on every pull request and fail the build when scores drop.",
    path: "skills/langfuse/references/ci-cd.md",
    githubUrl: githubFile("skills/langfuse/references/ci-cd.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and set up a CI experiment gate with langfuse/experiment-action.",
    preview: `---
name: langfuse-ci-cd
description: Set up CI/CD experiment gates with
  langfuse/experiment-action.
---

# Experiments in CI

Fail the pull request when an experiment score drops
below the threshold you care about.

## Workflow

1. Confirm there is a dataset and at least one
   experiment that already runs locally or in
   Langfuse.
2. Add \`langfuse/experiment-action\` to the repo.
3. Pass the dataset, task, evaluators, and a
   numeric threshold.
4. Store Langfuse API keys as CI secrets. Do not
   commit them.
5. Open a dry-run PR and confirm the action posts
   the experiment URL and pass/fail status.

The gate should measure a product behavior, not
whether the pipeline stayed green. Start with one
dataset and one metric.
`,
  },
  {
    id: "cli",
    name: "cli",
    label: "Use the CLI",
    description:
      "Discover endpoints, query traces, and update project data with langfuse-cli instead of improvising HTTP.",
    path: "skills/langfuse/references/cli.md",
    githubUrl: githubFile("skills/langfuse/references/cli.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and show me how to query recent traces with the Langfuse CLI.",
    preview: `---
name: langfuse-cli
description: Tips and workflows for langfuse-cli,
  the generated REST API client.
---

# Langfuse CLI

Use \`npx langfuse-cli\` to read and write Langfuse
data. Discover the schema instead of guessing flags.

\`\`\`bash
npx langfuse-cli api __schema
npx langfuse-cli api <resource> --help
npx langfuse-cli api <resource> <action> --help
\`\`\`

## Credentials

\`\`\`bash
export LANGFUSE_PUBLIC_KEY=pk-lf-...
export LANGFUSE_SECRET_KEY=sk-lf-...
export LANGFUSE_BASE_URL=https://cloud.langfuse.com
\`\`\`

Keys live in the project under Settings → API Keys.
Do not ask the user to paste secrets into chat.

## Habits

- List first, then get a single id
- Filter on the server; do not page through everything
- Prefer \`--help\` over remembered argument names
`,
  },
  {
    id: "sdk-upgrade",
    name: "sdk-upgrade",
    label: "Upgrade the SDK",
    description:
      "Upgrade Langfuse SDKs and keep instrumentation attributes intact across major versions.",
    path: "skills/langfuse/references/sdk-upgrade.md",
    githubUrl: githubFile("skills/langfuse/references/sdk-upgrade.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and upgrade this project to the latest Langfuse SDK.",
    preview: `---
name: langfuse-sdk-upgrade
description: Upgrade Langfuse SDKs while preserving
  application instrumentation.
---

# Upgrade the SDK

Always fetch the current upgrade guide for the
language and version pair you are moving between.
Do not upgrade from memory.

## Workflow

1. Detect the installed SDK version and language.
2. Open the matching upgrade path in the docs
   (Python v3 → v4, JS/TS v4 → v5, and so on).
3. Update imports, env vars, and span processors
   exactly as the guide specifies.
4. Keep observation names, input/output, and
   metadata. An upgrade should not flatten the
   trace tree.
5. Run the app once and confirm a new trace
   appears with the same shape as before.

Unless the user asks otherwise, go to the latest
stable SDK.
`,
  },
  {
    id: "v4-project-migration",
    name: "v4-project-migration",
    label: "Prepare for v4",
    description:
      "Get a Langfuse project ready for the v4 platform migration: observations-first data, evaluators, and APIs.",
    path: "skills/langfuse/references/v4-project-migration.md",
    githubUrl: githubFile("skills/langfuse/references/v4-project-migration.md"),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and prepare this Langfuse project for the v4 platform migration.",
    preview: `---
name: langfuse-v4-project-migration
description: Prepare a Langfuse project for the v4
  platform migration.
---

# Prepare a project for v4

v4 is observations-first. Traces are still the unit
you look at, but scores, filters, and APIs attach to
observations.

## Workflow

1. Read the current v4 migration docs. Do not
   implement from changelog posts.
2. Inventory trace-level evaluators, legacy ingest
   paths, and v1 read APIs still in use.
3. Move evaluators to observation-level or
   experiment evaluators where the docs require it.
4. Switch clients to Observations API v2 and the
   current SDK.
5. Confirm a representative workflow — a live
   score, a dataset run, an export — still works.

See the v4 upgrade guide and the custom ingestion
migration notes before changing production traffic.
`,
  },
  {
    id: "trace-evaluator-upgrade",
    name: "trace-evaluator-upgrade",
    label: "Upgrade evaluators",
    description:
      "Move legacy trace-level or dataset-item evaluators to observation-level or experiment evaluators.",
    path: "skills/langfuse/references/trace-evaluator-upgrade.md",
    githubUrl: githubFile(
      "skills/langfuse/references/trace-evaluator-upgrade.md",
    ),
    prompt:
      "Install the Langfuse Agent Skill from github.com/langfuse/skills and upgrade our legacy trace-level evaluators.",
    preview: `---
name: langfuse-trace-evaluator-upgrade
description: Upgrade legacy trace-level or
  dataset-item evaluators.
---

# Upgrade evaluators

Legacy trace-level judges do not map cleanly onto
an observations-first project. Move them before you
rely on them for monitoring.

## Workflow

1. List every evaluator and whether it targets a
   trace, an observation, a dataset item, or an
   experiment.
2. Read the current evaluator migration guide.
3. Recreate each judge against the observation
   that actually contains the model output.
4. Keep the score name stable so dashboards do
   not break. Change the target, not the metric.
5. Run both evaluators side by side on a sample,
   then retire the legacy one.

Use the FAQ migration guide as the primary
reference, not remembered field names.
`,
  },
];

module.exports = {
  SKILL_REPO_URL,
  SKILL_REPO_TREE_URL,
  SKILL_INSTALL_COMMAND,
  SKILL_AGENTS,
  SKILL_WORKFLOWS,
};
