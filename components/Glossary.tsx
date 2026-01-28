"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

// Category definitions with colors
const CATEGORIES = {
  OBSERVABILITY: {
    label: "Observability",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  EVALUATION: {
    label: "Evaluation",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  PROMPTS: {
    label: "Prompts",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  SDK: {
    label: "SDK",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800",
  },
  ADMINISTRATION: {
    label: "Administration",
    color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800",
  },
  METRICS: {
    label: "Metrics",
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
  },
  API: {
    label: "API",
    color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
} as const;

type CategoryKey = keyof typeof CATEGORIES;

export interface GlossaryTerm {
  term: string;
  id: string;
  definition: string;
  link?: string;
  categories: CategoryKey[];
  relatedTerms?: string[];
  synonyms?: string[];
}

// Glossary data
const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Agent Graph",
    id: "agent-graph",
    definition: "A visual representation of complex AI agent workflows in Langfuse. Agent graphs help you understand and debug multi-step reasoning processes and agent interactions by displaying the flow of observations within a trace.",
    link: "/docs/observability/features/agent-graphs",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Observation", "Span"],
  },
  {
    term: "Annotation Queue",
    id: "annotation-queue",
    definition: "A manual evaluation method that allows domain experts to review and add scores and comments to traces, observations, or sessions. Useful for building ground truth, systematic labeling, and team collaboration.",
    link: "/docs/evaluation/evaluation-methods/annotation-queues",
    categories: ["EVALUATION"],
    relatedTerms: ["Score", "Trace", "Session", "Online Evaluation"],
  },
  {
    term: "API Key",
    id: "api-key",
    definition: "Credentials used to authenticate with the Langfuse API and SDKs. API keys consist of a public key and secret key and are associated with a specific project. They are managed in project settings.",
    link: "/docs/administration/rbac",
    categories: ["ADMINISTRATION", "API"],
    relatedTerms: ["Project", "Public API", "SDK"],
  },
  {
    term: "Chain",
    id: "chain",
    definition: "An observation type that represents a link between different application steps, such as passing context from a retriever to an LLM call.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Span", "Retriever", "Generation"],
  },
  {
    term: "Chat Prompt",
    id: "chat-prompt",
    definition: "A prompt type that consists of an array of messages with specific roles (system, user, assistant). Useful for managing complete conversation structures and chat history.",
    link: "/docs/prompt-management/data-model#text-vs-chat-prompts",
    categories: ["PROMPTS"],
    relatedTerms: ["Text Prompt", "Prompt Management", "Variables"],
    synonyms: ["Message Prompt"],
  },
  {
    term: "Custom Dashboards",
    id: "custom-dashboards",
    definition: "Flexible, self-service analytics dashboards that allow you to visualize and monitor metrics from your LLM application. Dashboards support multiple chart types, filtering, and multi-level aggregations.",
    link: "/docs/metrics/features/custom-dashboards",
    categories: ["METRICS"],
    relatedTerms: ["Score", "Token Tracking"],
  },
  {
    term: "Dataset",
    id: "dataset",
    definition: "A collection of test cases (dataset items) used to test and benchmark LLM applications. Datasets contain inputs and optionally expected outputs for systematic testing.",
    link: "/docs/evaluation/experiments/datasets",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset Item", "Dataset Experiment", "Offline Evaluation"],
  },
  {
    term: "Dataset Item",
    id: "dataset-item",
    definition: "An individual test case within a dataset. Each item contains an input (the scenario to test) and optionally an expected output.",
    link: "/docs/evaluation/experiments/data-model#datasetitem-object",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Experiment", "Task"],
  },
  {
    term: "Dataset Experiment",
    id: "dataset-experiment",
    definition: "Also known as a Dataset Run. The execution of a dataset through your LLM application, producing outputs that can be evaluated. Links dataset items to their corresponding traces.",
    link: "/docs/evaluation/experiments/data-model#datasetrun-experiment-run",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Item", "Task", "Score"],
    synonyms: ["Dataset Run", "Experiment Run"],
  },
  {
    term: "Embedding",
    id: "embedding",
    definition: "An observation type that represents a call to an LLM to generate embeddings. Can include model information, token usage, and costs.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Generation", "Retriever", "Token Tracking"],
  },
  {
    term: "Environment",
    id: "environment",
    definition: "A way to organize traces, observations, and scores from different deployment contexts (e.g., production, staging, development). Helps keep data separate while using the same project.",
    link: "/docs/observability/features/environments",
    categories: ["OBSERVABILITY", "ADMINISTRATION"],
    relatedTerms: ["Project", "Trace", "Tags"],
  },
  {
    term: "Evaluator",
    id: "evaluator",
    definition: "An observation type that represents functions assessing the relevance, correctness, or helpfulness of LLM outputs. Also refers to the function that scores experiment results.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY", "EVALUATION"],
    relatedTerms: ["Score", "LLM-as-a-Judge", "Observation"],
  },
  {
    term: "Event",
    id: "event",
    definition: "A basic observation type used to track discrete events in a trace. Events are the building blocks of tracing.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Span", "Trace"],
  },
  {
    term: "Flush",
    id: "flush",
    definition: "The process of sending buffered trace data to the Langfuse server. Important for short-lived applications to ensure no data is lost when the process terminates.",
    link: "/docs/observability/sdk/instrumentation#client-lifecycle--flushing",
    categories: ["SDK"],
    relatedTerms: ["SDK", "Trace", "Instrumentation"],
  },
  {
    term: "Generation",
    id: "generation",
    definition: "An observation type that logs outputs from AI models including prompts, completions, token usage, and costs. The most common observation type for LLM calls.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Token Tracking", "Span"],
  },
  {
    term: "Guardrail",
    id: "guardrail",
    definition: "An observation type that represents a component protecting against malicious content, jailbreaks, or other security risks.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Trace"],
  },
  {
    term: "Instrumentation",
    id: "instrumentation",
    definition: "The process of adding code to record application behavior. Langfuse provides context managers, observe wrappers, and manual observation methods for instrumenting your application.",
    link: "/docs/observability/sdk/instrumentation",
    categories: ["SDK", "OBSERVABILITY"],
    relatedTerms: ["SDK", "Trace", "Observation", "Flush"],
  },
  {
    term: "LLM Connection",
    id: "llm-connection",
    definition: "An API key configuration that allows Langfuse to call LLM models in the Playground or for LLM-as-a-Judge evaluations. Supports providers like OpenAI, Anthropic, and Google.",
    link: "/docs/administration/llm-connection",
    categories: ["ADMINISTRATION"],
    relatedTerms: ["Playground", "LLM-as-a-Judge"],
  },
  {
    term: "LLM-as-a-Judge",
    id: "llm-as-a-judge",
    definition: "An evaluation method that uses an LLM to score the output of your application based on custom criteria. Provides scalable, repeatable evaluations with chain-of-thought reasoning.",
    link: "/docs/evaluation/evaluation-methods/llm-as-a-judge",
    categories: ["EVALUATION"],
    relatedTerms: ["Score", "Evaluator", "Online Evaluation", "Offline Evaluation"],
  },
  {
    term: "Masking",
    id: "masking",
    definition: "A feature that allows redacting sensitive information from inputs and outputs before sending data to the Langfuse server. Important for compliance and protecting user privacy.",
    link: "/docs/observability/features/masking",
    categories: ["OBSERVABILITY", "ADMINISTRATION"],
    relatedTerms: ["Trace", "Generation"],
  },
  {
    term: "MCP Server",
    id: "mcp-server",
    definition: "A Model Context Protocol server that enables AI-powered tools to interact with Langfuse data. Used for advanced integrations and AI-assisted workflows.",
    link: "/docs/api-and-data-platform/features/mcp-server",
    categories: ["API"],
    relatedTerms: ["Public API", "SDK"],
  },
  {
    term: "Observation",
    id: "observation",
    definition: "An individual step within a trace. Observations can be of different types (span, generation, event, tool, etc.) and can be nested to represent hierarchical workflows.",
    link: "/docs/observability/data-model",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Span", "Generation", "Event"],
  },
  {
    term: "Offline Evaluation",
    id: "offline-evaluation",
    definition: "Testing your application against a fixed dataset before deployment. Used to validate changes and catch regressions during development.",
    link: "/docs/evaluation/core-concepts#the-evaluation-loop",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Online Evaluation", "Score", "Dataset Experiment"],
  },
  {
    term: "Online Evaluation",
    id: "online-evaluation",
    definition: "Scoring live production traces to catch issues in real traffic. Helps identify edge cases and monitor application quality in production.",
    link: "/docs/evaluation/core-concepts#online-evaluation",
    categories: ["EVALUATION"],
    relatedTerms: ["Trace", "Score", "Offline Evaluation", "LLM-as-a-Judge"],
  },
  {
    term: "OpenTelemetry",
    id: "opentelemetry",
    definition: "An open standard for collecting telemetry data from applications. Langfuse is built on OpenTelemetry, enabling interoperability and reducing vendor lock-in.",
    link: "/docs/observability/data-model#built-on-opentelemetry",
    categories: ["OBSERVABILITY", "SDK"],
    relatedTerms: ["Trace", "Span", "Instrumentation"],
    synonyms: ["OTel", "OTLP"],
  },
  {
    term: "Organization",
    id: "organization",
    definition: "A top-level entity in Langfuse that contains projects. Organizations manage billing, team members, and SSO configuration.",
    link: "/docs/administration/rbac",
    categories: ["ADMINISTRATION"],
    relatedTerms: ["Project", "RBAC"],
  },
  {
    term: "Playground",
    id: "playground",
    definition: "The LLM Playground where you can test, iterate, and compare different prompts and models directly in Langfuse without writing code.",
    link: "/docs/prompt-management/features/playground",
    categories: ["PROMPTS"],
    relatedTerms: ["Chat Prompt", "Text Prompt", "LLM Connection"],
  },
  {
    term: "Project",
    id: "project",
    definition: "A container that groups all Langfuse data within an organization. Projects enable fine-grained role-based access control and separate data for different applications.",
    link: "/docs/administration/rbac",
    categories: ["ADMINISTRATION"],
    relatedTerms: ["Organization", "RBAC", "API Key", "Environment"],
  },
  {
    term: "Prompt Management",
    id: "prompt-management",
    definition: "A systematic approach to storing, versioning, and retrieving prompts for LLM applications. Decouples prompt updates from code deployment.",
    link: "/docs/prompt-management/overview",
    categories: ["PROMPTS"],
    relatedTerms: ["Chat Prompt", "Text Prompt", "Variables", "Playground"],
  },
  {
    term: "Public API",
    id: "public-api",
    definition: "The REST API that provides access to all Langfuse data and features. Used for custom integrations, workflows, and programmatic access.",
    link: "/docs/api-and-data-platform/features/public-api",
    categories: ["API"],
    relatedTerms: ["SDK", "API Key", "MCP Server"],
  },
  {
    term: "RBAC",
    id: "rbac",
    definition: "Role-Based Access Control that manages permissions within Langfuse. Roles include Owner, Admin, Member, Viewer, and None, each with specific scopes.",
    link: "/docs/administration/rbac",
    categories: ["ADMINISTRATION"],
    relatedTerms: ["Organization", "Project"],
    synonyms: ["Role-Based Access Control"],
  },
  {
    term: "Retriever",
    id: "retriever",
    definition: "An observation type that represents data retrieval steps, such as calls to vector stores or databases in RAG applications.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Chain", "Embedding"],
  },
  {
    term: "Sampling",
    id: "sampling",
    definition: "Controlling the volume of traces collected by Langfuse. Configured via sample rate to reduce data volume and costs while maintaining representative coverage.",
    link: "/docs/observability/features/sampling",
    categories: ["OBSERVABILITY", "SDK"],
    relatedTerms: ["Trace", "Instrumentation"],
  },
  {
    term: "Score",
    id: "score",
    definition: "The output of an evaluation. Scores can be numeric, categorical, or boolean and are assigned to traces, observations, sessions, or dataset runs.",
    link: "/docs/evaluation/experiments/data-model#scores",
    categories: ["EVALUATION"],
    relatedTerms: ["Score Config", "Evaluator", "LLM-as-a-Judge", "Annotation Queue"],
  },
  {
    term: "Score Config",
    id: "score-config",
    definition: "A configuration defining how a score is calculated and interpreted. Includes data type, value constraints, and categories for standardized scoring.",
    link: "/docs/evaluation/experiments/data-model#score-config",
    categories: ["EVALUATION"],
    relatedTerms: ["Score", "LLM-as-a-Judge"],
  },
  {
    term: "SDK",
    id: "sdk",
    definition: "Software Development Kit. Langfuse provides native SDKs for Python and JavaScript/TypeScript that handle tracing, prompt management, and API access.",
    link: "/docs/observability/sdk/overview",
    categories: ["SDK"],
    relatedTerms: ["Instrumentation", "Flush", "Public API"],
    synonyms: ["Software Development Kit"],
  },
  {
    term: "Session",
    id: "session",
    definition: "A way to group related traces that are part of the same user interaction. Commonly used for multi-turn conversations or chat threads.",
    link: "/docs/observability/features/sessions",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "User Tracking"],
  },
  {
    term: "Span",
    id: "span",
    definition: "An observation type that represents the duration of a unit of work in a trace. The default observation type for most operations.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Trace", "Generation", "OpenTelemetry"],
  },
  {
    term: "Tags",
    id: "tags",
    definition: "Flexible labels that categorize and filter traces and observations. Useful for organizing by feature, API endpoint, workflow, or other criteria.",
    link: "/docs/observability/features/tags",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Environment"],
  },
  {
    term: "Task",
    id: "task",
    definition: "A function definition that processes dataset items during an experiment. The task represents the application code you want to test.",
    link: "/docs/evaluation/experiments/data-model#task",
    categories: ["EVALUATION"],
    relatedTerms: ["Dataset", "Dataset Item", "Dataset Experiment"],
  },
  {
    term: "Text Prompt",
    id: "text-prompt",
    definition: "A prompt type that consists of a single string. Ideal for simple use cases or when you only need a system message.",
    link: "/docs/prompt-management/data-model#text-vs-chat-prompts",
    categories: ["PROMPTS"],
    relatedTerms: ["Chat Prompt", "Prompt Management", "Variables"],
    synonyms: ["String Prompt"],
  },
  {
    term: "Token Tracking",
    id: "token-tracking",
    definition: "The ability to track token usage across LLM generations. Langfuse captures input and output tokens and can infer usage using built-in tokenizers.",
    link: "/docs/observability/features/token-and-cost-tracking",
    categories: ["OBSERVABILITY", "METRICS"],
    relatedTerms: ["Generation", "Custom Dashboards"],
    synonyms: ["Cost Tracking"],
  },
  {
    term: "Tool",
    id: "tool",
    definition: "An observation type that represents a tool call in your application, such as calling a weather API or executing a database query.",
    link: "/docs/observability/features/observation-types",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Span", "Agent Graph"],
  },
  {
    term: "Trace",
    id: "trace",
    definition: "A single request or operation in your LLM application. Traces contain the overall input, output, and metadata, along with nested observations that capture each step.",
    link: "/docs/observability/data-model",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Observation", "Session", "Span", "Generation"],
  },
  {
    term: "Tracing",
    id: "tracing",
    definition: "The process of capturing structured logs of every request in your LLM application. Includes prompts, responses, token usage, latency, and any intermediate steps.",
    link: "/docs/observability/overview",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Instrumentation", "SDK"],
  },
  {
    term: "User Feedback",
    id: "user-feedback",
    definition: "Collecting feedback from users on LLM outputs. Can be explicit (ratings, comments) or implicit (behavior signals). Captured as scores linked to traces.",
    link: "/docs/observability/features/user-feedback",
    categories: ["EVALUATION", "OBSERVABILITY"],
    relatedTerms: ["Score", "Trace", "Annotation Queue"],
  },
  {
    term: "User Tracking",
    id: "user-tracking",
    definition: "The ability to associate traces with users via a userId. Enables per-user analytics, cost tracking, and filtering.",
    link: "/docs/observability/features/users",
    categories: ["OBSERVABILITY"],
    relatedTerms: ["Trace", "Session"],
  },
  {
    term: "Variables",
    id: "variables",
    definition: "Placeholders in prompts that are dynamically filled at runtime. Allow creating reusable prompt templates with customizable content.",
    link: "/docs/prompt-management/features/variables",
    categories: ["PROMPTS"],
    relatedTerms: ["Prompt Management", "Chat Prompt", "Text Prompt"],
  },
];

