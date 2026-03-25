/**
 * Used by IntegrationIndex for additional links. Content lives under content/integrations/.
 * Empty = use only filesystem pages.
 */
type MetaEntry = { href?: string; title?: string; logo?: string };
export const nativeIntegrationsMeta: Record<string, MetaEntry> = {
  "python-sdk": {
    href: "/docs/sdk/python/sdk-v3",
    title: "Python SDK",
  },
  "js-ts-sdk": {
    href: "/docs/sdk/typescript/guide",
    title: "JS/TS SDK",
  },
};
export const dataPlatformIntegrationsMeta: Record<string, MetaEntry> = {};
