"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    mermaid?: {
      initialize: (config: object) => void;
      render: (id: string, text: string) => Promise<{ svg: string }>;
    };
  }
}

interface MermaidProps {
  chart: string;
}

let mermaidScriptPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
  if (window.mermaid) return Promise.resolve();
  if (!mermaidScriptPromise) {
    mermaidScriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
      script.onload = () => resolve();
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return mermaidScriptPromise;
}

let idCounter = 0;

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const id = `mermaid-diagram-${++idCounter}`;

    loadMermaid()
      .then(() => {
        window.mermaid!.initialize({
          startOnLoad: false,
          theme: document.documentElement.classList.contains("dark")
            ? "dark"
            : "default",
          securityLevel: "loose",
        });
        return window.mermaid!.render(id, chart);
      })
      .then(({ svg }) => {
        if (el) el.innerHTML = svg;
      })
      .catch(() => {
        if (el) {
          el.innerHTML = `<pre class="text-xs text-left overflow-x-auto">${chart}</pre>`;
        }
      });
  }, [chart]);

  return (
    <div
      ref={ref}
      className="my-4 flex justify-center overflow-x-auto rounded-lg border bg-card p-4"
    />
  );
}
