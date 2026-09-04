import Image from "next/image";
import Link from "next/link";
import { getCustomerStories } from "@/lib/getCustomerStories";

const QUOTE_ROUTES = [
  "/users/sumup",
  "/users/cresta",
  "/users/magic-patterns-ai-design-tools",
] as const;

type Story = ReturnType<typeof getCustomerStories>[number];

function getStoryMap(stories: Story[]) {
  return new Map(stories.map((story) => [story.route, story]));
}

export function CustomerQuoteGrid() {
  const stories = getCustomerStories();
  const byRoute = getStoryMap(stories);
  const selected = QUOTE_ROUTES.map((route) => byRoute.get(route)).filter(
    (story): story is Story => Boolean(story),
  );

  return (
    <div className="mt-8 grid gap-2 lg:grid-cols-3">
      {selected.map((story) => {
        const frontMatter = story.frontMatter ?? {};
        const quote = frontMatter.customerQuote ?? "";
        const quoteAuthor = frontMatter.quoteAuthor ?? "";
        const quoteRole = frontMatter.quoteRole ?? "";
        const quoteCompany = frontMatter.quoteCompany ?? "";
        const customerLogo = frontMatter.customerLogo;
        const customerLogoDark = frontMatter.customerLogoDark;
        const logoSrc = customerLogoDark ?? customerLogo;

        return (
          <blockquote
            key={story.route}
            className="border border-line-structure bg-surface-bg p-5 text-[14px] leading-[1.45] text-text-primary"
          >
            <p>“{quote}”</p>
            <footer className="mt-4 border-t border-line-structure pt-3">
              <Link href={story.route} className="inline-flex items-center">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={quoteCompany}
                    width={110}
                    height={28}
                    className="h-5 w-auto object-contain opacity-90"
                  />
                ) : (
                  <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-text-tertiary">
                    {quoteCompany}
                  </span>
                )}
              </Link>
              <p className="mt-2 text-[11px] text-text-tertiary">
                {quoteAuthor}
                {quoteRole ? `, ${quoteRole}` : ""}
                {quoteCompany ? ` · ${quoteCompany}` : ""}
              </p>
            </footer>
          </blockquote>
        );
      })}
    </div>
  );
}
