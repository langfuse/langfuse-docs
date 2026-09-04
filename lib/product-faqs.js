/** @typedef {{ question: string, answer: string }} ProductFaqItem */

/** @type {ProductFaqItem[]} */
const observabilityFaqs = [
  {
    question: "What is the difference between observability and tracing?",
    answer:
      "Observability is the broader capability of understanding the internal state of your system from its outputs. It encompasses tracing, metrics, and logging. Tracing is a specific observability technique that records the flow of a request through your system, preserving causal relationships between operations. In LLM applications, tracing is the most important observability tool because it captures the full context of each request — prompts, responses, tool calls, and their relationships.",
  },
  {
    question: "What is application tracing?",
    answer:
      "Application tracing records the complete lifecycle of a request as it flows through your system. Each trace captures every operation — LLM calls, retrieval steps, tool executions, and custom logic — along with timing, inputs, outputs, and metadata. This gives you full visibility into what happened during each request, enabling debugging, performance optimization, and quality monitoring.",
  },
  {
    question: "How does Langfuse compare to other tracing solutions?",
    answer:
      "Langfuse is purpose-built for LLM applications, so it natively understands token usage, model parameters, prompt and completion pairs, and evaluation scores. Unlike general-purpose APM tools, it includes LLM-as-a-Judge evaluation, prompt management, experiments and datasets, and custom dashboards. It is also open source and can be self-hosted.",
  },
  {
    question: "Does Langfuse add latency to my application?",
    answer:
      "No. Langfuse SDKs send tracing data asynchronously in the background. Trace events are queued locally and flushed in batches, so your application's response time is not affected.",
  },
];

/** @type {ProductFaqItem[]} */
const promptManagementFaqs = [
  {
    question: "What is LLM prompt management?",
    answer:
      "LLM prompt management is a systematic way to store, version, and retrieve prompts outside of application code. Instead of hardcoding prompts, you manage them centrally so product and domain experts can update text without a deploy, while the application fetches the latest version at runtime.",
  },
  {
    question: "Does prompt management add latency?",
    answer:
      "No. Langfuse prompts are cached client-side by the SDKs, so retrieving them after the first fetch is as fast as reading from memory. You can also pre-fetch prompts on startup and provide a fallback so the application keeps working if Langfuse is unreachable.",
  },
  {
    question: "Who should own prompts — engineering or product?",
    answer:
      "Both. Engineers wire prompt fetching and fallbacks into the application. Product managers and domain experts iterate on wording, examples, and model config in the UI. Labels such as production and staging control which version each environment receives.",
  },
  {
    question: "Can I link a prompt version to production traces?",
    answer:
      "Yes. When you fetch a prompt from Langfuse and use it in a traced generation, you can link that prompt version to the trace. That lets you compare cost, latency, and quality by prompt version.",
  },
];

/** @type {ProductFaqItem[]} */
const evaluationFaqs = [
  {
    question: "What is LLM evaluation?",
    answer:
      "LLM evaluation is a repeatable way to score application behavior — helpfulness, factuality, tone, safety, or any rubric you define — instead of relying on anecdotal reviews. In Langfuse, evaluation results are stored as scores on traces, observations, sessions, and experiment runs.",
  },
  {
    question: "What is the difference between online and offline evaluation?",
    answer:
      "Online evaluation scores live production traces as they arrive, so you can watch quality trends and catch regressions in production. Offline evaluation runs your application against a fixed dataset before you ship, so you can compare prompt, model, or code changes side by side.",
  },
  {
    question: "When should I use LLM-as-a-Judge vs a code evaluator?",
    answer:
      "Use a code evaluator for deterministic checks you can write as Python or TypeScript — format, required fields, keyword presence, or numeric thresholds. Use LLM-as-a-Judge when the judgment is qualitative, such as faithfulness, helpfulness, or whether a response followed a policy.",
  },
  {
    question: "How do experiments relate to scores?",
    answer:
      "An experiment runs your task on a dataset and attaches scores to each item. Those scores are the same score objects you use on production traces, so you can compare an offline experiment to live quality using one data model.",
  },
];

/** @type {ProductFaqItem[]} */
const metricsFaqs = [
  {
    question: "What LLM metrics should I track?",
    answer:
      "Start with cost, latency, volume, and quality. Cost and latency come from traces. Volume is request and token count. Quality comes from evaluation scores and user feedback. Slice those metrics by user, session, trace name, tag, release, and prompt version.",
  },
  {
    question: "How do Langfuse metrics relate to traces?",
    answer:
      "Metrics are aggregations over observability traces and evaluation scores. Every dashboard widget and Metrics API query reads the same underlying events you already ingest, so you do not maintain a separate analytics pipeline.",
  },
  {
    question: "Can I export metrics to other tools?",
    answer:
      "Yes. Use the Metrics API for custom reporting, export dashboards, or send data to PostHog and Mixpanel. You can also alert when a metric crosses a threshold.",
  },
  {
    question: "Do I need evaluation set up before metrics are useful?",
    answer:
      "No. Cost, latency, and volume work from traces alone. Quality metrics become available once you attach scores — via LLM-as-a-Judge, code evaluators, user feedback, or manual annotation.",
  },
];

module.exports = {
  observabilityFaqs,
  promptManagementFaqs,
  evaluationFaqs,
  metricsFaqs,
};
