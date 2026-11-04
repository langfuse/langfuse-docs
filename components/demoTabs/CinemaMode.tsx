"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { FocusTrap, FocusTrapFeatures } from "@headlessui/react";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const CinemaModeContext = createContext<{
  inlineHeight: number | null;
  setInlineHeight: (height: number | null) => void;
  containerRef: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
} | null>(null);

export function CinemaModeProvider({ children }: { children: ReactNode }) {
  const [inlineHeight, setInlineHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <CinemaModeContext.Provider
      value={{ inlineHeight, setInlineHeight, containerRef, triggerRef }}
    >
      {children}
    </CinemaModeContext.Provider>
  );
}

function useCinemaMode() {
  const context = useContext(CinemaModeContext);
  if (!context) throw new Error("Cinema mode requires CinemaModeProvider");
  return context;
}

export function CinemaModeTrigger() {
  const { setInlineHeight, containerRef, triggerRef } = useCinemaMode();

  return (
    <Button
      ref={triggerRef}
      type="button"
      variant="secondary"
      size="default"
      wrapperClassName="not-prose shrink-0"
      aria-label="Cinema mode"
      aria-haspopup="dialog"
      onClick={() => setInlineHeight(containerRef.current.offsetHeight)}
      icon={<MaximizeIcon className="size-4" />}
    >
      Cinema mode
    </Button>
  );
}

export function CinemaMode({ children }: { children: ReactNode }) {
  const { inlineHeight, setInlineHeight, containerRef, triggerRef } =
    useCinemaMode();
  const isActive = inlineHeight !== null;
  const stageRef = useRef<HTMLDivElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // Keep the demos mounted in place, while isolating the surrounding docs.
    // Newly opened portals (e.g. chat feedback) remain above the cinema stage.
    const restore = new Map<HTMLElement, () => void>();
    const isolate = (element: HTMLElement) => {
      if (restore.has(element)) return;
      const inert = element.inert;
      const visibility = element.style.visibility;
      element.inert = true;
      element.style.visibility = "hidden";
      restore.set(element, () => {
        element.inert = inert;
        element.style.visibility = visibility;
      });
    };
    // Responsive docs navigation can mount new siblings at a breakpoint.
    const observer = new MutationObserver((records) => {
      for (const { addedNodes } of records) {
        for (const node of addedNodes) {
          if (
            node instanceof HTMLElement &&
            !node.contains(containerRef.current)
          ) {
            isolate(node);
          }
        }
      }
    });
    let current: HTMLElement = containerRef.current;
    while (current && current !== document.body) {
      for (const sibling of current.parentElement.children) {
        if (sibling === current || !(sibling instanceof HTMLElement)) continue;
        isolate(sibling);
      }
      if (current.parentElement !== document.body) {
        observer.observe(current.parentElement, { childList: true });
      }
      current = current.parentElement;
    }
    exitRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      // Docs shortcuts must stay inactive even when a background click blurs the stage.
      event.stopPropagation();
      if (event.isComposing || event.keyCode === 229) return;
      if (event.key !== "Escape" || event.defaultPrevented) return;

      const dialog =
        event.target instanceof Element
          ? event.target.closest('[role="dialog"], [role="alertdialog"]')
          : null;
      if (dialog && dialog !== stageRef.current) return;

      event.preventDefault();
      setInlineHeight(null);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      observer.disconnect();
      restore.forEach((reset) => reset());
      document.documentElement.style.overflow = overflow;
      if (containerRef.current?.isConnected) {
        triggerRef.current?.focus({ preventScroll: true });
        window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      }
    };
  }, [isActive, containerRef, triggerRef, setInlineHeight]);

  return (
    <div ref={containerRef} style={{ minHeight: inlineHeight ?? undefined }}>
      <FocusTrap
        ref={stageRef}
        features={isActive ? FocusTrapFeatures.TabLock : FocusTrapFeatures.None}
        role={isActive ? "dialog" : undefined}
        aria-modal={isActive || undefined}
        aria-label={isActive ? "Demo cinema mode" : undefined}
        data-cinema={isActive}
        className={cn(
          "group/cinema",
          isActive &&
            "fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-surface-bg p-4 text-text-primary sm:p-8",
        )}
      >
        <div className={cn(isActive && "mx-auto w-full max-w-5xl")}>
          {isActive && (
            <div className="sticky top-0 z-30 mb-3 flex items-center justify-end gap-3 bg-surface-bg">
              <span className="mr-auto hidden text-sm font-medium text-text-secondary sm:block">
                Demo applications
              </span>
              <ThemeToggle />
              <Button
                ref={exitRef}
                type="button"
                variant="secondary"
                size="default"
                aria-label="Exit cinema mode"
                onClick={() => setInlineHeight(null)}
                icon={<MinimizeIcon className="size-4" />}
              >
                Exit cinema mode
                <span className="ml-2 text-text-tertiary">Esc</span>
              </Button>
            </div>
          )}
          {children}
        </div>
      </FocusTrap>
    </div>
  );
}
