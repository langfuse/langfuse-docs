import assert from "node:assert/strict";
import test from "node:test";
import {
  applyWorkshopContentFixes,
  rewriteMarkdownReferences,
} from "./sync-workshop.mjs";

const SOURCE_PATH = "docs/learner/04-monitoring.md";
const RAW_IMAGE_BASE =
  "https://raw.githubusercontent.com/langfuse/langfuse-workshop/main/docs/images/monitoring";

function rewrite(markdown) {
  return rewriteMarkdownReferences(markdown, SOURCE_PATH, new Map());
}

test("rewrites relative HTML image sources and preserves sizing attributes", () => {
  const markdown =
    '<img src="../images/monitoring/mapping.png" alt="Map variables." width="400" />';

  assert.equal(
    rewrite(markdown),
    `<img src="${RAW_IMAGE_BASE}/mapping.png" alt="Map variables." width="400" />`,
  );
});

test("rewrites multiline HTML images with single-quoted sources", () => {
  const markdown = `<img
  width="400"
  src='../images/monitoring/mapping image.png'
  alt="Map variables."
/>`;

  assert.equal(
    rewrite(markdown),
    `<img
  width="400"
  src='${RAW_IMAGE_BASE}/mapping%20image.png'
  alt="Map variables."
/>`,
  );
});

test("leaves absolute HTML image sources and code examples unchanged", () => {
  const absolute = '<img src="https://example.com/image.png" width="400" />';
  const dataSource =
    '<img data-src="../images/monitoring/lazy.png" width="400" />';
  const inlineCode =
    '`<img src="../images/monitoring/inline.png" width="400" />`';
  const fencedCode = `\`\`\`html
<img src="../images/monitoring/fenced.png" width="400" />
\`\`\``;

  assert.equal(rewrite(absolute), absolute);
  assert.equal(rewrite(dataSource), dataSource);
  assert.equal(rewrite(inlineCode), inlineCode);
  assert.equal(rewrite(fencedCode), fencedCode);
});

test("continues to rewrite Markdown image sources", () => {
  assert.equal(
    rewrite("![Map variables.](../images/monitoring/mapping.png)"),
    `![Map variables.](${RAW_IMAGE_BASE}/mapping.png)`,
  );
});

test("preserves dollar replacement tokens in HTML image URLs", () => {
  const absolute =
    '<img src="https://example.com/image.png?literal=$&$1$$" width="400" />';
  const relative =
    '<img src="../images/monitoring/mapping.png?literal=$&$1$$" width="400" />';

  assert.equal(rewrite(absolute), absolute);
  assert.equal(
    rewrite(relative),
    `<img src="${RAW_IMAGE_BASE}/mapping.png?literal=$&$1$$" width="400" />`,
  );
});

test("adds the Out-of-Scope system_prompt mapping to the learner monitoring page", () => {
  const markdown = `The goal of monitoring is finding the things that are worth knowing about for *your* AI application. For Specs, we chose two events that are worth catching as a starting point:

- **User disagreement** — Dad pushes back ("No, that menu isn't there"). Either the agent gave the wrong steps or the app is showing its limits.
- **All-caps frustration** — Dad writes something like "THIS STILL ISNT WORKING".

For **User Disagreement**:

| Template variable | Object field | JsonMapping |
| --- | --- | --- |
| \`{{conversation_history}}\` | \`Input\` | All messages |

The monitor above use LLM-as-a-judge because they need semantic judgment.

Send four turns that should each light up one monitor:

1. **Disagreement** — ask a normal question, then reply with "No, that menu isn't there"
2. **All caps** — "THIS STILL ISNT WORKING"

The out-of-scope, disagreement, and all-caps traces should bubble to the top.

![User disagrees Example](../images/monitoring/user-disagrees-example.png)

Four hand-typed turns prove the wiring works.`;

  const fixed = applyWorkshopContentFixes(
    markdown,
    "docs/learner/04-monitoring.md",
  );

  assert.match(fixed, /we chose three events that are worth catching/);
  assert.match(fixed, /\*\*Out-of-scope requests\*\*/);
  assert.match(fixed, /Detect Out-of-Scope Request/);
  assert.match(fixed, /`\{\{system_prompt\}\}`/);
  assert.match(fixed, /not the full conversation history/);
  assert.match(fixed, /The two monitors above use LLM-as-a-judge/);
  assert.match(fixed, /\*\*Out of scope\*\* — "Can you file my taxes\?"/);
  assert.match(fixed, /out-of-scope-example\.png/);
  assert.match(fixed, /Three hand-typed turns prove the wiring works/);
  assert.equal(
    applyWorkshopContentFixes(fixed, "docs/learner/04-monitoring.md"),
    fixed,
  );
});

