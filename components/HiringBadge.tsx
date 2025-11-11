"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function HiringBadge() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href="/careers"
      className={cn(
        buttonVariants({ variant: "cta", size: "pill" }),
        "hidden lg:inline-flex h-6 px-2.5 text-[11px] font-medium"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {isHovered ? "Looking for 🐐s!" : "Hiring in Berlin and SF"}
    </Link>
  );
}

