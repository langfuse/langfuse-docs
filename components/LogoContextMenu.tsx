import { DropdownMenuPortal } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Download, ExternalLink } from "lucide-react";

const LogoContextMenu: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger />
      <DropdownMenuPortal>
        <DropdownMenuContent className="min-w-[180px]">
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href="/brand-assets/icon/color/langfuse-icon.png" download>
              <Download size={14} className="shrink-0" />
              Langfuse Icon (png)
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href="/brand-assets/icon/color/langfuse-icon.svg" download>
              <Download size={14} className="shrink-0" />
              Langfuse Icon (svg)
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href="/brand-assets/wordmark/Langfuse/light/langfuse-wordart.png"
              download
            >
              <Download size={14} className="shrink-0" />
              Langfuse Logo (png)
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <a
              href="/brand-assets/wordmark/Langfuse/light/langfuse-wordart.svg"
              download
            >
              <Download size={14} className="shrink-0" />
              Langfuse Logo (svg)
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="cursor-pointer">
            <a href="/brand" target="_blank" rel="noopener noreferrer">
              <ExternalLink size={14} className="shrink-0" />
              Brand Assets & Guide
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default LogoContextMenu;
