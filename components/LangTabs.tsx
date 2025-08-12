import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Tabs } from "nextra/components";

const LANG_TABS_STORAGE_KEY = "lang-tab-index";

type LangTabsContextValue = {
  index: number;
  setIndex: (index: number) => void;
};

const LangTabsContext = createContext<LangTabsContextValue | undefined>(
  undefined
);

export function LangTabsProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const [index, setIndex] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const stored = window.localStorage.getItem(LANG_TABS_STORAGE_KEY);
    const parsed = stored != null ? Number(stored) : 0;
    return Number.isFinite(parsed) ? parsed : 0;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LANG_TABS_STORAGE_KEY, String(index));
  }, [index]);

  // Sync across browser tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === LANG_TABS_STORAGE_KEY) {
        const next = e.newValue != null ? Number(e.newValue) : 0;
        if (Number.isFinite(next)) setIndex(next);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo(() => ({ index, setIndex }), [index]);

  return (
    <LangTabsContext.Provider value={value}>{children}</LangTabsContext.Provider>
  );
}

export function useLangTabs(): LangTabsContextValue {
  const ctx = useContext(LangTabsContext);
  if (!ctx) {
    throw new Error(
      "useLangTabs must be used within a LangTabsProvider. Wrap your app in <LangTabsProvider>."
    );
  }
  return ctx;
}

export type LangTabsProps = React.ComponentProps<typeof Tabs>;

export function LangTabs(props: LangTabsProps): JSX.Element {
  const { index, setIndex } = useLangTabs();
  return (
    <Tabs
      {...props}
      selectedIndex={index}
      onChange={setIndex}
      storageKey={LANG_TABS_STORAGE_KEY}
    />
  );
}

// Re-export nested Tab component to allow <LangTabs.Tab> usage in MDX
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(LangTabs as any).Tab = (Tabs as any).Tab;

export { LANG_TABS_STORAGE_KEY };