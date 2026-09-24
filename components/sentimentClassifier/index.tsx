"use client";

import { useState, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { scoreDemoNegativeUserFeedback } from "@/components/demoLangfuseBrowserClients";
import { SendIcon } from "lucide-react";
import {
  EXAMPLE_TEXTS,
  ENGINE_CONFIG,
  type SentimentEngine,
  classifySentiment,
  getPersistedSentimentUserId,
} from "./shared";
import type { ClassifierRunResult } from "./types";
import { SentimentResultPanel } from "./resultPanel";

type SentimentClassifierProps = HTMLAttributes<HTMLDivElement> & {
  /** Jev is the example-project classifier. `llm` is available for reuse elsewhere. */
  engine?: SentimentEngine;
};

export const SentimentClassifier = ({
  className,
  engine = "jev",
  ...props
}: SentimentClassifierProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    result: ClassifierRunResult;
    traceId: string;
    inputText: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getPersistedSentimentUserId();
  }, []);

  const handleSubmit = async (text?: string) => {
    const textToAnalyze = text ?? input;
    if (!textToAnalyze.trim() || !userId) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedback(null);

    const outcome = await classifySentiment(engine, textToAnalyze, userId);
    if (outcome.ok === false) {
      setError(outcome.error);
    } else {
      setResult({ ...outcome.data, inputText: textToAnalyze });
    }
    setLoading(false);
  };

  const firstAnswer = result?.result.answers[0];
  const jevModel = result?.result.model;

  return (
    <div className={cn("h-[62vh]", className)} {...props}>
      <div className="flex flex-col h-full rounded-[2px] border border-line-structure bg-surface-bg corner-box-corners p-5 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto relative z-10 space-y-4">
          <div className="space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to analyze sentiment..."
              className="w-full h-32 p-3 rounded-[2px] border border-line-structure bg-surface-bg text-text-secondary text-sm shadow-sm resize-none focus:outline-none focus:ring-1 focus:ring-line-cta"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[2px] border border-line-structure bg-text-primary text-surface-bg text-sm font-medium shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {loading ? (
                  <Loader size={14} />
                ) : (
                  <SendIcon className="size-4" />
                )}
                Analyze
              </button>
            </div>
          </div>

          {!result && !loading && (
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

          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader size={16} />
                {ENGINE_CONFIG[engine].loading}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="p-3 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-sm text-text-secondary">
                <span className="font-medium text-text-primary">
                  Analyzed:{" "}
                </span>
                {result.inputText}
              </div>

              {firstAnswer && (
                <SentimentResultPanel
                  answer={firstAnswer}
                  usage={result.result.usage}
                  feedback={feedback}
                  onFeedback={(value) => {
                    setFeedback(value);
                    scoreDemoNegativeUserFeedback({
                      traceId: result.traceId,
                      value,
                    });
                  }}
                />
              )}
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center relative z-10 italic">
          {engine === "jev" ? (
            <>
              Powered by{" "}
              <a
                href="/integrations/model-providers/typesafe"
                className="underline underline-offset-2 hover:text-foreground"
              >
                TypeSafe Jev
              </a>
              {jevModel ? ` (${jevModel})` : ""}.
            </>
          ) : (
            <>Powered by GPT-5.6 Luna (high reasoning).</>
          )}{" "}
          All interactions are traced in the public example project.
        </p>
      </div>
    </div>
  );
};
