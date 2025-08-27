import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const DEFAULT_BUTTON_TEXT = {
  signedIn: "To App",
  signUp: "Sign Up",
  dropdown: "App",
} as const;

const regions = {
  eu: {
    url: "https://cloud.langfuse.com",
    label: "EU region",
  },
  us: {
    url: "https://us.cloud.langfuse.com",
    label: "US region",
  },
  hipaa: {
    url: "https://hipaa.cloud.langfuse.com",
    label: "HIPAA region",
  },
} as const;

const continentHostMapping = {
  AF: regions.eu.url, // Africa
  AN: regions.eu.url, // Antarctica
  AS: regions.eu.url, // Asia
  EU: regions.eu.url, // Europe
  NA: regions.us.url, // North America
  OC: regions.eu.url, // Oceania
  SA: regions.us.url, // South America
};

type RegionKey = keyof typeof regions;

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
  const [signedInRegions, setSignedInRegions] = useState<
    Record<RegionKey, boolean>
  >(
    Object.fromEntries(
      Object.keys(regions).map((key) => [key, false])
    ) as Record<RegionKey, boolean>
  );
  const [continentCode, setContinentCode] = useState<string | null>(null);
  const isUsingDefaultText =
    signedInText === DEFAULT_BUTTON_TEXT.signedIn &&
    signUpText === DEFAULT_BUTTON_TEXT.signUp &&
    dropdownText === DEFAULT_BUTTON_TEXT.dropdown;

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      const abortController = new AbortController();

      // Check sign-in status for all regions
      Object.entries(regions).forEach(([key, region]) => {
        fetch(`${region.url}/api/auth/session`, {
          credentials: "include",
          mode: "cors",
          signal: abortController.signal,
        })
          .then((response) => response.json())
          .then((data) => {
            setSignedInRegions((prev) => ({
              ...prev,
              [key]: isSignedIn(data),
            }));
          })
          .catch((error) => {
            // Only update state if the error is not from aborting
            if (error.name !== "AbortError") {
              setSignedInRegions((prev) => ({
                ...prev,
                [key]: false,
              }));
            }
          });
      });

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
            size="xs"
            className={cn(
              "whitespace-nowrap",
              !isUsingDefaultText && "w-[45px] sm:w-[70px]"
            )}
          >
            <span className="sm:hidden">{dropdownText}</span>
            <span className="hidden sm:inline">{signedInText}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(regions).map(
            ([key, region]) =>
              signedInRegions[key as RegionKey] && (
                <DropdownMenuItem asChild key={key}>
                  <Link href={region.url}>{region.label}</Link>
                </DropdownMenuItem>
              )
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (signedInCount === 1) {
    const signedInRegion = Object.entries(regions).find(
      ([key]) => signedInRegions[key as RegionKey]
    );

    return (
      <Button
        size="xs"
        asChild
        className={cn(
          "whitespace-nowrap",
          !isUsingDefaultText && "w-[45px] sm:w-[70px]"
        )}
      >
        <Link href={signedInRegion![1].url}>
          <span className="sm:hidden">{dropdownText}</span>
          <span className="hidden sm:inline">{signedInText}</span>
        </Link>
      </Button>
    );
  } else {
    return (
      <Button
        size="xs"
        asChild
        className={cn(
          "whitespace-nowrap",
          !isUsingDefaultText && "w-[45px] sm:w-[70px]"
        )}
      >
        <Link
          href={
            continentCode ? continentHostMapping[continentCode] : regions.eu.url
          }
        >
          <span className="sm:hidden">{dropdownText}</span>
          <span className="hidden sm:inline">{signUpText}</span>
        </Link>
      </Button>
    );
  }
};

const isSignedIn = (session: Record<string, unknown>) => {
  return session && "user" in session;
};
