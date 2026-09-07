"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
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

const PathContext = createContext<CodingAgentPath>("gateway");

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
  const current = useContext(PathContext);
  const active = current === value;

  return (
    <div hidden={!active} className={cn(!active && "hidden", className)}>
      {label ? <h3 className="sr-only">{label}</h3> : null}
      {children}
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

  const handleChange = (next: CodingAgentPath) => {
    setValue(next);
    writePathToUrl(next);
  };

  return (
    <PathContext.Provider value={value}>
      <div>
        <div
          role="tablist"
          aria-label="Integration path"
          id="integration-paths"
          className="grid grid-cols-2 border-b border-line-structure"
        >
          {PATHS.map((item) => {
            const active = value === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleChange(item.value)}
                className={cn(
                  "flex flex-col items-start gap-0.5 border-r border-line-structure px-5 py-3.5 text-left last:border-r-0",
                  active
                    ? "bg-surface-1 text-text-primary"
                    : "bg-surface-bg text-text-tertiary hover:text-text-secondary",
                )}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.09em]">
                  {item.label}
                </span>
                <span className="font-sans text-[12px] leading-tight">
                  {item.description}
                </span>
              </button>
            );
          })}
        </div>
        {children}
      </div>
    </PathContext.Provider>
  );
}
