"use client";

import { useState, useEffect } from "react";
import { RenderedReadmeContent } from "@/components/RenderedReadmeContent";

/**
 * Fetches and renders a README from GitHub at runtime.
 * Renders as formatted markdown (headings, lists, tables) for all README usages
 * (terraform, k8s, n8n, changelog, etc.).
 */
export function GitHubReadme({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(setContent)
      .catch(() => setError(true));
  }, [url]);

  if (error) return <p>Error loading README content.</p>;
  if (!content)
    return (
      <p className="text-sm text-muted-foreground">Loading README…</p>
    );

  return <RenderedReadmeContent content={content} />;
}
