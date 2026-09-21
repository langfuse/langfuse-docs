"use client";

import { cn } from "@/lib/utils";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import {
  SENTIMENT_COLORS,
  SENTIMENT_ORDER,
  type JevSentimentResult,
  type LlmSentimentResult,
} from "./shared";

type SentimentResultPanelProps = {
  result: JevSentimentResult | LlmSentimentResult;
  feedback: boolean | null;
  onFeedback: (value: boolean) => void;
};

export const SentimentResultPanel = ({
  result,
  feedback,
  onFeedback,
}: SentimentResultPanelProps) => {
  const colors = SENTIMENT_COLORS[result.sentiment];
  const jevResult = "probabilities" in result ? result : null;
  const llmResult = "explanation" in result ? result : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-[2px] text-sm font-semibold capitalize",
            colors.bg,
            colors.text,
          )}
        >
          {result.sentiment}
        </span>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Confidence</span>
            <span>{Math.round(result.confidence * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                colors.bar,
              )}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
        </div>
      </div>

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

      {llmResult && (
        <>
          <div className="text-sm text-foreground">{llmResult.explanation}</div>
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

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Was this classification accurate?
        </span>
        <button
          onClick={() => onFeedback(false)}
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
          onClick={() => onFeedback(true)}
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
  );
};
