"use client";

import { useState } from "react";

export interface EvaluatorBlockEvaluator {
  name: string;
  /** "LLM-as-a-judge" | "Code" | "Human" */
  type: string;
  /** The one-line check, shown in the collapsed row. */
  check?: React.ReactNode;
  /** Score output, e.g. "binary, on the trace". Shown with the type in the expanded meta line. */
  returns?: string;
  /**
   * Narrative shown when the row is expanded: why it is this type of
   * evaluator, what it returns, where it runs. Can contain links.
   */
  details?: React.ReactNode;
}

export function EvaluatorBlock({
  evaluators,
}: {
  evaluators: EvaluatorBlockEvaluator[];
}) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <figure className="evaluator-block not-prose" aria-label="Evaluators">
      <div className="evaluator-block__card corner-box-corners">
        <header className="evaluator-block__ribbon">
          <span className="evaluator-block__mark" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
              <path
                d="M2.5 7l3 3 5-6.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Evaluators</span>
        </header>

        {evaluators.map((evaluator, index) => {
          const expandable = Boolean(evaluator.details);
          const isOpen = expandable && open.has(index);
          const rowContent = (
            <>
              <span className="evaluator-block__name">{evaluator.name}</span>
              {evaluator.check ? (
                <span className="evaluator-block__check">
                  {evaluator.check}
                </span>
              ) : null}
              {expandable ? (
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                  className="evaluator-block__chevron"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className="evaluator-block__chevron-spacer" aria-hidden />
              )}
            </>
          );
          return (
            <div className="evaluator-block__group" key={evaluator.name}>
              {expandable ? (
                <button
                  type="button"
                  className="evaluator-block__row"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                >
                  {rowContent}
                </button>
              ) : (
                <div className="evaluator-block__row evaluator-block__row--static">
                  {rowContent}
                </div>
              )}

              {isOpen ? (
                <div className="evaluator-block__details">
                  <div className="evaluator-block__detail-meta">
                    {evaluator.type}
                    {evaluator.returns ? ` · returns ${evaluator.returns}` : ""}
                  </div>
                  <div className="evaluator-block__narrative">
                    {evaluator.details}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <style>{`
        .evaluator-block {
          margin: 16px 0;
          width: 100%;
        }

        .evaluator-block__card {
          position: relative;
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          border-radius: 2px;
        }

        .evaluator-block__ribbon {
          background: var(--surface-beige-accent);
          border-bottom: 1px solid var(--line-structure);
          padding: 7px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 10.5px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .evaluator-block__mark {
          width: 17px;
          height: 17px;
          background: var(--text-primary);
          color: var(--surface-beige-accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 1px;
          flex-shrink: 0;
        }

        .evaluator-block__group + .evaluator-block__group {
          border-top: 1px dashed var(--line-divider-dash);
        }

        .evaluator-block__row {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: baseline;
          gap: 9px;
          width: 100%;
          cursor: pointer;
          padding: 9px 14px;
        }

        .evaluator-block__row:hover {
          background: var(--surface-1);
        }

        .evaluator-block__row--static {
          cursor: default;
        }

        .evaluator-block__row--static:hover {
          background: transparent;
        }

        .evaluator-block__name {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
        }

        @media (min-width: 641px) {
          .evaluator-block__name {
            flex: 0 0 19ch;
          }
        }

        .evaluator-block__check {
          font-size: 12.5px;
          line-height: 1.45;
          color: var(--text-secondary);
          flex: 1 1 auto;
          min-width: 0;
        }

        .evaluator-block__check code {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--text-primary);
        }

        .evaluator-block__chevron {
          flex: none;
          align-self: center;
          margin-left: auto;
          color: var(--text-tertiary);
          transition: transform 0.18s ease;
        }

        .evaluator-block__chevron-spacer {
          width: 11px;
          flex: none;
        }

        .evaluator-block__details {
          padding: 10px 14px 12px;
          background: var(--surface-1);
          border-top: 1px dashed var(--line-divider-dash);
        }

        .evaluator-block__detail-meta {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          margin-bottom: 6px;
        }

        .evaluator-block__narrative {
          font-size: 12.5px;
          line-height: 1.55;
          color: var(--text-secondary);
          max-width: 620px;
        }

        .evaluator-block__narrative a {
          color: var(--text-primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .evaluator-block__narrative code {
          font-family: var(--font-mono);
          font-size: 11.5px;
          color: var(--text-primary);
        }

        .evaluator-block__narrative p {
          margin: 0;
        }

        .evaluator-block__narrative p + p {
          margin-top: 6px;
        }
      `}</style>
    </figure>
  );
}
