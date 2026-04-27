"use client";

import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useMemo, useRef } from "react";
import { useWrappedData, type PageData } from "./WrappedDataContext";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";
import { HoverStars } from "./components/HoverStars";
import adobeLogo from "../home/img/adobe.svg";
import canvaLogo from "../home/img/canva.svg";
import circlebackLogo from "../home/img/circleback.svg";
import freeeLogo from "../home/img/freee.svg";
import intuitLogo from "../home/img/intuit.svg";
import khanacademyLogo from "../home/img/khan.svg";
import magicPatternsLogo from "../home/img/magic.svg";
import merckLogo from "../home/img/merck.svg";
import pigmentLogo from "../home/img/pigment.svg";
import samsaraLogo from "../home/img/samsara.svg";
import sumupLogo from "../home/img/sumup.svg";
import telusLogo from "../home/img/telus.svg";
import twilioLogo from "../home/img/twilio.svg";

interface CustomerStory {
  route: string;
  frontMatter: {
    title: string;
    customerLogo?: string;
    customerLogoDark?: string;
    customerQuote?: string;
    quoteAuthor?: string;
    quoteRole?: string;
    quoteCompany?: string;
    quoteAuthorImage?: string;
    showInCustomerIndex?: boolean;
  };
}

// Companies with customer stories
const companiesWithStories = [
  { name: "Canva", path: "/users/canva", logo: canvaLogo },
  { name: "SumUp", path: "/users/sumup", logo: sumupLogo },
  {
    name: "Khan Academy",
    path: "/users/khan-academy",
    logo: khanacademyLogo,
  },
  {
    name: "Magic Patterns",
    path: "/users/magic-patterns-ai-design-tools",
    logo: magicPatternsLogo,
  },
  {
    name: "Merck",
    path: "/users/merckgroup",
    logo: merckLogo,
  },
];

// Companies without customer stories (logos only)
const companiesWithoutStories = [
  { name: "Samsara", logo: samsaraLogo },
  { name: "Twilio", logo: twilioLogo },
  { name: "Telus", logo: telusLogo },
  { name: "Pigment", logo: pigmentLogo },
  { name: "Adobe", logo: adobeLogo },
  {
    name: "Intuit",
    logo: intuitLogo,
  },
  {
    name: "Circleback",
    logo: circlebackLogo,
  },
  { name: "freee", logo: freeeLogo },
];

