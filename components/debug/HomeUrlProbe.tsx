"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type UrlDebugPayload = {
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
  timestamp: number;
};

function sendUrlDebugLog(payload: UrlDebugPayload) {
  void fetch("/api/debug-url", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

function HomeUrlProbeInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const didPatchHistoryRef = useRef(false);

  useEffect(() => {
    const navigationEntry = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    // #region agent log
    sendUrlDebugLog({
      hypothesisId: "B",
      location: "components/debug/HomeUrlProbe.tsx:31",
      message: "Home URL probe mount",
      data: {
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        referrer: document.referrer || null,
        navigationType: navigationEntry?.type ?? "unknown",
        hasUtmLastweek:
          new URLSearchParams(window.location.search).get("utm") === "lastweek",
      },
      timestamp: Date.now(),
    });
    // #endregion

    if (didPatchHistoryRef.current) return;
    didPatchHistoryRef.current = true;

    const originalReplaceState = window.history.replaceState.bind(
      window.history,
    );
    const originalPushState = window.history.pushState.bind(window.history);

    window.history.replaceState = ((
      data: unknown,
      unused: string,
      url?: string | URL | null,
    ) => {
      const before = window.location.href;
      const result = originalReplaceState(data, unused, url);

      // #region agent log
      sendUrlDebugLog({
        hypothesisId: "D",
        location: "components/debug/HomeUrlProbe.tsx:57",
        message: "history.replaceState invoked",
        data: {
          before,
          url: url?.toString() ?? null,
          after: window.location.href,
        },
        timestamp: Date.now(),
      });
      // #endregion

      return result;
    }) as History["replaceState"];

    window.history.pushState = ((
      data: unknown,
      unused: string,
      url?: string | URL | null,
    ) => {
      const before = window.location.href;
      const result = originalPushState(data, unused, url);

      // #region agent log
      sendUrlDebugLog({
        hypothesisId: "E",
        location: "components/debug/HomeUrlProbe.tsx:80",
        message: "history.pushState invoked",
        data: {
          before,
          url: url?.toString() ?? null,
          after: window.location.href,
        },
        timestamp: Date.now(),
      });
      // #endregion

      return result;
    }) as History["pushState"];

    return () => {
      window.history.replaceState = originalReplaceState;
      window.history.pushState = originalPushState;
      didPatchHistoryRef.current = false;
    };
  }, []);

  useEffect(() => {
    // #region agent log
    sendUrlDebugLog({
      hypothesisId: "C",
      location: "components/debug/HomeUrlProbe.tsx:107",
      message: "Home URL probe navigation snapshot",
      data: {
        pathname,
        searchParams: searchParams.toString(),
        href: window.location.href,
        hasUtmLastweek: searchParams.get("utm") === "lastweek",
      },
      timestamp: Date.now(),
    });
    // #endregion
  }, [pathname, searchParams]);

  return null;
}

export function HomeUrlProbe() {
  return (
    <Suspense fallback={null}>
      <HomeUrlProbeInner />
    </Suspense>
  );
}
