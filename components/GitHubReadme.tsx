"use client";

import { useState, useEffect } from "react";
import { RenderedReadmeContent } from "@/components/RenderedReadmeContent";

/**
 * Fetches a README from GitHub and renders it as formatted markdown.
 * Relative links/images are rewritten to GitHub; HTML `<img>` tags render as images.
 */
export function GitHubReadme({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setContent(null);
    setError(false);

    fetch(url, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then((text) => {
        if (!controller.signal.aborted) setContent(text);
      })
      .catch((e) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(true);
      });

    return () => controller.abort();
  }, [url]);

  if (error) return <p>Error loading README content.</p>;
  if (!content)
    return <p className="text-sm text-muted-foreground">Loading README…</p>;

  return <RenderedReadmeContent content={content} sourceUrl={url} />;
}
