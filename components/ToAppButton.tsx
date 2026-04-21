"use client";

import Link from "next/link";
import NextLink from "next/link";
import { Plus, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  cloudRegions,
  cloudRegionSelectorOrder,
  type CloudRegionKey,
} from "@/lib/cloud-regions";
import { useCloudRegionSignIn } from "@/lib/use-cloud-region-sign-in";
import { HoverCorners } from "./ui/corner-box";

const DEFAULT_BUTTON_TEXT = {
  signedIn: "Launch App",
  signUp: "Launch App",
  dropdown: "Launch App",
} as const;

const labelClasses =
  "font-sans text-[12px] font-[450] leading-[150%] tracking-[-0.06px] [font-variant-numeric:ordinal] p-0";

interface ToAppButtonProps {
  signedInText?: string;
  signUpText?: string;
  dropdownText?: string;
}

export const ToAppButton = ({
  signedInText = DEFAULT_BUTTON_TEXT.signedIn,
  signUpText = DEFAULT_BUTTON_TEXT.signUp,
  dropdownText = DEFAULT_BUTTON_TEXT.dropdown,
}: ToAppButtonProps = {}) => {
  const signedInRegions = useCloudRegionSignIn();

  const signedInCount = Object.values(signedInRegions).filter(Boolean).length;

  if (signedInCount > 1) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="primary"
            size="small"
            shortcutKey="L"
            className="whitespace-nowrap"
          >
            {dropdownText}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {cloudRegionSelectorOrder.map((key) => {
            const region = cloudRegions[key];
            return (
              signedInRegions[key] && (
                <DropdownMenuItem asChild key={key}>
                  <Link href={region.url}>{region.label}</Link>
                </DropdownMenuItem>
              )
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/cloud" className="flex items-center gap-1.5 text-muted-foreground">
              <Plus className="h-3.5 w-3.5" />
              Add region
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (signedInCount === 1) {
    const signedInRegion = Object.entries(cloudRegions).find(
      ([key]) => signedInRegions[key as CloudRegionKey]
    );

    return (
      <div className="relative flex items-center p-1 group button-wrapper max-h-[34px]">
        <HoverCorners />
        <NextLink
          href={signedInRegion![1].url}
          className="inline-flex h-[26px] min-w-0 items-center gap-[6px] whitespace-nowrap rounded-[2px] rounded-r-none border border-r-0 border-text-secondary bg-text-primary py-0.75 pl-[10px] pr-[8px] text-surface-bg shadow-sm transition-colors [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
        >
          <span className={labelClasses}>{signedInText}</span>
        </NextLink>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex h-[26px] items-center justify-center rounded-[2px] rounded-l-none border border-text-secondary bg-text-primary px-1.5 text-surface-bg shadow-sm transition-colors [box-shadow:0_4px_8px_0_rgba(0,0,0,0.05),0_4px_4px_0_rgba(0,0,0,0.03)]"
              aria-label="More options"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem asChild>
              <Link href="/cloud" className="flex items-center gap-1.5 text-muted-foreground">
                <Plus className="h-3.5 w-3.5" />
                Add region
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  } else {
    return (
      <Button
        variant="primary"
        size="small"
        shortcutKey="L"
        href="/cloud"
        className="whitespace-nowrap"
      >
        {signUpText}
      </Button>
    );
  }
};
