"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContextMenu = dynamic(() => import("./LogoContextMenu"), {
  ssr: false,
});

export function Logo({
  wrapInLink = true,
}: {
  /** When false, render only the image block (use when already inside a link, e.g. NavbarLogo). */
  wrapInLink?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const images = (
    <div className="flex gap-2 items-center -mr-4 cursor-pointer md:mr-0 shrink-0">
      <Image
        src="/langfuse-wordart-white.svg"
        alt="Langfuse Logo"
        width={120}
        height={20}
        className="hidden h-auto dark:block max-w-28 sm:max-w-none"
      />
      <Image
        src="/langfuse-wordart.svg"
        alt="Langfuse Logo"
        width={120}
        height={20}
        className="block h-auto dark:hidden max-w-28 sm:max-w-none"
      />
      <style jsx>{`
      div {
        mask-image: linear-gradient(
          60deg,
          #bba0ff 25%,
          rgba(187, 160, 255, 0.2) 50%,
          #bba0ff 75%
        );
        mask-size: 400%;
        mask-position: 0%;
      }
      div:hover {
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
      rel="noopener noreferrer"
      className="text-[10px] sm:text-[11px] leading-none text-text-tertiary/60 hover:text-text-tertiary transition-colors whitespace-nowrap shrink-0"
    >
      by ClickHouse
    </a>
  );

  return (
    <>
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden">
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
        {byClickHouse}
      </div>
      {menuOpen && <ContextMenu open={menuOpen} setOpen={setMenuOpen} />}
    </>
  );
}
