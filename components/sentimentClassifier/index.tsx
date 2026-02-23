"use client";

import { useState, useMemo } from "react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "@/components/ai-elements/loader";
import {
  Suggestions,
  Suggestion,
} from "@/components/ai-elements/suggestion";
import { LangfuseWeb } from "langfuse";
import { getPersistedNanoId } from "@/components/qaChatbot/utils/persistedNanoId";
import { SendIcon, ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";

const eulangfuseWebClient = new LangfuseWeb({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
});

const usLangfuseWebClient = new LangfuseWeb({
  publicKey: process.env.NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.NEXT_PUBLIC_US_LANGFUSE_BASE_URL,
});

type SentimentResult = {
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  explanation: string;
  keyPhrases: string[];
};

const EXAMPLE_TEXTS = [
  "The product quality exceeded all my expectations. Customer service was incredibly helpful and responsive!",
  "I'm extremely disappointed with the delivery. The package arrived damaged and two weeks late.",
  "The meeting is scheduled for 3pm in conference room B. Please bring your laptop.",
];

const SENTIMENT_COLORS = {
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

type SentimentClassifierProps = HTMLAttributes<HTMLDivElement>;

export const SentimentClassifier = ({
  className,
  ...props
}: SentimentClassifierProps) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    result: SentimentResult;
    traceId: string;
    inputText: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<number | null>(null);

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
      const res = await fetch("/api/sentiment-classifier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToAnalyze, userId }),
      });

      const text = await res.text();
      let data: any;
      try {
        data = text ? JSON.parse(text) : {};
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

  const handleFeedback = (value: number) => {
    if (!result) return;
    setFeedback(value);
    for (const client of [eulangfuseWebClient, usLangfuseWebClient]) {
      client.score({
        traceId: result.traceId,
        id: `user-feedback-${result.traceId}`,
        name: "user-feedback",
        value,
      });
    }
  };

  const colors = result ? SENTIMENT_COLORS[result.result.sentiment] : null;

  return (
    <div className={cn("h-[62vh]", className)} {...props}>
      <div className="flex flex-col h-full border border-border/40 rounded-2xl bg-gradient-to-br from-background via-background/95 to-muted/20 backdrop-blur-md shadow-xl shadow-black/10 dark:shadow-black/30 p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/15 dark:hover:shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:via-transparent before:to-transparent before:pointer-events-none">
        <div className="flex-1 overflow-y-auto relative z-10 space-y-4">
          {/* Input area */}
          <div className="space-y-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to analyze sentiment..."
              className="w-full h-32 p-3 rounded-lg border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSubmit()}
                disabled={!input.trim() || loading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                Analyzing sentiment...
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
              <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Analyzed: </span>
                {result.inputText}
              </div>

              {/* Sentiment badge + confidence */}
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold capitalize",
                    colors.bg,
                    colors.text
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
                      className={cn("h-full rounded-full transition-all duration-500", colors.bar)}
                      style={{ width: `${result.result.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Explanation */}
              <div className="text-sm text-foreground">
                {result.result.explanation}
              </div>

              {/* Key phrases */}
              {result.result.keyPhrases.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground font-medium">
                    Key phrases
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.result.keyPhrases.map((phrase, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground"
                      >
                        {phrase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  Was this classification accurate?
                </span>
                <button
                  onClick={() => handleFeedback(1)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    feedback === 1
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <ThumbsUpIcon className="size-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback(0)}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    feedback === 0
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <ThumbsDownIcon className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-muted-foreground text-center relative z-10 italic">
          Powered by GPT-4o-mini. All interactions are traced in the public example project.
        </p>
      </div>
    </div>
  );
};
