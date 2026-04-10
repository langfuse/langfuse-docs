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
  const handleAction = (
    e: React.MouseEvent,
    url: string,
    isDownload: boolean
  ) => {
    e.preventDefault();

    if (isDownload) {
      const link = document.createElement("a");
      link.href = url;
      link.download = url.split("/").pop() || ""; // Get filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger />
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse-icon.svg", true)}
          >
            <Download size={14} className="mr-2" />
            Langfuse Icon
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse-wordart.svg", true)}
          >
            <Download size={14} className="mr-2" />
            Langfuse Wordmark
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={(e) => handleAction(e, "/brand", false)}>
            <ExternalLink size={14} className="mr-2" />
            Brand Assets & Guide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default LogoContextMenu;
