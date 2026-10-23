// Markdown 404 for agents.
//
// Markdown requests end up under /md-src/: `/foo.md` via the `afterFiles`
// rewrite, and `/foo` with `Accept: text/markdown` via the `beforeFiles`
// content-negotiation rewrite (both in next.config.mjs). Existing mirrors are
// static files in public/md-src/ and are served before dynamic routes, so this
// handler only runs when no mirror exists. Without it, those requests fall
// through to the HTML not-found page; agents get a real 404 status with a
// Markdown body that points them to the indexes instead.

const NOT_FOUND_MARKDOWN = `# Page not found

There is no page at this URL on langfuse.com. It may have moved or been removed.

To find what you were looking for:

- [llms.txt](https://langfuse.com/llms.txt): index of the site for agents, with links to per-section indexes
- [Documentation](https://langfuse.com/docs.md): Langfuse documentation home
- [Docs search](https://langfuse.com/api/search-docs?query=your+question): semantic search over the documentation, no authentication
- [Sitemap](https://langfuse.com/sitemap.xml): every public URL

Every page on langfuse.com is available as Markdown at its URL plus \`.md\`.
`;

function notFound() {
  return new Response(NOT_FOUND_MARKDOWN, {
    status: 404,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
      Vary: "Accept",
    },
  });
}

export const GET = notFound;
export const HEAD = notFound;
