"use client";

import { getPagesUnderRoute } from "nextra/context";
import Link from "next/link";
import { type Page } from "nextra";
import { motion, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface LaunchItemProps {
  title: string;
  route: string;
}

function LaunchItem({ title, route }: LaunchItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPermanent, setIsPermanent] = useState(false);
  const [justLockedIn, setJustLockedIn] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isHovered && !isPermanent) {
      // Start timer when hovering begins
      hoverTimerRef.current = setTimeout(() => {
        setIsPermanent(true);
        setJustLockedIn(true);
        // Reset the celebration flag after animation
        setTimeout(() => setJustLockedIn(false), 1000);
      }, 750); // 0.75 seconds
    } else {
      // Clear timer when hover ends (unless already permanent)
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    }

    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, [isHovered, isPermanent]);

  const shouldShowStar = isHovered || isPermanent;

  return (
    <Link
      href={route}
      className="group relative flex items-center py-1.5 -mx-6 lg:-mx-8 px-6 lg:px-8 hover:bg-muted/50 transition-colors text-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="mr-2 flex-shrink-0 relative w-4 flex items-center justify-start">
        <motion.span
          initial={{ opacity: 0, scale: 0.5, x: -4 }}
          animate={shouldShowStar ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.5, x: -4 }}
          transition={{
            duration: 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute left-0 text-base leading-none z-10"
        >
          <motion.span
            animate={
              justLockedIn
                ? {
                    scale: [1, 1.4, 1.2, 1.3, 1],
                    rotate: [0, 15, -15, 10, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="inline-block"
          >
            ⭐
          </motion.span>
          {justLockedIn && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute text-xs"
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1, 0.8],
                    x: Math.cos((i * Math.PI * 2) / 6) * 16,
                    y: Math.sin((i * Math.PI * 2) / 6) * 16,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  ✨
                </motion.span>
              ))}
            </>
          )}
        </motion.span>
        <span className={shouldShowStar ? "opacity-0" : "opacity-100"}>-</span>
      </span>
      <span className="truncate">{title}</span>
    </Link>
  );
}

interface MonthBoxProps {
  month: string;
  year: number;
  launches: Array<{
    title: string;
    route: string;
  }>;
  animationProps?: any;
}

function MonthBox({ month, year, launches, animationProps }: MonthBoxProps) {
  const monthDate = new Date(year, parseInt(month) - 1, 1);
  const monthName = monthDate.toLocaleDateString("en-US", { month: "long" });

  // Get launch week blog post URL for May and November
  const getLaunchWeekUrl = (month: string) => {
    if (month === "05") return "/blog/2025-05-19-launch-week-3";
    if (month === "11") return "/blog/2025-10-29-launch-week-4";
    return null;
  };

  const launchWeekUrl = getLaunchWeekUrl(month);

  const content = (
    <div className="h-full flex flex-col p-6 lg:p-8">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <h3 className="text-2xl font-bold font-mono">{monthName}</h3>
          <span className="text-sm text-muted-foreground">
            {launches.length} {launches.length === 1 ? "launch" : "launches"}
          </span>
          {launchWeekUrl && (
            <Link
              href={launchWeekUrl}
              className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              Launch Week
            </Link>
          )}
        </div>
        <div className="flex-1 flex flex-col">
          {launches.map((launch, index) => (
            <LaunchItem key={index} {...launch} />
          ))}
        </div>
      </div>
  );

  return (
    <WrappedGridItem colSpan={1} hideStars>
      {animationProps ? (
        <motion.div {...animationProps}>
          {content}
        </motion.div>
      ) : (
        content
      )}
    </WrappedGridItem>
  );
}

export function Launches() {
  const allPages = (
    getPagesUnderRoute("/changelog") as Array<Page & { frontMatter: any }>
  )
    .filter(
      (page) =>
        page.frontMatter?.date &&
        new Date(page.frontMatter.date).getFullYear() === 2025
    )
    .sort(
      (a, b) =>
        new Date(a.frontMatter.date).getTime() -
        new Date(b.frontMatter.date).getTime()
    );

  // Group by month
  const launchesByMonth = allPages.reduce(
    (acc, page) => {
      const date = new Date(page.frontMatter.date);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const key = `${date.getFullYear()}-${month}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push({
        title: page.frontMatter.title || page.name || "Untitled",
        route: page.route,
      });

      return acc;
    },
    {} as Record<
      string,
      Array<{
        title: string;
        route: string;
      }>
    >
  );

  // Get all months and sort them (Jan to Dec)
  const months = Object.keys(launchesByMonth).sort((a, b) => {
    // Sort by year-month ascending (oldest first)
    return a.localeCompare(b);
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <WrappedSection>
      <SectionHeading
        title="A Year of Launches..."
        subtitle="We have shipped a ton of new features this year."
      >
        <p className="hidden lg:block text-sm text-muted-foreground">
          hold hover to ⭐ your favorite launches of the year
        </p>
      </SectionHeading>
      <div ref={containerRef}>
        <WrappedGrid className="!grid-cols-1 sm:!grid-cols-1 lg:!grid-cols-3 !border-t-0 -mt-[1px]">
          {months.map((monthKey, index) => {
            const [year, month] = monthKey.split("-");
            
            const animationProps = {
              initial: { opacity: 0, y: 20, scale: 0.95 },
              animate: isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 20, scale: 0.95 },
              transition: {
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              },
            };

            return (
              <MonthBox
                key={monthKey}
                month={month}
                year={parseInt(year)}
                launches={launchesByMonth[monthKey]}
                animationProps={animationProps}
              />
            );
          })}
        </WrappedGrid>
      </div>
    </WrappedSection>
  );
}

