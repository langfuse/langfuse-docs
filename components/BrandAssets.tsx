"use client";

import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function BrandDownloadButton() {
  return (
    <div className="mt-2 w-fit">
      <Button
        variant="secondary"
        size="small"
        icon={<Download className="h-3.5 w-3.5" />}
        href="/brand-assets.zip"
        onClick={(e) => {
          e.preventDefault();
          const a = document.createElement("a");
          a.href = "/brand-assets.zip";
          a.download = "";
          a.click();
        }}
      >
        Download Langfuse Brand Assets
      </Button>
    </div>
  );
}

type BrandAssetVariant = "light" | "dark";

interface BrandAssetCardProps {
  href: string;
  src: string;
  alt: string;
  label: string;
  variant?: BrandAssetVariant;
  tall?: boolean;
}

export function BrandAssetCard({
  href,
  src,
  alt,
  label,
  variant = "light",
  tall,
}: BrandAssetCardProps) {
  return (
    <a
      download
      href={href}
      className="block no-underline relative group border border-line-structure bg-surface-bg rounded-[2px] corner-box-corners--hover corner-box-hover-stripes transition-[background] duration-180 ease-out"
    >
      <div
        className={cn(
          "flex items-center justify-center border-b border-line-structure min-h-28 p-6",
          variant === "dark"
            ? "bg-text-primary dark:bg-surface-code"
            : "bg-surface-bg"
        )}
      >
        <img
          src={src}
          alt={alt}
          className={cn("max-w-full max-h-full w-auto object-contain", tall ? "h-12" : "h-10")}
        />
      </div>
      <div className="p-3 text-xs font-medium text-text-secondary">
        {label}
      </div>
    </a>
  );
}

export function BrandAssetGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 not-prose">
      {children}
    </div>
  );
}
