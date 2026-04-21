import Image from "next/image";
import type { CustomerStory } from "./CustomerCarousel";
import { HoverPostRow } from "@/components/lists/HoverPostRow";

export function CustomerHoverList({
  stories: allStories = [],
  maxItems,
}: {
  stories?: CustomerStory[];
  maxItems?: number;
}) {
  const customerStories = allStories
    .filter((page) => page.frontMatter?.showInCustomerIndex !== false)
    .slice(0, maxItems);

  if (customerStories.length === 0) return null;

  return (
    <section className="rounded-[2px] border border-line-structure bg-surface-bg overflow-hidden">
      <div className="flex items-center px-4 py-3 border-b border-line-structure">
        <h2 className="text-left font-analog font-medium text-[16px] text-text-primary shrink-0">
          All posts
        </h2>
      </div>
      <div className="divide-y divide-line-structure">
        {customerStories.map((story) => {
          const title = story.frontMatter.title ?? story.route;
          const quote = story.frontMatter.customerQuote;
          const quoteCompany = story.frontMatter.quoteCompany;

          const logo = story.frontMatter.customerLogo;
          const logoDark = story.frontMatter.customerLogoDark;

          return (
            <HoverPostRow
              key={story.route}
              href={story.route}
              tags={quoteCompany ? [quoteCompany] : []}
              title={title}
              description={quote ? `"${quote}"` : undefined}
              previewOnHover={false}
              leadingVisual={
                <div className="w-16 h-16 shrink-0 flex items-center justify-center overflow-hidden rounded-sm border border-line-structure bg-surface-1 p-2">
                  {logo ? (
                    logoDark ? (
                      <>
                        <Image
                          src={logo as string}
                          alt={`${title} logo`}
                          width={250}
                          height={80}
                          className="object-contain w-auto h-8 dark:hidden m-0!"
                          unoptimized
                        />
                        <Image
                          src={logoDark as string}
                          alt={`${title} logo`}
                          width={250}
                          height={80}
                          className="hidden object-contain w-auto h-8 dark:block m-0!"
                          unoptimized
                        />
                      </>
                    ) : (
                      <Image
                        src={logo as string}
                        alt={`${title} logo`}
                        width={250}
                        height={80}
                        className="object-contain w-auto h-8 m-0! dark:invert dark:brightness-0 dark:contrast-200"
                        unoptimized
                      />
                    )
                  ) : null}
                </div>
              }
            />
          );
        })}
      </div>
    </section>
  );
}

