import { renderMermaidSVG } from "beautiful-mermaid";
import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";

interface MermaidProps {
  chart: string;
}

// beautiful-mermaid is stricter than mermaid.js, so normalize a couple of
// legacy patterns that still exist in docs content before rendering.
function normalizeMermaidInput(chart: string): string {
  const lines = chart.split("\n");

  let startIndex = 0;
  if (lines[0]?.trim() === "---") {
    const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
    if (closingIndex !== -1) {
      startIndex = closingIndex + 1;
    }
  }

  return lines
    .slice(startIndex)
    .map((line) => line.replace(/;\s*$/, ""))
    .join("\n")
    .trim();
}

// The library inlines Google Fonts imports into the SVG. Strip those so
// diagrams inherit the site's existing font setup instead of loading fonts.
function normalizeMermaidSvgFonts(svg: string): string {
  return svg.replace(/@import\s+url\('https:\/\/fonts\.googleapis\.com\/[^']+'\);\s*/g, "");
}

export function Mermaid({ chart }: MermaidProps) {
  try {
    const svg = normalizeMermaidSvgFonts(renderMermaidSVG(normalizeMermaidInput(chart), {
      bg: "var(--surface-1)",
      fg: "var(--text-primary)",
      line: "var(--line-cta)",
      accent: "var(--line-cta)",
      muted: "var(--text-tertiary)",
      surface: "var(--surface-2)",
      border: "var(--text-tertiary)",
      interactive: false,
      transparent: true,
    }));

    return (
      <div
        className="mermaid-diagram my-4 overflow-x-auto border p-4 not-prose rounded-none"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  } catch (error) {
    console.warn("Failed to render Mermaid diagram", error);

    return (
      <CodeBlock title="Mermaid">
        <Pre>{normalizeMermaidInput(chart)}</Pre>
      </CodeBlock>
    );
  }
}
