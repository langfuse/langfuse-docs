import Link from "next/link";

/**
 * Tells readers of the Japanese Academy which snapshot of the English source a
 * page was translated from, and links to the English original.
 *
 * The Japanese pages are synced in batches, so they trail the English source
 * between syncs. Rather than hiding that lag, every page states its own
 * `translatedAt` date and points readers at the English page for the current
 * version.
 */
export function TranslationNotice({
  translatedAt,
  englishHref,
}: {
  /** ISO date (YYYY-MM-DD) from the page's `translatedAt` frontmatter. */
  translatedAt?: string | null;
  /** Path of the corresponding English page, when one exists. */
  englishHref?: string;
}) {
  const formatted = formatJapaneseDate(translatedAt);

  return (
    <div className="not-prose mb-4 text-xs text-fd-muted-foreground">
      {formatted
        ? `英語版 ${formatted} 時点の翻訳です。`
        : "英語版を翻訳したものです。"}
      {englishHref ? (
        <>
          {" "}
          最新の内容は{" "}
          <Link
            href={englishHref}
            className="underline underline-offset-2 decoration-1 hover:no-underline"
          >
            英語版
          </Link>{" "}
          をご参照ください。
        </>
      ) : (
        " 最新の内容は英語版をご参照ください。"
      )}
    </div>
  );
}

function formatJapaneseDate(value?: string | null): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return undefined;
  const [, year, month, day] = match;
  return `${year}年${Number(month)}月${Number(day)}日`;
}
