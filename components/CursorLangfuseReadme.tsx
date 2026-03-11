"use client";

import { useState, useEffect } from "react";

/**
 * Fetches and renders the cursor-langfuse README from GitHub at runtime.
 * Replaces the old Nextra getStaticProps/useData pattern.
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
  if (!content) return <p className="text-sm text-muted-foreground">Loading README…</p>;

  return (
    <pre className="p-4 overflow-auto rounded-lg border bg-muted/50 text-sm max-h-[70vh]">
      <code>{content}</code>
    </pre>
  );
}
