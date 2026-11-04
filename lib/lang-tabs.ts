const LANGUAGE_HASH_IDS: Record<string, string> = {
  python: "tab-python",
  js: "tab-js",
  "js/ts": "tab-js",
  javascript: "tab-js",
  typescript: "tab-js",
};

const LANGUAGE_GROUP_PATTERN =
  /\b(python|js\/ts|\bjs\b|javascript|typescript|sdk|langchain|openai|opentelemetry|otel)\b/;

export function normalizeTabLabel(label: string): string {
  return label.trim().toLowerCase();
}

export function toTabValue(label: string): string {
  return normalizeTabLabel(label).replace(/\s/g, "-");
}

function slugifyTabLabel(label: string): string {
  return normalizeTabLabel(label)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Short language/SDK labels share stable hash ids (`tab-js`, `tab-python`).
 * Compound labels fall back to a slug so each tab on a page stays unique.
 */
export function toTabId(label: string): string {
  const normalized = normalizeTabLabel(label);
  const short = normalized.match(
    /^(python|js\/ts|js|javascript|typescript)(?:\s+sdk)?(?:\s+v[\d.+]+)?$/,
  );
  if (short)
    return LANGUAGE_HASH_IDS[short[1]] ?? `tab-${slugifyTabLabel(label)}`;
  return `tab-${slugifyTabLabel(label)}`;
}

export function isLanguageLabel(label: string): boolean {
  const normalized = normalizeTabLabel(label);
  if (
    /^(python|js\/ts|js|javascript|typescript)(?:\s+sdk)?(?:\s+v[\d.+]+)?$/.test(
      normalized,
    )
  ) {
    return true;
  }
  return LANGUAGE_GROUP_PATTERN.test(normalized);
}

export function isLanguageTabGroup(labels: (string | null)[]): boolean {
  const named = labels.filter(
    (label): label is string => typeof label === "string" && label.length > 0,
  );
  if (named.length === 0) return false;
  return named.filter(isLanguageLabel).length > named.length / 2;
}

export function tabValueFromHash(
  hash: string,
  ids: string[],
  values: string[],
): string | undefined {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return undefined;
  const index = ids.indexOf(id);
  return index === -1 ? undefined : values[index];
}
