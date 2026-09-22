"use client";

import { cn } from "@/lib/utils";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import {
  DEFAULT_ANSWER_COLORS,
  SENTIMENT_COLORS,
  formatCostUsd,
  type SentimentLabel,
} from "./shared";
import { CLASSIFIERS } from "./criteria";
import type { ClassifierAnswer } from "./types";
import type { SentimentUsage } from "./cost";

type SentimentResultPanelProps = {
  answer: ClassifierAnswer;
  usage?: SentimentUsage;
  compact?: boolean;
  feedback?: boolean | null;
  onFeedback?: (value: boolean) => void;
};

const answerColors = (answer: ClassifierAnswer) => {
  if (answer.id === "sentiment" && answer.value in SENTIMENT_COLORS) {
    return SENTIMENT_COLORS[answer.value as SentimentLabel];
  }
  return DEFAULT_ANSWER_COLORS;
};

export const SentimentResultPanel = ({
  answer,
  usage,
  compact = false,
  feedback,
  onFeedback,
}: SentimentResultPanelProps) => {
  const colors = answerColors(answer);
  const probabilityEntries = answer.probabilities
    ? Object.keys(CLASSIFIERS[answer.id].criteria).map((label) => ({
        label,
        probability: answer.probabilities?.[label] ?? 0,
      }))
    : [];
  const showReasoning = Boolean(
    answer.explanation || answer.keyPhrases?.length,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {answer.name}
          </p>
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-sm font-semibold capitalize",
              colors.bg,
              colors.text,
            )}
          >
            {answer.value.replaceAll("_", " ")}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Confidence</span>
            <span>{Math.round(answer.confidence * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                colors.bar,
              )}
              style={{ width: `${answer.confidence * 100}%` }}
            />
          </div>
        </div>
      </div>

      {usage && (
        <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-muted-foreground border border-line-structure rounded-[2px] px-2.5 py-2">
          <span>
            Est. cost{" "}
            <span className="font-semibold tabular-nums text-text-primary">
              {formatCostUsd(usage.costUsd)}
            </span>
          </span>
          <span className="tabular-nums">
            {usage.inputTokens.toLocaleString()} in
            {usage.outputTokens > 0
              ? ` · ${usage.outputTokens.toLocaleString()} out`
              : ""}
            {typeof usage.reasoningTokens === "number" &&
            usage.reasoningTokens > 0
              ? ` · ${usage.reasoningTokens.toLocaleString()} reasoning`
              : ""}
          </span>
        </div>
      )}

      {probabilityEntries.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">
            Probabilities
          </p>
          {probabilityEntries.map(({ label, probability }) => {
            const labelColors =
              answer.id === "sentiment" && label in SENTIMENT_COLORS
                ? SENTIMENT_COLORS[label as SentimentLabel]
                : DEFAULT_ANSWER_COLORS;
            return (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize text-text-secondary">
                    {label.replaceAll("_", " ")}
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

      {showReasoning && !compact && (
        <>
          {answer.explanation && (
            <div className="text-sm text-foreground">{answer.explanation}</div>
          )}
          {answer.keyPhrases && answer.keyPhrases.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground font-medium">
                Key phrases
              </p>
              <div className="flex flex-wrap gap-1.5">
                {answer.keyPhrases.map((phrase, i) => (
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

      {showReasoning && compact && (
        <details className="text-sm">
          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
            Show reasoning
          </summary>
          <div className="mt-2 space-y-2">
            {answer.explanation && (
              <div className="text-sm text-foreground">
                {answer.explanation}
              </div>
            )}
            {answer.keyPhrases && answer.keyPhrases.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {answer.keyPhrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2 py-0.5 rounded-[2px] border border-line-structure bg-[#403d391a] dark:bg-[#b8b6a01a] text-xs text-text-secondary"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            )}
          </div>
        </details>
      )}

      {onFeedback && (
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
      )}
    </div>
  );
};
