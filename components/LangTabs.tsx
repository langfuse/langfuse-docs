"use client";
import React, { useEffect, useMemo, useSyncExternalStore } from "react";
import { Tabs } from "nextra/components";

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

export function LangTabs(props: {
  items: any[];
  children: React.ReactNode;
  defaultIndex?: number;
  onChange?: (next: number) => void;
}) {
  const { items, children, defaultIndex = 0, onChange } = props;
  const storedLabel = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );

  // Track the current active index separately
  const [currentIndex, setCurrentIndex] = React.useState<number>(
    defaultIndex >= 0 && defaultIndex < items.length ? defaultIndex : 0
  );

  const labels: (string | null)[] = useMemo(() => {
    return items.map((it) => {
      if (typeof it === "string") return it;
      if (
        it &&
        typeof it === "object" &&
        "label" in it &&
        typeof (it as any).label === "string"
      )
        return (it as any).label as string;
      return null;
    });
  }, [items]);

  const initialLabel = useMemo(
    () => labels[defaultIndex] ?? null,
    [labels, defaultIndex]
  );

  useEffect(() => {
    if (storedLabel == null && initialLabel) store.set(initialLabel);
  }, [storedLabel, initialLabel]);

  // Update currentIndex when storedLabel changes and matches available tabs
  useEffect(() => {
    const target = storedLabel ?? initialLabel;
    if (target) {
      const idx = labels.findIndex(
        (l) => typeof l === "string" && normalize(l) === normalize(target)
      );
      if (idx !== -1) {
        setCurrentIndex(idx);
        return;
      }
      const asNum = Number(target);
      if (!Number.isNaN(asNum) && asNum >= 0 && asNum < items.length) {
        setCurrentIndex(asNum);
        return;
      }
    }
    // If no match found, keep the current index unchanged
  }, [storedLabel, initialLabel, labels, items.length]);

  const selectedIndex = useMemo(() => {
    // Ensure currentIndex is within bounds
    return currentIndex >= 0 && currentIndex < items.length ? currentIndex : 0;
  }, [currentIndex, items.length]);

  const handleChange = (next: number) => {
    setCurrentIndex(next);
    const label = labels[next];
    if (typeof label === "string") store.set(label);
    else store.set(String(next));
    if (typeof onChange === "function") onChange(next);
  };

  return (
    <Tabs
      items={items}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      storageKey={undefined as unknown as string}
    >
      {children}
    </Tabs>
  );
}
