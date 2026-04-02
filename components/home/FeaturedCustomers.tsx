"use client";

import { useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { BoxCorners, CornerBox } from "@/components/ui/corner-box";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import twilioLogo from "./img/twilio-signet.svg";
import canvaLogo from "./img/canva-signet.svg";
import sumupLogo from "./img/sumup-signet.svg";
import { cn } from "@/lib/utils";

const stories = [
  {
    name: "Twilio",
    logo: twilioLogo as StaticImageData,
    description: "How Twilio uses Langfuse to monitor and evaluate LLM-powered customer engagement features at scale.",
    href: "/customers/twilio",
  },
  {
    name: "Canva",
    logo: canvaLogo as StaticImageData,
    description: "Canva's AI team relies on Langfuse to trace and debug their generative design features in production.",
    href: "/customers/canva",
  },
  {
    name: "SumUp",
    logo: sumupLogo as StaticImageData,
    description: "Adobe uses Langfuse to evaluate prompt quality and track LLM usage across their creative cloud products.",
    href: "/customers/adobe",
  },
] as const;

export function FeaturedCustomers({ corners = { tl: true, tr: true, bl: true, br: true } }: { corners?: BoxCorners }) {
  const [active, setActive] = useState(0);
  const story = stories[active];

  return (
    <CornerBox className="flex gap-6 items-center p-4 pr-5 -mt-px" corners={corners}>
      <div className="flex gap-1 shrink-0">
        {stories.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.name}
              onClick={() => setActive(i)}
              aria-label={s.name}
              aria-pressed={isActive}
              className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <CornerBox
                className="flex justify-center items-center p-0.75 w-11 h-11 border-none cursor-pointer"
                corners={isActive ? undefined : { tl: false, tr: false, bl: false, br: false }}
              >
                <div className={cn("flex justify-center items-center w-full h-full transition-colors duration-150", isActive ? "bg-surface-code" : "bg-surface-2")}>
                  <Image
                    src={s.logo}
                    alt={s.name}
                    width={56}
                    height={16}
                    className={[
                      "object-contain w-5 h-5",
                      isActive ? "brightness-0 invert" : "",
                    ].join(" ")}
                  />
                </div>
              </CornerBox>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="overflow-hidden flex-1 min-w-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <a
              href={story.href}
              className="inline-flex items-baseline gap-1.5 group"
            >
              <span className="text-[15px] font-medium text-text-primary leading-snug group-hover:underline">
                {story.name}
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="translate-y-px text-text-tertiary shrink-0"
                aria-hidden
              >
                <path
                  d="M1 9L9 1M9 1H3M9 1V7"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <Text size="s" className="text-left mt-0.5 truncate text-text-tertiary">
              {story.description}
            </Text>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="shrink-0">
        <Button
          href="https://cloud.langfuse.com"
          target="_blank"
          rel="noopener noreferrer"
          shortcutKey="s"
          variant="secondary"
          size="small"
        >
          Start free
        </Button>
      </div>
    </CornerBox>
  );
}
