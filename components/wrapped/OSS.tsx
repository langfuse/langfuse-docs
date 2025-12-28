"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import contributors from "./data/oss-contributors-2025.json";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface MetricCardProps {
  value: number;
  label: string;
  suffix?: string;
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

function MetricCard({ value, label, suffix }: MetricCardProps) {
  return (
    <div className="p-6 lg:p-8">
      <div className="font-bold font-mono text-2xl sm:text-3xl lg:text-4xl">
        <AnimatedMetric targetValue={value} />
        {suffix}
      </div>
      <div className="mt-2 text-base font-normal">{label}</div>
    </div>
  );
}

const ossMetrics = [
  {
    value: contributors.length,
    label: "Contributors",
  },
  {
    value: 2572,
    label: "Merged PRs",
  },
  {
    value: 1936,
    label: "GH Discussions",
  },
];

export function OSS() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Contributors of 2025 🙏"
        subtitle="Big thanks to all contributors!"
      />
      <div className="border-l border-r border-b border-border -mt-[1px] p-6 lg:p-8">
        <div className="flex flex-wrap items-center gap-3">
          {contributors.map((contributor) => (
            <Link
              key={contributor.login}
              href={contributor.url}
              className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-sm hover:bg-muted transition-colors"
            >
              {contributor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={contributor.avatarUrl}
                  alt={contributor.login}
                  className="h-6 w-6 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="h-6 w-6 rounded-full bg-muted" />
              )}
              <span className="font-medium">@{contributor.login}</span>
            </Link>
          ))}
        </div>
      </div>
      <WrappedGrid className="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !border-t-0 -mt-[1px]">
        {ossMetrics.map((metric, index) => (
          <WrappedGridItem key={index}>
            <MetricCard {...metric} />
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}