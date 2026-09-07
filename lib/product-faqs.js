/** @typedef {{ question: string, answer: string }} ProductFaqItem */

/** @type {ProductFaqItem[]} */
const observabilityFaqs = [
  {
    question: "Why do agents need observability?",
    answer:
      "Agents are non-deterministic, take many steps, and see mixed user intent. A run can call a model, retrieve context, and use tools in an order that is hard to reconstruct from logs. Observability records that path — prompts, tool arguments, retrieved documents, latency, and cost — so you can debug a bad answer, a loop, or a cost spike instead of guessing.",
  },
  {
    question:
      "What is the difference between observability, tracing, and monitoring?",
    answer:
      "Observability is the ability to infer internal state from outputs. Tracing is the technique that records one request as a causal tree of observations. Monitoring is watching aggregated signals — latency, error rate, cost, quality — over time. Agents need all three: a trace to debug a single run, and monitoring to see whether the system is getting better or worse.",
  },
  {
    question: "What is an agent observability platform?",
    answer:
      "It is one system that captures every agent request and turns that data into something you can debug, evaluate, and improve. The category usually includes tracing, evaluation scores, prompt management, cost tracking, and dashboards. Langfuse is an open-source example: you start with traces, then add scores, prompts, and analytics incrementally.",
  },
  {
    question: "How do you monitor agent outputs in production?",
    answer:
      "Attach scores to live traces, then chart and alert on those scores. Online evaluators (LLM-as-a-Judge or code) score incoming traffic. User feedback — thumbs, ratings, retries — is stored as scores on the same traces. Dashboards show quality, cost, and latency over time. Alerts fire when a metric or boolean fail rate crosses a threshold.",
  },
  {
    question: "What is application tracing?",
    answer:
      "Application tracing records the complete lifecycle of a request as it flows through your system. Each trace captures every operation — model calls, retrieval steps, tool executions, and custom logic — along with timing, inputs, outputs, and metadata. That is what lets you debug, optimize, and evaluate an agent run.",
  },
  {
    question: "How does Langfuse compare to other tracing solutions?",
    answer:
      "Langfuse is purpose-built for agents, so it natively understands token usage, model parameters, prompt and completion pairs, and evaluation scores. Unlike general-purpose APM tools, it includes LLM-as-a-Judge evaluation, prompt management, experiments and datasets, and custom dashboards. It is also open source and can be self-hosted.",
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
    question: "What is prompt management?",
    answer:
      "Prompt management is a systematic way to store, version, and retrieve prompts outside of application code. Instead of hardcoding prompts, you manage them centrally so product and domain experts can update text without a deploy, while the application fetches the latest version at runtime.",
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
    question: "What are agent evals?",
    answer:
      "Agent evals are a repeatable way to score application behavior — helpfulness, factuality, tone, safety, or any rubric you define — instead of relying on anecdotal reviews. In Langfuse, evaluation results are stored as scores on traces, observations, sessions, and experiment runs.",
  },
  {
    question: "What is the difference between online and offline evaluation?",
    answer:
      "Online evaluation scores live production traces as they arrive, so you can watch quality trends and catch regressions in production. Offline evaluation runs your application against a fixed dataset before you ship, so you can compare prompt, model, or code changes side by side. Experiments are the offline workflow.",
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
    question: "What agent metrics should I track?",
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
    question: "Do I need evals set up before metrics are useful?",
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
