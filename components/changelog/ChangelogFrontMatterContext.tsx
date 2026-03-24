"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/**
 * Changelog page frontmatter passed from the server component (SectionDocPage)
 * down to ChangelogHeader via React context, avoiding a client-side import of
 * lib/source (and its .source/server.ts dependency) from a "use client" component.
 */
export type ChangelogFrontMatter = {
  title?: string;
  description?: string;
  ogImage?: string;
  ogVideo?: string;
  gif?: string;
  date?: string;
  author?: string;
  showOgInHeader?: boolean;
  badge?: string;
};

const ChangelogFrontMatterContext = createContext<ChangelogFrontMatter | null>(null);

export function ChangelogFrontMatterProvider({
  frontMatter,
  children,
}: {
  frontMatter: ChangelogFrontMatter;
  children: ReactNode;
}) {
  return (
    <ChangelogFrontMatterContext.Provider value={frontMatter}>
      {children}
    </ChangelogFrontMatterContext.Provider>
  );
}

export function useChangelogFrontMatter(): ChangelogFrontMatter {
  return useContext(ChangelogFrontMatterContext) ?? {};
}
