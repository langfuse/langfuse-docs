import Image from "next/image";
import Link from "next/link";
import { getCustomerStories } from "@/lib/getCustomerStories";
import { HeroStatsStrip } from "@/components/home/HeroStatsStrip";
import {
  financialServicesFeaturedStory,
  financialServicesStoryCards,
} from "./content";

function StoryLogo({
  logo,
  logoDark,
  company,
  sizes,
  widthClass,
  heightClass = "h-6",
}: {
  logo?: string;
  logoDark?: string;
  company: string;
  sizes: string;
  widthClass: string;
  heightClass?: string;
}) {
  if (!logo) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
        {company}
      </span>
    );
  }

  return (
    <div className={`relative ${heightClass} ${widthClass}`}>
      {logoDark ? (
        <>
          <Image
            src={logo}
            alt={`${company} logo`}
            fill
            sizes={sizes}
            className="object-contain object-left dark:hidden"
            unoptimized
          />
          <Image
            src={logoDark}
            alt={`${company} logo`}
            fill
            sizes={sizes}
            className="hidden object-contain object-left dark:block"
            unoptimized
          />
        </>
      ) : (
        <Image
          src={logo}
          alt={`${company} logo`}
          fill
          sizes={sizes}
          className="object-contain object-left dark:invert dark:brightness-0 dark:contrast-200"
          unoptimized
        />
      )}
    </div>
  );
}

const storyCardClassName =
  "flex flex-col gap-4 border border-line-structure bg-surface-bg p-5 no-underline";
const liveStoryCardClassName = `${storyCardClassName} transition-colors hover:border-line-cta`;

export function CustomerStoriesSection() {
  const stories = getCustomerStories();
  const byRoute = new Map(stories.map((story) => [story.route, story]));
  const featured = byRoute.get(financialServicesFeaturedStory.href);

  return (
    <div className="flex flex-col">
      <div className="mb-6 sm:mb-7">
        <HeroStatsStrip textSize="m" density="compact" />
      </div>
      <div className="flex flex-col gap-2">
        <Link
          href={financialServicesFeaturedStory.href}
          aria-label="Read the Merck customer story"
          className="grid border border-line-structure bg-surface-bg no-underline transition-colors hover:border-line-cta lg:grid-cols-[minmax(0,1.35fr)_minmax(220px,0.65fr)]"
        >
          <div className="flex flex-col gap-5 border-b border-line-structure p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <StoryLogo
              logo={featured?.frontMatter.customerLogo}
              logoDark={featured?.frontMatter.customerLogoDark}
              company={financialServicesFeaturedStory.company}
              sizes="160px"
              widthClass="w-40"
              heightClass="h-8"
            />
            <blockquote className="m-0 border-0 p-0 text-[22px] font-medium leading-[1.22] text-text-primary sm:text-[26px]">
              “{financialServicesFeaturedStory.quote}”
            </blockquote>
            <p className="m-0 text-[13px] leading-[1.45] text-text-secondary">
              <span className="font-medium text-text-primary">
                {financialServicesFeaturedStory.author}
              </span>
              , {financialServicesFeaturedStory.role}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1">
            {financialServicesFeaturedStory.stats.map((stat, index) => (
              <div
                key={stat.value}
                className={
                  index === 0
                    ? "flex flex-col justify-center gap-1 px-6 py-5 sm:px-6 lg:px-7 lg:py-6"
                    : "flex flex-col justify-center gap-1 border-t border-dashed border-line-divider-dash px-6 py-5 sm:border-t-0 sm:border-l lg:border-l-0 lg:border-t lg:px-7 lg:py-6"
                }
              >
                <p className="m-0 font-medium text-[28px] leading-none tracking-tight text-text-primary sm:text-[32px]">
                  {stat.value}
                </p>
                <p className="m-0 text-[13px] leading-[1.4] text-text-secondary">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Link>

        <div className="grid gap-2 md:grid-cols-3">
          {financialServicesStoryCards.map((card) => {
            const story = byRoute.get(card.route);
            const published = !(
              "published" in card && card.published === false
            );
            const isLive = published && Boolean(story);
            const company =
              story?.frontMatter.quoteCompany ?? card.company ?? "Customer";
            const logo =
              story?.frontMatter.customerLogo ??
              ("logo" in card ? card.logo : undefined);
            const logoDark =
              story?.frontMatter.customerLogoDark ??
              ("logoDark" in card ? card.logoDark : undefined);
            const body = (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
                  Customer story · {card.category}
                </p>
                <StoryLogo
                  logo={logo}
                  logoDark={logoDark}
                  company={company}
                  sizes="148px"
                  widthClass="w-[148px]"
                  heightClass="h-8"
                />
                <p className="text-[14px] leading-[1.45] text-text-primary">
                  {card.description}
                </p>
                <span className="mt-auto pt-1 text-[13px] text-text-secondary">
                  {isLive ? "Read story →" : "Coming soon"}
                </span>
              </>
            );

            if (!isLive) {
              return (
                <div key={card.route} className={storyCardClassName}>
                  {body}
                </div>
              );
            }

            return (
              <Link
                key={card.route}
                href={card.route}
                className={liveStoryCardClassName}
              >
                {body}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
