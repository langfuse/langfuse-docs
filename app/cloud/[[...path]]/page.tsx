"use client";

import { useCallback, useMemo, type MouseEvent } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Globe,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  cloudRegionSelectorOrder,
  cloudRegions,
  type CloudRegionKey,
} from "@/lib/cloud-regions";
import { useCloudRegionSignIn } from "@/lib/use-cloud-region-sign-in";

const regionCards: Record<
  CloudRegionKey,
  {
    title: string;
    awsRegion: string;
    awsLocation: string;
    icon: typeof Shield;
    flag?: string;
  }
> = {
  us: {
    title: "US",
    awsRegion: "us-west-2",
    awsLocation: "Oregon",
    icon: Shield,
    flag: "🇺🇸",
  },
  hipaa: {
    title: "US HIPAA",
    awsRegion: "us-west-2",
    awsLocation: "Oregon",
    icon: ShieldCheck,
  },
  eu: {
    title: "Europe",
    awsRegion: "eu-west-1",
    awsLocation: "Ireland",
    icon: Globe,
    flag: "🇪🇺",
  },
};

const CLOUD_ROUTE_PREFIX = "/cloud";

const stripControlChars = (value: string) =>
  value.replace(/[\u0000-\u001F\u007F]/g, "");

const getCloudRedirectPartsFromPathname = (pathname: string) => {
  const sanitized = stripControlChars(pathname || "");
  let cloudSubpath = "/";
  if (
    sanitized.startsWith(`${CLOUD_ROUTE_PREFIX}/`) &&
    sanitized.length > CLOUD_ROUTE_PREFIX.length
  ) {
    cloudSubpath = sanitized.slice(CLOUD_ROUTE_PREFIX.length);
  } else if (sanitized === CLOUD_ROUTE_PREFIX) {
    cloudSubpath = "/";
  }
  return { cloudSubpath };
};

const buildCloudRedirectUrl = ({
  region,
  cloudSubpath,
  search,
  hash,
}: {
  region: CloudRegionKey;
  cloudSubpath: string;
  search: string;
  hash: string;
}) => {
  const baseUrl = cloudRegions[region].url.replace(/\/$/, "");
  const targetPath = cloudSubpath.startsWith("/") ? cloudSubpath : `/${cloudSubpath}`;
  return `${baseUrl}${targetPath}${search}${hash}`;
};

const SignedInHint = () => (
  <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700/90 dark:text-emerald-400">
    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/90" />
    Signed in
  </span>
);

const getCloudHost = (url: string) => new URL(url).host;

export default function CloudRegionSelectorPage() {
  const pathname = usePathname();
  const signedInRegions = useCloudRegionSignIn();

  const { cloudSubpath } = useMemo(
    () => getCloudRedirectPartsFromPathname(pathname || ""),
    [pathname]
  );

  const handleRegionSelect = useCallback(
    (region: CloudRegionKey, event: MouseEvent<HTMLAnchorElement>) => {
      const isModifiedClick =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;
      if (isModifiedClick) return;
      event.preventDefault();
      const search = typeof window === "undefined" ? "" : window.location.search;
      const hash = typeof window === "undefined" ? "" : window.location.hash;
      const targetUrl = buildCloudRedirectUrl({
        region,
        cloudSubpath,
        search,
        hash,
      });
      if (typeof window !== "undefined") {
        window.location.assign(targetUrl);
      }
    },
    [cloudSubpath]
  );

  return (
    <main className="flex min-h-screen items-center bg-background px-4 py-6 sm:min-h-full sm:justify-center sm:px-6 sm:py-10 lg:px-8">
      <div className="w-full max-w-[480px]">
        <div className="text-center sm:mx-auto sm:w-full">
          <a href="/" aria-label="Langfuse Home" className="inline-flex">
            <Image
              src="/langfuse-wordart.svg"
              alt="Langfuse"
              width={152}
              height={20}
              priority
              className="h-auto w-36 dark:hidden"
            />
            <Image
              src="/langfuse-wordart-white.svg"
              alt="Langfuse"
              width={152}
              height={20}
              priority
              className="hidden h-auto w-36 dark:block"
            />
          </a>
          <h1 className="mt-7 text-2xl font-bold leading-9 tracking-tight text-primary">
            Select your region
          </h1>
        </div>

        <Card className="mt-8 overflow-hidden border shadow-sm">
          <CardContent className="divide-y p-0">
            {cloudRegionSelectorOrder.map((regionKey) => {
              const region = cloudRegions[regionKey];
              const card = regionCards[regionKey];
              const Icon = card.icon;
              const host = getCloudHost(region.url);
              const href = buildCloudRedirectUrl({
                region: regionKey,
                cloudSubpath,
                search: typeof window === "undefined" ? "" : "",
                hash: typeof window === "undefined" ? "" : "",
              });
              const isSignedIn = signedInRegions[regionKey];

              return (
                <div
                  key={regionKey}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-border/80 bg-muted/25 text-lg">
                      {card.flag ? (
                        <span>{card.flag}</span>
                      ) : (
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="mb-1 text-base font-semibold">
                        {card.title}
                      </p>
                      <p className="mt-1.5 text-xs font-medium tracking-wide text-muted-foreground/80">
                        AWS {card.awsRegion} • {card.awsLocation}
                      </p>
                      <code
                        className="mt-1.5 block max-w-full truncate text-xs text-muted-foreground/90"
                        title={host}
                      >
                        {host}
                      </code>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Button
                      asChild
                      size="sm"
                      className="whitespace-nowrap"
                    >
                      <a
                        href={href}
                        onClick={(event) => handleRegionSelect(regionKey, event)}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                    {isSignedIn && <SignedInHint />}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
