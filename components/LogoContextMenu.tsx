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
          <DropdownMenuItem onClick={(e) => handleAction(e, "/", false)}>
            <ExternalLink size={14} className="mr-2" />
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse_logo.png", true)}
          >
            <Download size={14} className="mr-2" />
            Logo (png)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse_logo.svg", true)}
          >
            <Download size={14} className="mr-2" />
            Logo (svg)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse_logo_white.png", true)}
          >
            <Download size={14} className="mr-2" />
            Logo white (png)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse_logo_white.svg", true)}
          >
            <Download size={14} className="mr-2" />
            Logo white (svg)
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse_icon.png", true)}
          >
            <Download size={14} className="mr-2" />
            Icon (png)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleAction(e, "/langfuse_icon.svg", true)}
          >
            <Download size={14} className="mr-2" />
            Icon (svg)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};

export default LogoContextMenu;
