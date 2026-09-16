import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FrameProps = {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  transparent?: boolean;
  /**
   * @deprecated Zoom is handled by Fumadocs ImageZoom on MDX images.
   * Kept so existing MDX `zoom` / `zoomOnMobile` props still compile.
   */
  zoom?: boolean;
  /**
   * @deprecated Zoom is handled by Fumadocs ImageZoom on MDX images.
   */
  zoomOnMobile?: boolean;
};

/**
 * Optional screenshot chrome: border, muted background, max-width, spacing.
 *
 * Zoom used to live here (custom lightbox). Markdown `img` / `Image` now map
 * to Fumadocs ImageZoom, so Frame is layout-only and must not open a second
 * overlay. Nested images zoom once.
 */
export const Frame = ({
  children,
  className,
  fullWidth = false,
  transparent = false,
}: FrameProps) => {
  return (
    <div
      className={cn(
        "mt-4 overflow-hidden rounded border inline-block",
        className,
      )}
    >
      <div
        className={cn(
          "block max-w-2xl bg-primary/5 [&>*]:mt-0 [&>*]:mb-0 [&>*]:p-0 [&_[data-rmiz]]:block [&_[data-rmiz]]:w-full [&_img]:block [&_img]:my-0 [&_img]:h-auto [&_img]:w-full [&_img]:align-top [&_img]:leading-none [&_p]:my-0",
          fullWidth && "max-w-full",
          transparent && "bg-transparent",
        )}
      >
        {children}
      </div>
    </div>
  );
};
