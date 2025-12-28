"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";
import {
  ListTree,
  FileCode,
  SquareDivide,
  Users,
  FolderOpen,
  Database,
  type LucideIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface MetricCardProps {
  value: number | string;
  label: string;
  description?: string;
  suffix?: string;
  isFullWidth?: boolean;
  decimals?: number;
  ratePerSecond?: number;
  icon?: LucideIcon;
}

function MetricCard({
  value,
  label,
  description,
  suffix,
  isFullWidth,
  decimals,
  ratePerSecond,
  icon: Icon,
}: MetricCardProps) {
  const isNumeric = typeof value === "number";
  const hasDecimals = decimals !== undefined && decimals > 0;
  const isAnimated = ratePerSecond !== undefined && ratePerSecond > 0;
  const fullLabel = description ? `${label} ${description}` : label;

  const renderStatic = () => {
    if (!isNumeric) return value;
    if (hasDecimals) return <StaticDecimalValue value={value} decimals={decimals!} />;
    if (isFullWidth) return <StaticValue value={value} />;
    return <StaticShortValue value={value} />;
  };

  return (
    <div className="p-6 lg:p-8">
      <div
        className={`font-bold font-mono ${
          isFullWidth
            ? "text-3xl sm:text-4xl lg:text-5xl"
            : "text-2xl sm:text-3xl lg:text-4xl"
        }`}
      >
        {isNumeric ? (
          <>
            {isAnimated ? (
              <AnimatedMetric
                startValue={value}
                ratePerSecond={ratePerSecond}
                decimals={hasDecimals ? decimals : undefined}
              />
            ) : (
              renderStatic()
            )}
            {suffix}
          </>
        ) : (
          value
        )}
      </div>
      <div className="mt-2 flex items-center gap-2 text-base font-normal">
        {Icon && (
          <div className="shrink-0 rounded-lg border bg-muted/50 flex items-center justify-center w-6 h-6">
            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        )}
        <span>{fullLabel}</span>
      </div>
    </div>
  );
}

function StaticValue({ value }: { value: number }) {
  return (
    <span className="tabular-nums">
      {Intl.NumberFormat("en-US").format(value)}
    </span>
  );
}

function StaticShortValue({ value }: { value: number }) {
  const abs = Math.abs(value);
  let formatted = value.toString();
  if (abs >= 1_000_000_000) {
    formatted = `${Math.floor(value / 1_000_000_000)}B`;
  } else if (abs >= 1_000_000) {
    formatted = `${Math.floor(value / 1_000_000)}M`;
  } else if (abs >= 1_000) {
    formatted = `${Math.floor(value / 1_000)}K`;
  }
  return <span className="tabular-nums">{formatted}</span>;
}

function StaticDecimalValue({
  value,
  decimals,
}: {
  value: number;
  decimals: number;
}) {
  return (
    <span className="tabular-nums">{value.toFixed(decimals)}</span>
  );
}

function AnimatedMetric({
  startValue,
  ratePerSecond,
  decimals,
}: {
  startValue: number;
  ratePerSecond: number;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(startValue);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 150,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isInView && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      motionValue.set(startValue);
      
      // Update continuously based on rate
      const interval = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds
          const newValue = startValue + ratePerSecond * elapsed;
          motionValue.set(newValue);
        }
      }, 100); // Update every 100ms

      return () => clearInterval(interval);
    }
  }, [isInView, motionValue, startValue, ratePerSecond]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        if (decimals !== undefined) {
          ref.current.textContent = latest.toFixed(decimals);
        } else {
          ref.current.textContent = Intl.NumberFormat("en-US").format(
            Math.floor(latest)
          );
        }
      }
    });
  }, [springValue, decimals]);

  return (
    <span
      className="inline-block tabular-nums tracking-wider"
      ref={ref}
    />
  );
}

// Calculate seconds from Jan 1, 2025 00:00:00 to Dec 23, 2025 12:32:00
// Jan 1 to Dec 23 = 356 full days + 12 hours 32 minutes
const SECONDS_IN_2025_UNTIL_NOW =
  356 * 24 * 60 * 60 + 12 * 60 * 60 + 32 * 60; // 30,803,520 seconds

const metrics = [
  {
    value: 34034881045,
    label: "Traces & Observations ingested",
    isFullWidth: true,
    ratePerSecond: (34000000000 / SECONDS_IN_2025_UNTIL_NOW) * 10,
    icon: ListTree,
  },
  {
    value: 99334923,
    label: "Evals executed",
    isFullWidth: true,
    ratePerSecond: (99000000 / SECONDS_IN_2025_UNTIL_NOW) * 10,
    icon: SquareDivide,
  },
  {
    value: 1436154,
    label: "Prompts created",
    isFullWidth: true,
    ratePerSecond: (1400000 / SECONDS_IN_2025_UNTIL_NOW) * 10,
    icon: FileCode,
  },
  {
    value: 132695,
    suffix: "+",
    label: "Unique Users",
    icon: Users,
  },
  {
    value: 86034,
    suffix: "+",
    label: "Projects created",
    icon: FolderOpen,
  },
  {
    value: 29.32,
    suffix: "TB",
    label: "Peak Tracing data traffic in one day",
    decimals: 2,
    icon: Database,
  },
];