test("leaves learner monitoring unchanged when system_prompt mapping already exists", () => {
  const markdown = `For **Out-of-Scope Request**:

| Template variable | Object field | JsonMapping |
| --- | --- | --- |
| \`{{system_prompt}}\` | \`Input\` | First message |

For **User Disagreement**:
`;

  assert.equal(
    applyWorkshopContentFixes(markdown, "docs/learner/04-monitoring.md"),
    markdown,
  );
});

test("updates instructor notes to map Out-of-Scope Request to system prompt", () => {
  const markdown = `## Instructor notes

- This is a UI-first chapter with two signals: **Detect User Disagreement** uses LLM-as-a-judge for semantic judgment, while **Detect User Frustration (ALL CAPS)** uses deterministic TypeScript logic.
- Before the disagreement evaluator, confirm the project has **Project Settings → LLM Connections** configured. The API keys in \`.env\` do not configure the judge model inside Langfuse.
- Both evaluators target the logical root \`dad-it-support-chat-turn\` agent observation because that observation carries the overall conversation input and final answer.
- Have learners use the right-side sample panel instead of mapping from memory: select a root observation, map \`conversation_history\` to all input messages and \`last_user_message\` to the last input message, then test the evaluator before saving.

## Demo rhythm

1. Confirm or configure the project's default evaluator model.
2. Create **Detect User Disagreement**, select a sample root observation, map both variables through the data tree, run a test, then create and execute the evaluator.
3. Create **Detect User Frustration (ALL CAPS)** on the same root observation, run a test, then create and execute it.
4. Send one disagreement turn and one ALL-CAPS turn, then inspect the scores on their root observations.
5. Seed production traffic with \`npm run langfuse:seed:otel:no-scores\`, refresh the Tracing view, and watch the two evaluators score the seeded batch.

## Watch for

- Accidentally choosing the wrong template instead of **Detect User Disagreement** from the Template Gallery.
- Treating the Langfuse API keys from \`.env\` as enough for evaluators. Judge-based evaluators also need the Langfuse-side LLM connection.
- Selecting a child generation instead of the root agent observation. The evaluator only receives data from the observation it targets; it does not automatically read sibling or child observations.
- Mapping \`conversation_history\` to a single message, or \`last_user_message\` to every message. Use the live sample tree: **Input → messages** and **Input → messages → last**.
`;

  const fixed = applyWorkshopContentFixes(
    markdown,
    "docs/instructor/04-monitoring.md",
  );

  assert.match(fixed, /three signals/);
  assert.match(fixed, /map `system_prompt` to the first input message/);
  assert.match(
    fixed,
    /Mapping Out-of-Scope Request as if it used `conversation_history`/,
  );
  assert.doesNotMatch(fixed, /Both evaluators target the logical root/);
  assert.equal(
    applyWorkshopContentFixes(fixed, "docs/instructor/04-monitoring.md"),
    fixed,
  );
});

test("does not rewrite unrelated workshop pages", () => {
  const markdown = "Map `conversation_history` on this page.";
  assert.equal(
    applyWorkshopContentFixes(markdown, "docs/learner/06-experiments.md"),
    markdown,
  );
});
