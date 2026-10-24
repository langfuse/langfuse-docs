import { Home } from "@/components/home";
import { JsonLd } from "@/components/JsonLd";
import { HOME_JSON_LD } from "@/lib/structured-data";
import type { Metadata } from "next";

// Keep this on the homepage: a layout canonical would be inherited by children.
export const metadata: Metadata = {
  title: {
    absolute: "Langfuse: Open Source Agent Evals & Observability",
  },
  alternates: {
    canonical: "https://langfuse.com/",
    // Markdown mirror from md-override/index.md.
    types: { "text/markdown": "https://langfuse.com/index.md" },
  },
};

export default function HomePage() {
  return (
    <>
      {/* Agentic Resource Discovery catalog (MCP servers, skill, APIs).
          React hoists this into <head>. */}
      <link rel="ard" href="/.well-known/ard.json" />
      <JsonLd data={HOME_JSON_LD} />
      <Home />
    </>
  );
}
