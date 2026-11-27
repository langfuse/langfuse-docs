const inputs = [
  { name: "Input", value: "Support questions", adornment: "none" },
  { name: "PasswordInput", value: "••••••••••••", adornment: "eye" },
  { name: "SelectInput", value: "Production", adornment: "chevron" },
  {
    name: "MultiSelectInput",
    value: "2 environments selected",
    adornment: "chevron",
  },
  {
    name: "AsyncSelectInput",
    value: "Select a project…",
    adornment: "chevron",
  },
  { name: "MultiSelectTagInput", value: "Production", adornment: "tags" },
  {
    name: "DateRangeInput",
    value: "Nov 1 – Nov 20, 2026",
    adornment: "calendar",
  },
  { name: "QueryInput", value: "Search traces…", adornment: "search" },
];

export function InputControlDiagram() {
  return (
    <figure className="not-prose min-w-0">
      <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-xs">
        <span className="flex items-center gap-2 text-text-code-blue">
          <span
            aria-hidden="true"
            className="h-3 w-5 rounded-sm border border-current"
          />
          Shared styling (InputControl)
        </span>
        <span className="flex items-center gap-2 text-text-code-orange">
          <span
            aria-hidden="true"
            className="h-3 w-5 rounded-sm border border-dashed border-current"
          />
          Input-specific content
        </span>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        {inputs.map(({ name, value, adornment }) => (
          <div key={name} className="min-w-0">
            <p className="mb-2 font-mono text-xs text-text-secondary">{name}</p>
            <svg
              viewBox="0 4 300 46"
              role="img"
              aria-label={`${name}: ${value}. Blue outlines mark shared InputControl presentation${adornment === "eye" ? ", including the reveal button" : ""}. Dashed orange outlines mark specialized input content.`}
              className="block h-auto w-full text-text-code-blue"
            >
              <rect
                x="2"
                y="9"
                width="296"
                height="36"
                rx="6"
                fill="var(--surface-1)"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <rect
                x="11"
                y="13"
                width={adornment === "tags" ? "122" : "247"}
                height="28"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeDasharray="3 3"
                className="text-text-code-orange"
              />
              {adornment !== "none" && adornment !== "tags" && (
                <rect
                  x="263"
                  y="13"
                  width="28"
                  height="28"
                  rx="3"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={adornment === "eye" ? undefined : "3 3"}
                  className={
                    adornment === "eye"
                      ? "text-text-code-blue"
                      : "text-text-code-orange"
                  }
                />
              )}
              {adornment === "tags" && (
                <g>
                  <rect
                    x="13"
                    y="14"
                    width="116"
                    height="26"
                    rx="4"
                    fill="var(--surface-2)"
                    stroke="var(--line-structure)"
                  />
                  <path
                    transform="translate(117.5 26.5) scale(0.8) translate(-117.5 -26.5)"
                    d="m114 23 7 7m0-7-7 7"
                    stroke="var(--text-secondary)"
                  />
                </g>
              )}
              <text
                x={adornment === "tags" ? "20" : "15"}
                y="32"
                fontSize="13"
                fill="var(--text-primary)"
              >
                {value}
              </text>
              <g
                transform="translate(277 27) scale(0.72) translate(-276 -27)"
                fill="none"
                stroke="var(--text-secondary)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {adornment === "chevron" && <path d="m271 24 5 5 5-5" />}
                {adornment === "eye" && (
                  <g>
                    <path d="M265 27q11-14 22 0-11 14-22 0Z" />
                    <circle cx="276" cy="27" r="3" />
                  </g>
                )}
                {adornment === "search" && (
                  <g>
                    <circle cx="273" cy="25" r="6" />
                    <path d="m278 30 6 6" />
                  </g>
                )}
                {adornment === "calendar" && (
                  <g>
                    <rect x="267" y="19" width="18" height="17" rx="2" />
                    <path d="M267 24h18m-14-8v6m10-6v6" />
                  </g>
                )}
              </g>
            </svg>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-text-secondary">
        The orange boxes show what each input adds, with shared text styles and
        spacing. Even the password reveal button is rendered by InputControl;
        PasswordInput just picks the icon and decides what happens on click.
      </p>
      <div className="mt-6 rounded-lg border border-border bg-surface-2 p-4 sm:p-6">
        <p className="text-sm font-medium text-text-code-blue">
          Shared presentation: InputControl
        </p>
        <svg
          viewBox="0 0 560 174"
          role="img"
          aria-label="InputControl owns the background, border, radius, height, typography, content layout, prefix region, and trailing action presentation. Public inputs supply values and input-specific behavior."
          className="mt-3 block h-auto w-full text-text-code-blue"
        >
          <rect
            x="22"
            y="41"
            width="516"
            height="58"
            rx="8"
            fill="var(--surface-1)"
            stroke="currentColor"
            strokeWidth="2"
          />
          <rect
            x="23"
            y="42"
            width="110"
            height="56"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <rect
            x="480"
            y="42"
            width="57"
            height="56"
            fill="currentColor"
            fillOpacity="0.1"
          />
          <path d="M133 42v56" stroke="currentColor" />
          <text x="39" y="76" fontSize="14" fill="var(--text-secondary)">
            Project
          </text>
          <text x="150" y="76" fontSize="15" fill="var(--text-primary)">
            Production
          </text>
          <g fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="506" cy="68" r="7" />
            <path d="m512 74 6 6" />
          </g>
          <g fill="none" stroke="currentColor">
            <path d="M76 99v22m204-22v22m227-22v22" />
          </g>
          <text
            x="76"
            y="141"
            textAnchor="middle"
            fontSize="13"
            fill="var(--text-secondary)"
          >
            Prefix
          </text>
          <text
            x="280"
            y="141"
            textAnchor="middle"
            fontSize="13"
            fill="var(--text-secondary)"
          >
            Typography + content layout
          </text>
          <text
            x="507"
            y="141"
            textAnchor="middle"
            fontSize="13"
            fill="var(--text-secondary)"
          >
            Action
          </text>
          <text
            x="280"
            y="19"
            textAnchor="middle"
            fontSize="13"
            fill="var(--text-secondary)"
          >
            Background, border, radius, height + padding
          </text>
        </svg>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {(["Focused", "Error", "Disabled"] as const).map((state) => (
            <div key={state} className="min-w-0">
              <p className="mb-2 text-xs text-text-secondary">{state}</p>
              <svg
                viewBox="0 0 170 46"
                role="img"
                aria-label={`Shared ${state.toLowerCase()} presentation`}
                className={
                  state === "Error"
                    ? "block h-auto w-full text-destructive"
                    : "block h-auto w-full text-text-code-blue"
                }
              >
                {state === "Focused" && (
                  <rect
                    x="2"
                    y="4"
                    width="166"
                    height="38"
                    rx="7"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                )}
                <g opacity={state === "Disabled" ? 0.5 : 1}>
                  <rect
                    x="6"
                    y="8"
                    width="158"
                    height="30"
                    rx="4"
                    fill={
                      state === "Disabled"
                        ? "var(--surface-2)"
                        : "var(--surface-1)"
                    }
                    stroke={
                      state === "Disabled"
                        ? "var(--line-structure)"
                        : "currentColor"
                    }
                  />
                  <text x="16" y="28" fontSize="12" fill="var(--text-primary)">
                    Production
                  </text>
                </g>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
