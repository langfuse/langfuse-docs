"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import IsoPNG from "./home/security/iso27001.png";
import Soc2SVG from "./home/security/soc2.svg";
import GdprSVG from "./home/security/gdpr.svg";
import HipaaSVG from "./home/security/hipaa.svg";

/**
 * Security certification badge grid.
 * Implemented as a Client Component so that static SVG/PNG imports are bundled
 * in the client bundle rather than serialised through the RSC payload, which
 * would fail because Turbopack treats SVG imports as ES module namespace objects.
 */
export function SecurityBadgesGrid({
  compact = false,
  showHipaa = true,
  className,
}: {
  compact?: boolean;
  showHipaa?: boolean;
  className?: string;
} = {}) {
  const imageClass = compact
    ? "h-auto w-14 sm:w-16 dark:invert"
    : "h-auto w-24 dark:invert";
  const invertImageClass = compact
    ? "h-auto w-14 sm:w-16 invert dark:invert-0"
    : "h-auto w-24 invert dark:invert-0";
  const hipaaClass = compact
    ? "h-auto w-12 sm:w-14 dark:invert"
    : "h-auto w-20 dark:invert";

  return (
    <div
      className={cn(
        compact
          ? "flex flex-wrap items-center gap-4 sm:gap-5"
          : "my-10 grid grid-cols-2 place-items-center gap-8 sm:gap-10 md:grid-cols-4 md:gap-16",
        className,
      )}
    >
      <Link href="/security/iso27001" className="shrink-0">
        <Image
          src={IsoPNG}
          alt="ISO 27001"
          width={compact ? 64 : 100}
          height={compact ? 64 : 100}
          className={imageClass}
        />
      </Link>
      <Link href="/security/soc2" className="shrink-0">
        <Image
          src={Soc2SVG}
          alt="SOC 2"
          width={compact ? 64 : 100}
          height={compact ? 64 : 100}
          className={invertImageClass}
        />
      </Link>
      <Link href="/security/gdpr" className="shrink-0">
        <Image
          src={GdprSVG}
          alt="GDPR"
          width={compact ? 56 : 80}
          height={compact ? 56 : 80}
          className={
            compact
              ? "h-auto w-12 sm:w-14 invert dark:invert-0"
              : "h-auto w-20 invert dark:invert-0"
          }
        />
      </Link>
      {showHipaa ? (
        <Link href="/security/hipaa" className="shrink-0">
          <Image
            src={HipaaSVG}
            alt="HIPAA"
            width={compact ? 48 : 59}
            height={compact ? 32 : 40}
            className={hipaaClass}
          />
        </Link>
      ) : null}
    </div>
  );
}
