import cookbookRoutes from "../cookbook/_routes.json";

export const COOKBOOK_ROUTE_MAPPING: {
  path: string;
  ipynbPath: string;
  canonicalPath?: string;
  showNotebookBanner?: boolean;
}[] = cookbookRoutes
  .flatMap(({ docsPath, notebook, isGuide, showNotebookBanner }) => [
    // Only include a /guides/cookbook/ entry when isGuide is true (default)
    isGuide !== false
      ? {
          path: `/guides/cookbook/${notebook.replace(".ipynb", "")}`,
          ipynbPath: `/cookbook/${notebook}`,
          canonicalPath: docsPath ? `/${docsPath}` : undefined,
          showNotebookBanner,
        }
      : null,
    docsPath
      ? {
          path: `/${docsPath}`,
          ipynbPath: `/cookbook/${notebook}`,
          showNotebookBanner,
        }
      : null,
  ])
  .filter(Boolean);
