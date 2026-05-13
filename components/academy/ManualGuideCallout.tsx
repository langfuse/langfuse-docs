"use client";

import Link from "next/link";

export interface ManualGuideCalloutProps {
  /** Where the card links to (cookbook URL or similar). */
  href: string;
  /** Topic shown in the ribbon after the static "Guide:" prefix, e.g. "error analysis". */
  topic: string;
  /** Lede paragraph beneath the ribbon. */
  lede?: React.ReactNode;
  /** CTA button text, default "Open the guide". */
  cta?: string;
}

export function ManualGuideCallout({
  href,
  topic,
  lede,
  cta = "Open",
}: ManualGuideCalloutProps) {
  const isExternal = /^https?:/i.test(href);

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a
        href={href}
        className="manual-guide not-prose corner-box-corners"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className="manual-guide not-prose corner-box-corners">
        {children}
      </Link>
    );

  return (
    <>
      <Wrapper>
        <header className="manual-guide__ribbon">
          <div className="manual-guide__ribbon-lead">
            <span className="manual-guide__mark" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                <path
                  d="M3 3.5h7M3 6.5h7M3 9.5h4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span>
              <span className="manual-guide__ribbon-prefix">Guide:</span>{" "}
              {topic}
            </span>
          </div>
          <span className="manual-guide__cta">
            {cta}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              className="manual-guide__cta-arrow"
              aria-hidden="true"
            >
              <path
                d="M3 8h10M8 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </header>

        {lede && (
          <div className="manual-guide__body">
            <p className="manual-guide__lede">{lede}</p>
          </div>
        )}
      </Wrapper>

      <style>{`
        .manual-guide {
          position: relative;
          display: block;
          margin: 32px 0;
          background: var(--surface-bg);
          color: var(--text-primary);
          border: 1px solid var(--line-structure);
          border-radius: 0;
          font-family: var(--font-sans);
          text-decoration: none;
          transition: border-color 0.15s ease;
        }

        .manual-guide:hover {
          border-color: var(--line-cta);
        }

        .manual-guide:hover .manual-guide__cta {
          color: var(--text-primary);
        }

        .manual-guide:hover .manual-guide__cta-arrow {
          transform: translateX(3px);
        }

        .manual-guide__ribbon {
          background: var(--surface-beige-accent);
          border-bottom: 1px solid var(--line-structure);
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

        .manual-guide__ribbon-lead {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .manual-guide__ribbon-prefix {
          color: var(--text-secondary);
        }

        .manual-guide__mark {
          width: 18px;
          height: 18px;
          background: var(--text-primary);
          color: var(--surface-beige-accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 1px;
          flex-shrink: 0;
        }

        .manual-guide__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--text-secondary);
          white-space: nowrap;
          transition: color 0.15s;
        }

        .manual-guide__cta-arrow {
          transition: transform 0.15s;
        }

        .manual-guide__body {
          padding: 14px 24px 16px;
        }

        .manual-guide__lede {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--text-tertiary);
          margin: 0;
          max-width: 560px;
        }

        @media (max-width: 720px) {
          .manual-guide__body {
            padding: 12px 18px 14px;
          }
        }
      `}</style>
    </>
  );
}
