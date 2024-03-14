import cookbookRoutes from "../cookbook/_routes.json";

export const COOKBOOK_ROUTE_MAPPING: {
  path: string;
  ipynbPath: string;
  canonicalPath?: string;
}[] = cookbookRoutes
  .flatMap(({ docsPath, notebook }) => [
    {
      // default export to cookbook folder
      path: `/guides/cookbook/${notebook.replace(".ipynb", "")}`,
      ipynbPath: `/cookbook/${notebook}`,
      // if also in docs, set cookbook as canonical path
      canonicalPath: docsPath ? `/${docsPath}` : undefined,
    },
    docsPath
      ? {
          path: `/${docsPath}`,
          ipynbPath: `/cookbook/${notebook}`,
        }
      : null,
  ])
  .filter(Boolean);
