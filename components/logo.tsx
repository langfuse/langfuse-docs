import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";

const ContextMenu = dynamic(() => import("./LogoContextMenu"), {
  ssr: false,
});

export function Logo() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div
        className="flex gap-2 items-center cursor-pointer"
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(true);
        }}
      >
        <Image
          src="/langfuse_logo_white.svg"
          alt="Langfuse Logo"
          width={120}
          height={20}
          className="hidden dark:block"
        />
        <Image
          src="/langfuse_logo.svg"
          alt="Langfuse Logo"
          width={120}
          height={20}
          className="block dark:hidden"
        />
      </div>
      {menuOpen && <ContextMenu open={menuOpen} setOpen={setMenuOpen} />}
    </>
  );
}
