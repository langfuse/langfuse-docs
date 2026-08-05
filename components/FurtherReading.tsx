export interface FurtherReadingResource {
  /** Stable id used by inline <Ref /> markers; required when numbered. */
  id?: string;
  title: string;
  url: string;
}

export function FurtherReading({
  resources,
  rules = true,
  numbered = false,
}: {
  resources: FurtherReadingResource[];
  rules?: boolean;
  numbered?: boolean;
}) {
  return (
    <figure
      className="further-reading not-prose"
      aria-label={numbered ? "References" : "Further reading"}
    >
      {rules ? (
        <hr className="further-reading__rule further-reading__rule--top" />
      ) : null}

      <div className="further-reading__list">
        {resources.map((resource, index) => (
          <a
            key={resource.url}
            id={numbered ? `ref-${resource.id ?? index + 1}` : undefined}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="further-reading__item"
          >
            {numbered ? (
              <span className="further-reading__num">{index + 1}</span>
            ) : null}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="further-reading__book"
            >
              <path d="M12 7v14" />
              <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
            </svg>
            <span className="further-reading__title">{resource.title}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="further-reading__arrow"
            >
              <path d="M7 17L17 7" />
              <path d="M8 7H17V16" />
            </svg>
          </a>
        ))}
      </div>

      {rules ? (
        <hr className="further-reading__rule further-reading__rule--bottom" />
      ) : null}

      <style>{`
        .further-reading {
          margin: 16px 0;
          width: 100%;
        }

        .further-reading__rule {
          border: 0;
          border-top: 1px dashed var(--line-divider-dash);
        }

        .further-reading__rule--top {
          margin: 0 0 13px;
        }

        .further-reading__rule--bottom {
          margin: 13px 0 0;
        }

        .further-reading__list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .further-reading__item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 14px;
          line-height: 1.5;
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.15s ease;
          scroll-margin-top: 96px;
        }

        .further-reading__item:hover {
          color: var(--text-primary);
        }

        .further-reading__num {
          flex: none;
          min-width: 14px;
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 21px;
          color: var(--text-tertiary);
        }

        .further-reading__book {
          flex: none;
          color: var(--text-tertiary);
          margin-top: 3px;
        }

        .further-reading__title {
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: var(--line-structure);
        }

        .further-reading__arrow {
          flex: none;
          color: var(--text-disabled);
          margin-top: 5px;
        }
      `}</style>
    </figure>
  );
}
