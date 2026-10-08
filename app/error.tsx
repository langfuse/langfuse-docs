"use client";

import { useEffect } from "react";

/**
 * Soft-navigation RSC failures (including truncated Flight payloads on
 * Next 16.3 and mid-preview redeploy skew) surface as "This page couldn't
 * load". A full document load of the same URL usually works — recover with
 * a hard reload instead of leaving the user on a dead-end error screen.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="font-analog text-2xl text-text-primary">
        This page couldn&apos;t load
      </h1>
      <p className="max-w-md text-sm text-text-secondary">
        A client navigation failed. Reloading usually fixes it — especially on
        preview deployments that just updated.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          className="rounded border border-line-structure bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
        <button
          type="button"
          className="rounded border border-line-structure px-4 py-2 text-sm font-medium text-text-secondary hover:bg-accent/70"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
