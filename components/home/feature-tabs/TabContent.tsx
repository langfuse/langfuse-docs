import { useCallback } from "react";

import Image from "next/image";
import type { FeatureTabData } from "./types";
import type { SyntheticEvent } from "react";

export interface TabContentProps {
  feature: FeatureTabData;
  className?: string;
}

export const TabContent = ({ feature }: TabContentProps) => {
  const handleImageError = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      const retryCount = Number(img.dataset.retryCount || "0");
      if (retryCount < 3) {
        img.dataset.retryCount = String(retryCount + 1);
        setTimeout(
          () => {
            const currentSrc = img.src;
            img.src = "";
            img.src = currentSrc;
          },
          1000 * (retryCount + 1),
        );
      }
    },
    [],
  );

  const sizes = "(min-width: 1280px) 808px, (min-width: 768px) 648px";

  return (
    <div className="relative w-full aspect-[2205/1291]">
      <Image
        src={feature.image.light}
        alt={feature.image.alt}
        fill
        quality={85}
        className="object-contain object-center sm:object-cover sm:object-top-left"
        sizes={sizes}
        loading="lazy"
        onError={handleImageError}
      />
    </div>
  );
};
