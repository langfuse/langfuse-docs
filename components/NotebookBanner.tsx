import { Callout } from "nextra/components";
import { Button } from "./ui/button";

export const NotebookBanner: React.FC<{ src: string; className?: string }> = ({
  src,
  className,
}) => {
  // Check if this is a Deno notebook by looking at the filename
  const isDenoNotebook = src.includes("/js_") && src.endsWith(".ipynb");

  // Extract the notebook filename from the src path for Binder URL
  const notebookFilename = src.split("/").pop();
  const binderUrl = `https://mybinder.org/v2/gh/langfuse/langfuse-docs/main?urlpath=lab/tree/cookbook/${notebookFilename}`;

  return (
    <div className={className}>
      <Callout type="info">
        <div className="flex flex-wrap gap-1 md:justify-between md:items-center">
          <span>This is a {isDenoNotebook ? "Deno" : "Jupyter"} notebook</span>
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
            {isDenoNotebook && (
              <a
                href={binderUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xs" variant="outline" className="inline-flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="4 9 39 48"
                    className="h-4 w-4 shrink-0"
                  >
                    <circle fill="none" stroke="#F5A252" strokeWidth="4.8342" strokeMiterlimit="10" cx="27.879" cy="23.939" r="9.542"/>
                    <circle fill="none" stroke="#579ACA" strokeWidth="4.8342" strokeMiterlimit="10" cx="27.879" cy="42.499" r="9.543"/>
                    <circle fill="none" stroke="#E66581" strokeWidth="4.8342" strokeMiterlimit="10" cx="18.551" cy="33.289" r="9.543"/>
                    <path fill="none" stroke="#579ACA" strokeWidth="4.8342" strokeMiterlimit="10" d="M20.196,36.836c0.759-1.031,1.74-1.927,2.921-2.607c4.566-2.63,10.401-1.06,13.031,3.507"/>
                    <path fill="none" stroke="#F5A252" strokeWidth="4.8342" strokeMiterlimit="10" d="M19.61,28.701c-2.63-4.566-1.061-10.401,3.507-13.032c4.567-2.63,10.401-1.059,13.031,3.508"/>
                  </svg>
                  Open in Binder
                </Button>
              </a>
            )}
            {!isDenoNotebook && (
              <a
                href={`https://colab.research.google.com/github/langfuse/langfuse-docs/blob/main${src}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="xs" variant="outline" className="inline-flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0"
                    fill="#F9AB00"
                  >
                    <path d="M16.9414 4.9757a7.033 7.033 0 0 0-4.9308 2.0646 7.033 7.033 0 0 0-.1232 9.8068l2.395-2.395a3.6455 3.6455 0 0 1 5.1497-5.1478l2.397-2.3989a7.033 7.033 0 0 0-4.8877-1.9297zM7.07 4.9855a7.033 7.033 0 0 0-4.8878 1.9316l2.3911 2.3911a3.6434 3.6434 0 0 1 5.0227.1271l1.7341-2.9737-.0997-.0802A7.033 7.033 0 0 0 7.07 4.9855zm15.0093 2.1721-2.3892 2.3911a3.6455 3.6455 0 0 1-5.1497 5.1497l-2.4067 2.4068a7.0362 7.0362 0 0 0 9.9456-9.9476zM1.932 7.1674a7.033 7.033 0 0 0-.002 9.6816l2.397-2.397a3.6434 3.6434 0 0 1-.004-4.8916zm7.664 7.4235c-1.38 1.3816-3.5863 1.411-5.0168.1134l-2.397 2.395c2.4693 2.3328 6.263 2.5753 9.0072.5455l.1368-.1115z" />
                  </svg>
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
