import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared outer shell for left sidebars in HomeLayout.
 * Provides the sticky positioning, fixed width, overflow scroll,
 * and visual chrome (bg, border pixel) that all left sidebars share.
 */
export function SidebarShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col bg-line-structure sticky p-px pt-0 w-[240px] shrink-0",
        className,
      )}
      style={{
        top: "calc(var(--fd-banner-height, 0px) + 4rem)",
        height: "calc(100vh - var(--fd-banner-height, 0px) - 4rem)",
      }}
    >
      <nav className="flex overflow-y-auto overflow-x-hidden flex-col flex-1 rounded-sm bg-surface-1">
        {children}
        <span className="flex px-px w-full bg-line-structure h-[3px]">
          <span className="w-full h-full rounded-t-sm bg-surface-1" />
        </span>
      </nav>
    </aside>
  );
}
