"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  cloudRegions,
  cloudRegionSelectorOrder,
  continentHostMapping,
  type CloudRegionKey,
} from "@/lib/cloud-regions";
import { useCloudRegionSignIn } from "@/lib/use-cloud-region-sign-in";

const DEFAULT_BUTTON_TEXT = {
  signedIn: "To App",
  signUp: "Sign Up",
  dropdown: "App",
} as const;

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
  const [continentCode, setContinentCode] = useState<string | null>(null);
  const isUsingDefaultText =
    signedInText === DEFAULT_BUTTON_TEXT.signedIn &&
    signUpText === DEFAULT_BUTTON_TEXT.signUp &&
    dropdownText === DEFAULT_BUTTON_TEXT.dropdown;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const abortController = new AbortController();

      fetch("/api/get-continent-code", {
        signal: abortController.signal,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.continentCode && continentHostMapping[data.continentCode]) {
            setContinentCode(data.continentCode);
          }
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            setContinentCode(null);
          }
        });

      return () => {
        abortController.abort();
      };
    }
  }, []);

  const signedInCount = Object.values(signedInRegions).filter(Boolean).length;

  if (signedInCount >= 1) {
    const signedInRegionKeys = cloudRegionSelectorOrder.filter(
      (key) => signedInRegions[key]
    );
    const otherRegionKeys = cloudRegionSelectorOrder.filter(
      (key) => !signedInRegions[key]
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="xs"
            className={cn(
              "whitespace-nowrap",
              isUsingDefaultText && "w-[45px] sm:w-[70px]"
            )}
          >
            <span className="sm:hidden">{dropdownText}</span>
            <span className="hidden sm:inline">{signedInText}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {signedInRegionKeys.length > 0 && (
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Signed in
            </DropdownMenuLabel>
          )}
          {signedInRegionKeys.map((key) => (
            <DropdownMenuItem asChild key={key}>
              <Link href={cloudRegions[key].url}>
                {cloudRegions[key].label}
              </Link>
            </DropdownMenuItem>
          ))}
          {signedInRegionKeys.length > 0 && otherRegionKeys.length > 0 && (
            <DropdownMenuSeparator />
          )}
          {otherRegionKeys.length > 0 && (
            <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
              Other regions
            </DropdownMenuLabel>
          )}
          {otherRegionKeys.map((key) => (
            <DropdownMenuItem asChild key={key}>
              <Link href={cloudRegions[key].url}>
                {cloudRegions[key].label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      size="xs"
      asChild
      className={cn(
        "whitespace-nowrap",
        isUsingDefaultText && "w-[45px] sm:w-[70px]"
      )}
    >
      <Link
        href={
          continentCode
            ? continentHostMapping[continentCode]
            : cloudRegions.eu.url
        }
      >
        <span className="sm:hidden">{dropdownText}</span>
        <span className="hidden sm:inline">{signUpText}</span>
      </Link>
    </Button>
  );
};
