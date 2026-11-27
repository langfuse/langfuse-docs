import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

export function UserCardStatesDiagram() {
  return (
    <figure className="not-prose min-w-0">
      <div className="grid min-w-0 gap-6 sm:grid-cols-2">
        {(["loaded", "loading"] as const).map((state) => (
          <div key={state} className="min-w-0">
            <p className="mb-2 text-sm font-medium text-text-primary">
              {state === "loaded" ? "Loaded" : "Loading"}
            </p>
            <svg
              viewBox="0 0 300 84"
              role="img"
              aria-label={`${state === "loaded" ? "A user card displaying an AM avatar and Alex Morgan" : "A user card containing circular avatar and name skeletons"}. Both states have the same card boundary, height, padding, and avatar spacing.`}
              className="block h-auto w-full"
            >
              <rect
                x="1"
                y="10"
                width="298"
                height="64"
                rx="8"
                fill="var(--surface-1)"
                stroke="var(--line-structure)"
              />
              {state === "loaded" ? (
                <g>
                  <circle cx="33" cy="42" r="16" fill="var(--surface-2)" />
                  <text
                    x="33"
                    y="47"
                    textAnchor="middle"
                    fontSize="12"
                    fill="var(--text-secondary)"
                  >
                    AM
                  </text>
                  <text x="61" y="47" fontSize="14" fill="var(--text-primary)">
                    Alex Morgan
                  </text>
                </g>
              ) : (
                <g>
                  <circle cx="33" cy="42" r="16" fill="var(--surface-2)" />
                  <rect
                    x="61"
                    y="34"
                    width="96"
                    height="16"
                    rx="4"
                    fill="var(--surface-2)"
                  />
                </g>
              )}
            </svg>
            <DynamicCodeBlock
              lang="tsx"
              code={
                state === "loaded"
                  ? '<UserCard\n  state="loaded"\n  name="Alex Morgan"\n/>'
                  : '<UserCard state="loading" />'
              }
            />
          </div>
        ))}
      </div>
    </figure>
  );
}
