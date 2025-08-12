import React, { useEffect, useMemo, useSyncExternalStore } from "react";
import { Tabs as OriginalTabs } from "nextra/components";

const normalize = (label: string) => label.trim().toLowerCase();
const STORAGE_KEY = "lang-tabs-selected-label";

// Shared in-memory store for the active tab label across all Tabs on a page
class TabsLabelStore {
  private _label: string | null = null;
  private subscribers = new Set<() => void>();

  getSnapshot = () => this._label;

  subscribe = (cb: () => void) => {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  };

  setLabel = (next: string | null) => {
    const n = next == null ? null : normalize(next);
    if (n !== this._label) {
      this._label = n;
      // Notify listeners
      this.subscribers.forEach((cb) => cb());
      // Persist to localStorage (client-only)
      if (typeof window !== "undefined") {
        if (typeof n === "string" && n.length > 0) {
          try {
            window.localStorage.setItem(STORAGE_KEY, n);
          } catch {}
        } else {
          try {
            window.localStorage.removeItem(STORAGE_KEY);
          } catch {}
        }
      }
    }
  };
}

const globalStore: TabsLabelStore = (globalThis as any).__LANGFUSE_TABS_LABEL_STORE__ ?? new TabsLabelStore();
// cache on globalThis to keep a single store across HMR in dev
;(globalThis as any).__LANGFUSE_TABS_LABEL_STORE__ = globalStore;

// Initialize from localStorage once on module load (client-only)
if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw && globalStore.getSnapshot() == null) {
      globalStore.setLabel(raw);
    }
  } catch {}
}

export type SyncedTabsProps = React.ComponentProps<typeof OriginalTabs>;

export function SyncedTabs(props: SyncedTabsProps): JSX.Element {
  const { items, onChange: userOnChange, storageKey: _ignored, ...rest } = props as SyncedTabsProps & {
    items: string[];
  };

  const normalizedItems = useMemo(() => items.map(normalize), [items]);
  const currentLabel = useSyncExternalStore(globalStore.subscribe, globalStore.getSnapshot, globalStore.getSnapshot);

  // Live-sync across browser tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next = e.newValue ?? null;
        globalStore.setLabel(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const selectedIndex = useMemo(() => {
    if (currentLabel == null) return (props as any).selectedIndex ?? 0;
    const idx = normalizedItems.indexOf(normalize(currentLabel));
    return idx === -1 ? 0 : idx;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLabel, normalizedItems]);

  const handleChange = useMemo(() => (nextIndex: number) => {
    const nextLabel = items[nextIndex];
    if (typeof nextLabel === "string") globalStore.setLabel(nextLabel);
    if (typeof userOnChange === "function") userOnChange(nextIndex);
  }, [items, userOnChange]);

  return (
    <OriginalTabs
      {...rest}
      items={items}
      selectedIndex={selectedIndex}
      onChange={handleChange}
      // Avoid built-in persistence, since we manage persistence by label
      storageKey={undefined as unknown as string}
    />
  );
}
