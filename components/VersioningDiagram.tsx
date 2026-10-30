function FileIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.5 1.5h5l4 4v9h-9z" />
      <path d="M8.5 1.5v4h4" />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M1.5 3.5h5l1.5 2h6.5v8h-13z" />
    </svg>
  );
}

function FileRow({
  name,
  additions,
  deletions,
  nested = false,
}: {
  name: string;
  additions?: number;
  deletions?: number;
  nested?: boolean;
}) {
  return (
    <div
      className={`versioning-diagram__file${nested ? " versioning-diagram__file--nested" : ""}`}
    >
      <FileIcon />
      <span>{name}</span>
      {(additions !== undefined || deletions !== undefined) && (
        <span className="versioning-diagram__diff">
          {additions !== undefined && (
            <span className="versioning-diagram__addition">+{additions}</span>
          )}
          {deletions !== undefined && (
            <span className="versioning-diagram__deletion">−{deletions}</span>
          )}
        </span>
      )}
    </div>
  );
}

function SkillFiles({ showDiff = false }: { showDiff?: boolean }) {
  return (
    <>
      <FileRow name="SKILL.md" />
      <div className="versioning-diagram__folder">
        <div className="versioning-diagram__file">
          <FolderIcon />
          <span>references/</span>
        </div>
        <FileRow
          name="reference-1.md"
          additions={showDiff ? 18 : undefined}
          deletions={showDiff ? 7 : undefined}
          nested
        />
        <FileRow name="reference-2.md" nested />
      </div>
    </>
  );
}

function VersionCard({ children }: { children: React.ReactNode }) {
  return <div className="versioning-diagram__card">{children}</div>;
}

function ChangeArrow({ file }: { file: string }) {
  return (
    <div className="versioning-diagram__change">
      <span>
        change to <strong>{file}</strong>
      </span>
      <div className="versioning-diagram__arrow" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

function Comparison({
  change,
  before,
  after,
}: {
  change: string;
  before: React.ReactNode;
  after: React.ReactNode;
}) {
  return (
    <div className="versioning-diagram__comparison">
      <div className="versioning-diagram__version">
        <span className="versioning-diagram__version-label">Version 1</span>
        <VersionCard>{before}</VersionCard>
      </div>
      <ChangeArrow file={change} />
      <div className="versioning-diagram__version">
        <span className="versioning-diagram__version-label versioning-diagram__version-label--current">
          Version 2
        </span>
        <VersionCard>{after}</VersionCard>
      </div>
    </div>
  );
}

export function VersioningDiagram() {
  return (
    <figure
      className="versioning-diagram not-prose"
      aria-label="How prompt and skill changes create new versions"
    >
      <div className="versioning-diagram__scroll">
        <div className="versioning-diagram__canvas">
          <Comparison
            change="prompt.txt"
            before={<FileRow name="prompt.txt" />}
            after={<FileRow name="prompt.txt" additions={4} deletions={2} />}
          />
          <Comparison
            change="references/reference-1.md"
            before={<SkillFiles />}
            after={<SkillFiles showDiff />}
          />
        </div>
      </div>

      <style>{`
        .versioning-diagram {
          container-type: inline-size;
          margin: 24px 0 32px;
          width: 100%;
          background: var(--surface-bg);
          color: var(--text-primary);
          font-family: inherit;
        }

        .versioning-diagram__scroll {
          width: 100%;
          padding: clamp(8px, 4cqw, 32px);
        }

        .versioning-diagram__canvas {
          display: grid;
          width: 100%;
          gap: clamp(24px, 7cqw, 56px);
        }

        .versioning-diagram__comparison {
          display: grid;
          grid-template-columns: minmax(0, 220px) minmax(70px, 150px) minmax(0, 220px);
          align-items: stretch;
          justify-content: center;
          gap: clamp(5px, 2.5cqw, 24px);
        }

        .versioning-diagram__version {
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 8px;
        }

        .versioning-diagram__version-label {
          justify-self: start;
          padding: 1px 3px;
          color: var(--text-tertiary);
          font-size: clamp(9px, 1.8cqw, 13px);
          font-weight: 600;
          line-height: 1.35;
        }

        .versioning-diagram__version-label--current {
          background: var(--surface-cta-primary);
          color: var(--text-primary);
        }

        .versioning-diagram__card {
          border: 1px solid var(--line-structure);
          border-radius: 2px;
          padding: clamp(6px, 2cqw, 16px) clamp(6px, 2.5cqw, 20px);
          background: var(--surface-bg);
        }

        .versioning-diagram__file {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: clamp(3px, 1cqw, 8px);
          color: var(--text-secondary);
          font-size: clamp(8px, 1.8cqw, 13px);
          line-height: 1.5;
          white-space: nowrap;
        }

        .versioning-diagram__file svg {
          width: clamp(7px, 2cqw, 16px);
          height: clamp(7px, 2cqw, 16px);
          flex: 0 0 auto;
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.25;
        }

        .versioning-diagram__folder {
          margin-top: clamp(5px, 1.25cqw, 10px);
        }

        .versioning-diagram__file--nested {
          position: relative;
          margin-top: clamp(3px, 0.75cqw, 6px);
          padding-left: clamp(10px, 3cqw, 24px);
        }

        .versioning-diagram__file--nested::before {
          content: "";
          position: absolute;
          top: -7px;
          bottom: 50%;
          left: clamp(3px, 0.9cqw, 7px);
          width: clamp(4px, 1.25cqw, 10px);
          border-bottom: 1px solid var(--line-divider-dash);
          border-left: 1px solid var(--line-divider-dash);
        }

        .versioning-diagram__diff {
          display: flex;
          margin-left: auto;
          gap: clamp(2px, 0.75cqw, 6px);
          padding-left: clamp(3px, 1.25cqw, 10px);
          font-variant-numeric: tabular-nums;
          font-weight: 600;
        }

        .versioning-diagram__addition {
          color: var(--callout-success);
        }

        .versioning-diagram__deletion {
          color: var(--callout-error);
        }

        .versioning-diagram__change {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-self: center;
          gap: clamp(4px, 1cqw, 8px);
          color: var(--text-tertiary);
          font-size: clamp(8px, 1.7cqw, 12px);
          line-height: 1.35;
          text-align: center;
        }

        .versioning-diagram__change strong {
          display: block;
          color: var(--text-secondary);
          font-weight: 600;
          overflow-wrap: anywhere;
        }

        .versioning-diagram__arrow {
          position: relative;
          height: 10px;
        }

        .versioning-diagram__arrow::before {
          content: "";
          position: absolute;
          top: 4px;
          right: 5px;
          left: 5px;
          border-top: 1px solid var(--line-cta);
        }

        .versioning-diagram__arrow::after {
          content: "";
          position: absolute;
          top: 1px;
          right: 0;
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 6px solid var(--line-cta);
        }

        .versioning-diagram__arrow span {
          position: absolute;
          top: 2px;
          left: 0;
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: var(--line-cta);
        }
      `}</style>
    </figure>
  );
}
