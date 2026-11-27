import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

export function ComponentLayoutDiagram() {
  return (
    <figure className="not-prose min-w-0">
      <div className="grid min-w-0 gap-8">
        {(["avoid", "prefer"] as const).map((example) => (
          <div key={example} className="min-w-0">
            <p className="mb-3 text-sm font-medium text-text-primary">
              {example === "avoid"
                ? "Avoid: controls bring their own spacing"
                : "Prefer: the toolbar arranges its controls"}
            </p>
            <svg
              viewBox="0 0 680 114"
              role="img"
              aria-label={`Toolbar with a search input, Filter, Export, and Create dataset buttons. Positions are identical in both examples. ${example === "avoid" ? "Orange shows margins supplied by the controls and a separate spacer element." : "Blue shows gaps and group alignment supplied by the parent toolbar."}`}
              className={
                example === "avoid"
                  ? "mb-3 block h-auto w-full text-text-code-orange"
                  : "mb-3 block h-auto w-full text-text-code-blue"
              }
            >
              <rect
                x="1"
                y="1"
                width="678"
                height="76"
                rx="7"
                fill="var(--surface-1)"
                stroke="var(--line-structure)"
              />
              <rect
                x="20"
                y="22"
                width="206"
                height="34"
                rx="5"
                fill="var(--surface-2)"
                stroke="var(--line-structure)"
              />
              <circle
                cx="36"
                cy="38"
                r="5"
                fill="none"
                stroke="var(--text-tertiary)"
              />
              <path d="m40 42 4 4" stroke="var(--text-tertiary)" />
              <text x="53" y="43" fontSize="12" fill="var(--text-tertiary)">
                Search datasets…
              </text>
              {[
                { x: 238, width: 72, label: "Filter" },
                { x: 442, width: 78, label: "Export" },
                { x: 532, width: 128, label: "Create dataset" },
              ].map(({ x, width, label }) => (
                <g key={label}>
                  <rect
                    x={x}
                    y="22"
                    width={width}
                    height="34"
                    rx="5"
                    fill={
                      label === "Create dataset"
                        ? "var(--text-primary)"
                        : "var(--surface-1)"
                    }
                    stroke="var(--line-structure)"
                  />
                  <text
                    x={x + width / 2}
                    y="43"
                    textAnchor="middle"
                    fontSize="12"
                    fill={
                      label === "Create dataset"
                        ? "var(--surface-1)"
                        : "var(--text-primary)"
                    }
                  >
                    {label}
                  </text>
                </g>
              ))}
              <g
                fill="currentColor"
                fillOpacity="0.12"
                stroke="currentColor"
                strokeDasharray="3 2"
              >
                <rect x="226" y="22" width="12" height="34" />
                <rect x="310" y="22" width="132" height="34" />
                <rect x="520" y="22" width="12" height="34" />
              </g>
              {example === "prefer" && (
                <g fill="none" stroke="currentColor">
                  <rect x="16" y="17" width="298" height="44" rx="6" />
                  <rect x="438" y="17" width="226" height="44" rx="6" />
                </g>
              )}
              <g fill="none" stroke="currentColor">
                <path d="M232 57v28m144-28v28m150-28v28" />
              </g>
              <g fill="currentColor" fontSize="11" textAnchor="middle">
                <text x="232" y="102">
                  {example === "avoid" ? "Input margin" : "Group gap"}
                </text>
                <text x="376" y="102">
                  {example === "avoid" ? "Spacer element" : "justify-between"}
                </text>
                <text x="526" y="102">
                  {example === "avoid" ? "Button margin" : "Group gap"}
                </text>
              </g>
            </svg>
            <DynamicCodeBlock
              lang="tsx"
              code={
                example === "avoid"
                  ? `// Spacing is hidden inside the controls:
// SearchInput: margin-right
// ExportButton: margin-right
<div className="flex items-center">
  <SearchInput />
  <FilterButton />
  <div className="flex-1" />
  <ExportButton />
  <CreateButton />
</div>`
                  : `// Controls have no outer margins.
<div className="flex items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <div className="w-52"><Input /></div>
    <Button text="Filter" />
  </div>
  <div className="flex items-center gap-3">
    <Button text="Export" />
    <Button text="Create dataset" />
  </div>
</div>`
              }
            />
          </div>
        ))}
      </div>
    </figure>
  );
}
