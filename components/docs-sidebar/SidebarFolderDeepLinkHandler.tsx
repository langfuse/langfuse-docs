"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const SIDEBAR_FOLDER_HASH_PREFIX = "#sidebar-folder-";

function openSidebarFolder(hash: string) {
  if (!hash.startsWith(SIDEBAR_FOLDER_HASH_PREFIX)) return;

  const anchorId = hash.slice(1);
  const trigger = Array.from(
    document.querySelectorAll<HTMLButtonElement>(
      "button[data-sidebar-folder-anchor]",
    ),
  ).find(
    (element) =>
      element.getAttribute("data-sidebar-folder-anchor") === anchorId,
  );
  if (!trigger) return;

  if (trigger.getAttribute("aria-expanded") === "false") {
    trigger.click();
  }
  trigger.scrollIntoView({ block: "nearest" });
}

export function SidebarFolderDeepLinkHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const openFolderFromLocation = () => {
      openSidebarFolder(window.location.hash);
    };
    const openFolderFromLink = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link?.hash.startsWith(SIDEBAR_FOLDER_HASH_PREFIX) ||
        link.origin !== window.location.origin ||
        link.pathname !== window.location.pathname
      ) {
        return;
      }

      window.setTimeout(() => openSidebarFolder(link.hash));
    };

    openFolderFromLocation();
    window.addEventListener("hashchange", openFolderFromLocation);
    document.addEventListener("click", openFolderFromLink);
    return () => {
      window.removeEventListener("hashchange", openFolderFromLocation);
      document.removeEventListener("click", openFolderFromLink);
    };
  }, [pathname]);

  return null;
}
