/**
 * Shim for nextra/components (Cards, Tabs, Callout) so existing components render.
 * Re-export Fumadocs or simple equivalents where possible.
 *
 * This file has NO "use client" directive.  Server-safe components (Cards, Card,
 * Callout, Steps, Playground) live in ./cards.tsx so that MDX compiled code can
 * access sub-properties like Cards.Card in RSC.
 *
 * Tabs/Tab/FileTree live in ./tabs.tsx (also no "use client") which delegates its
 * hook-based logic to ./tabs-client.tsx.  This preserves accessible sub-properties
 * (Tabs.Tab, FileTree.File, FileTree.Folder) in RSC.
 */

// Server-safe — re-exported directly so MDX compiled code can access sub-properties
export { Cards, Card, Callout, Steps, Playground } from "./cards";

// Server-safe wrappers with client delegation
export { Tabs, Tab, FileTree, FileTreeFile, FileTreeFolder } from "./tabs";
