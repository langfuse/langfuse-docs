"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

// Pinned so the frozen spec keeps rendering the same way over time.
const SCALAR_BUNDLE_URL =
  "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.66.1/dist/browser/standalone.js";

type ScalarInstance = { destroy?: () => void };
type ScalarGlobal = {
  createApiReference: (
    element: HTMLElement,
    configuration: Record<string, unknown>,
  ) => ScalarInstance;
};

declare global {
  interface Window {
    Scalar?: ScalarGlobal;
  }
}

let scalarBundlePromise: Promise<ScalarGlobal> | null = null;

function loadScalarBundle(): Promise<ScalarGlobal> {
  if (window.Scalar) return Promise.resolve(window.Scalar);
  scalarBundlePromise ??= new Promise<ScalarGlobal>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCALAR_BUNDLE_URL;
    script.async = true;
    script.onload = () =>
      window.Scalar
        ? resolve(window.Scalar)
        : reject(new Error("Scalar bundle loaded without a global"));
    script.onerror = () => {
      scalarBundlePromise = null;
      script.remove();
      reject(new Error("Failed to load the Scalar bundle"));
    };
    document.head.appendChild(script);
  });
  return scalarBundlePromise;
}

export function LegacyApiReference({ specUrl }: { specUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || resolvedTheme === undefined) return;

    let instance: ScalarInstance | null = null;
    let isCurrent = true;

    loadScalarBundle()
      .then((scalar) => {
        if (!isCurrent) return;
        instance = scalar.createApiReference(container, {
          url: specUrl,
          hideModels: true,
          hideClientButton: true,
          hideDarkModeToggle: true,
          forceDarkModeState: resolvedTheme === "dark" ? "dark" : "light",
          defaultOpenAllTags: false,
          withDefaultFonts: false,
          showDeveloperTools: "never",
          telemetry: false,
          agent: { disabled: true },
          mcp: { disabled: true },
          servers: [
            {
              url: "https://cloud.langfuse.com",
              description: "Langfuse Cloud (EU data region)",
            },
            {
              url: "https://us.cloud.langfuse.com",
              description: "Langfuse Cloud (US data region)",
            },
            {
              url: "https://hipaa.cloud.langfuse.com",
              description: "Langfuse Cloud (HIPAA data region)",
            },
            {
              url: "http://localhost:3000",
              description: "Self-hosted (local)",
            },
          ],
        });
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) return;
        setError(
          loadError instanceof Error ? loadError : new Error(String(loadError)),
        );
      });

    return () => {
      isCurrent = false;
      instance?.destroy?.();
      container.replaceChildren();
    };
  }, [specUrl, resolvedTheme]);

  if (error) {
    return (
      <p className="my-4 text-sm text-text-secondary">
        The interactive reference could not be loaded.{" "}
        <a href={specUrl} className="underline">
          Download the OpenAPI spec
        </a>{" "}
        instead.
      </p>
    );
  }

  return (
    <div className="not-prose my-6 border border-line-structure">
      <div ref={containerRef} />
    </div>
  );
}
