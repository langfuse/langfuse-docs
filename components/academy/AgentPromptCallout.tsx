"use client";

import { useState } from "react";

const DEFAULT_AGENTS = "Claude Code · Cursor · Codex";
const DEFAULT_TIME = "~5 min";

export interface AgentPromptCalloutProps {
  /** Ribbon label, e.g. "Run with your agent". */
  ribbon?: string;
  /** Estimated time shown on the right side of the ribbon, e.g. "~5 min". Set to "" to hide. */
  time?: string;
  /** Compatible agents shown after the time, e.g. "Claude Code · Cursor · Codex". Set to "" to hide. */
  agents?: string;
  /** Title shown above the lede. */
  title?: string;
  /** Lede paragraph beneath the title. */
  lede?: React.ReactNode;
  /** The exact text written to the clipboard. */
  prompt: string;
  /** Optional "what you'll get" footer items. Omit to hide the footer. */
  steps?: string[];
}

export function AgentPromptCallout({
  ribbon = "Run with your agent",
  time = DEFAULT_TIME,
  agents = DEFAULT_AGENTS,
  title,
  lede,
  prompt,
  steps,
}: AgentPromptCalloutProps) {
  const meta = [time, agents].filter(Boolean).join(" · ");
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(prompt.trim()).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      },
      () => {}
    );
  };

  return (
    <figure
      className="agent-prompt not-prose"
      role="region"
      aria-label={ribbon}
    >
      <header className="agent-prompt__ribbon">
        <div className="agent-prompt__ribbon-lead">
          <span className="agent-prompt__mark" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path
                d="M2 3v4a2 2 0 0 0 2 2h6M7 6l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>{ribbon}</span>
        </div>
        {meta && <span className="agent-prompt__meta">{meta}</span>}
      </header>

      {(title || lede) && (
        <div className="agent-prompt__body">
          {title && <h3 className="agent-prompt__title">{title}</h3>}
          {lede && <p className="agent-prompt__lede">{lede}</p>}
        </div>
      )}

      <div className="agent-prompt__prompt">
        <div className="agent-prompt__gutter" aria-hidden="true">
          &gt;_
        </div>
        <pre className="agent-prompt__code">{prompt.trim()}</pre>
        <button
          type="button"
          onClick={onCopy}
          aria-label={copied ? "Copied" : "Copy prompt"}
          className={`agent-prompt__copy${
            copied ? " agent-prompt__copy--copied" : ""
          }`}
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path
                  d="M3 7l3 3 5-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="9"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  rx="1"
                />
                <path
                  d="M5 3V2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {steps && steps.length > 0 && (
        <footer className="agent-prompt__foot">
          <div className="agent-prompt__foot-label">What you'll get</div>
          <div className="agent-prompt__foot-items">
            {steps.map((step, i) => (
              <div key={i} className="agent-prompt__foot-item">
                <span className="agent-prompt__foot-step">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </footer>
      )}

      <style>{`
        .agent-prompt {
          position: relative;
          margin: 32px 0;
          background: var(--surface-bg);
          color: var(--text-primary);
          border: 1px solid var(--line-cta);
          border-radius: 2px;
          overflow: hidden;
          font-family: var(--font-sans);
        }

        .agent-prompt__ribbon {
          background: var(--surface-cta-primary);
          border-bottom: 1px solid var(--line-cta);
          padding: 9px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .agent-prompt__ribbon-lead {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .agent-prompt__mark {
          width: 18px;
          height: 18px;
          background: var(--text-primary);
          color: var(--surface-cta-primary);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 1px;
          flex-shrink: 0;
        }

        .agent-prompt__mark svg {
          width: 11px;
          height: 11px;
        }

        .agent-prompt__meta {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
        }

        .agent-prompt__body {
          padding: 18px 24px 14px;
        }

        .agent-prompt__title {
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 22px;
          line-height: 1.15;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          margin: 0 0 8px;
        }

        .agent-prompt__lede {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--text-tertiary);
          margin: 0;
          max-width: 640px;
        }

        .agent-prompt__prompt {
          position: relative;
          margin: 0 24px 20px;
          background:
            repeating-linear-gradient(
              315deg,
              var(--surface-bg),
              var(--surface-bg) 3px,
              color-mix(in oklab, var(--text-tertiary) 10%, transparent) 5px,
              var(--surface-bg) 5px
            );
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          display: flex;
          align-items: stretch;
          overflow: hidden;
        }

        .agent-prompt__gutter {
          flex-shrink: 0;
          width: 36px;
          background: color-mix(in oklab, var(--text-tertiary) 12%, transparent);
          border-right: 1px solid var(--line-structure);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 13px;
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-disabled);
        }

        .agent-prompt__code {
          flex: 1;
          margin: 0;
          padding: 14px 16px;
          padding-right: 80px;
          font-family: var(--font-mono);
          font-size: 12.5px;
          line-height: 1.6;
          color: var(--text-primary);
          white-space: pre-wrap;
          word-break: break-word;
          background: transparent;
        }

        .agent-prompt__copy {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          background: var(--surface-cta-primary);
          color: var(--text-primary);
          border: 1px solid var(--line-cta);
          border-radius: 2px;
          padding: 4px 8px;
          font-family: var(--font-sans);
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: -0.005em;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          line-height: 1;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .agent-prompt__copy:hover {
          background: color-mix(in oklab, var(--surface-cta-primary) 80%, white);
        }

        .agent-prompt__copy--copied,
        .agent-prompt__copy--copied:hover {
          background: var(--callout-success);
          color: #fff;
          border-color: var(--callout-success);
        }

        .agent-prompt__copy svg {
          display: block;
        }

        .agent-prompt__foot {
          padding: 14px 24px 16px;
          border-top: 1px dashed var(--line-divider-dash);
          display: flex;
          align-items: flex-start;
          gap: 18px;
          background: var(--surface-1);
        }

        .agent-prompt__foot-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          flex-shrink: 0;
          width: 100px;
          padding-top: 2px;
        }

        .agent-prompt__foot-items {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px 20px;
          font-family: var(--font-sans);
          font-size: 12.5px;
          color: var(--text-secondary);
          line-height: 1.45;
        }

        .agent-prompt__foot-item {
          display: flex;
          gap: 7px;
          align-items: baseline;
        }

        .agent-prompt__foot-step {
          font-family: var(--font-mono);
          font-size: 10.5px;
          color: var(--text-disabled);
          letter-spacing: 0.06em;
          flex-shrink: 0;
        }

        @media (max-width: 720px) {
          .agent-prompt__body {
            padding: 16px 18px 12px;
          }

          .agent-prompt__title {
            font-size: 19px;
          }

          .agent-prompt__prompt {
            margin: 0 18px 16px;
          }

          .agent-prompt__gutter {
            display: none;
          }

          .agent-prompt__code {
            padding-right: 72px;
          }

          .agent-prompt__foot {
            flex-direction: column;
            padding: 12px 18px 14px;
            gap: 8px;
          }

          .agent-prompt__foot-label {
            width: auto;
          }

          .agent-prompt__foot-items {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </figure>
  );
}
