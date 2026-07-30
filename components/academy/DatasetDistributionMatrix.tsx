import { Fragment } from "react";

const SCENARIOS = [
  "Billing",
  "Account access",
  "Technical issue",
  "Sales request",
];

const DIFFICULTIES = [
  {
    name: "Routine",
    description: "clear intent, one right answer",
    tone: "strong",
  },
  {
    name: "Ambiguous",
    description: "two plausible routes",
    tone: "medium",
  },
  {
    name: "Hard or risky",
    description: "multi-step, adversarial, high-stakes",
    tone: "light",
  },
];

export function DatasetDistributionMatrix() {
  return (
    <figure
      className="dataset-distribution not-prose"
      aria-label="Example input distribution matrix by scenario and difficulty"
    >
      <div className="dataset-distribution__scroll">
        <div className="dataset-distribution__axis" aria-hidden="true">
          <span>Difficulty →</span>
        </div>
        <div className="dataset-distribution__matrix corner-box-corners">
          <div className="dataset-distribution__header dataset-distribution__header--axis">
            Scenario →
          </div>
          {SCENARIOS.map((scenario) => (
            <div className="dataset-distribution__header" key={scenario}>
              {scenario}
            </div>
          ))}

          {DIFFICULTIES.map((difficulty) => (
            <Fragment key={difficulty.name}>
              <div
                className="dataset-distribution__row-label"
                key={`${difficulty.name}-label`}
              >
                <strong>{difficulty.name}</strong>
                <span>{difficulty.description}</span>
              </div>
              {SCENARIOS.map((scenario) => (
                <div
                  className={`dataset-distribution__cell dataset-distribution__cell--${difficulty.tone}`}
                  key={`${difficulty.name}-${scenario}`}
                />
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      <style>{`
        .dataset-distribution {
          margin: 24px 0 28px;
          width: 100%;
        }

        .dataset-distribution__scroll {
          position: relative;
          overflow-x: auto;
          padding: 0 0 10px 48px;
        }

        .dataset-distribution__axis {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 10px;
          display: flex;
          width: 40px;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .dataset-distribution__axis span {
          transform: rotate(-90deg);
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          line-height: 1;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .dataset-distribution__matrix {
          display: grid;
          width: 100%;
          min-width: 620px;
          grid-template-columns: minmax(150px, 1.15fr) repeat(4, minmax(104px, 1fr));
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
        }

        .dataset-distribution__header,
        .dataset-distribution__row-label,
        .dataset-distribution__cell {
          min-height: 92px;
          border-right: 1px solid var(--line-structure);
          border-bottom: 1px solid var(--line-structure);
        }

        .dataset-distribution__header:nth-child(5n),
        .dataset-distribution__cell:nth-child(5n) {
          border-right: 0;
        }

        .dataset-distribution__row-label:nth-last-child(-n + 5),
        .dataset-distribution__cell:nth-last-child(-n + 4) {
          border-bottom: 0;
        }

        .dataset-distribution__header {
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          min-height: 72px;
          padding: 18px 20px;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 650;
          line-height: 1.2;
        }

        .dataset-distribution__header--axis {
          color: var(--text-tertiary);
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .dataset-distribution__row-label {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          color: var(--text-primary);
        }

        .dataset-distribution__row-label strong {
          font-family: var(--font-sans);
          font-size: 18px;
          font-weight: 650;
          line-height: 1.2;
        }

        .dataset-distribution__row-label span {
          color: var(--text-tertiary);
          font-family: var(--font-sans);
          font-size: 15px;
          line-height: 1.35;
        }

        .dataset-distribution__cell {
          min-height: 112px;
        }

        .dataset-distribution__cell--strong {
          background: var(--surface-cta-primary);
        }

        .dataset-distribution__cell--medium {
          background: color-mix(in oklab, var(--surface-cta-primary) 48%, var(--surface-bg));
        }

        .dataset-distribution__cell--light {
          background: color-mix(in oklab, var(--surface-cta-primary) 18%, var(--surface-bg));
        }

        @media (max-width: 720px) {
          .dataset-distribution__scroll {
            margin-right: -16px;
            padding-left: 40px;
          }

          .dataset-distribution__axis span {
            font-size: 10px;
          }

          .dataset-distribution__matrix {
            min-width: 620px;
          }

          .dataset-distribution__header,
          .dataset-distribution__row-label {
            padding: 16px;
          }
        }
      `}</style>
    </figure>
  );
}
