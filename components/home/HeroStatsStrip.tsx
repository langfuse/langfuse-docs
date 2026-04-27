"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { Text } from "@/components/ui/text";
import { Dot } from "@/components/ui/dot";

/** Slower than Integrations marquee rows (40–48s) for short hero copy */
const MARQUEE_DURATION_SEC = 40;

function StatItems() {
  return (
    <>
      <Text size="s" className="whitespace-nowrap shrink-0">
        Used by <b className="text-primary">19</b> of Fortune 50
      </Text>
      <Dot />
      <Text size="s" className="whitespace-nowrap shrink-0">
        <b className="text-primary">10+ billion</b> observations/month
      </Text>
      <Dot />
      <Text size="s" className="whitespace-nowrap shrink-0">
        <b className="text-primary">100,000+</b> engineers building on Langfuse
      </Text>
    </>
  );
}

export function HeroStatsStrip() {
  return (
    <>
      <div className="xl:hidden overflow-hidden w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <motion.div
          className="flex gap-3 lg:gap-6 items-center w-max py-[10px]"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: MARQUEE_DURATION_SEC,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {[0, 1].map((i) => (
            <Fragment key={i}>
              <StatItems />
              <Dot />
            </Fragment>
          ))}
        </motion.div>
      </div>
      <div className="hidden xl:block overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3 lg:gap-6 justify-center items-center px-4 py-[10px] min-w-max mx-auto">
          <StatItems />
        </div>
      </div>
    </>
  );
}
