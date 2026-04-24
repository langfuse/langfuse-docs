"use client";

import { useCallback, useMemo, type MouseEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Logo } from "@/components/Logo";
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
    icon: ReactNode;
  }
> = {
  us: {
    title: "US",
    awsRegion: "us-west-2",
    icon: <span className="text-lg">{"\u{1F1FA}\u{1F1F8}"}</span>,
  },
  hipaa: {
    title: "US HIPAA",
    awsRegion: "us-west-2",
    icon: <ShieldCheck className="h-5 w-5 text-text-tertiary" />,
  },
  eu: {
    title: "Europe",
    awsRegion: "eu-west-1",
    icon: <span className="text-lg">{"\u{1F1EA}\u{1F1FA}"}</span>,
  },
  jp: {
    title: "Japan",
    awsRegion: "ap-northeast-1",
    icon: <span className="text-lg">{"\u{1F1EF}\u{1F1F5}"}</span>,
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
  const targetPath = cloudSubpath.startsWith("/")
    ? cloudSubpath
    : `/${cloudSubpath}`;
  return `${baseUrl}${targetPath}${search}${hash}`;
};

const SignedInBadge = () => (
  <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-muted-green/20 bg-muted-green/5 px-2 py-0.5 text-[11px] font-medium text-muted-green">
    <span className="h-1.5 w-1.5 rounded-full bg-muted-green" />
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
      const search =
        typeof window === "undefined" ? "" : window.location.search;
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-bg px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-[480px] flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-5">
          <Logo />
          <Heading as="h1" size="normal" className="text-center">
            Select your region
          </Heading>
          <Text className="max-w-xs">
            Choose a cloud region to continue.
          </Text>
        </div>

        <CornerBox className="w-full">
          <div className="divide-y divide-line-structure">
            {cloudRegionSelectorOrder.map((regionKey) => {
              const region = cloudRegions[regionKey];
              const card = regionCards[regionKey];
              const host = getCloudHost(region.url);
              const href = buildCloudRedirectUrl({
                region: regionKey,
                cloudSubpath,
                search: "",
                hash: "",
              });
              const isSignedIn = signedInRegions[regionKey];

              return (
                <a
                  key={regionKey}
                  href={href}
                  onClick={(event) => handleRegionSelect(regionKey, event)}
                  className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-1 sm:px-5"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border border-line-structure bg-surface-1">
                    {card.icon}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-analog text-[15px] font-medium text-text-primary">
                        {card.title}
                      </span>
                      {isSignedIn && <SignedInBadge />}
                    </div>
                    <Text
                      size="s"
                      as="span"
                      className="mt-0.5 block text-left text-text-tertiary"
                    >
                      {host}
                      <span className="mx-1.5 text-text-disabled">&middot;</span>
                      AWS {card.awsRegion}
                    </Text>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-text-tertiary transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-text-secondary" />
                </a>
              );
            })}
          </div>
        </CornerBox>

        <Text size="s">
          <Link
            href="/security/data-regions"
            className="text-text-secondary underline underline-offset-2 decoration-line-structure hover:decoration-text-tertiary hover:text-text-primary transition-colors"
          >
            Learn more about data regions
          </Link>
        </Text>
      </div>
    </main>
  );
}
