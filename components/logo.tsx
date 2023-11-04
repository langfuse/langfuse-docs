import Image from "next/image";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

import { useState } from "react";
import { Download, ExternalLink, Sun } from "lucide-react";
import Link from "next/link";

export function Logo() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <div
        className="flex gap-2 items-center"
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuOpen(true);
        }}
      >
        <Image
          src="/logo_light_512.png"
          alt="Langfuse Logo"
          width={120}
          height={20}
          className="hidden dark:block"
        />
        <Image
          src="/logo_dark_512.png"
          alt="Langfuse Logo"
          width={120}
          height={20}
          className="block dark:hidden"
        />
      </div>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
        <DropdownMenuTrigger />
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open("/", "_blank");
            }}
          >
            <ExternalLink size={14} className="mr-2" />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              window.open("/langfuse_logo.png", "_blank");
            }}
          >
            <Download size={14} className="mr-2" />
            Logo (png)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
