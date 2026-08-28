"use client";

import {
  RootProvider,
  type RootProviderProps,
} from "fumadocs-ui/provider/next";

/**
 * Wraps Fumadocs' `RootProvider` to silence the React 19 / Next.js 16
 * "Encountered a script tag while rendering React component" warning.
 *
 * `next-themes` (used internally by `RootProvider`) renders an inline
 * `<script>` to set the theme before hydration and prevent a flash of the
 * wrong theme. During SSR we emit it as a normal executable script so flicker
 * prevention keeps working; on the client render — where the warning fires —
 * we switch its `type` to `application/json` so React ignores the (already
 * executed) script instead of warning about it.
 */
export function AppRootProvider({
  children,
  theme,
  ...props
}: RootProviderProps) {
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <RootProvider
      {...props}
      theme={{
        ...theme,
        scriptProps: { ...theme?.scriptProps, ...scriptProps },
      }}
    >
      {children}
    </RootProvider>
  );
}