// Create a map for quick lookup of terms by id
const termMap = new Map(glossaryTerms.map((t) => [t.id, t]));

// Get all unique first letters
const getAlphabet = (terms: GlossaryTerm[]) => {
  const letters = new Set(terms.map((t) => t.term[0].toUpperCase()));
  return Array.from(letters).sort();
};

// Category badge component
const CategoryBadge = ({
  category,
  onClick,
  isActive,
}: {
  category: CategoryKey;
  onClick?: () => void;
  isActive?: boolean;
}) => {
  const cat = CATEGORIES[category];
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-all",
        cat.color,
        onClick && "cursor-pointer hover:opacity-80",
        isActive && "ring-2 ring-offset-1 ring-primary"
      )}
    >
      {cat.label}
    </button>
  );
};

// Related term link
const RelatedTermLink = ({ termId }: { termId: string }) => {
  const term = termMap.get(termId.toLowerCase().replace(/\s+/g, "-"));
  if (!term) {
    // Try to find by term name
    const foundTerm = glossaryTerms.find(
      (t) => t.term.toLowerCase() === termId.toLowerCase()
    );
    if (foundTerm) {
      return (
        <a
          href={`#${foundTerm.id}`}
          className="text-primary hover:underline text-sm"
        >
          {foundTerm.term}
        </a>
      );
    }
    return <span className="text-sm text-muted-foreground">{termId}</span>;
  }
  return (
    <a href={`#${term.id}`} className="text-primary hover:underline text-sm">
      {term.term}
    </a>
  );
};

