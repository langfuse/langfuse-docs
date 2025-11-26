import integrationRoutes from "../pages/integrations/cookbooks/_routes.json";
import guideRoutes from "../pages/guides/cookbooks/_routes.json";

type RawCookbookRoute = {
  notebook: string;
  destinations?: string[];
};

const COOKBOOK_SOURCES: Array<{
  routes: RawCookbookRoute[];
  notebookBasePath: string;
}> = [
  {
    routes: integrationRoutes as RawCookbookRoute[],
    notebookBasePath: "/pages/integrations/cookbooks",
  },
  {
    routes: guideRoutes as RawCookbookRoute[],
    notebookBasePath: "/pages/guides/cookbooks",
  },
];

export const COOKBOOK_ROUTE_MAPPING: {
  path: string;
  ipynbPath: string;
  canonicalPath?: string;
}[] = COOKBOOK_SOURCES.flatMap(({ routes, notebookBasePath }) =>
  routes.flatMap(({ destinations = [], notebook }) => {
    const ipynbPath = `${notebookBasePath}/${notebook}`;
    const docDestination = destinations.find(
      (destination) => !destination.startsWith("guides/cookbook/")
    );

    return destinations
      .map((destination) => {
        const normalizedDestination = destination.startsWith("/")
          ? destination
          : `/${destination}`;

        return {
          path: normalizedDestination,
          ipynbPath,
          canonicalPath: normalizedDestination.startsWith("/guides/cookbook/") &&
            docDestination
            ? (docDestination.startsWith("/")
                ? docDestination
                : `/${docDestination}`)
            : undefined,
        };
      })
      .filter(Boolean);
  })
).filter(Boolean);
