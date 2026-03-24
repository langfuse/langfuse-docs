"use client";
import React, { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import {
  Tabs as FumadocsTabs,
  TabsList as FumadocsTabsList,
  TabsTrigger as FumadocsTabsTrigger,
} from "fumadocs-ui/components/tabs";
import { cn } from "@/lib/utils";

const KEY = "synced-tabs:language";
const normalize = (s: string) => s.trim().toLowerCase();

type Store = {
  getSnapshot: () => string | null;
  subscribe: (cb: () => void) => () => void;
  set: (label: string) => void;
};

const storeEntry: { value: string | null; subs: Set<() => void> } = {
  value: null,
  subs: new Set(),
};

const store: Store = {
  getSnapshot: () => storeEntry.value,
  subscribe: (cb) => {
    storeEntry.subs.add(cb);
    return () => storeEntry.subs.delete(cb);
  },
  set: (label: string) => {
    if (storeEntry.value === label) return;
    storeEntry.value = label;
    storeEntry.subs.forEach((cb) => cb());
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(KEY, label);
      } catch {}
    }
  },
};

if (typeof window !== "undefined") {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved != null) storeEntry.value = saved;
  } catch {}
  window.addEventListener("storage", (e: StorageEvent) => {
    if (e.key !== KEY) return;
    const next = e.newValue == null ? null : e.newValue;
    if (storeEntry.value !== next) {
      storeEntry.value = next;
      storeEntry.subs.forEach((cb) => cb());
    }
  });
}

function toValue(s: string): string {
  return s.toLowerCase().replace(/\s/g, "-");
}

export function LangTabs(props: {
  items: any[];
  children: React.ReactNode;
  defaultIndex?: number;
  onChange?: (next: number) => void;
}) {
  const { items, children, defaultIndex = 0, onChange } = props;

  const labels: (string | null)[] = useMemo(() => {
    return items.map((it) => {
      if (typeof it === "string") return it;
      if (
        it &&
        typeof it === "object" &&
        "label" in it &&
        typeof it.label === "string"
      )
        return it.label as string;
      return null;
    });
  }, [items]);

  const values = useMemo(
    () => labels.map((l, i) => (l ? toValue(l) : String(i))),
    [labels],
  );

  const storedLabel = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  const initialLabel = useMemo(
    () => labels[defaultIndex] ?? null,
    [labels, defaultIndex],
  );

  useEffect(() => {
    if (storedLabel == null && initialLabel) store.set(initialLabel);
  }, [storedLabel, initialLabel]);

  const [internalValue, setInternalValue] = React.useState(
    values[defaultIndex] ?? values[0],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const pendingOffsetRef = useRef<number | null>(null);

  useEffect(() => {
    const target = storedLabel ?? initialLabel;
    if (target) {
      const idx = labels.findIndex(
        (l) => typeof l === "string" && normalize(l) === normalize(target),
      );
      if (idx !== -1) {
        setInternalValue(values[idx]);
        return;
      }
      const asNum = Number(target);
      if (!Number.isNaN(asNum) && asNum >= 0 && asNum < items.length) {
        setInternalValue(values[asNum]);
        return;
      }
    }
  }, [storedLabel, initialLabel, labels, items.length, values]);

  useEffect(() => {
    if (pendingOffsetRef.current !== null && containerRef.current) {
      const savedOffset = pendingOffsetRef.current;
      pendingOffsetRef.current = null;
      const restoreScroll = () => {
        if (containerRef.current) {
          const currentRect = containerRef.current.getBoundingClientRect();
          const scrollAdjustment = currentRect.top - savedOffset;
          if (Math.abs(scrollAdjustment) > 1) {
            window.scrollBy({ top: scrollAdjustment, behavior: "instant" });
          }
        }
      };
      restoreScroll();
      requestAnimationFrame(restoreScroll);
      setTimeout(restoreScroll, 0);
      setTimeout(restoreScroll, 50);
    }
  }, [internalValue]);

  const handleValueChange = (v: string) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      pendingOffsetRef.current = rect.top;
    }
    setInternalValue(v);
    const idx = values.indexOf(v);
    const label = idx !== -1 ? labels[idx] : null;
    if (typeof label === "string") store.set(label);
    else store.set(v);
    if (typeof onChange === "function" && idx !== -1) onChange(idx);
  };

  return (
    <div ref={containerRef}>
      <FumadocsTabs
        key={internalValue}
        defaultValue={internalValue}
        className="flex overflow-hidden flex-col my-4 rounded-xl border border-border bg-card"
      >
        <FumadocsTabsList
          className={cn(
            "flex overflow-x-auto overflow-y-hidden flex-nowrap gap-1 px-4 pt-1 rounded-t-xl border-b text-muted-foreground not-prose bg-muted/50 border-border min-h-11",
          )}
        >
          {items.map((item, i) => (
            <FumadocsTabsTrigger
              key={i}
              value={values[i]}
              onClick={() => handleValueChange(values[i])}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-none border-b-2 border-transparent px-2.5 pb-2 pt-1.5 -mb-px text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-foreground data-[state=active]:text-foreground data-[state=active]:font-medium"
            >
              {typeof item === "string" ? item : (item?.label ?? String(i))}
            </FumadocsTabsTrigger>
          ))}
        </FumadocsTabsList>
        {React.Children.map(children, (child, i) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(
            child as React.ReactElement<{ value: string }>,
            {
              value: values[i] ?? String(i),
            },
          );
        })}
      </FumadocsTabs>
    </div>
  );
}
