import { useCallback } from "react";

import Image from "next/image";
import type { FeatureTabData } from "./types";
import type { SyntheticEvent } from "react";

export interface TabContentProps {
  feature: FeatureTabData;
  className?: string;
  /** Pass false if this panel is off-screen or deprioritized for LCP. */
  priority?: boolean;
}

export const TabContent = ({
  feature,
  priority = true,
}: TabContentProps) => {
  const handleImageError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const retryCount = Number(img.dataset.retryCount || "0");
      if (retryCount < 3) {
        img.dataset.retryCount = String(retryCount + 1);
        setTimeout(() => {
          const currentSrc = img.src;
          img.src = "";
          img.src = currentSrc;
        }, 1000 * (retryCount + 1));
      }
    },
    []
  );

  const sizes = "(min-width: 1280px) 1616px, (min-width: 768px) 1616px, 100vw";

  return (
    <div className="relative h-full w-full sm:h-[410px] custom-card-shadow">
      {/* Light theme image */}
      <Image
        src={feature.image.light}
        alt={feature.image.alt}
        fill
        quality={100}
        className="object-contain object-center sm:object-cover sm:object-top-left dark:hidden"
        sizes={sizes}
        priority={priority}
        onError={handleImageError}
      />

      {/* Dark theme image */}
      <Image
        src={feature.image.dark}
        alt={feature.image.alt}
        fill
        quality={100}
        className="hidden object-contain object-center sm:object-cover sm:object-top-left dark:block"
        sizes={sizes}
        priority={priority}
        onError={handleImageError}
      />
    </div>
  );
};
