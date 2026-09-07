"use client";

import { motion } from "framer-motion";
import { Dot } from "@/components/ui/dot";

function CompanyNames({ names }: { names: string[] }) {
  return (
    <span className="flex shrink-0 items-center gap-4 pr-4">
      {names.map((name) => (
        <span key={name} className="contents">
          <span className="shrink-0 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.1em] text-text-secondary transition-colors group-hover:text-text-primary">
            {name}
          </span>
          <Dot />
        </span>
      ))}
    </span>
  );
}

export function AdoptersTicker({ names }: { names: string[] }) {
  if (names.length === 0) return null;

  return (
    <a
      href="/users#adopters"
      aria-label="View Langfuse adopters"
      className="group block overflow-hidden border-t border-line-structure bg-surface-1 no-underline mask-[linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
    >
      <motion.span
        aria-hidden
        className="flex w-max items-center py-3"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: Math.max(40, names.length * 2),
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <CompanyNames names={names} />
        <CompanyNames names={names} />
      </motion.span>
    </a>
  );
}
