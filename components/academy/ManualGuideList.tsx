"use client";

import Link from "next/link";

export interface ManualGuideListItem {
  href: string;
  topic: string;
  lede?: React.ReactNode;
}

export interface ManualGuideListProps {
  /** Label shown in the ribbon header. Defaults to "Guides". */
  title?: string;
  /** Guides to render as rows. */
  guides: ManualGuideListItem[];
}

export function ManualGuideList({
  title = "Guides",
  guides,
}: ManualGuideListProps) {
  return (
    <>
      <section className="manual-guide-list not-prose corner-box-corners">
        <header className="manual-guide-list__ribbon">
          <div className="manual-guide-list__ribbon-lead">
            <span className="manual-guide-list__mark" aria-hidden="true">
              <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                <path
                  d="M3 3.5h7M3 6.5h7M3 9.5h4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="manual-guide-list__ribbon-prefix">{title}</span>
          </div>
        </header>

        <ul className="manual-guide-list__items">
          {guides.map((guide) => (
            <li key={guide.href} className="manual-guide-list__item">
              <GuideRow {...guide} />
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .manual-guide-list {
          position: relative;
          display: block;
          margin: 32px 0;
          background: var(--surface-bg);
          color: var(--text-primary);
          border: 1px solid var(--line-structure);
          border-radius: 0;
          font-family: var(--font-sans);
        }

        .manual-guide-list__ribbon {
          background: var(--surface-beige-accent);
          border-bottom: 1px solid var(--line-structure);
          padding: 9px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-primary);
        }

        .manual-guide-list__ribbon-lead {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .manual-guide-list__ribbon-prefix {
          color: var(--text-secondary);
        }

        .manual-guide-list__mark {
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

        .manual-guide-list__items {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .manual-guide-list__item + .manual-guide-list__item {
          border-top: 1px solid var(--line-structure);
        }

        .manual-guide-list__row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 14px 24px;
          color: var(--text-primary);
          text-decoration: none;
          transition: background-color 0.15s ease;
        }

        .manual-guide-list__row:hover {
          background: var(--surface-beige-accent);
        }

        .manual-guide-list__row:hover .manual-guide-list__row-arrow {
          transform: translateX(3px);
          color: var(--text-primary);
        }

        .manual-guide-list__row-main {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .manual-guide-list__row-topic {
          font-family: var(--font-sans);
          font-size: 14.5px;
          font-weight: 500;
          color: var(--text-primary);
        }

        .manual-guide-list__row-lede {
          font-family: var(--font-sans);
          font-size: 13.5px;
          line-height: 1.5;
          color: var(--text-tertiary);
          margin: 0;
          max-width: 560px;
        }

        .manual-guide-list__row-arrow {
          color: var(--text-secondary);
          flex-shrink: 0;
          transition: transform 0.15s, color 0.15s;
        }

        @media (max-width: 720px) {
          .manual-guide-list__row {
            padding: 12px 18px;
          }
        }
      `}</style>
    </>
  );
}

function GuideRow({ href, topic, lede }: ManualGuideListItem) {
  const isExternal = /^https?:/i.test(href);

  const content = (
    <>
      <div className="manual-guide-list__row-main">
        <span className="manual-guide-list__row-topic">{topic}</span>
        {lede && <p className="manual-guide-list__row-lede">{lede}</p>}
      </div>
      <span className="manual-guide-list__row-arrow" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h10M8 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  return isExternal ? (
    <a
      href={href}
      className="manual-guide-list__row"
      target="_blank"
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <Link href={href} className="manual-guide-list__row">
      {content}
    </Link>
  );
}
