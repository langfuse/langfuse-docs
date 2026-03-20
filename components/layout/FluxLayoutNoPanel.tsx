"use client";

import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/flux";

/** Wrapper around fumadocs flux DocsLayout that suppresses the NavigationPanel.
 * Must be a Client Component because renderNavigationPanel is a function prop. */
export function FluxLayoutNoPanel(props: Omit<DocsLayoutProps, "renderNavigationPanel">) {
  return <DocsLayout {...props} renderNavigationPanel={() => null} />;
}
