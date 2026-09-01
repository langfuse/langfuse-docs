"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContextMenu = dynamic(() => import("./LogoContextMenu"), {
  ssr: false,
});

const WORDMARKS = {
  langfuse: {
    light: "/langfuse-wordart.svg",
    dark: "/langfuse-wordart-white.svg",
    alt: "Langfuse Logo",
    width: 120,
    height: 20,
    className: "h-auto max-w-28 sm:max-w-none",
  },
  byClickHouse: {
    light:
      "/brand-assets/wordmark/Langfuse%20by%20ClickHouse/light/langfuse-by-clickhouse.svg",
    dark: "/brand-assets/wordmark/Langfuse%20by%20ClickHouse/dark/langfuse-by-clickhouse-white.svg",
    alt: "Langfuse by ClickHouse",
    // Lockup is taller (includes "by ClickHouse"); size it as a page hero mark.
    width: 220,
    height: 59,
    className: "h-auto max-w-[200px] sm:max-w-[220px]",
  },
} as const;

export function Logo({
  wrapInLink = true,
  showAffiliation = false,
  variant = "langfuse",
}: {
  /** When false, render only the image block (use when already inside a link, e.g. NavbarLogo). */
  wrapInLink?: boolean;
  /** When true, show the "by ClickHouse" affiliation link next to the logo. */
  showAffiliation?: boolean;
  /** Use the co-branded "Langfuse by ClickHouse" wordmark lockup. */
  variant?: keyof typeof WORDMARKS;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const wordmark = WORDMARKS[variant];
  const images = (
    <div className="logo-images flex gap-2 items-center cursor-pointer shrink-0">
      <Image
        src={wordmark.dark}
        alt={wordmark.alt}
        width={wordmark.width}
        height={wordmark.height}
        className={`hidden dark:block ${wordmark.className}`}
      />
      <Image
        src={wordmark.light}
        alt={wordmark.alt}
        width={wordmark.width}
        height={wordmark.height}
        className={`block dark:hidden ${wordmark.className}`}
      />
      <style jsx>{`
      .logo-images {
        mask-image: linear-gradient(
          60deg,
          #bba0ff 25%,
          rgba(187, 160, 255, 0.2) 50%,
          #bba0ff 75%
        );
        mask-size: 400%;
        mask-position: 0%;
      }
      .logo-images:hover {
        mask-position: 100%;
        transition: mask-position 1s ease, -webkit-mask-position 1s ease;
      }
    `}</style>
    </div>
  );

  const byClickHouse = (
    <a
      href="https://clickhouse.com"
      target="_blank"
      // Explicitly omit `noreferrer` to pass on referrer to ClickHouse
      rel="noopener"
      className="text-[10px] sm:text-[11px] leading-none text-text-tertiary/60 hover:text-text-tertiary transition-colors whitespace-nowrap"
    >
      by ClickHouse
    </a>
  );

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2">
        {wrapInLink ? (
          <Link
            href="/"
            className="shrink-0"
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuOpen(true);
            }}
          >
            {images}
          </Link>
        ) : (
          <div
            className="shrink-0"
            onContextMenu={(e) => {
              e.preventDefault();
              setMenuOpen(true);
            }}
          >
            {images}
          </div>
        )}
        {showAffiliation && variant !== "byClickHouse" && byClickHouse}
      </div>
      {menuOpen && <ContextMenu open={menuOpen} setOpen={setMenuOpen} />}
    </>
  );
}
