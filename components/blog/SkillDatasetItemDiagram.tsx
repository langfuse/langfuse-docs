export function SkillDatasetItemDiagram() {
  return (
    <figure
      aria-label="Structure of a Langfuse dataset item with Input, Expected output, and Metadata"
      className="not-prose my-8 border border-line-structure bg-surface-bg text-xs"
    >
      <div className="grid grid-cols-1 divide-y divide-line-structure sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <div className="p-3.5 sm:p-4">
          <div className="mb-2 font-medium text-text-primary">Input</div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">
            {`"Add Langfuse tracing to this app so every LLM call and tool invocation is captured."`}
          </pre>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="mb-2 font-medium text-text-primary">
            Expected output
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">
            {`{\n  "invoked_reference_file": "references/instrumentation.md"\n}`}
          </pre>
        </div>

        <div className="p-3.5 sm:p-4">
          <div className="mb-2 font-medium text-text-primary">Metadata</div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">
            {`{\n  "env_folder": "starter-app-python"\n}`}
          </pre>
        </div>
      </div>
    </figure>
  );
}
