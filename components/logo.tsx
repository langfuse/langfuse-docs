import Image from "next/image";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

import { useState } from "react";
import { Download, ExternalLink } from "lucide-react";

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
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
        <DropdownMenuTrigger />
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              window.open("/", "_blank");
            }}
          >
            <ExternalLink size={14} className="mr-2" />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              window.open("/langfuse_logo.png", "_blank");
            }}
          >
            <Download size={14} className="mr-2" />
            Logo (png)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              window.open("/langfuse_logo.svg", "_blank");
            }}
          >
            <Download size={14} className="mr-2" />
            Logo (svg)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
