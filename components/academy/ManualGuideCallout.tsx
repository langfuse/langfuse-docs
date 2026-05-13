"use client";

import Link from "next/link";

export interface ManualGuideCalloutProps {
  /** Where the card links to (cookbook URL or similar). */
  href: string;
  /** Ribbon label, default "Walk through manually". */
  ribbon?: string;
  /** Right side of the ribbon — e.g. "~30 min · 5 steps". */
  meta?: string;
  /** Title shown beneath the ribbon. */
  title: string;
  /** Lede paragraph beneath the title. */
  lede?: React.ReactNode;
  /** CTA button text, default "Open the guide". */
  cta?: string;
}

export function ManualGuideCallout({
  href,
  ribbon = "Walk through manually",
  meta,
  title,
  lede,
  cta = "Open the guide",
}: ManualGuideCalloutProps) {
  const isExternal = /^https?:/i.test(href);

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    isExternal ? (
      <a
        href={href}
        className="manual-guide not-prose"
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    ) : (
      <Link href={href} className="manual-guide not-prose">
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
            <span>{ribbon}</span>
          </div>
          {meta && <span className="manual-guide__meta">{meta}</span>}
        </header>

        <div className="manual-guide__body">
          <h3 className="manual-guide__title">{title}</h3>
          {lede && <p className="manual-guide__lede">{lede}</p>}
        </div>

        <footer className="manual-guide__foot">
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
        </footer>
      </Wrapper>

      <style>{`
        .manual-guide {
          position: relative;
          display: block;
          margin: 32px 0;
          background: var(--surface-bg);
          color: var(--text-primary);
          border: 1px solid var(--line-cta);
          border-radius: 2px;
          overflow: hidden;
          font-family: var(--font-sans);
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.2s ease;
        }

        .manual-guide:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.07);
        }

        .manual-guide:hover .manual-guide__cta {
          background: var(--text-primary);
          color: var(--surface-bg);
        }

        .manual-guide:hover .manual-guide__cta-arrow {
          transform: translateX(3px);
        }

        .manual-guide__ribbon {
          background: var(--surface-beige-accent);
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

        .manual-guide__ribbon-lead {
          display: flex;
          align-items: center;
          gap: 12px;
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

        .manual-guide__meta {
          font-size: 10px;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .manual-guide__body {
          padding: 18px 24px 14px;
        }

        .manual-guide__title {
          font-family: var(--font-analog), serif;
          font-weight: 500;
          font-size: 22px;
          line-height: 1.15;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          margin: 0 0 8px;
        }

        .manual-guide__lede {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--text-tertiary);
          margin: 0;
          max-width: 560px;
        }

        .manual-guide__foot {
          border-top: 1px solid var(--line-structure);
          background: var(--surface-1);
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }

        .manual-guide__cta {
          flex: 1;
          padding: 12px 24px;
          background: var(--surface-bg);
          display: inline-flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: var(--text-primary);
          transition: background 0.15s, color 0.15s;
        }

        .manual-guide__cta-arrow {
          transition: transform 0.15s;
        }

        @media (max-width: 720px) {
          .manual-guide__body {
            padding: 16px 18px 12px;
          }

          .manual-guide__title {
            font-size: 19px;
          }

          .manual-guide__cta {
            padding: 12px 18px;
          }
        }
      `}</style>
    </>
  );
}