// Monthly actual downloads (calculated from cumulative data)
const downloadData = [
  { month: "Jan", downloads: 1.38 },
  { month: "Feb", downloads: 1.40 }, // 2.78 - 1.38
  { month: "Mar", downloads: 1.60 }, // 4.38 - 2.78
  { month: "Apr", downloads: 1.60 }, // 5.98 - 4.38
  { month: "May", downloads: 2.00 }, // 7.98 - 5.98
  { month: "Jun", downloads: 2.50 }, // 10.48 - 7.98
  { month: "Jul", downloads: 11.80 }, // 22.28 - 10.48
  { month: "Aug", downloads: 11.90 }, // 34.18 - 22.28
  { month: "Sep", downloads: 14.80 }, // 48.98 - 34.18
  { month: "Oct", downloads: 18.10 }, // 67.08 - 48.98
  { month: "Nov", downloads: 23.10 }, // 90.18 - 67.08
  { month: "Dec", downloads: 24.20 }, // 114.38 - 90.18
];

// Relative growth data
const growthData = [
  { month: "Jan", growth: 6.15 },
  { month: "Feb", growth: 6.24 },
  { month: "Mar", growth: 9.40 },
  { month: "Apr", growth: 13.25 },
  { month: "May", growth: 15.66 },
  { month: "Jun", growth: 19.28 },
  { month: "Jul", growth: 30.12 },
  { month: "Aug", growth: 39.76 },
  { month: "Sep", growth: 57.83 },
  { month: "Oct", growth: 63.86 },
  { month: "Nov", growth: 86.75 },
  { month: "Dec", growth: 100.00 },
];

const formatDownloads = (value: number) => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}M`;
  }
  return `${value.toFixed(1)}M`;
};

const formatGrowth = (value: number) => {
  return `${Math.round(value)}%`;
};

export function Metrics() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <WrappedSection>
      <SectionHeading
        title="You all have been busy..."
        subtitle="Key metrics from our platform in 2025"
      />
      <div ref={containerRef}>
        <WrappedGrid className="!grid-cols-1 sm:!grid-cols-2 lg:!grid-cols-3 !border-t-0 -mt-[1px]">
          {metrics.map((metric, index) => {
            const delay = index * 0.1; // Stagger delay
            
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

            const items = [
              <WrappedGridItem
                key={index}
                colSpan={metric.isFullWidth ? 3 : 1}
              >
                <motion.div {...animationProps}>
                  <MetricCard {...metric} />
                </motion.div>
              </WrappedGridItem>
            ];

          // Insert Consumption graph after Prompts created (index 2)
          if (index === 2) {
            const graphAnimationProps = {
              initial: { opacity: 0, y: 20, scale: 0.95 },
              animate: isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 20, scale: 0.95 },
              transition: {
                duration: 0.5,
                delay: (index + 1) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              },
            };
            items.push(
              <WrappedGridItem key="consumption" colSpan={3} className="hidden lg:block">
                <motion.div {...graphAnimationProps}>
                  <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                    <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                      <h3 className="text-2xl sm:text-3xl font-bold font-mono">Consumption</h3>
                      <p className="mt-2 text-sm text-muted-foreground"> Consumption between January and December 2025. Ingestions of traces, observations and evals.</p>
                    </div>
                    <div className="w-full lg:w-3/4 aspect-[21/9] lg:aspect-auto lg:h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={growthData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="month"
                            className="text-xs"
                            tick={{ fill: "currentColor" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.5rem",
                              padding: "0.5rem",
                            }}
                            formatter={(value: number) => [`${formatGrowth(value)}`, "Traffic relative to Dec 25"]}
                            labelStyle={{ color: "hsl(var(--foreground))" }}
                          />
                          <Bar
                            dataKey="growth"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          >
                            <LabelList
                              dataKey="growth"
                              position="inside"
                              formatter={formatGrowth}
                              fill="hsl(var(--card))"
                              style={{ fontWeight: 600, fontSize: "0.75rem" }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                </motion.div>
              </WrappedGridItem>
            );
          }

          // Insert Monthly Package Downloads graph after the last 3 metrics (index 5 - Peak Tracing)
          if (index === 5) {
            const graphAnimationProps = {
              initial: { opacity: 0, y: 20, scale: 0.95 },
              animate: isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 20, scale: 0.95 },
              transition: {
                duration: 0.5,
                delay: (index + 1) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              },
            };
            items.push(
              <WrappedGridItem key="downloads" colSpan={3} className="hidden lg:block">
                <motion.div {...graphAnimationProps}>
                  <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
                    <div className="w-full lg:w-1/4 mb-4 lg:mb-0">
                      <h3 className="text-2xl sm:text-3xl font-bold font-mono">Monthly Package Downloads</h3>
                    </div>
                    <div className="w-full lg:w-3/4 aspect-[21/9] lg:aspect-auto lg:h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={downloadData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis
                            dataKey="month"
                            className="text-xs"
                            tick={{ fill: "currentColor" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "0.5rem",
                              padding: "0.5rem",
                            }}
                            formatter={(value: number) => [`${formatDownloads(value)}`, "Downloads"]}
                            labelStyle={{ color: "hsl(var(--foreground))" }}
                          />
                          <Bar
                            dataKey="downloads"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          >
                            <LabelList
                              dataKey="downloads"
                              position="inside"
                              formatter={formatDownloads}
                              fill="hsl(var(--card))"
                              style={{ fontWeight: 600, fontSize: "0.75rem" }}
                            />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                </motion.div>
              </WrappedGridItem>
            );
          }

          return items;
        }).flat()}
      </WrappedGrid>
      </div>
    </WrappedSection>
  );
}

