type SharedMessage = { role: 'user' | 'assistant'; text: string };

const SHARE_BASE = '/docs/ask-ai';

export function encodeShareUrl(messages: SharedMessage[]): string {
  const json = JSON.stringify(messages);
  const encoded = btoa(unescape(encodeURIComponent(json)));
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://langfuse.com';
  return `${origin}${SHARE_BASE}#chat=${encoded}`;
}

export function decodeShareHash(hash: string): SharedMessage[] | null {
  const prefix = '#chat=';
  if (!hash.startsWith(prefix)) return null;
  try {
    const encoded = hash.slice(prefix.length);
    const json = decodeURIComponent(escape(atob(encoded)));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (m: unknown): m is SharedMessage =>
        typeof m === 'object' && m !== null &&
        'role' in m && 'text' in m &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.text === 'string',
    );
  } catch {
    return null;
  }
}

export function extractTextFromParts(parts: unknown[]): string {
  return (parts ?? [])
    .filter((p): p is { type: 'text'; text: string } =>
      typeof p === 'object' && p !== null && 'type' in p && (p as any).type === 'text')
    .map((p) => p.text)
    .join('');
}
