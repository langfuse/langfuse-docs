"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContextMenu = dynamic(() => import("./LogoContextMenu"), {
  ssr: false,
});

const WORDMARK_ASSETS = {
  light: "/brand-assets/wordmark/light/langfuse-by-clickhouse.svg",
  dark: "/brand-assets/wordmark/dark/langfuse-by-clickhouse-white.svg",
  alt: "Langfuse",
} as const;

const WORDMARKS = {
  // Default site mark sized to the 60px nav bar.
  langfuse: {
    ...WORDMARK_ASSETS,
    width: 128,
    height: 34,
    className: "h-[30px] w-auto sm:h-[34px]",
  },
  hero: {
    ...WORDMARK_ASSETS,
    // Taller wordmark for page heroes.
    width: 220,
    height: 59,
    className: "h-auto max-w-[200px] sm:max-w-[220px]",
  },
} as const;

export function Logo({
  wrapInLink = true,
  variant = "langfuse",
}: {
  /** When false, render only the image block (use when already inside a link, e.g. NavbarLogo). */
  wrapInLink?: boolean;
  /** Use the larger wordmark for page heroes. */
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
        priority
      />
      <Image
        src={wordmark.light}
        alt={wordmark.alt}
        width={wordmark.width}
        height={wordmark.height}
        className={`block dark:hidden ${wordmark.className}`}
        priority
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
          transition:
            mask-position 1s ease,
            -webkit-mask-position 1s ease;
        }
      `}</style>
    </div>
  );

  return (
    <>
      <div className="flex items-center">
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
      </div>
      {menuOpen && <ContextMenu open={menuOpen} setOpen={setMenuOpen} />}
    </>
  );
}
