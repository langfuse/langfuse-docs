/**
 * Fumadocs tab persist grouping for LangTabs.
 *
 * Language-like tab sets share `groupId="language"` + persist.
 * Other tab sets persist only when MDX passes an explicit groupId, so
 * Local/VM and Cloud-region tabs cannot overwrite the language preference.
 */

export function isLanguageLikeLabel(label: string): boolean {
  const n = label.trim().toLowerCase();
  if (
    /\bpython\b/.test(n) ||
    /\bjavascript\b/.test(n) ||
    /\btypescript\b/.test(n) ||
    /\bjs\/ts\b/.test(n) ||
    /\bjava sdk\b/.test(n)
  ) {
    return true;
  }
  return /\b(openai sdk|langchain|langgraph|vercel ai sdk|opentelemetry|\botel\b)\b/.test(
    n,
  );
}

export function isLanguageTabSet(labels: string[]): boolean {
  return labels.some(isLanguageLikeLabel);
}

export function resolveTabsPersist({
  labels,
  groupId,
  persist,
}: {
  labels: string[];
  groupId?: string;
  persist?: boolean;
}): { groupId?: string; persist: boolean } {
  const resolvedGroupId =
    groupId ?? (isLanguageTabSet(labels) ? "language" : undefined);
  return {
    groupId: resolvedGroupId,
    persist: persist ?? Boolean(resolvedGroupId),
  };
}
