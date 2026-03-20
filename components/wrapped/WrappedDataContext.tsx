"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/**
 * Page data passed from the server component (SectionDocPage) to
 * the Customers and Launches client components via React context,
 * avoiding a client-side import of lib/source / .source/server.ts.
 */
export type PageData = {
  route: string;
  name?: string;
  title?: string;
  frontMatter?: Record<string, unknown>;
};

export type WrappedData = {
  usersPages: PageData[];
  changelogPages: PageData[];
};

const WrappedDataContext = createContext<WrappedData | null>(null);

export function WrappedDataProvider({
  data,
  children,
}: {
  data: WrappedData;
  children: ReactNode;
}) {
  return (
    <WrappedDataContext.Provider value={data}>
      {children}
    </WrappedDataContext.Provider>
  );
}

export function useWrappedData(): WrappedData {
  return useContext(WrappedDataContext) ?? { usersPages: [], changelogPages: [] };
}
