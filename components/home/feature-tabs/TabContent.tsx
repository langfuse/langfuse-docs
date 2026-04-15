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

  return (
    <div className="relative w-full h-[410px] custom-card-shadow">
      {/* Light theme image */}
      <Image
        src={feature.image.light}
        alt={feature.image.alt}
        fill
        quality={100}
        className="object-cover object-top-left dark:hidden"
        sizes="(min-width: 1024px) 33vw, 100vw"
        priority={priority}
        onError={handleImageError}
      />

      {/* Dark theme image */}
      <Image
        src={feature.image.dark}
        alt={feature.image.alt}
        fill
        quality={100}
        className="hidden object-cover object-top-left dark:block"
        sizes="(min-width: 1024px) 33vw, 100vw"
        priority={priority}
        onError={handleImageError}
      />
    </div>
  );
};
