"use client";

import { useState } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { scoreDemoNegativeUserFeedback } from "@/components/demoLangfuseBrowserClients";
import { SendIcon } from "lucide-react";
import {
  EXAMPLE_TEXTS,
  ENGINE_CONFIG,
  type JevSentimentResult,
  type LlmSentimentResult,
  classifySentiment,
  getPersistedSentimentUserId,
} from "./shared";
import { SentimentResultPanel } from "./resultPanel";

export const SentimentClassifierCompare = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (text?: string) => {
    const textToAnalyze = text ?? input;
    const userId =
      typeof window === "undefined" ? null : getPersistedSentimentUserId();
    if (!textToAnalyze.trim() || !userId) return;

    setLoading(true);
    setInputText(textToAnalyze);
    setJev(null);
    setLlm(null);
    setJevError(null);
    setLlmError(null);
    setJevFeedback(null);
    setLlmFeedback(null);

    const [jevOutcome, llmOutcome] = await Promise.all([
      classifySentiment("jev", textToAnalyze, userId),
      classifySentiment("llm", textToAnalyze, userId),
    ]);

    if (jevOutcome.ok) {
      setJev({
        result: jevOutcome.data.result as JevSentimentResult,
        traceId: jevOutcome.data.traceId,
      });
    } else {
      setJevError(jevOutcome.error);
    }

    if (llmOutcome.ok) {
      setLlm({
        result: llmOutcome.data.result as LlmSentimentResult,
        traceId: llmOutcome.data.traceId,
      });
    } else {
      setLlmError(llmOutcome.error);
    }

    setLoading(false);
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
                Running Jev and GPT-4o-mini in parallel…
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
            {loading && !jev && !jevError && (
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
                GPT-4o mini
              </h3>
            </div>
            {loading && !llm && !llmError && (
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

        <p className="text-xs text-muted-foreground text-center italic">
          One Analyze runs both classifiers. The{" "}
          <a
            href="/docs/demo#sentiment"
            className="underline underline-offset-2 hover:text-foreground"
          >
            example project
          </a>{" "}
          shows the Jev classifier only. All interactions are traced.
        </p>
      </div>
    </div>
  );
};
