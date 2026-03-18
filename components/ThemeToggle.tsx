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
        className="flex h-8 items-center rounded-full border border-border bg-muted/30 px-1"
        aria-hidden
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
          <Sun className="h-3.5 w-3.5 text-foreground" />
        </span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full">
          <Moon className="h-3.5 w-3.5 text-muted-foreground" />
        </span>
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className="flex h-8 items-center rounded-full border border-border bg-muted/30 px-1"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme?.("light")}
        aria-label="Switch to light mode"
        aria-pressed={!isDark}
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
          !isDark
            ? "bg-muted text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
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
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
          isDark
            ? "bg-muted text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Moon className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

