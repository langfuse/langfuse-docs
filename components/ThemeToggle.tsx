"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="inline-flex h-[26px] w-fit items-center rounded-sm justify-center gap-0.5 border border-line-structure bg-transparent p-0.5 border-sm"
        aria-hidden
      >
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center border border-line-structure bg-surface-1 text-text-primary">
          <Sun className="h-3.5 w-3.5" />
        </span>
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center border border-transparent text-text-secondary">
          <Moon className="h-3.5 w-3.5" />
        </span>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="inline-flex h-[26px] w-fit items-center rounded-sm justify-center gap-0.5 border border-line-structure bg-transparent p-0.5 border-sm"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme?.("light")}
        aria-label="Switch to light mode"
        aria-pressed={!isDark}
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center border border-transparent text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary",
          !isDark
            ? "border-line-structure bg-surface-bg text-text-primary"
            : ""
        )}
      >
        <Sun className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setTheme?.("dark")}
        aria-label="Switch to dark mode"
        aria-pressed={isDark}
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center border border-transparent text-text-secondary transition-colors hover:bg-surface-1 hover:text-text-primary",
          isDark
            ? "border-line-structure bg-surface-bg text-text-primary"
            : ""
        )}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

