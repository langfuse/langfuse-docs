import { getChangelogIndexItems } from "@/lib/changelog-index";

export async function GET() {
  try {
    const items = getChangelogIndexItems();

    const rssItems = items
      .map((item) => {
        const title = item.frontMatter?.title ?? "Untitled";
        const description = item.frontMatter?.description ?? "";
        const date = item.frontMatter?.date
          ? new Date(item.frontMatter.date).toUTCString()
          : new Date().toUTCString();
        const url = `https://langfuse.com${item.route}`;

        return `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${date}</pubDate>
      <description><![CDATA[${description}]]></description>
    </item>`;
      })
      .join("");

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Langfuse Changelog</title>
    <link>https://langfuse.com/changelog</link>
    <atom:link href="https://langfuse.com/api/changelog-rss.xml" rel="self" type="application/rss+xml"/>
    <description>Latest updates from Langfuse</description>
    <language>en-us</language>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(feed, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (err) {
    console.error("RSS generation failed:", err);
    return new Response(JSON.stringify({ error: "Failed to generate RSS feed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}