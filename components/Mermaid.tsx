"use client";

import { useEffect, useState } from "react";
import type { MermaidConfig } from "mermaid";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";

const renderedSvgCache = new Map<string, string>();
const renderedSvgByThemeModeCache = new Map<string, string>();
const pendingRenderCache = new Map<string, Promise<string>>();

let nextMermaidRenderId = 0;
let mermaidRenderQueue = Promise.resolve();

function getCssVariableValue(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function getMermaidThemeValues() {
  return {
    surface1: getCssVariableValue("--surface-1"),
    surface2: getCssVariableValue("--surface-2"),
    textPrimary: getCssVariableValue("--text-primary"),
    textTertiary: getCssVariableValue("--text-tertiary"),
    lineCta: getCssVariableValue("--line-cta"),
    lineStructure: getCssVariableValue("--line-structure"),
  };
}

function getMermaidConfig(
  themeValues: ReturnType<typeof getMermaidThemeValues>,
): MermaidConfig {
  const {
    surface1,
    surface2,
    textPrimary,
    textTertiary,
    lineCta,
    lineStructure,
  } = themeValues;

  return {
    startOnLoad: false,
    securityLevel: "strict",
    theme: "base",
    htmlLabels: true,
    fontFamily: "var(--font-sans)",
    themeVariables: {
      background: "transparent",
      mainBkg: surface2,
      primaryColor: surface2,
      primaryBorderColor: textTertiary,
      primaryTextColor: textPrimary,
      secondaryColor: surface1,
      secondaryBorderColor: textTertiary,
      secondaryTextColor: textPrimary,
      tertiaryColor: surface1,
      tertiaryBorderColor: textTertiary,
      tertiaryTextColor: textPrimary,
      lineColor: lineCta,
      textColor: textPrimary,
      edgeLabelBackground: surface1,
      clusterBkg: surface1,
      clusterBorder: lineStructure,
      nodeBorder: textTertiary,
      defaultLinkColor: lineCta,
    },
  };
}

function getMermaidCacheKey(chart: string, themeMode: string): string {
  return `${themeMode}\n${chart}`;
}

function enqueueMermaidRender<T>(render: () => Promise<T>): Promise<T> {
  const queuedRender = mermaidRenderQueue.then(render, render);
  mermaidRenderQueue = queuedRender.then(
    () => undefined,
    () => undefined,
  );
  return queuedRender;
}

async function renderMermaidChart(
  chart: string,
  cacheKey: string,
  themeValues: ReturnType<typeof getMermaidThemeValues>,
): Promise<string> {
  const cachedSvg = renderedSvgCache.get(cacheKey);
  if (cachedSvg) return cachedSvg;

  const pendingRender = pendingRenderCache.get(cacheKey);
  if (pendingRender) return pendingRender;

  const mermaidConfig = getMermaidConfig(themeValues);
  const renderPromise = enqueueMermaidRender(() =>
    import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize(mermaidConfig);
      return mermaid.render(`mermaid-diagram-${nextMermaidRenderId++}`, chart);
    }),
  )
    .then(({ svg }) => {
      renderedSvgCache.set(cacheKey, svg);
      pendingRenderCache.delete(cacheKey);
      return svg;
    })
    .catch((error: unknown) => {
      pendingRenderCache.delete(cacheKey);
      throw error;
    });

  pendingRenderCache.set(cacheKey, renderPromise);
  return renderPromise;
}

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme();
  const [error, setError] = useState<Error | null>(null);
  const [renderedSvg, setRenderedSvg] = useState<string | null>(null);
  const [renderedCacheKey, setRenderedCacheKey] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<{
    cacheSignature: string;
    values: ReturnType<typeof getMermaidThemeValues>;
  } | null>(null);
  const currentCacheKey =
    currentTheme === null
      ? null
      : getMermaidCacheKey(chart, currentTheme.cacheSignature);
  const isRendered =
    renderedSvg !== null && renderedCacheKey === currentCacheKey;
  const themeModeCacheKey =
    resolvedTheme === undefined
      ? null
      : getMermaidCacheKey(chart, resolvedTheme);
  const visibleSvg =
    isRendered || themeModeCacheKey === null
      ? renderedSvg
      : (renderedSvgByThemeModeCache.get(themeModeCacheKey) ?? null);

  useEffect(() => {
    setError(null);
    setCurrentTheme(null);

    if (resolvedTheme === undefined) return;

    const frame = requestAnimationFrame(() => {
      const values = getMermaidThemeValues();
      setCurrentTheme({
        cacheSignature: [
          resolvedTheme,
          values.surface1,
          values.surface2,
          values.textPrimary,
          values.textTertiary,
          values.lineCta,
          values.lineStructure,
        ].join("\n"),
        values,
      });
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [resolvedTheme]);

  useEffect(() => {
    let isCurrent = true;

    if (currentTheme === null) return;

    const cacheKey = getMermaidCacheKey(chart, currentTheme.cacheSignature);
    setError(null);

    const cachedSvg = renderedSvgCache.get(cacheKey);
    if (cachedSvg) {
      if (themeModeCacheKey !== null) {
        renderedSvgByThemeModeCache.set(themeModeCacheKey, cachedSvg);
      }
      setRenderedSvg(cachedSvg);
      setRenderedCacheKey(cacheKey);
      return;
    }

    setRenderedSvg(null);
    setRenderedCacheKey(null);

    renderMermaidChart(chart, cacheKey, currentTheme.values)
      .then((svg) => {
        if (!isCurrent) return;

        if (themeModeCacheKey !== null) {
          renderedSvgByThemeModeCache.set(themeModeCacheKey, svg);
        }
        setRenderedSvg(svg);
        setRenderedCacheKey(cacheKey);
      })
      .catch((renderError: unknown) => {
        if (!isCurrent) return;

        console.warn("Failed to render Mermaid diagram", renderError);
        setError(
          renderError instanceof Error
            ? renderError
            : new Error(String(renderError)),
        );
      });

    return () => {
      isCurrent = false;
    };
  }, [chart, currentTheme, themeModeCacheKey]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto border border-line-structure bg-surface-1 p-4 text-left text-xs text-text-primary not-prose">
        {chart}
      </pre>
    );
  }

  return (
    <div className="mermaid-diagram my-4 overflow-x-auto border p-4 not-prose rounded-none">
      {visibleSvg === null && (
        <div
          aria-hidden="true"
          className="flex items-center justify-center py-6"
        >
          <Loader2 className="size-4 animate-spin text-text-tertiary" />
        </div>
      )}
      <div
        key={renderedCacheKey ?? themeModeCacheKey}
        className={visibleSvg === null ? "hidden" : ""}
        dangerouslySetInnerHTML={
          visibleSvg === null ? undefined : { __html: visibleSvg }
        }
      />
    </div>
  );
}
