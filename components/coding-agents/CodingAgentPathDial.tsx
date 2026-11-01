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
import { controlTextClassName } from "@/components/ui/button";
import { TabButton } from "@/components/ui/tab-button";
import { cn } from "@/lib/utils";
import { dispatchUseCaseInteraction } from "@/lib/use-case-analytics";

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
      <p
        className={cn(
          "shrink-0 px-1",
          controlTextClassName,
          "text-text-tertiary",
        )}
      >
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
            <TabButton
              key={item.value}
              ref={(node) => {
                buttonRefs.current[item.value] = node;
              }}
              active={active}
              role="radio"
              aria-checked={active}
              tabIndex={active ? 0 : -1}
              onClick={() => selectPath(item.value)}
              onKeyDown={handleKeyDown}
            >
              <span className="text-text-primary">{item.label}</span>
              <span className="text-text-tertiary">{item.description}</span>
            </TabButton>
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
