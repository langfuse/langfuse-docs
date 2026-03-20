"use client";

import { useState, useEffect } from "react";
import { RenderedReadmeContent } from "@/components/RenderedReadmeContent";

/**
 * Fetches and renders the cursor-langfuse README from GitHub at runtime.
 * Renders as formatted markdown (headings, lists, tables) like the integration docs.
 */
export function CursorLangfuseReadme() {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/naoufalelh/cursor-langfuse/refs/heads/main/README.md"
    )
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
      })
      .then(setContent)
      .catch(() => setError(true));
  }, []);

  if (error) return <p>Error loading README content.</p>;
  if (!content)
    return (
      <p className="text-sm text-muted-foreground">Loading README…</p>
    );

  return <RenderedReadmeContent content={content} />;
}
