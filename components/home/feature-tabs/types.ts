import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

export interface FeatureTabData {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  body: string;
  docsHref: string;
  videoHref?: string;
  image: {
    light: StaticImageData;
    dark: StaticImageData;
    alt: string;
  };
  code: {
    language: string;
    snippet: string;
  };
  quickstartHref: string;
}

export interface TabContentProps {
  feature: FeatureTabData;
  isActive: boolean;
}

export interface TabButtonProps {
  feature: FeatureTabData;
  isActive: boolean;
  onClick: () => void;
}