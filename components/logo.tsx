"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";

const ContextMenu = dynamic(() => import("./LogoContextMenu"), {
  ssr: false,
});

export function Logo() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div className="flex items-center">
        <Link
          href="/"
          onContextMenu={(e) => {
            e.preventDefault();
            setMenuOpen(true);
          }}
        >
          <div className="flex gap-2 items-center cursor-pointer -mr-4 md:-mr-0">
            <Image
              src="/langfuse_logo_white.svg"
              alt="Langfuse Logo"
              width={120}
              height={20}
              className="hidden dark:block max-w-28 sm:max-w-none"
            />
            <Image
              src="/langfuse_logo.svg"
              alt="Langfuse Logo"
              width={120}
              height={20}
              className="block dark:hidden max-w-28 sm:max-w-none"
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
        </Link>
      </div>
      {menuOpen && <ContextMenu open={menuOpen} setOpen={setMenuOpen} />}
    </>
  );
}
