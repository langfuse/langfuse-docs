"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { Text } from "@/components/ui/text";
import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/utils";
import {
  FORTUNE_50_COMPANIES,
  formatObservationsPerMonth,
} from "@/lib/usage-stats";

/** Slower than Integrations marquee rows (40–48s) for short hero copy */
const MARQUEE_DURATION_SEC = 40;

type HeroStatsStripProps = {
  /** Body text size. Default `"s"` matches the homepage hero. */
  textSize?: "s" | "m";
  /** `"compact"` cuts vertical padding by ~25%. */
  density?: "default" | "compact";
};

function StatItems({ textSize }: { textSize: "s" | "m" }) {
  return (
    <>
      <Text size={textSize} className="whitespace-nowrap shrink-0">
        Used by <b className="text-primary">{FORTUNE_50_COMPANIES}</b> of the
        Fortune 50
      </Text>
      <Dot />
      <Text size={textSize} className="whitespace-nowrap shrink-0">
        <b className="text-primary">{formatObservationsPerMonth()}</b>{" "}
        observations/month
      </Text>
      <Dot />
      <Text size={textSize} className="whitespace-nowrap shrink-0">
        <b className="text-primary">100,000+</b> engineers building on Langfuse
      </Text>
    </>
  );
}

export function HeroStatsStrip({
  textSize = "s",
  density = "default",
}: HeroStatsStripProps = {}) {
  const rowPadding = density === "compact" ? "py-[7px]" : "py-[10px]";

  return (
    <>
      <div className="xl:hidden overflow-hidden w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          className={cn("flex gap-3 lg:gap-6 items-center w-max", rowPadding)}
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: MARQUEE_DURATION_SEC,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[0, 1].map((i) => (
            <Fragment key={i}>
              <StatItems textSize={textSize} />
              <Dot />
            </Fragment>
          ))}
        </motion.div>
      </div>
      <div className="hidden xl:block overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={cn(
            "flex gap-3 lg:gap-6 justify-center items-center px-4 min-w-max mx-auto",
            rowPadding,
          )}
        >
          <StatItems textSize={textSize} />
        </div>
      </div>
    </>
  );
}
