"use client";

import { useEffect, useState } from "react";
import { Playground } from "@/lib/nextra-shim/components";

export function FetchReadme({ url }: { url: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => (res.ok ? res.text() : Promise.reject(new Error(res.statusText))))
      .then(setContent)
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, [url]);

  if (error) return <p>Error loading content: {error}</p>;
  if (content === null) return <p>Loading…</p>;
  return <Playground source={content} />;
}
