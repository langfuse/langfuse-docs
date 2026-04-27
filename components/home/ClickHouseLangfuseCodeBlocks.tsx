"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

const INSTALL_SNIPPET = "pip install langfuse";

const PYTHON_SNIPPET = `from langfuse.openai import openai

# Drop-in replacement. Traces automatically.
response = openai.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)`;

const homeCodeBlockClassName = "my-0 w-full text-left [&_pre]:text-left rounded-[1px] shadow-none border border-line-structure bg-surface-1";

export function ClickHouseLangfuseCodeBlocks() {
  return (
    <div className="flex w-full max-w-[min(100%,560px)] flex-col gap-3 mt-10">
      <DynamicCodeBlock
        lang="bash"
        code={INSTALL_SNIPPET}
        codeblock={{
          allowCopy: true,
          className: homeCodeBlockClassName,
        }}
      />
      <DynamicCodeBlock
        lang="python"
        code={PYTHON_SNIPPET}
        codeblock={{
          allowCopy: true,
          className: homeCodeBlockClassName,
        }}
      />
    </div>
  );
}
