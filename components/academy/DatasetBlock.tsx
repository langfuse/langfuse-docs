"use client";

import { useState } from "react";

export interface DatasetBlockItem {
  input: string;
  expectedOutput: string;
}

export interface DatasetBlockDataset {
  name: string;
  description?: string;
  items: DatasetBlockItem[];
}

export function DatasetBlock({
  datasets,
}: {
  datasets: DatasetBlockDataset[];
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
    <figure className="dataset-block not-prose" aria-label="Example datasets">
      <div className="dataset-block__card corner-box-corners">
        <header className="dataset-block__ribbon">
          <span className="dataset-block__mark" aria-hidden="true">
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
              <ellipse
                cx="6.5"
                cy="3.5"
                rx="3.8"
                ry="1.7"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M2.7 3.5v6c0 .94 1.7 1.7 3.8 1.7s3.8-.76 3.8-1.7v-6"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M2.7 6.5c0 .94 1.7 1.7 3.8 1.7s3.8-.76 3.8-1.7"
                stroke="currentColor"
                strokeWidth="1.3"
              />
            </svg>
          </span>
          <span>Datasets</span>
        </header>
        {datasets.map((dataset, index) => {
          const isOpen = open.has(index);
          return (
            <div className="dataset-block__group" key={dataset.name}>
              <button
                type="button"
                className="dataset-block__row"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
              >
                <span className="dataset-block__name">{dataset.name}</span>
                {dataset.description ? (
                  <span className="dataset-block__description">
                    {dataset.description}
                  </span>
                ) : null}
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden
                  className="dataset-block__chevron"
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
              </button>

              {isOpen ? (
                <div className="dataset-block__items">
                  {dataset.items.map((item) => (
                    <div className="dataset-block__item" key={item.input}>
                      <div className="dataset-block__cell dataset-block__cell--input">
                        <div className="dataset-block__field">input</div>
                        <div className="dataset-block__value dataset-block__value--input">
                          {item.input}
                        </div>
                      </div>
                      <div className="dataset-block__cell">
                        <div className="dataset-block__field">
                          expected_output
                        </div>
                        <div className="dataset-block__value">
                          {item.expectedOutput}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <style>{`
        .dataset-block {
          margin: 16px 0;
          width: 100%;
        }

        .dataset-block__ribbon {
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

        .dataset-block__mark {
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

        .dataset-block__card {
          position: relative;
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          border-radius: 2px;
        }

        .dataset-block__group + .dataset-block__group {
          border-top: 1px dashed var(--line-divider-dash);
        }

        .dataset-block__row {
          all: unset;
          box-sizing: border-box;
          display: flex;
          align-items: baseline;
          gap: 9px;
          width: 100%;
          cursor: pointer;
          padding: 9px 14px;
        }

        .dataset-block__row:hover {
          background: var(--surface-1);
        }

        .dataset-block__name {
          font-family: var(--font-mono);
          font-size: 13px;
          font-weight: 500;
          color: var(--text-primary);
          white-space: nowrap;
        }

        @media (min-width: 641px) {
          .dataset-block__name {
            flex: 0 0 19ch;
          }
        }

        .dataset-block__description {
          font-size: 12.5px;
          line-height: 1.45;
          color: var(--text-secondary);
          flex: 1 1 auto;
          min-width: 0;
        }

        .dataset-block__chevron {
          flex: none;
          align-self: center;
          margin-left: auto;
          color: var(--text-tertiary);
          transition: transform 0.18s ease;
        }

        .dataset-block__items {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px 14px;
          background: var(--surface-1);
          border-top: 1px dashed var(--line-divider-dash);
        }

        .dataset-block__item {
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          border-radius: 2px;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .dataset-block__cell {
          padding: 10px 14px;
        }

        .dataset-block__cell--input {
          border-right: 1px dashed var(--line-divider-dash);
        }

        .dataset-block__field {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.04em;
          color: var(--callout-info);
          margin-bottom: 5px;
        }

        .dataset-block__value {
          font-size: 12.5px;
          line-height: 1.45;
          color: var(--text-secondary);
        }

        .dataset-block__value--input {
          font-size: 13px;
          line-height: 1.4;
          color: var(--text-primary);
        }

        @media (max-width: 640px) {
          .dataset-block__item {
            grid-template-columns: 1fr;
          }

          .dataset-block__cell--input {
            border-right: 0;
            border-bottom: 1px dashed var(--line-divider-dash);
          }
        }
      `}</style>
    </figure>
  );
}
