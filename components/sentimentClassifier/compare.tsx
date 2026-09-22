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
  type JevSentimentResult,
  type LlmSentimentResult,
  classifySentiment,
  getPersistedSentimentUserId,
} from "./shared";
import { SentimentResultPanel } from "./resultPanel";

const PUBLIC_SAMPLE_PROJECT_TRACES_URL =
  "https://cloud.langfuse.com/project/clkpwwm0m000gmm094odg11gi/traces";

export const SentimentClassifierCompare = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const capture = usePostHogClientCapture();
  const [input, setInput] = useState("");
  const [jevLoading, setJevLoading] = useState(false);
  const [llmLoading, setLlmLoading] = useState(false);
  const [inputText, setInputText] = useState<string | null>(null);
  const [jev, setJev] = useState<{
    result: JevSentimentResult;
    traceId: string;
  } | null>(null);
  const [llm, setLlm] = useState<{
    result: LlmSentimentResult;
    traceId: string;
  } | null>(null);
  const [jevError, setJevError] = useState<string | null>(null);
  const [llmError, setLlmError] = useState<string | null>(null);
  const [jevFeedback, setJevFeedback] = useState<boolean | null>(null);
  const [llmFeedback, setLlmFeedback] = useState<boolean | null>(null);

  const loading = jevLoading || llmLoading;

  const handleSubmit = async (text?: string) => {
    const textToAnalyze = text ?? input;
    const userId =
      typeof window === "undefined" ? null : getPersistedSentimentUserId();
    if (!textToAnalyze.trim() || !userId || loading) return;

    capture("demo:sentiment_analyze_submitted", {
      source: "jev_evals_blog",
      mode: "compare",
      from_example: typeof text === "string",
      text_char_count: textToAnalyze.trim().length,
    });

    setInputText(textToAnalyze);
    setJev(null);
    setLlm(null);
    setJevError(null);
    setLlmError(null);
    setJevFeedback(null);
    setLlmFeedback(null);
    setJevLoading(true);
    setLlmLoading(true);

    // Paint each column as soon as its classifier returns — Jev usually lands first.
    void classifySentiment("jev", textToAnalyze, userId).then((outcome) => {
      if (outcome.ok === false) {
        setJevError(outcome.error);
      } else {
        setJev({
          result: outcome.data.result as JevSentimentResult,
          traceId: outcome.data.traceId,
        });
      }
      setJevLoading(false);
    });

    void classifySentiment("llm", textToAnalyze, userId).then((outcome) => {
      if (outcome.ok === false) {
        setLlmError(outcome.error);
      } else {
        setLlm({
          result: outcome.data.result as LlmSentimentResult,
          traceId: outcome.data.traceId,
        });
      }
      setLlmLoading(false);
    });
  };

  const hasResults = Boolean(jev || llm || jevError || llmError);

  return (
    <div className={cn(className)} {...props}>
      <div className="rounded-[2px] border border-line-structure bg-surface-bg corner-box-corners p-5 space-y-4">
        <div className="space-y-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to analyze sentiment..."
            className="w-full h-28 p-3 rounded-[2px] border border-line-structure bg-surface-bg text-text-secondary text-sm shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-line-cta"
          />
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
                Results appear as each classifier finishes…
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
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                TypeSafe Jev
              </h3>
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
              <SentimentResultPanel
                result={jev.result}
                feedback={jevFeedback}
                onFeedback={(value) => {
                  setJevFeedback(value);
                  scoreDemoNegativeUserFeedback({
                    traceId: jev.traceId,
                    value,
                  });
                }}
              />
            )}
          </div>

          <div className="rounded-[2px] border border-line-structure p-4 space-y-3 min-h-48">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-text-primary">
                GPT-5.6 Luna
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono">
                high reasoning
              </span>
            </div>
            {llmLoading && !llm && !llmError && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center">
                <Loader size={16} />
                {ENGINE_CONFIG.llm.loading}
              </div>
            )}
            {llmError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {llmError}
              </div>
            )}
            {llm && (
              <SentimentResultPanel
                result={llm.result}
                feedback={llmFeedback}
                onFeedback={(value) => {
                  setLlmFeedback(value);
                  scoreDemoNegativeUserFeedback({
                    traceId: llm.traceId,
                    value,
                  });
                }}
              />
            )}
          </div>
        </div>

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
              reasoning — each column updates when its model finishes, and
              estimated cost is shown per run.
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
