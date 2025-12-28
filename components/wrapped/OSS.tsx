"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";
import { Users, GitPullRequest, MessageSquare, Star, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { getGitHubStars } from "@/lib/github-stars";
import contributors from "./data/oss-contributors-2025.json";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";
import { HoverStars } from "./components/HoverStars";

interface MetricCardProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: LucideIcon;
}

function AnimatedMetric({ targetValue }: { targetValue: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 150,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(targetValue);
    }
  }, [isInView, motionValue, targetValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(
          Math.floor(latest)
        );
      }
    });
  }, [springValue]);

  return (
    <span className="inline-block tabular-nums" ref={ref} />
  );
}

function MetricCard({ value, label, suffix, icon: Icon }: MetricCardProps) {
  return (
    <div className="p-6 lg:p-8">
      <div className="font-bold font-mono text-2xl sm:text-3xl lg:text-4xl">
        <AnimatedMetric targetValue={value} />
        {suffix}
      </div>
      <div className="mt-2 flex items-center gap-2 text-base font-normal">
        {Icon && (
          <div className="shrink-0 rounded-lg border bg-muted/50 flex items-center justify-center w-6 h-6">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        )}
        <span>{label}</span>
      </div>
    </div>
  );
}

const ossMetrics = [
  {
    value: contributors.length,
    label: "Contributors",
    icon: Users,
  },
  {
    value: 2572,
    label: "Merged PRs",
    icon: GitPullRequest,
  },
  {
    value: 1936,
    label: "GH Discussions",
    icon: MessageSquare,
  },
  {
    value: getGitHubStars(),
    label: "GitHub Stars",
    icon: Star,
  },
];

export function OSS() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <WrappedSection>
      <SectionHeading
        title="To the Builders..."
        subtitle="Big thanks to all contributors of 2025!"
      />
      <div ref={containerRef} className="relative group border-l border-r border-b border-border -mt-[1px] p-6 lg:p-8">
        <HoverStars />
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {contributors.map((contributor, index) => {
            const animationProps = {
              initial: { opacity: 0, y: 10, scale: 0.9 },
              animate: isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 10, scale: 0.9 },
              transition: {
                duration: 0.3,
                delay: index * 0.02, // Stagger delay: 20ms per badge
                ease: [0.22, 1, 0.36, 1],
              },
            };

            return (
              <motion.div key={contributor.login} {...animationProps}>
                <Link
                  href={contributor.url}
                  className="inline-flex items-center gap-1 rounded-full border px-1 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-sm hover:bg-muted transition-colors"
                >
                  {contributor.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={contributor.avatarUrl}
                      alt={contributor.login}
                      className="h-3 w-3 sm:h-6 sm:w-6 rounded-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="h-3 w-3 sm:h-6 sm:w-6 rounded-full bg-muted" />
                  )}
                  <span className="font-medium">@{contributor.login}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
      <WrappedGrid className="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-4 !border-t-0 -mt-[1px]">
        {ossMetrics.map((metric, index) => (
          <WrappedGridItem key={index}>
            <MetricCard {...metric} />
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}