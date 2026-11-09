import {
  CHANGELOG_RSS_PATH,
  getChangelogIndexItems,
} from "@/lib/changelog-index";
import authorsData from "@/data/authors.json";

// The feed only depends on content files, so it is rendered once at build time.
export const dynamic = "force-static";

const SITE_URL = "https://langfuse.com";

const authorsByKey = authorsData as Record<
  string,
  { firstName: string; name: string }
>;
const authors = Object.values(authorsByKey);

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_URL).toString();
}

/**
 * Resolves `author: Marc, Max` frontmatter to full names from data/authors.json,
 * matching by key, first name, or full name (same lookup as components/Authors.tsx).
 */
function resolveAuthors(raw: unknown): string[] {
  if (typeof raw !== "string" || raw.trim() === "") return [];
  return raw
    .split(",")
    .map((a) => a.trim())
    .filter(Boolean)
    .map((name) => {
      const lower = name.toLowerCase();
      const match =
        authorsByKey[name] ??
        authors.find(
          (a) =>
            a.firstName.toLowerCase() === lower ||
            a.name.toLowerCase() === lower,
        );
      return match?.name ?? name;
    });
}

function toRfc822(date: string | undefined): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toUTCString();
}

export function GET() {
  const items = getChangelogIndexItems();

  const itemsXml = items
    .map((item) => {
      const fm = item.frontMatter ?? {};
      const link = absoluteUrl(item.route);
      const pubDate = toRfc822(fm.date);
      const title = fm.title ?? item.title ?? item.route;
      const lines = [
        `<title>${escapeXml(title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        pubDate && `<pubDate>${pubDate}</pubDate>`,
        fm.description &&
          `<description>${escapeXml(fm.description)}</description>`,
        ...resolveAuthors(fm.author).map(
          (name) => `<dc:creator>${escapeXml(name)}</dc:creator>`,
        ),
        fm.badge && `<category>${escapeXml(fm.badge)}</category>`,
        fm.ogImage &&
          `<media:content url="${escapeXml(absoluteUrl(fm.ogImage))}" medium="image" />`,
      ].filter(Boolean);
      return `    <item>\n${lines.map((l) => `      ${l}`).join("\n")}\n    </item>`;
    })
    .join("\n");

  // Use the newest entry's date rather than the build time so the feed only
  // changes when a changelog entry is added.
  const lastBuildDate = toRfc822(items[0]?.frontMatter?.date);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Langfuse Changelog</title>
    <link>${SITE_URL}/changelog</link>
    <description>Latest product updates from the Langfuse team: new features, improvements, and release notes.</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}${CHANGELOG_RSS_PATH}" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE_URL}/apple-touch-icon.png</url>
      <title>Langfuse Changelog</title>
      <link>${SITE_URL}/changelog</link>
    </image>
${lastBuildDate ? `    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n` : ""}${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
