import Link from "next/link";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const continentHostMapping = {
  AF: "https://cloud.langfuse.com", // Africa
  AN: "https://cloud.langfuse.com", // Antarctica
  AS: "https://cloud.langfuse.com", // Asia
  EU: "https://cloud.langfuse.com", // Europe
  NA: "https://us.cloud.langfuse.com", // North America
  OC: "https://cloud.langfuse.com", // Oceania
  SA: "https://us.cloud.langfuse.com", // South America
};

export const ToAppButton = () => {
  const [signedInUS, setSignedInUS] = useState(false);
  const [signedInEU, setSignedInEU] = useState(false);
  const [continentCode, setContinentCode] = useState<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      fetch("https://us.cloud.langfuse.com/api/auth/session", {
        credentials: "include",
        mode: "cors",
      })
        .then((us) => us.json())
        .then((usData) => {
          setSignedInUS(isSignedIn(usData));
        })
        .catch(() => {
          setSignedInUS(false);
        });

      fetch("https://cloud.langfuse.com/api/auth/session", {
        credentials: "include",
        mode: "cors",
      })
        .then((eu) => eu.json())
        .then((euData) => {
          setSignedInEU(isSignedIn(euData));
        })
        .catch(() => {
          setSignedInEU(false);
        });

      fetch("/api/get-continent-code")
        .then((response) => response.json())
        .then((data) => {
          if (data.continentCode && continentHostMapping[data.continentCode]) {
            setContinentCode(data.continentCode);
          }
        })
        .catch(() => {
          setContinentCode(null);
        });
    }
  }, []);

  if (signedInUS && signedInEU) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="xs" className="whitespace-nowrap w-[45px] sm:w-[70px]">
            <span className="sm:hidden">App</span>
            <span className="hidden sm:inline">To App</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild key="us">
            <Link href="https://us.cloud.langfuse.com">US region</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild key="eu">
            <Link href="https://cloud.langfuse.com">EU region</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else if (signedInUS || signedInEU) {
    return (
      <Button
        size="xs"
        asChild
        className="whitespace-nowrap w-[45px] sm:w-[70px]"
      >
        <Link
          href={
            signedInUS
              ? "https://us.cloud.langfuse.com"
              : "https://cloud.langfuse.com"
          }
        >
          <span className="sm:hidden">App</span>
          <span className="hidden sm:inline">To App</span>
        </Link>
      </Button>
    );
  } else {
    return (
      <Button
        size="xs"
        asChild
        className="whitespace-nowrap w-[45px] sm:w-[70px]"
      >
        <Link
          href={
            continentCode
              ? continentHostMapping[continentCode]
              : "https://cloud.langfuse.com"
          }
        >
          <span className="sm:hidden">App</span>
          <span className="hidden sm:inline">Sign Up</span>
        </Link>
      </Button>
    );
  }
};

const isSignedIn = (session: Record<string, unknown>) => {
  // check if session is object and has key "user", get typing right
  return session && "user" in session;
};
