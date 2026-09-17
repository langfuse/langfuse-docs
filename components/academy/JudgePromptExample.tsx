const SEGMENTS: { name: string; text: string }[] = [
  {
    name: "Context",
    text: `You evaluate replies from an apartment-leasing assistant. The assistant answers using the property information provided in its context. It has no availability calendar and cannot schedule tours itself.`,
  },
  {
    name: "One precise criterion",
    text: `Criterion: the reply must only state facts present in the provided context. A reply that invents specifics (times, prices, availability) fails, even if it sounds helpful. Ignore style and formatting.`,
  },
  {
    name: "Labeled examples",
    text: `Example (fail):
User: "Do you have a 2-bed available for July 1?"
Reply: "Yes! I have a 2-bed ready for you, tour at 2pm works."
Reasoning: the context contains no tour time. "2pm" is invented.
Verdict: fail

Example (pass):
User: "What's the pet policy?"
Reply: "Cats and dogs under 40 lbs are welcome with a $300 deposit."
Reasoning: every fact (cats and dogs, 40 lbs, $300) is in the context.
Verdict: pass`,
  },
  {
    name: "Reasoning first, verdict last",
    text: `Evaluate the reply below. Write your reasoning first, then output exactly`,
  },
  {
    name: "A way out",
    text: `one of: pass, fail, unknown.`,
  },
];

export function JudgePromptExample() {
  return (
    <figure
      className="judge-prompt not-prose"
      aria-label="Example judge prompt with its parts annotated"
    >
      <div className="judge-prompt__frame">
        {SEGMENTS.map((segment) => (
          <div className="judge-prompt__row" key={segment.name}>
            <div className="judge-prompt__gutter">
              <span className="judge-prompt__name">{segment.name}</span>
            </div>
            <div className="judge-prompt__text">{segment.text}</div>
          </div>
        ))}
      </div>

      <style>{`
        .judge-prompt {
          margin: 16px 0;
          width: 100%;
        }

        .judge-prompt__frame {
          border: 1px solid var(--line-structure);
          background: var(--surface-bg);
          border-radius: 2px;
        }

        .judge-prompt__row {
          display: grid;
          grid-template-columns: 92px 1fr;
        }

        @media (min-width: 641px) {
          .judge-prompt__row {
            grid-template-columns: 148px 1fr;
          }
        }

        .judge-prompt__row + .judge-prompt__row {
          border-top: 1px dashed var(--line-divider-dash);
        }

        .judge-prompt__gutter {
          border-right: 1px dashed var(--line-divider-dash);
          padding: 10px 10px 11px 14px;
        }

        .judge-prompt__name {
          display: block;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          line-height: 1.5;
          color: var(--text-tertiary);
        }

        .judge-prompt__text {
          padding: 10px 14px 11px;
          font-family: var(--font-mono);
          font-size: 12px;
          line-height: 1.55;
          color: var(--text-secondary);
          white-space: pre-line;
          max-width: 620px;
        }
      `}</style>
    </figure>
  );
}
