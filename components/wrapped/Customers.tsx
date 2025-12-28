"use client";

import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import Image from "next/image";
import { type Page } from "nextra";
import { useMemo, useRef } from "react";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";
import intuitLight from "../home/img/intuit_light.svg";
import intuitDark from "../home/img/intuit_dark.svg";
import samsaraLight from "../home/img/samsara_light.png";
import samsaraDark from "../home/img/samsara_dark.png";
import khanacademyLight from "../home/img/khanacademy_light.png";
import khanacademyDark from "../home/img/khanacademy_dark.png";
import twilioLight from "../home/img/twilio_light.svg";
import twilioDark from "../home/img/twilio_dark.svg";
import sumupLight from "../home/img/sumup_light.svg";
import sumupDark from "../home/img/sumup_dark.svg";
import telusLight from "../home/img/telus_light.png";
import telusDark from "../home/img/telus_dark.png";
import magicPatternsLight from "../home/img/magicpatterns_light.png";
import magicPatternsDark from "../home/img/magicpatterns_dark.png";
import merckLight from "../home/img/merck-dark.png";
import merckDark from "../home/img/merck-light.png";
import juiceboxLight from "../home/img/juicebox_light.svg";
import juiceboxDark from "../home/img/juicebox_dark.svg";
import pigmentLight from "../home/img/pigment_light.svg";
import pigmentDark from "../home/img/pigment_dark.svg";
import sevenelevenLight from "../home/img/seveneleven_light.png";
import sevenelevenDark from "../home/img/seveneleven_dark.png";
import circlebackLight from "../home/img/circleback_light.png";
import circlebackDark from "../home/img/circleback_dark.png";

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
  { name: "SumUp", path: "/customers/sumup", light: sumupLight, dark: sumupDark },
  { name: "Khan Academy", path: "/customers/khan-academy", light: khanacademyLight, dark: khanacademyDark },
  { name: "Magic Patterns", path: "/customers/magic-patterns-ai-design-tools", light: magicPatternsLight, dark: magicPatternsDark },
  { name: "Merck", path: "/customers/merckgroup", light: merckLight, dark: merckDark },
];

// Companies without customer stories (logos only)
// Note: Most logos use counterintuitive naming (_light for dark mode, _dark for light mode)
// But Intuit uses intuitive naming (_light for light mode, _dark for dark mode)
const companiesWithoutStories = [
  { name: "Samsara", light: samsaraLight, dark: samsaraDark, isIntuitive: false },
  { name: "Twilio", light: twilioLight, dark: twilioDark, isIntuitive: false },
  { name: "Telus", light: telusLight, dark: telusDark, isIntuitive: false },
  { name: "Pigment", light: pigmentLight, dark: pigmentDark, isIntuitive: false },
  { name: "Juicebox", light: juiceboxLight, dark: juiceboxDark, isIntuitive: false },
  { name: "Intuit", light: intuitLight, dark: intuitDark, isIntuitive: true },
  { name: "Seven Eleven Japan", light: sevenelevenLight, dark: sevenelevenDark, isIntuitive: false },
  { name: "Circleback", light: circlebackLight, dark: circlebackDark, isIntuitive: false },
];

