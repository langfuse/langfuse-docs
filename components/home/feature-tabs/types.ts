import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

export type CodeSnippets = {
  python?: string;
  javascript?: string;
};

export interface StatementItem {
  title: string;
  description: string;
}

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
  code?: {
    language: string;
    snippets: CodeSnippets;
  };
  statements?: StatementItem[];
  quickstartHref?: string;
}

export interface AutoAdvanceConfig {
  enabled: boolean;
  intervalMs: number;
}

export interface FeatureTabsProps {
  features: FeatureTabData[];
  defaultTab?: string;
  autoAdvance?: AutoAdvanceConfig;
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