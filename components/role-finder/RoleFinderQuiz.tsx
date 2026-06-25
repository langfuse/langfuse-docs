"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Option, Question, QuizResult } from "./role-finder-data";

/** A role with live job-board data merged in (resolved by the server component). */
export type ResolvedRole = {
  key: string;
  /** False when the role is no longer listed on the live Ashby board. */
  available: boolean;
  title: string;
  url: string;
  pitch: string;
  youll: string[];
};

type RoleFinderQuizProps = {
  roles: Record<string, ResolvedRole>;
  tree: Record<string, Question>;
  rootId: string;
  careersFallbackUrl: string;
};

type View =
  | { type: "question"; id: string }
  | { type: "result"; res: QuizResult };

export function RoleFinderQuiz({
  roles,
  tree,
  rootId,
  careersFallbackUrl,
}: RoleFinderQuizProps) {
  const [history, setHistory] = React.useState<string[]>([]);
  const [view, setView] = React.useState<View>({
    type: "question",
    id: rootId,
  });

  // Memoize, per question, whether any reachable result is for an available
  // role. Used to hide answer options that only lead to closed roles.
  const optionLeadsToAvailable = React.useMemo(() => {
    const questionCache = new Map<string, boolean>();

    const questionHasAvailable = (
      id: string,
      visited: Set<string>,
    ): boolean => {
      if (questionCache.has(id)) return questionCache.get(id)!;
      if (visited.has(id)) return false;
      visited.add(id);
      const question = tree[id];
      if (!question) return false;
      const result = question.options.some((opt) =>
        leadsToAvailable(opt, visited),
      );
      questionCache.set(id, result);
      return result;
    };

    const leadsToAvailable = (
      option: Option,
      visited: Set<string>,
    ): boolean => {
      if (typeof option.next === "string") {
        return questionHasAvailable(option.next, visited);
      }
      return Boolean(roles[option.next.result]?.available);
    };

    return (option: Option) => leadsToAvailable(option, new Set<string>());
  }, [roles, tree]);

  // Longest path (number of questions) from the root to any result. Used as the
  // progress-bar denominator so it stays correct if the tree changes.
  const maxDepth = React.useMemo(() => {
    const depthOf = (id: string, visited: Set<string>): number => {
      const question = tree[id];
      if (!question || visited.has(id)) return 0;
      visited.add(id);
      let deepest = 1;
      for (const option of question.options) {
        if (typeof option.next === "string") {
          deepest = Math.max(deepest, 1 + depthOf(option.next, visited));
        }
      }
      visited.delete(id);
      return deepest;
    };
    return Math.max(1, depthOf(rootId, new Set<string>()));
  }, [tree, rootId]);

  // The result screen is the final step beyond the last question.
  const totalSteps = maxDepth + 1;
  const currentStep = view.type === "result" ? totalSteps : history.length + 1;
  const progress = Math.min(1, currentStep / totalSteps);

  const answer = (option: Option) => {
    if (view.type !== "question") return;
    setHistory((h) => [...h, view.id]);
    if (typeof option.next === "string") {
      setView({ type: "question", id: option.next });
    } else {
      setView({ type: "result", res: option.next });
    }
  };

  const back = () => {
    if (view.type === "result") {
      // Return to the question that produced this result.
      const previous = history[history.length - 1];
      if (previous) setView({ type: "question", id: previous });
      setHistory((h) => h.slice(0, -1));
      return;
    }
    setHistory((h) => {
      if (h.length === 0) return h;
      const previous = h[h.length - 1];
      setView({ type: "question", id: previous });
      return h.slice(0, -1);
    });
  };

  const startOver = () => {
    setHistory([]);
    setView({ type: "question", id: rootId });
  };

  const canGoBack = history.length > 0 || view.type === "result";

  return (
    <div className="not-prose mx-auto w-full max-w-2xl">
      <div
        className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Quiz progress"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {view.type === "question" ? (
        <QuestionScreen
          question={tree[view.id]}
          questionNumber={history.length + 1}
          onAnswer={answer}
          isOptionVisible={optionLeadsToAvailable}
          careersFallbackUrl={careersFallbackUrl}
        />
      ) : (
        <ResultScreen
          res={view.res}
          roles={roles}
          careersFallbackUrl={careersFallbackUrl}
        />
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={back}
          disabled={!canGoBack}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back
        </button>
        <button
          type="button"
          onClick={startOver}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Start over
        </button>
      </div>
    </div>
  );
}

function QuestionScreen({
  question,
  questionNumber,
  onAnswer,
  isOptionVisible,
  careersFallbackUrl,
}: {
  question: Question | undefined;
  questionNumber: number;
  onAnswer: (option: Option) => void;
  isOptionVisible: (option: Option) => boolean;
  careersFallbackUrl: string;
}) {
  if (!question) {
    return <ClosedFallback careersFallbackUrl={careersFallbackUrl} />;
  }

  const visibleOptions = question.options.filter(isOptionVisible);

  if (visibleOptions.length === 0) {
    return <ClosedFallback careersFallbackUrl={careersFallbackUrl} />;
  }

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Question {questionNumber}
      </p>
      <h2 className="mt-1.5 text-balance text-xl font-semibold tracking-tight md:text-2xl">
        {question.q}
      </h2>
      <div className="mt-5 flex flex-col gap-3">
        {visibleOptions.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onAnswer(option)}
            className={cn(
              "group flex w-full items-center justify-between gap-3 rounded-lg border border-border bg-card p-4 text-left",
              "transition-colors hover:border-foreground/30 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            <span className="text-sm font-medium md:text-base">
              {option.label}
            </span>
            <ArrowRight
              className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
              aria-hidden
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultScreen({
  res,
  roles,
  careersFallbackUrl,
}: {
  res: QuizResult;
  roles: Record<string, ResolvedRole>;
  careersFallbackUrl: string;
}) {
  const role = roles[res.result];

  // Defensive: if the matched role has closed since the tree was authored,
  // fall back to the general careers board.
  if (!role || !role.available) {
    return <ClosedFallback careersFallbackUrl={careersFallbackUrl} />;
  }

  const alsoRoles = (res.also ?? [])
    .map((key) => roles[key])
    .filter((r): r is ResolvedRole => Boolean(r?.available));

  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Your best match
      </p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight md:text-3xl">
        {role.title}
      </h2>
      <p className="mt-3 text-muted-foreground">{role.pitch}</p>

      <ul className="mt-5 flex flex-col gap-2.5">
        {role.youll.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-foreground"
              aria-hidden
            />
            <span className="text-sm">{item}</span>
          </li>
        ))}
      </ul>

      {res.note ? (
        <p className="mt-5 rounded-md border-l-2 border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
          {res.note}
        </p>
      ) : null}

      <div className="mt-6">
        <a
          href={role.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          View role &amp; apply
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>

      {alsoRoles.length > 0 ? (
        <div className="mt-7 border-t border-border pt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Also worth a look
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {alsoRoles.map((r) => (
              <li key={r.key}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {r.title}
                  <ExternalLink
                    className="h-3.5 w-3.5 text-muted-foreground"
                    aria-hidden
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function ClosedFallback({
  careersFallbackUrl,
}: {
  careersFallbackUrl: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 md:p-8">
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
        That role isn&apos;t open right now
      </h2>
      <p className="mt-3 text-muted-foreground">
        The roles change as we grow. Browse all currently open positions to find
        your fit.
      </p>
      <div className="mt-6">
        <a
          href={careersFallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          See all open roles
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}
