import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

export function DialogCompositionDiagram() {
  return (
    <figure className="not-prose min-w-0">
      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        {(["before", "after"] as const).map((mode) => (
          <div key={mode} className="min-w-0">
            <p className="mb-3 text-sm font-medium text-text-primary">
              {mode === "before" ? "Before: bundled" : "After: composed"}
            </p>
            <div className="mb-3 flex min-h-10 flex-wrap content-start gap-x-4 gap-y-1 text-xs">
              <span className="flex items-center gap-2 text-text-code-blue">
                <span
                  aria-hidden="true"
                  className="h-3 w-4 rounded-sm border border-current"
                />
                {mode === "before"
                  ? "DatasetActionButton"
                  : "Caller (DatasetsTable)"}
              </span>
              {mode === "after" && (
                <span className="flex items-center gap-2 text-text-code-orange">
                  <span
                    aria-hidden="true"
                    className="h-3 w-4 rounded-sm border border-current"
                  />
                  Dialog content
                </span>
              )}
              <span className="w-full text-text-tertiary">
                Outline color identifies component ownership.
              </span>
            </div>
            <svg
              viewBox="0 0 420 730"
              fill="currentColor"
              role="img"
              aria-label={
                mode === "before"
                  ? "Before: the dataset table's Edit button and the Update dataset dialog belong to DatasetActionButton, which also controls visibility."
                  : "After: the dataset table owns its Edit button. UpdateDatasetDialogController controls visibility without rendering UI. UpdateDatasetDialogContent owns the Update dataset form."
              }
              className="block h-auto w-full font-sans text-text-primary"
            >
              <text x="2" y="18" fontSize="12" className="fill-text-secondary">
                1. Dataset list: dialog closed
              </text>
              <g transform="translate(1 32)">
                <rect
                  width="418"
                  height="222"
                  rx="7"
                  fill="var(--surface-1)"
                  stroke="var(--line-structure)"
                />
                <path d="M0 30h418M82 30v192" stroke="var(--line-structure)" />
                <text x="12" y="20" fontSize="11" fontWeight="600">
                  Langfuse
                </text>
                <text
                  x="96"
                  y="20"
                  fontSize="10"
                  className="fill-text-secondary"
                >
                  My project / Datasets
                </text>
                <rect
                  x="5"
                  y="91"
                  width="72"
                  height="23"
                  rx="3"
                  fill="var(--surface-2)"
                />
                <text x="12" y="62" fontSize="9" className="fill-text-tertiary">
                  Tracing
                </text>
                <text x="12" y="84" fontSize="9" className="fill-text-tertiary">
                  Prompts
                </text>
                <text x="12" y="106" fontSize="9" fontWeight="600">
                  Datasets
                </text>
                <text x="96" y="61" fontSize="17" fontWeight="600">
                  Datasets
                </text>
                <rect
                  x="96"
                  y="75"
                  width="308"
                  height="26"
                  rx="4"
                  fill="var(--surface-2)"
                  stroke="var(--line-structure)"
                />
                <text
                  x="106"
                  y="92"
                  fontSize="10"
                  className="fill-text-tertiary"
                >
                  Search datasets…
                </text>
                <path
                  d="M96 132h308M96 167h308M96 202h308"
                  stroke="var(--line-structure)"
                />
                <text
                  x="103"
                  y="122"
                  fontSize="10"
                  className="fill-text-secondary"
                >
                  Name
                </text>
                <text
                  x="350"
                  y="122"
                  fontSize="10"
                  className="fill-text-secondary"
                >
                  Actions
                </text>
                <text x="103" y="154" fontSize="11">
                  Support questions
                </text>
                <text x="103" y="189" fontSize="11">
                  Product feedback
                </text>
                <g className="text-text-code-blue">
                  <rect
                    x="346"
                    y="136"
                    width="27"
                    height="27"
                    rx="4"
                    fill="var(--surface-2)"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    transform="translate(359.5 149.5) scale(0.75) translate(-359.5 -149.5)"
                    d="m354 154 2-6 8-8 4 4-8 8-6 2m8-12 4 4"
                    fill="none"
                    stroke="var(--text-primary)"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M359 163v14h-35"
                    fill="none"
                    stroke="var(--text-tertiary)"
                  />
                  <rect
                    x="274"
                    y="165"
                    width="49"
                    height="23"
                    rx="4"
                    fill="var(--surface-1)"
                    stroke="var(--line-structure)"
                  />
                  <text
                    x="298"
                    y="180"
                    textAnchor="middle"
                    fontSize="10"
                    className="fill-text-primary"
                  >
                    Edit
                  </text>
                </g>
                <path
                  d="M384 143h10m-8 0v12h6v-12m-5-3h4"
                  fill="none"
                  stroke="var(--text-tertiary)"
                />
              </g>
              <g className="text-text-code-blue">
                <rect
                  x="2"
                  y="266"
                  width="9"
                  height="9"
                  rx="2"
                  fill="currentColor"
                />
                <text x="18" y="275" fontSize="12" fill="currentColor">
                  {mode === "before"
                    ? "Bundled trigger"
                    : "Caller-rendered trigger"}
                </text>
              </g>

              <text x="2" y="309" fontSize="12" className="fill-text-secondary">
                2. Click Edit: dialog open
              </text>
              <g transform="translate(1 323)">
                <rect
                  width="418"
                  height="300"
                  rx="7"
                  fill="var(--surface-1)"
                  stroke="var(--line-structure)"
                />
                <text x="12" y="20" fontSize="11" fontWeight="600">
                  Langfuse
                </text>
                <text
                  x="96"
                  y="20"
                  fontSize="10"
                  className="fill-text-secondary"
                >
                  My project / Datasets
                </text>
                <path
                  d="M0 30h418M82 30v270M96 92h308M96 127h308M96 162h308"
                  stroke="var(--line-structure)"
                />
                <text x="96" y="62" fontSize="17" fontWeight="600">
                  Datasets
                </text>
                <text x="103" y="117" fontSize="11">
                  Support questions
                </text>
                <text x="103" y="152" fontSize="11">
                  Product feedback
                </text>
                <rect
                  width="418"
                  height="300"
                  rx="7"
                  fill="var(--text-primary)"
                  fillOpacity="0.16"
                />

                <g
                  className={
                    mode === "before"
                      ? "text-text-code-blue"
                      : "text-text-code-orange"
                  }
                >
                  <rect
                    x="37"
                    y="36"
                    width="344"
                    height="233"
                    rx="7"
                    fill="var(--surface-1)"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <text
                    x="54"
                    y="62"
                    fontSize="16"
                    fontWeight="600"
                    className="fill-text-primary"
                  >
                    Update dataset
                  </text>
                  <path
                    d="m357 51 8 8m0-8-8 8"
                    stroke="var(--text-secondary)"
                    strokeWidth="1.3"
                  />
                  <text
                    x="54"
                    y="88"
                    fontSize="11"
                    className="fill-text-primary"
                  >
                    Name
                  </text>
                  <rect
                    x="54"
                    y="97"
                    width="310"
                    height="29"
                    rx="4"
                    fill="var(--surface-2)"
                    stroke="var(--line-structure)"
                  />
                  <text
                    x="64"
                    y="116"
                    fontSize="11"
                    className="fill-text-primary"
                  >
                    Support questions
                  </text>
                  <text
                    x="54"
                    y="148"
                    fontSize="11"
                    className="fill-text-primary"
                  >
                    Description (optional)
                  </text>
                  <rect
                    x="54"
                    y="157"
                    width="310"
                    height="29"
                    rx="4"
                    fill="var(--surface-2)"
                    stroke="var(--line-structure)"
                  />
                  <text
                    x="64"
                    y="176"
                    fontSize="11"
                    className="fill-text-primary"
                  >
                    Customer support evaluation
                  </text>
                  <text
                    x="54"
                    y="205"
                    fontSize="10"
                    className="fill-text-tertiary"
                  >
                    More fields omitted
                  </text>
                  <rect
                    x="249"
                    y="222"
                    width="115"
                    height="29"
                    rx="4"
                    fill="var(--text-primary)"
                  />
                  <text
                    x="306"
                    y="241"
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--surface-1)"
                  >
                    Update dataset
                  </text>
                </g>
              </g>
              <g
                className={
                  mode === "before"
                    ? "text-text-code-blue"
                    : "text-text-code-orange"
                }
              >
                <rect
                  x="2"
                  y="637"
                  width="9"
                  height="9"
                  rx="2"
                  fill="currentColor"
                />
                <text x="18" y="646" fontSize="12" fill="currentColor">
                  {mode === "before"
                    ? "Dialog in the same bundle"
                    : "Dialog content composed by the parent"}
                </text>
              </g>
              <g className="text-text-secondary">
                <path
                  d="M2 682h28m-4-4 4 4-4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="4 3"
                />
                <text
                  x="40"
                  y="685"
                  fontSize="12"
                  fontWeight="600"
                  fill="currentColor"
                >
                  {mode === "before"
                    ? "State lives inside the bundle"
                    : "Controller connects trigger and dialog"}
                </text>
                <text
                  x="40"
                  y="706"
                  fontSize="11"
                  className="fill-text-secondary"
                >
                  Permissions + open/closed state, no visible UI
                </text>
              </g>
            </svg>
            <div className="mt-3">
              <DynamicCodeBlock
                lang="tsx"
                code={
                  mode === "before"
                    ? `// Trigger, state, and form are bundled.
<DatasetActionButton
  {...datasetProps}
/>`
                    : `// The table renders its own trigger.
<UpdateDatasetDialogController
  {...datasetProps}
>
  {({ openDialog }) => (
    <IconButton
      icon={Pencil}
      label="Edit"
      onClick={openDialog}
    />
  )}
</UpdateDatasetDialogController>`
                }
              />
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
