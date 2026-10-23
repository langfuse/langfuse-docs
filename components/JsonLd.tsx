/**
 * Renders schema.org structured data as a server-rendered JSON-LD script, so
 * crawlers that do not run JavaScript still see it. `<` is escaped to keep a
 * string value from closing the script tag early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
