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
import { HoverCorners } from "@/components/ui/corner-box";
import { cn } from "@/lib/utils";
import { dispatchUseCaseInteraction } from "@/lib/use-case-analytics";

const controlType =
  "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px]";

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
    <div hidden={!active} className={active ? className : "hidden"}>
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
    const changed = next !== value;
    setValue(next);
    writePathToUrl(next);
    if (changed && buttonRefs.current[next]) {
      dispatchUseCaseInteraction(
        buttonRefs.current[next]!,
        "path_selected",
        next,
      );
    }
    if (focus) buttonRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    selectPath(value === "gateway" ? "hooks" : "gateway", true);
  };

  return (
    <div className="flex flex-wrap items-center gap-1 px-4 py-1 sm:px-9">
      <p className={cn("shrink-0 px-1", controlType, "text-text-tertiary")}>
        Set up
      </p>
      <div
        role="radiogroup"
        aria-label="Set up path"
        id="integration-paths"
        className="inline-flex flex-wrap items-center"
      >
        {PATHS.map((item) => {
          const active = value === item.value;
          return (
            <div
              key={item.value}
              className="relative flex items-center overflow-visible p-1 group button-wrapper"
            >
              <HoverCorners />
              <button
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
                  "inline-flex h-[26px] items-center gap-2 whitespace-nowrap rounded-[2px] border px-[10px] text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  controlType,
                  active
                    ? "border-line-structure bg-surface-bg text-text-primary [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
                    : "border-transparent bg-transparent text-text-tertiary hover:border-line-structure hover:bg-surface-bg hover:text-text-primary hover:[box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]",
                )}
              >
                <span className="text-text-primary">{item.label}</span>
                <span className="text-text-tertiary">{item.description}</span>
              </button>
            </div>
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
      <div data-use-case-path={value}>{children}</div>
    </PathContext.Provider>
  );
}
