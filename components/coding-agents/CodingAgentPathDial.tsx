"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export type CodingAgentPath = "gateway" | "hooks";

const PATHS: {
  value: CodingAgentPath;
  label: string;
  description: string;
}[] = [
  {
    value: "gateway",
    label: "Via gateways",
    description: "For platform teams",
  },
  {
    value: "hooks",
    label: "Via hooks",
    description: "Trace a single agent",
  },
];

type PathContextValue = {
  value: CodingAgentPath;
  setValue: (next: CodingAgentPath) => void;
};

const PathContext = createContext<PathContextValue | null>(null);

function usePathContext() {
  const context = useContext(PathContext);
  if (!context) {
    throw new Error(
      "Coding agent path controls must be used inside CodingAgentPathDial",
    );
  }
  return context;
}

function readPathFromUrl(): CodingAgentPath | null {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("path");
  if (value === "gateway" || value === "hooks") return value;
  return null;
}

function writePathToUrl(path: CodingAgentPath) {
  const url = new URL(window.location.href);
  if (path === "gateway") {
    url.searchParams.delete("path");
  } else {
    url.searchParams.set("path", path);
  }
  window.history.replaceState(
    null,
    "",
    `${url.pathname}${url.search}${url.hash}`,
  );
}

export function CodingAgentPathPanel({
  value,
  label,
  className,
  children,
}: {
  value: CodingAgentPath;
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const { value: current } = usePathContext();
  const active = current === value;

  return (
    <div hidden={!active} className={cn(!active && "hidden", className)}>
      {label ? <h3 className="sr-only">{label}</h3> : null}
      {children}
    </div>
  );
}

export function CodingAgentPathSwitcher() {
  const { value, setValue } = usePathContext();
  const buttonRefs = useRef<
    Partial<Record<CodingAgentPath, HTMLButtonElement | null>>
  >({});

  const selectPath = (next: CodingAgentPath, focus = false) => {
    setValue(next);
    writePathToUrl(next);
    if (focus) buttonRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    selectPath(value === "gateway" ? "hooks" : "gateway", true);
  };

  return (
    <div className="flex flex-col gap-2 border-t border-line-structure px-5 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-10">
      <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.09em] text-text-tertiary">
        Set up
      </p>
      <div
        role="radiogroup"
        aria-label="Set up path"
        id="integration-paths"
        className="grid min-w-0 flex-1 grid-cols-1 overflow-hidden rounded-[1px] border border-line-structure sm:grid-cols-2"
      >
        {PATHS.map((item, index) => {
          const active = value === item.value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                buttonRefs.current[item.value] = node;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => selectPath(item.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                "flex items-center justify-between gap-3 px-4 py-2.5 text-left",
                index === 0 &&
                  "border-b border-line-structure sm:border-b-0 sm:border-r",
                active
                  ? "bg-surface-cta-primary text-text-primary"
                  : "bg-surface-bg text-text-primary hover:bg-surface-1",
              )}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.06em]">
                {item.label}
              </span>
              <span
                className={cn(
                  "text-[12px] leading-tight",
                  active ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {item.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CodingAgentPathDial({
  defaultValue = "gateway",
  children,
}: {
  defaultValue?: CodingAgentPath;
  children: ReactNode;
}) {
  const [value, setValue] = useState<CodingAgentPath>(defaultValue);

  useEffect(() => {
    const fromUrl = readPathFromUrl();
    if (fromUrl) setValue(fromUrl);
  }, []);

  return (
    <PathContext.Provider value={{ value, setValue }}>
      {children}
    </PathContext.Provider>
  );
}