function CustomerStoryCard({ story }: { story: CustomerStory }) {
  return (
    <Link
      href={story.route}
      className="group relative w-full block [perspective:1000px]"
    >
      {/* Hidden content to determine height */}
      <div className="invisible p-6 lg:p-8 flex flex-col">
        {story.frontMatter.customerLogo && <div className="h-6 mb-4" />}
        {story.frontMatter.customerQuote && (
          <div className="text-base sm:text-lg leading-relaxed mb-4">
            "{story.frontMatter.customerQuote}"
          </div>
        )}
        {(story.frontMatter.quoteAuthor ||
          story.frontMatter.quoteRole ||
          story.frontMatter.quoteCompany) && (
          <div className="flex items-center gap-3">
            {story.frontMatter.quoteAuthorImage && (
              <div className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
            )}
            <div className="flex-1">
              {story.frontMatter.quoteAuthor && (
                <div className="font-semibold text-sm sm:text-base" />
              )}
              <div className="text-xs sm:text-sm mt-1" />
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d] [transform:rotateY(180deg)] lg:[transform:rotateY(0deg)] lg:group-hover:[transform:rotateY(180deg)]">
        {/* Front side - Logo only */}
        <div className="absolute inset-0 flex items-center justify-center p-6 lg:p-8 [backface-visibility:hidden]">
          {story.frontMatter.customerLogo && (
            <div className="flex items-center justify-center">
              {story.frontMatter.customerLogoDark ? (
                <>
                  <Image
                    src={story.frontMatter.customerLogo}
                    alt={`${story.frontMatter.title} logo`}
                    width={200}
                    height={60}
                    className="h-6 w-auto object-contain dark:hidden"
                    quality={100}
                  />
                  <Image
                    src={story.frontMatter.customerLogoDark}
                    alt={`${story.frontMatter.title} logo`}
                    width={200}
                    height={60}
                    className="h-6 w-auto object-contain hidden dark:block"
                    quality={100}
                  />
                </>
              ) : (
                <Image
                  src={story.frontMatter.customerLogo}
                  alt={`${story.frontMatter.title} logo`}
                  width={200}
                  height={60}
                  className="h-6 w-auto object-contain dark:invert dark:brightness-0 dark:contrast-200"
                  quality={100}
                />
              )}
            </div>
          )}
        </div>

        {/* Back side - Full story card */}
        <div className="absolute inset-0 p-6 lg:p-8 flex flex-col items-center lg:items-start [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {/* Customer Logo */}
          {story.frontMatter.customerLogo && (
            <div className="flex items-center mb-4 flex-shrink-0">
              {story.frontMatter.customerLogoDark ? (
                <>
                  <Image
                    src={story.frontMatter.customerLogo}
                    alt={`${story.frontMatter.title} logo`}
                    width={200}
                    height={60}
                    className="h-6 w-auto object-contain dark:hidden"
                    quality={100}
                  />
                  <Image
                    src={story.frontMatter.customerLogoDark}
                    alt={`${story.frontMatter.title} logo`}
                    width={200}
                    height={60}
                    className="h-6 w-auto object-contain hidden dark:block"
                    quality={100}
                  />
                </>
              ) : (
                <Image
                  src={story.frontMatter.customerLogo}
                  alt={`${story.frontMatter.title} logo`}
                  width={200}
                  height={60}
                  className="h-6 w-auto object-contain dark:invert dark:brightness-0 dark:contrast-200"
                  quality={100}
                />
              )}
            </div>
          )}

          {/* Quote */}
          {story.frontMatter.customerQuote && (
            <blockquote className="text-base sm:text-lg leading-relaxed mb-4 text-center lg:text-left">
              "{story.frontMatter.customerQuote}"
            </blockquote>
          )}

          {/* Author Information - Centered on mobile, left aligned on desktop */}
          {(story.frontMatter.quoteAuthor ||
            story.frontMatter.quoteRole ||
            story.frontMatter.quoteCompany) && (
            <div className="flex items-center gap-3 flex-shrink-0 justify-center lg:justify-start">
              {story.frontMatter.quoteAuthorImage && (
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={story.frontMatter.quoteAuthorImage}
                    alt={`${story.frontMatter.quoteAuthor} profile picture`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    quality={100}
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {story.frontMatter.quoteAuthor && (
                  <div className="font-semibold text-sm sm:text-base break-words">
                    {story.frontMatter.quoteAuthor}
                  </div>
                )}
                {(story.frontMatter.quoteRole ||
                  story.frontMatter.quoteCompany) && (
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1 break-words">
                    {story.frontMatter.quoteRole}
                    {story.frontMatter.quoteRole &&
                      story.frontMatter.quoteCompany && (
                        <span> at </span>
                      )}
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
  light,
  dark,
  isIntuitive = false,
}: {
  name: string;
  light: any;
  dark: any;
  isIntuitive?: boolean;
}) {
  // Most logos use counterintuitive naming (_light for dark mode, _dark for light mode)
  // But some like Intuit use intuitive naming (_light for light mode, _dark for dark mode)
  const lightModeImage = isIntuitive ? light : dark;
  const darkModeImage = isIntuitive ? dark : light;

  return (
    <div className="p-3 lg:p-4 flex items-center justify-center min-h-[100px]">
      <Image
        src={lightModeImage}
        alt={`${name} logo`}
        width={200}
        height={80}
        className="h-8 w-auto object-contain dark:hidden"
        quality={100}
      />
      <Image
        src={darkModeImage}
        alt={`${name} logo`}
        width={200}
        height={80}
        className="h-8 w-auto object-contain hidden dark:block"
        quality={100}
      />
    </div>
  );
}

type CustomerItem =
  | { type: "story"; story: CustomerStory & { company: any } }
  | { type: "logo"; company: typeof companiesWithoutStories[0] };

export function Customers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const allStories = (getPagesUnderRoute("/customers") as Array<
    Page & { frontMatter: any }
  >).filter(
    (page) => page.frontMatter?.showInCustomerIndex !== false
  );

  // Match stories with companies
  const customerStories = companiesWithStories
    .map((company) => {
      const story = allStories.find(
        (s) => s.route === company.path || s.route === `${company.path}/`
      );
      return story ? { ...story, company } : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // Hardcoded order of all items
  const orderedItems = useMemo(() => {
    // Create maps for easy lookup
    const storyMap = new Map(
      customerStories.map((story) => [story.company.name, story])
    );
    const logoMap = new Map(
      companiesWithoutStories.map((company) => [company.name, company])
    );

    // Define the exact order
    const order: Array<{ type: "story" | "logo"; name: string }> = [
      // First column
      { type: "logo", name: "Intuit" },
      { type: "story", name: "SumUp" },
      // Continue with rest in desired order...
      { type: "logo", name: "Samsara" },
      { type: "logo", name: "Twilio" },
      { type: "logo", name: "Telus" },
      { type: "logo", name: "Juicebox" },
      { type: "logo", name: "Seven Eleven Japan" },
      { type: "story", name: "Khan Academy" },
      { type: "logo", name: "Circleback" },
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
      } else {
        const company = logoMap.get(name);
        if (company) {
          result.push({ type: "logo", company });
        }
      }
    }

    return result;
  }, [customerStories]);

  return (
    <WrappedSection>
      <SectionHeading
        title="Customers"
        subtitle="Teams building with Langfuse"
      />

      <div ref={containerRef}>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-px">
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

            if (item.type === "story") {
              return (
                <motion.div
                  key={`story-${item.story.route || index}`}
                  className="border border-border bg-background break-inside-avoid mb-px"
                  {...animationProps}
                >
                  <CustomerStoryCard story={item.story} />
                </motion.div>
              );
            } else {
              return (
                <motion.div
                  key={`logo-${item.company.name || index}`}
                  className="border border-border bg-background break-inside-avoid mb-px"
                  {...animationProps}
                >
                  <CompanyLogo {...item.company} />
                </motion.div>
              );
            }
          })}
        </div>
      </div>
    </WrappedSection>
  );
}

