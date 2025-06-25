import type { NextApiRequest, NextApiResponse } from "next";
import { getPagesUnderRoute } from "nextra/context";
import type { Page } from "nextra";

type ChangelogPage = Page & {
  frontMatter?: {
    title?: string;
    description?: string;
    date?: string;
    author?: string;
    ogImage?: string;
    badge?: string;
  };
};

// Function to properly escape XML content
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get all changelog pages and sort by date
    const allPages = (getPagesUnderRoute("/changelog") as ChangelogPage[])
      .filter((page) => page.frontMatter?.date) // Only include pages with dates
      .sort(
        (a, b) =>
          new Date(b.frontMatter!.date!).getTime() -
          new Date(a.frontMatter!.date!).getTime()
      );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://langfuse.com";
    const now = new Date().toUTCString();

    const rssItems = allPages
      .map((page) => {
        const pubDate = new Date(page.frontMatter!.date!).toUTCString();
        const link = `${baseUrl}${page.route}`;
        const title = page.frontMatter?.title || page.meta?.title || page.name;
        const description = page.frontMatter?.description || "";

        return `
        <item>
          <title>${escapeXml(title || "")}</title>
          <description>${escapeXml(description)}</description>
          <link>${link}</link>
          <guid isPermaLink="true">${link}</guid>
          <pubDate>${pubDate}</pubDate>
        </item>
      `.trim();
      })
      .join("\n");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Langfuse Changelog</title>
    <description><![CDATA[Latest updates and features for Langfuse, the open-source LLM engineering platform]]></description>
    <link>${baseUrl}/changelog</link>
    <atom:link href="${baseUrl}/api/changelog-rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <lastBuildDate>${now}</lastBuildDate>
    <generator>Langfuse Docs</generator>
    <image>
      <url>${baseUrl}/icon256.png</url>
      <title>Langfuse Changelog</title>
      <link>${baseUrl}/changelog</link>
    </image>
${rssItems}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    res.status(200).send(rssXml);
  } catch (error) {
    console.error("Error generating RSS feed:", error);
    res.status(500).json({ error: "Failed to generate RSS feed" });
  }
}