function CustomerStoryCard({ story }: { story: CustomerStory }) {
  return (
    <Link
      href={story.route}
      className="group relative w-full block [perspective:1000px]"
    >
      {/* Hidden content to determine height */}
      <div className="flex invisible flex-col p-6 lg:p-8">
        {story.frontMatter.customerLogo && <div className="mb-4 h-6" />}
        {story.frontMatter.customerQuote && (
          <div className="mb-4 text-base leading-relaxed sm:text-lg">
            "{story.frontMatter.customerQuote}"
          </div>
        )}
        {(story.frontMatter.quoteAuthor ||
          story.frontMatter.quoteRole ||
          story.frontMatter.quoteCompany) && (
            <div className="flex gap-3 items-center">
              {story.frontMatter.quoteAuthorImage && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0" />
              )}
              <div className="flex-1">
                {story.frontMatter.quoteAuthor && (
                  <div className="text-sm font-semibold sm:text-base" />
                )}
                <div className="mt-1 text-xs sm:text-sm" />
              </div>
            </div>
          )}
      </div>

      <div className="absolute inset-0 transition-transform duration-700 transform-3d transform-[rotateY(180deg)] lg:transform-[rotateY(0deg)] lg:group-hover:transform-[rotateY(180deg)]">
        {/* Front side - Logo only */}
        <div className="flex absolute inset-0 justify-center items-center p-6 lg:p-8 backface-hidden">
          {story.frontMatter.customerLogo && (
            <div className="flex justify-center items-center">
              <Image
                src={story.frontMatter.customerLogo}
                alt={`${story.frontMatter.title} logo`}
                width={200}
                height={80}
                className="object-contain w-auto h-8"
                quality={100}
              />
            </div>
          )}
        </div>

        {/* Back side - Full story card */}
        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col items-center lg:items-start [backface-visibility:hidden] transform-[rotateY(180deg)]">
          {/* Customer Logo */}
          {story.frontMatter.customerLogo && (
            <div className="flex flex-shrink-0 items-center mb-4">
              <Image
                src={story.frontMatter.customerLogo}
                alt={`${story.frontMatter.title} logo`}
                width={200}
                height={60}
                className="object-contain w-auto h-6"
                quality={100}
              />
            </div>
          )}

          {/* Quote */}
          {story.frontMatter.customerQuote && (
            <blockquote className="mb-4 text-base leading-relaxed text-center sm:text-lg lg:text-left">
              "{story.frontMatter.customerQuote}"
            </blockquote>
          )}

          {/* Author Information - Centered on mobile, left aligned on desktop */}
          {(story.frontMatter.quoteAuthor ||
            story.frontMatter.quoteRole ||
            story.frontMatter.quoteCompany) && (
              <div className="flex flex-shrink-0 gap-3 justify-center items-center lg:justify-start">
                {story.frontMatter.quoteAuthorImage && (
                  <div className="overflow-hidden flex-shrink-0 w-12 h-12 rounded-full sm:w-16 sm:h-16">
                    <Image
                      src={story.frontMatter.quoteAuthorImage}
                      alt={`${story.frontMatter.quoteAuthor} profile picture`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      quality={100}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {story.frontMatter.quoteAuthor && (
                    <div className="text-sm font-semibold break-words sm:text-base">
                      {story.frontMatter.quoteAuthor}
                    </div>
                  )}
                  {(story.frontMatter.quoteRole ||
                    story.frontMatter.quoteCompany) && (
                      <div className="mt-1 text-xs break-words sm:text-sm text-muted-foreground">
                        {story.frontMatter.quoteRole}
                        {story.frontMatter.quoteRole &&
                          story.frontMatter.quoteCompany && <span> at </span>}
                        {story.frontMatter.quoteCompany}
                      </div>
                    )}
                </div>
              </div>
            )}
        </div>
      </div>
    </Link>
  );
}

function CompanyLogo({
  name,
  logo,
}: {
  name: string;
  logo: StaticImageData;
}) {
  return (
    <div className="p-3 lg:p-4 flex items-center justify-center min-h-[100px]">
      <Image
        src={logo}
        alt={`${name} logo`}
        width={200}
        height={80}
        className="object-contain w-auto h-8"
        quality={100}
      />
    </div>
  );
}

type CustomerItem =
  | { type: "story"; story: CustomerStory & { company: any } }
  | { type: "logo"; company: (typeof companiesWithoutStories)[0] }
  | { type: "text"; text: string };

export function Customers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const allStories = useWrappedData().usersPages.filter(
    (page: PageData) => page.frontMatter?.showInCustomerIndex !== false,
  ) as Array<CustomerStory>;

  // Match stories with companies
  const customerStories = companiesWithStories
    .map((company) => {
      const story = allStories.find(
        (s) => s.route === company.path || s.route === `${company.path}/`,
      );
      return story ? { ...story, company } : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // Hardcoded order of all items
  const orderedItems = useMemo(() => {
    // Create maps for easy lookup
    const storyMap = new Map(
      customerStories.map((story) => [story.company.name, story]),
    );
    const logoMap = new Map(
      companiesWithoutStories.map((company) => [company.name, company]),
    );

    // Define the exact order
    const order: Array<{ type: "story" | "logo" | "text"; name: string }> = [
      // First column
      { type: "logo", name: "Intuit" },
      { type: "story", name: "Canva" },
      { type: "story", name: "SumUp" },
      // Continue with rest in desired order...
      { type: "logo", name: "Samsara" },
      { type: "logo", name: "Twilio" },
      { type: "logo", name: "Telus" },
      { type: "logo", name: "Adobe" },
      { type: "logo", name: "freee" },
      { type: "story", name: "Khan Academy" },
      { type: "logo", name: "Circleback" },
      { type: "text", name: "And thousands more..." },
      { type: "story", name: "Merck" },
      { type: "logo", name: "Pigment" },
      { type: "story", name: "Magic Patterns" },
    ];

    // Build the result array
    const result: CustomerItem[] = [];
    for (const { type, name } of order) {
      if (type === "story") {
        const story = storyMap.get(name);
        if (story) {
          result.push({ type: "story", story });
        }
      } else if (type === "logo") {
        const company = logoMap.get(name);
        if (company) {
          result.push({ type: "logo", company });
        }
      } else if (type === "text") {
        result.push({ type: "text", text: name });
      }
    }

    return result;
  }, [customerStories]);

  return (
    <WrappedSection>
      <SectionHeading
        title="Powering the Greatest..."
        subtitle="We couldn't be prouder to work with these companies."
      />

      <div ref={containerRef}>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-0 -mt-[1px]">
          {orderedItems.map((item, index) => {
            // Calculate delay based on position (top-left to bottom-right)
            // For 3 columns: row = Math.floor(index / 3), col = index % 3
            // Delay increases with row and column
            const columns = 3;
            const row = Math.floor(index / columns);
            const col = index % columns;
            const delay = (row + col) * 0.1; // Stagger delay

            const animationProps = {
              initial: { opacity: 0, y: 20, scale: 0.95 },
              animate: isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 20, scale: 0.95 },
              transition: {
                duration: 0.5,
                delay: delay,
                ease: [0.22, 1, 0.36, 1],
              },
            };

            // Use negative margins to overlap borders on all sides except first item
            // For columns layout, we overlap top and left borders
            const marginClass = index === 0 ? "" : "-mt-[1px] -ml-[1px]";

            if (item.type === "story") {
              return (
                <motion.div
                  key={`story-${item.story.route || index}`}
                  className={`relative border group border-border bg-background break-inside-avoid ${marginClass}`}
                  {...animationProps}
                >
                  <HoverStars />
                  <CustomerStoryCard story={item.story} />
                </motion.div>
              );
            } else if (item.type === "logo") {
              return (
                <motion.div
                  key={`logo-${item.company.name || index}`}
                  className={`relative border group border-border bg-background break-inside-avoid ${marginClass}`}
                  {...animationProps}
                >
                  <HoverStars />
                  <CompanyLogo {...item.company} />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={`text-${index}`}
                  className={`border border-border bg-background break-inside-avoid ${marginClass}`}
                  {...animationProps}
                >
                  <div className="p-3 lg:p-4 flex items-center justify-center min-h-[100px]">
                    <p className="text-sm text-center text-muted-foreground">
                      {item.text}
                    </p>
                  </div>
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </WrappedSection>
  );
}
