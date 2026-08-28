import { resourcesSource } from "@/lib/source";
import { Link } from "@/components/ui/link";

type ResourcePage = ReturnType<typeof resourcesSource.getPages>[number];

/**
 * Friendly category labels for the tags used across resource articles, plus the
 * order in which categories are rendered. Tags not listed here fall back to the
 * "Articles" bucket and render last.
 */
const CATEGORY_LABELS: Record<string, string> = {
  comparison: "Comparisons",
  migration: "Migrations",
};

const CATEGORY_ORDER = ["comparison", "migration"];
const OTHER_KEY = "other";
const OTHER_LABEL = "Articles";

/** Pick the category a page belongs to from its tags (first known tag wins). */
const categoryForPage = (page: ResourcePage): string => {
  const tags = (page.data.tags as string[] | undefined) ?? [];
  return tags.find((tag) => tag in CATEGORY_LABELS) ?? OTHER_KEY;
};

const formatDate = (value: unknown): string | null => {
  if (value == null) return null;
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Lists every article under /resources/engineering, grouped by category. Used
 * on the section landing page. New articles are picked up automatically — just
 * add the MDX file and its frontmatter tags.
 */
export const ResourcesIndex = ({ prefix = "/resources/engineering/" } = {}) => {
  const pages = resourcesSource
    .getPages()
    .filter((page) => page.url.startsWith(prefix));

  const byCategory = pages.reduce(
    (acc, page) => {
      const key = categoryForPage(page);
      (acc[key] ??= []).push(page);
      return acc;
    },
    {} as Record<string, ResourcePage[]>,
  );

  const orderedKeys = [
    ...CATEGORY_ORDER.filter((key) => byCategory[key]?.length),
    ...(byCategory[OTHER_KEY]?.length ? [OTHER_KEY] : []),
  ];

  return (
    <div className="not-prose flex flex-col gap-10">
      {orderedKeys.map((key) => {
        const items = [...byCategory[key]].sort((a, b) =>
          a.data.title.localeCompare(b.data.title),
        );
        return (
          <section key={key}>
            <h2 className="text-lg font-semibold tracking-tight text-primary">
              {CATEGORY_LABELS[key] ?? OTHER_LABEL}
            </h2>
            <ul className="mt-4 divide-y divide-border border-t border-border">
              {items.map((page) => {
                const date = formatDate(
                  (page.data as unknown as Record<string, unknown>)
                    .lastModified,
                );
                return (
                  <li key={page.url} className="py-4">
                    <Link
                      href={page.url}
                      variant="default"
                      className="text-base font-medium hover:underline"
                    >
                      {page.data.title}
                    </Link>
                    {page.data.description && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {page.data.description}
                      </p>
                    )}
                    {date && (
                      <p className="mt-1 text-xs text-muted-foreground/80">
                        Last updated {date}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
};