// Single glossary entry component
const GlossaryEntry = ({ term }: { term: GlossaryTerm }) => {
  return (
    <div
      id={term.id}
      className="scroll-mt-20 py-4 border-b border-border last:border-b-0"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-semibold m-0">
            {term.link ? (
              <Link href={term.link} className="hover:text-primary">
                {term.term}
              </Link>
            ) : (
              term.term
            )}
          </h3>
          {term.synonyms && term.synonyms.length > 0 && (
            <span className="text-sm text-muted-foreground">
              ({term.synonyms.join(", ")})
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {term.categories.map((cat) => (
            <CategoryBadge key={cat} category={cat} />
          ))}
        </div>
        <p className="text-sm text-muted-foreground m-0 mt-1">
          {term.definition}
        </p>
        {term.relatedTerms && term.relatedTerms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs text-muted-foreground font-medium">
              Related:
            </span>
            {term.relatedTerms.map((rt, i) => (
              <React.Fragment key={rt}>
                <RelatedTermLink termId={rt} />
                {i < term.relatedTerms!.length - 1 && (
                  <span className="text-muted-foreground">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Glossary component
export const Glossary = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<CategoryKey[]>([]);

  const toggleCategory = (category: CategoryKey) => {
    setActiveCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setActiveCategories([]);
    setSearchQuery("");
  };

  // Filter terms based on search and categories
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter((term) => {
      const matchesSearch =
        searchQuery === "" ||
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.synonyms?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategories =
        activeCategories.length === 0 ||
        term.categories.some((c) => activeCategories.includes(c));

      return matchesSearch && matchesCategories;
    });
  }, [searchQuery, activeCategories]);

  // Group terms by first letter
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const alphabet = getAlphabet(glossaryTerms);
  const activeLetters = new Set(Object.keys(groupedTerms));

  const hasActiveFilters = activeCategories.length > 0 || searchQuery !== "";

  return (
    <div className="mt-6">
      {/* Filters section */}
      <div className="sticky top-16 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 pt-2 -mt-2 border-b border-border mb-4">
        {/* Search input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground mr-1">Filter:</span>
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((cat) => (
            <CategoryBadge
              key={cat}
              category={cat}
              onClick={() => toggleCategory(cat)}
              isActive={activeCategories.includes(cat)}
            />
          ))}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground ml-2 underline"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Alphabetical navigation */}
        <div className="flex flex-wrap gap-1 mt-4 text-sm">
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={activeLetters.has(letter) ? `#letter-${letter}` : undefined}
              className={cn(
                "w-7 h-7 flex items-center justify-center rounded transition-colors",
                activeLetters.has(letter)
                  ? "text-primary hover:bg-primary/10 font-medium"
                  : "text-muted-foreground/40 cursor-default"
              )}
            >
              {letter}
            </a>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredTerms.length} of {glossaryTerms.length} terms
      </p>

      {/* Glossary entries grouped by letter */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No terms found matching your filters.</p>
          <button
            onClick={clearFilters}
            className="text-primary hover:underline mt-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        Object.entries(groupedTerms)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, terms]) => (
            <div key={letter} id={`letter-${letter}`} className="mb-6">
              <h2 className="text-2xl font-bold text-primary border-b-2 border-primary pb-1 mb-2 scroll-mt-48">
                {letter}
              </h2>
              {terms
                .sort((a, b) => a.term.localeCompare(b.term))
                .map((term) => (
                  <GlossaryEntry key={term.id} term={term} />
                ))}
            </div>
          ))
      )}
    </div>
  );
};

export default Glossary;
