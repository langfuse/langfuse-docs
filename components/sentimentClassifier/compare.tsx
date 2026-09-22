"use client";

import { useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { scoreDemoNegativeUserFeedback } from "@/components/demoLangfuseBrowserClients";
import { SendIcon } from "lucide-react";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";
import {
  EXAMPLE_TEXTS,
  ENGINE_CONFIG,
  classifiersForCount,
  classifySentiment,
  getPersistedSentimentUserId,
  type ClassifierId,
  type ClassifierRunResult,
} from "./shared";
import { SentimentResultPanel } from "./resultPanel";
import { CompareMetricBoxes } from "./metricBoxes";
import { CLASSIFIER_SEQUENCE, type ClassifierDefinition } from "./criteria";
import { sumUsage, type SentimentUsage } from "./cost";
import type { ClassifierAnswer } from "./types";

const PUBLIC_SAMPLE_PROJECT_TRACES_URL =
  "https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi/traces";

type EngineState = {
  result: ClassifierRunResult;
  traceId: string;
  latencyMs: number;
};

type LlmSlot =
  | { status: "loading" }
  | {
      status: "success";
      answer: ClassifierAnswer;
      usage: SentimentUsage;
      model: string;
      traceId: string;
      latencyMs: number;
    }
  | { status: "error"; error: string };

type LlmSlots = Partial<Record<ClassifierId, LlmSlot>>;

const LlmTaskSlot = ({
  definition,
  slot,
  index,
  total,
  compact,
  feedback,
  onFeedback,
}: {
  definition: ClassifierDefinition;
  slot: LlmSlot | undefined;
  index: number;
  total: number;
  compact: boolean;
  feedback?: boolean | null;
  onFeedback?: (value: boolean) => void;
}) => {
  if (slot?.status === "success") {
    return (
      <SentimentResultPanel
        answer={slot.answer}
        compact={compact}
        feedback={feedback}
        onFeedback={onFeedback}
      />
    );
  }

  if (slot?.status === "error") {
    return (
      <div className="space-y-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {definition.name}
        </p>
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {slot.error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {definition.name}
      </p>
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader size={16} />
        {total === 1
          ? ENGINE_CONFIG.llm.loading
          : `Call ${index + 1} of ${total} running in parallel…`}
      </div>
    </div>
  );
};

export const SentimentClassifierCompare = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const capture = usePostHogClientCapture();
  const [input, setInput] = useState("");
  const [taskCount, setTaskCount] = useState(1);
  const [jevLoading, setJevLoading] = useState(false);
  const [inputText, setInputText] = useState<string | null>(null);
  const [jev, setJev] = useState<EngineState | null>(null);
  const [jevError, setJevError] = useState<string | null>(null);
  const [llmSlots, setLlmSlots] = useState<LlmSlots | null>(null);
  const [jevFeedback, setJevFeedback] = useState<boolean | null>(null);
  const [llmFeedback, setLlmFeedback] = useState<boolean | null>(null);

  const selected = classifiersForCount(taskCount);
  const compact = selected.length > 1;
  const llmSlotList = selected.map((definition) => llmSlots?.[definition.id]);
  const llmPending =
    llmSlots != null &&
    llmSlotList.some((slot) => !slot || slot.status === "loading");
  const llmSuccesses = llmSlotList.filter(
    (slot): slot is Extract<LlmSlot, { status: "success" }> =>
      slot?.status === "success",
  );
  const llmAllFailed =
    llmSlots != null &&
    llmSlotList.length > 0 &&
    llmSlotList.every((slot) => slot?.status === "error");
  const lunaUsage = sumUsage(llmSuccesses.map((slot) => slot.usage));
  const lunaLatencyMs =
    llmSlots != null && !llmPending && llmSuccesses.length > 0
      ? Math.max(...llmSuccesses.map((slot) => slot.latencyMs))
      : null;
  const loading = jevLoading || llmPending;

  const clearRun = () => {
    setJev(null);
    setJevError(null);
    setLlmSlots(null);
    setJevFeedback(null);
    setLlmFeedback(null);
  };

  const handleTaskCount = (count: number) => {
    if (loading || count === taskCount) return;
    setTaskCount(count);
    clearRun();
  };

  const handleSubmit = async (text?: string) => {
    const textToAnalyze = text ?? input;
    const userId =
      typeof window === "undefined" ? null : getPersistedSentimentUserId();
    if (!textToAnalyze.trim() || !userId || loading) return;

    const tasks = selected.map((definition) => definition.id);

    capture("demo:sentiment_analyze_submitted", {
      source: "jev_evals_blog",
      mode: "compare",
      from_example: typeof text === "string",
      text_char_count: textToAnalyze.trim().length,
      classification_count: tasks.length,
    });

    setInputText(textToAnalyze);
    clearRun();
    setJevLoading(true);

    const pendingSlots = Object.fromEntries(
      selected.map((definition) => [definition.id, { status: "loading" }]),
    ) as LlmSlots;
    setLlmSlots(pendingSlots);
    const llmStarted = performance.now();

    const jevStarted = performance.now();
    void classifySentiment("jev", textToAnalyze, userId, tasks).then(
      (outcome) => {
        if (outcome.ok === false) {
          setJevError(outcome.error);
        } else {
          setJev({
            result: outcome.data.result,
            traceId: outcome.data.traceId,
            latencyMs: performance.now() - jevStarted,
          });
        }
        setJevLoading(false);
      },
    );

    // One HTTP request per classification so each Luna call can resolve on its own.
    for (const definition of selected) {
      void classifySentiment("llm", textToAnalyze, userId, [
        definition.id,
      ]).then((outcome) => {
        const answer =
          outcome.ok === true ? outcome.data.result.answers[0] : undefined;
        setLlmSlots((current) => ({
          ...(current ?? {}),
          [definition.id]:
            outcome.ok === false
              ? { status: "error", error: outcome.error }
              : answer
                ? {
                    status: "success",
                    answer,
                    usage: outcome.data.result.usage,
                    model: outcome.data.result.model,
                    traceId: outcome.data.traceId,
                    latencyMs: performance.now() - llmStarted,
                  }
                : {
                    status: "error",
                    error: "No classification returned",
                  },
        }));
      });
    }
  };

  const hasResults = Boolean(jev || jevError || llmSlots);
  const showMetrics = hasResults || loading;
  const firstLlmSuccess = llmSuccesses[0];

  return (
    <div className={cn(className)} {...props}>
      <div className="rounded-[2px] border border-line-structure bg-surface-bg corner-box-corners p-5 space-y-4">
        <div className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to analyze..."
            className="w-full h-28 p-3 rounded-[2px] border border-line-structure bg-surface-bg text-text-secondary text-sm shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-line-cta"
          />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-text-primary">
                Classifications
              </p>
              <div className="inline-flex rounded-[2px] border border-line-structure p-0.5">
                {CLASSIFIER_SEQUENCE.map((_, index) => {
                  const count = index + 1;
                  const active = taskCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handleTaskCount(count)}
                      disabled={loading}
                      aria-pressed={active}
                      className={cn(
                        "min-w-8 h-7 px-2.5 text-xs font-medium rounded-[2px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                        active
                          ? "bg-text-primary text-surface-bg"
                          : "text-text-secondary hover:text-text-primary",
                      )}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                {selected.map((definition) => definition.name).join(" · ")}
              </p>
            </div>
            <p className="text-xs text-muted-foreground max-w-xs sm:text-right">
              Jev answers all of them in one pass. Luna runs a parallel call per
              classification.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit()}
              disabled={!input.trim() || loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] border border-line-structure bg-text-primary text-surface-bg text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {loading ? <Loader size={14} /> : <SendIcon className="size-4" />}
              Analyze both
            </button>
            {loading && (
              <span className="text-xs text-muted-foreground">
                {selected.length > 1
                  ? "Jev returns together; Luna calls resolve as each one finishes…"
                  : "Results appear as each classifier finishes…"}
              </span>
            )}
          </div>
        </div>

        {!hasResults && !loading && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Try an example:</p>
            <Suggestions>
              {EXAMPLE_TEXTS.map((text, i) => (
                <Suggestion
                  key={i}
                  suggestion={text}
                  onClick={(s) => {
                    setInput(s);
                    handleSubmit(s);
                  }}
                  className="text-xs whitespace-normal text-left h-auto py-2 max-w-64"
                >
                  {text.length > 60 ? `${text.slice(0, 60)}...` : text}
                </Suggestion>
              ))}
            </Suggestions>
          </div>
        )}

        {(hasResults || loading) && inputText && (
          <div className="p-3 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-sm text-text-secondary">
            <span className="font-medium text-text-primary">Analyzed: </span>
            {inputText}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[2px] border border-line-structure p-4 space-y-3 min-h-48">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  TypeSafe Jev
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {selected.length === 1
                    ? "1 request · 1 question"
                    : `1 request · ${selected.length} questions`}
                </p>
              </div>
              {jev?.result.model && (
                <span className="text-[11px] text-muted-foreground font-mono">
                  {jev.result.model}
                </span>
              )}
            </div>
            {jevLoading && !jev && !jevError && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center">
                <Loader size={16} />
                {ENGINE_CONFIG.jev.loading}
              </div>
            )}
            {jevError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {jevError}
              </div>
            )}
            {jev && (
              <div className="space-y-4">
                {jev.result.answers.map((answer, index) => (
                  <div
                    key={answer.id}
                    className={
                      index > 0
                        ? "border-t border-line-structure pt-4"
                        : undefined
                    }
                  >
                    <SentimentResultPanel
                      answer={answer}
                      compact={compact}
                      feedback={index === 0 ? jevFeedback : undefined}
                      onFeedback={
                        index === 0
                          ? (value) => {
                              setJevFeedback(value);
                              scoreDemoNegativeUserFeedback({
                                traceId: jev.traceId,
                                value,
                              });
                            }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-[2px] border border-line-structure p-4 space-y-3 min-h-48">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">
                  GPT-5.6 Luna
                </h3>
                <p className="text-[11px] text-muted-foreground">
                  {selected.length === 1
                    ? "1 call · high reasoning"
                    : `${selected.length} parallel calls · high reasoning`}
                </p>
              </div>
              {firstLlmSuccess?.model && (
                <span className="text-[11px] text-muted-foreground font-mono">
                  {firstLlmSuccess.model}
                </span>
              )}
            </div>
            {llmSlots && (
              <div className="space-y-4">
                {selected.map((definition, index) => (
                  <div
                    key={definition.id}
                    className={
                      index > 0
                        ? "border-t border-line-structure pt-4"
                        : undefined
                    }
                  >
                    <LlmTaskSlot
                      definition={definition}
                      slot={llmSlots[definition.id]}
                      index={index}
                      total={selected.length}
                      compact={compact}
                      feedback={
                        firstLlmSuccess?.answer.id === definition.id
                          ? llmFeedback
                          : undefined
                      }
                      onFeedback={
                        firstLlmSuccess?.answer.id === definition.id
                          ? (value) => {
                              setLlmFeedback(value);
                              scoreDemoNegativeUserFeedback({
                                traceId: firstLlmSuccess.traceId,
                                value,
                              });
                            }
                          : undefined
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showMetrics && (
          <CompareMetricBoxes
            jevLatencyMs={jev?.latencyMs ?? null}
            lunaLatencyMs={lunaLatencyMs}
            jevUsage={jev?.result.usage}
            lunaUsage={lunaUsage}
            jevLoading={jevLoading}
            lunaLoading={llmPending}
            jevError={Boolean(jevError)}
            lunaError={llmAllFailed}
          />
        )}

        <div className="space-y-3 text-sm text-text-secondary leading-relaxed border-t border-line-structure pt-4">
          <p>
            Check out the traces of both in our{" "}
            <a
              href={PUBLIC_SAMPLE_PROJECT_TRACES_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                capture("demo:view_trace_in_langfuse_clicked", {
                  source: "jev_evals_blog",
                  trace_url: PUBLIC_SAMPLE_PROJECT_TRACES_URL,
                });
              }}
              className="underline underline-offset-2 text-text-links hover:text-primary"
            >
              public sample project
            </a>
            . Look for <code className="text-xs">Sentiment-Classifier-Jev</code>{" "}
            and <code className="text-xs">Sentiment-Classifier-GPT</code>. In
            this example we can see two very distinct differences:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Jev is a lot faster and cheaper than GPT-5.6 Luna with high
              reasoning. Add classifications with the 1–4 control: Jev keeps one
              request, Luna runs parallel calls that resolve independently so
              cost scales with the count. Latency and estimated cost are
              compared below the results.
            </li>
            <li>
              Jev returns a decision and confidence only, with no reasoning.
              Luna returns an explanation and key phrases after thinking.
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            The interactive{" "}
            <a
              href="/docs/demo#sentiment"
              className="underline underline-offset-2 hover:text-foreground"
            >
              example project
            </a>{" "}
            demo tab shows the Jev classifier only.{" "}
            <a
              href="https://cloud.langfuse.com/auth/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              Sign up for Langfuse Cloud
            </a>{" "}
            (free) for view access to the shared project.
          </p>
        </div>
      </div>
    </div>
  );
};
