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

export type TabDisplayMode =
  | "default"
  | "code-only"
  | "feature-only"
  | "image-only";

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
    snippets: CodeSnippets;
  };
  statements?: StatementItem[];
  quickstartHref?: string;
  displayMode?: TabDisplayMode;
}

export interface AutoAdvanceConfig {
  enabled: boolean;
  intervalMs: number;
}
