import { Database } from "lucide-react";

export function SkillDatasetItemDiagram() {
  return (
    <figure
      aria-label="Structure of a Langfuse dataset item with Input, Expected output, and optional Metadata containing env_folder"
      className="not-prose my-8 border border-line-structure bg-surface-bg text-xs"
    >
      <div className="flex items-center justify-between gap-2 border-b border-line-structure px-4 py-2.5 sm:px-5">
        <div className="flex items-center gap-2 font-medium text-text-primary">
          <Database
            className="h-3.5 w-3.5 shrink-0 text-text-secondary"
            aria-hidden="true"
          />
          <span>Dataset item</span>
        </div>
        <span className="font-mono text-[11px] text-text-tertiary">
          skill-eval-benchmark
        </span>
      </div>

      <div className="grid grid-cols-1 divide-y divide-line-structure sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <div className="p-4 sm:px-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-medium text-text-primary">Input</span>
            <span className="text-[11px] text-text-tertiary">prompt</span>
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">
            {`"Add Langfuse tracing to this app so every LLM call and tool invocation is captured."`}
          </pre>
        </div>

        <div className="p-4 sm:px-5">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-medium text-text-primary">
              Expected output
            </span>
            <span className="text-[11px] text-text-tertiary">
              varies by eval
            </span>
          </div>
          <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">
            {`{\n  "invoked_reference_file":\n    "references/instrumentation.md"\n}`}
          </pre>
        </div>
      </div>

      <div className="border-t border-line-structure p-4 sm:px-5">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-text-primary">Metadata</span>
            <span className="border border-line-structure px-1.5 py-0.5 text-[10px] leading-none text-text-tertiary">
              optional
            </span>
          </div>
          <span className="text-[11px] text-text-tertiary">
            starter workspace in langfuse/coding-agent-testing
          </span>
        </div>
        <pre className="whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed text-text-secondary">
          {"{\n  "}
          <span className="bg-surface-cta-primary px-1 text-text-primary">
            &quot;env_folder&quot;
          </span>
          {`: "starter-app-python"\n}`}
        </pre>
      </div>
    </figure>
  );
}
