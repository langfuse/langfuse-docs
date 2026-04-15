"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  cloudRegions,
  continentHostMapping,
  type CloudRegionKey,
} from "@/lib/cloud-regions";
import { useCloudRegionSignIn } from "@/lib/use-cloud-region-sign-in";

const DEFAULT_BUTTON_TEXT = {
  signedIn: "Launch App",
  signUp: "Launch App",
  dropdown: "Launch App",
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
          // Only update state if the error is not from aborting
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
          {Object.entries(cloudRegions).map(
            ([key, region]) =>
              signedInRegions[key as CloudRegionKey] && (
                <DropdownMenuItem asChild key={key}>
                  <Link href={region.url}>{region.label}</Link>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (signedInCount === 1) {
    const signedInRegion = Object.entries(cloudRegions).find(
      ([key]) => signedInRegions[key as CloudRegionKey]
    );

    return (
      <Button
        variant="primary"
        size="small"
        shortcutKey="L"
        href={signedInRegion![1].url}
        className="whitespace-nowrap"
      >
        {signedInText}
      </Button>
    );
  } else {
    return (
      <Button
        variant="primary"
        size="small"
        shortcutKey="L"
        href={
          continentCode ? continentHostMapping[continentCode] : cloudRegions.eu.url
        }
        className="whitespace-nowrap"
      >
        {signUpText}
      </Button>
    );
  }
};
