"use client";

import { useState, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import { Suggestions, Suggestion } from "@/components/ai-elements/suggestion";
import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";
import { scoreDemoNegativeUserFeedback } from "@/components/demoLangfuseBrowserClients";
import { SendIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";

type SentimentLabel = "positive" | "negative" | "neutral";

type JevSentimentResult = {
  sentiment: SentimentLabel;
  confidence: number;
  probabilities: Record<SentimentLabel, number>;
  model: string;
};

type LlmSentimentResult = {
  sentiment: SentimentLabel;
  confidence: number;
  explanation: string;
  keyPhrases: string[];
};

type SentimentEngine = "jev" | "llm";

const ENGINE_CONFIG: Record<
  SentimentEngine,
  { endpoint: string; loading: string }
> = {
  jev: {
    endpoint: "/api/sentiment-classifier",
    loading: "Classifying with Jev...",
  },
  llm: {
    endpoint: "/api/sentiment-classifier-llm",
    loading: "Classifying with GPT-4o-mini...",
  },
};

const EXAMPLE_TEXTS = [
  "The product quality exceeded all my expectations. Customer service was incredibly helpful and responsive!",
  "I'm extremely disappointed with the delivery. The package arrived damaged and two weeks late.",
  "The meeting is scheduled for 3pm in conference room B. Please bring your laptop.",
];

const SENTIMENT_ORDER: SentimentLabel[] = ["positive", "neutral", "negative"];

const SENTIMENT_COLORS: Record<
  SentimentLabel,
  { bg: string; text: string; bar: string }
> = {
  positive: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-800 dark:text-green-300",
    bar: "bg-green-500",
  },
  negative: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-800 dark:text-red-300",
    bar: "bg-red-500",
  },
  neutral: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-800 dark:text-yellow-300",
    bar: "bg-yellow-500",
  },
};

type SentimentClassifierProps = HTMLAttributes<HTMLDivElement> & {
  /** Jev is the example-project classifier. `llm` is the previous GPT-4o-mini version, used by the blog comparison tabs. */
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
    result: JevSentimentResult | LlmSentimentResult;
    traceId: string;
    inputText: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);

  const userId = useMemo(() => {
    if (typeof window === "undefined") return null;
    return getPersistedNanoId({
      key: "sentiment-classifier-user-id",
      prefix: "u-",
    });
  }, []);

  const handleSubmit = async (text?: string) => {
    const textToAnalyze = text ?? input;
    if (!textToAnalyze.trim() || !userId) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedback(null);

    try {
      const res = await fetch(ENGINE_CONFIG[engine].endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze, userId }),
      });

      const responseText = await res.text();
      let data: any;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Invalid response from server");
      }

      if (!res.ok) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setResult({ ...data, inputText: textToAnalyze });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (value: boolean) => {
    if (!result) return;
    setFeedback(value);
    scoreDemoNegativeUserFeedback({
      traceId: result.traceId,
      value,
    });
  };

  const colors = result ? SENTIMENT_COLORS[result.result.sentiment] : null;
  const jevResult =
    result && "probabilities" in result.result ? result.result : null;
  const llmResult =
    result && "explanation" in result.result ? result.result : null;

  return (
    <div className={cn("h-[62vh]", className)} {...props}>
      <div className="flex flex-col h-full rounded-[2px] border border-line-structure bg-surface-bg corner-box-corners p-5 relative overflow-hidden">
        <div className="flex-1 overflow-y-auto relative z-10 space-y-4">
          {/* Input area */}
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

          {/* Example suggestions */}
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

          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader size={16} />
                {ENGINE_CONFIG[engine].loading}
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Result */}
          {result && colors && (
            <div className="space-y-4">
              {/* Analyzed text */}
              <div className="p-3 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-sm text-text-secondary">
                <span className="font-medium text-text-primary">
                  Analyzed:{" "}
                </span>
                {result.inputText}
              </div>

              {/* Sentiment badge + confidence */}
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-[2px] text-sm font-semibold capitalize",
                    colors.bg,
                    colors.text,
                  )}
                >
                  {result.result.sentiment}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Confidence</span>
                    <span>{Math.round(result.result.confidence * 100)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        colors.bar,
                      )}
                      style={{ width: `${result.result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Probability distribution from Jev Choice */}
              {jevResult && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    Probabilities
                  </p>
                  {SENTIMENT_ORDER.map((label) => {
                    const probability = jevResult.probabilities[label] ?? 0;
                    const labelColors = SENTIMENT_COLORS[label];
                    return (
                      <div key={label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="capitalize text-text-secondary">
                            {label}
                          </span>
                          <span className="text-muted-foreground tabular-nums">
                            {Math.round(probability * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              labelColors.bar,
                            )}
                            style={{ width: `${probability * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explanation and key phrases from the GPT classifier */}
              {llmResult && (
                <>
                  <div className="text-sm text-foreground">
                    {llmResult.explanation}
                  </div>
                  {llmResult.keyPhrases.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground font-medium">
                        Key phrases
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {llmResult.keyPhrases.map((phrase, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-xs text-text-secondary"
                          >
                            {phrase}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Feedback */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Was this classification accurate?
                </span>
                <button
                  onClick={() => handleFeedback(false)}
                  className={cn(
                    "p-1.5 rounded-[2px] transition-colors",
                    feedback === false
                      ? "text-green-700 dark:text-green-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <ThumbsUpIcon className="size-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback(true)}
                  className={cn(
                    "p-1.5 rounded-[2px] transition-colors",
                    feedback === true
                      ? "text-red-700 dark:text-red-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                  )}
                >
                  <ThumbsDownIcon className="size-3.5" />
                </button>
              </div>
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
              {jevResult?.model ? ` (${jevResult.model})` : ""}.
            </>
          ) : (
            <>Powered by GPT-4o-mini.</>
          )}{" "}
          All interactions are traced in the public example project.
        </p>
      </div>
    </div>
  );
};
