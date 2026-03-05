/**
 * Formerly from pages/integrations/native/_meta and data-platform/_meta.
 * Used by IntegrationIndex for additional links. Empty = use only filesystem pages.
 */
type MetaEntry = { href?: string; title?: string; logo?: string };
export const nativeIntegrationsMeta: Record<string, MetaEntry> = {};
export const dataPlatformIntegrationsMeta: Record<string, MetaEntry> = {};
