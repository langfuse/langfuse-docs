"use client";

import { useState } from "react";

export interface AgentPromptCalloutProps {
  /** Ribbon label, e.g. "Run with your agent". */
  ribbon?: string;
  /** Title shown above the lede. */
  title?: string;
  /** Lede paragraph beneath the title. */
  lede?: React.ReactNode;
  /** The exact text written to the clipboard. */
  prompt: string;
}

export function AgentPromptCallout({
  ribbon = "Run with your agent",
  title,
  lede,
  prompt,
}: AgentPromptCalloutProps) {
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
      className="agent-prompt not-prose corner-box-corners"
      role="region"
      aria-label={ribbon}
    >
      <header className="agent-prompt__ribbon">
        <span className="agent-prompt__mark" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
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
      </header>

      {(title || lede) && (
        <div className="agent-prompt__body">
          {title && <h3 className="agent-prompt__title">{title}</h3>}
          {lede && <p className="agent-prompt__lede">{lede}</p>}
        </div>
      )}

      <div className="agent-prompt__prompt">
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
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7l3 3 5-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
          )}
        </button>
      </div>

      <style>{`
        .agent-prompt {
          position: relative;
          margin: 24px 0;
          background: var(--surface-bg);
          color: var(--text-primary);
          border: 1px solid var(--line-structure);
          border-radius: 0;
          font-family: var(--font-sans);
        }

        .agent-prompt__ribbon {
          background: var(--surface-beige-accent);
          border-bottom: 1px solid var(--line-structure);
          padding: 7px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .agent-prompt__mark {
          width: 16px;
          height: 16px;
          background: var(--text-primary);
          color: var(--surface-beige-accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 1px;
          flex-shrink: 0;
        }

        .agent-prompt__body {
          padding: 12px 18px 4px;
        }

        .agent-prompt__title {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 14px;
          line-height: 1.3;
          color: var(--text-primary);
          margin: 0 0 4px;
        }

        .agent-prompt__lede {
          font-family: var(--font-sans);
          font-size: 13px;
          line-height: 1.5;
          color: var(--text-tertiary);
          margin: 0;
          max-width: 640px;
        }

        .agent-prompt__prompt {
          position: relative;
          margin: 12px 18px 18px;
          background:
            repeating-linear-gradient(
              315deg,
              var(--surface-bg),
              var(--surface-bg) 3px,
              color-mix(in oklab, var(--text-tertiary) 8%, transparent) 5px,
              var(--surface-bg) 5px
            );
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          overflow: hidden;
        }

        .agent-prompt__code {
          margin: 0;
          padding: 12px 14px;
          padding-right: 44px;
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
          top: 6px;
          right: 6px;
          z-index: 2;
          background: var(--surface-bg);
          color: var(--text-tertiary);
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          padding: 4px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }

        .agent-prompt__copy:hover {
          color: var(--text-primary);
          border-color: var(--line-cta);
        }

        .agent-prompt__copy--copied,
        .agent-prompt__copy--copied:hover {
          color: var(--callout-success);
          border-color: var(--line-structure);
          background: var(--surface-bg);
        }

        .agent-prompt__copy svg {
          display: block;
        }

        @media (max-width: 720px) {
          .agent-prompt__body {
            padding: 10px 14px 2px;
          }

          .agent-prompt__prompt {
            margin: 10px 14px 14px;
          }
        }
      `}</style>
    </figure>
  );
}
