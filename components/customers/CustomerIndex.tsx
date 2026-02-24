import Link from "next/link";
import Image from "next/image";
import { type CustomerStory } from "./CustomerCarousel";

export const CustomerIndex = ({
  stories: allStories = [],
  maxItems,
}: {
  stories?: CustomerStory[];
  maxItems?: number;
}) => {
  const customerStories = allStories
    .filter((page) => page.frontMatter?.showInCustomerIndex !== false)
    .slice(0, maxItems);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {customerStories.map((story) => (
        <Link
          key={story.route}
          href={story.route}
          className="group block bg-card border rounded-lg p-8 break-inside-avoid hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 cursor-pointer flex flex-col h-full"
        >
          {/* Customer Logo */}
          {story.frontMatter.customerLogo && (
            <div className="flex items-center mb-8">
              {story.frontMatter.customerLogoDark ? (
                <>
                  <Image
                    src={story.frontMatter.customerLogo as string}
                    alt={`${story.frontMatter.title} logo`}
                    width={250}
                    height={80}
                    className="h-8 w-auto object-contain dark:hidden"
                    quality={100}
                    priority={false}
                    unoptimized={false}
                  />
                  <Image
                    src={story.frontMatter.customerLogoDark as string}
                    alt={`${story.frontMatter.title} logo`}
                    width={250}
                    height={80}
                    className="h-8 w-auto object-contain hidden dark:block"
                    quality={100}
                    priority={false}
                    unoptimized={false}
                  />
                </>
              ) : (
                <Image
                  src={story.frontMatter.customerLogo as string}
                  alt={`${story.frontMatter.title} logo`}
                  width={250}
                  height={80}
                  className="h-8 w-auto object-contain dark:invert dark:brightness-0 dark:contrast-200"
                  quality={100}
                  priority={false}
                  unoptimized={false}
                />
              )}
            </div>
          )}

          {/* Quote */}
          {story.frontMatter.customerQuote && (
            <blockquote className="text-gray-500 dark:text-gray-200 text-xl leading-relaxed mb-4">
              "{story.frontMatter.customerQuote as string}"
            </blockquote>
          )}

          {/* Spacing div to push author info to bottom */}
          <div className="flex-1" />

          {/* Author Information */}
          {(story.frontMatter.quoteAuthor || story.frontMatter.quoteRole || story.frontMatter.quoteCompany) && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div>
                {story.frontMatter.quoteAuthor && (
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {story.frontMatter.quoteAuthor as string}
                  </div>
                )}
                {(story.frontMatter.quoteRole || story.frontMatter.quoteCompany) && (
                  <div>
                    {story.frontMatter.quoteRole && (
                      <span>{story.frontMatter.quoteRole as string}</span>
                    )}
                    {story.frontMatter.quoteRole && story.frontMatter.quoteCompany && (
                      <span> at </span>
                    )}
                    {story.frontMatter.quoteCompany && (
                      <span>{story.frontMatter.quoteCompany as string}</span>
                    )}
                  </div>
                )}
              </div>
              <div className="w-6 h-6 min-w-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                <svg
                  className="w-3 h-3 text-gray-600 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};
