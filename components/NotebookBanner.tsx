import { Callout } from "nextra/components";
import { Button } from "./ui/button";

export const NotebookBanner: React.FC<{ src: string; className?: string }> = ({
  src,
  className,
}) => {
  // Check if this is a Deno notebook by looking at the filename
  const isDenoNotebook = src.includes("/js_") && src.endsWith(".ipynb");

  return (
    <div className={className}>
      <Callout type="info">
        <div className="flex flex-wrap gap-1 md:justify-between md:items-center">
          <span>This is a Jupyter notebook</span>
          <div className="flex gap-2 flex-wrap">
            <a
              href={`https://github.com/langfuse/langfuse-docs/blob/main${src}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="xs" variant="outline" className="inline-block">
                Open on GitHub
              </Button>
            </a>
            {!isDenoNotebook && (
              <a
                href={`https://colab.research.google.com/github/langfuse/langfuse-docs/blob/main${src}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xs" variant="outline" className="inline-block">
                  Run on Google Colab
                </Button>
              </a>
            )}
          </div>
        </div>
      </Callout>
    </div>
  );
};
