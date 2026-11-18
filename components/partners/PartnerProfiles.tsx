"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Button, controlTextClassName } from "@/components/ui/button";
import { CornerGrid, CornerGridItem } from "@/components/ui/corner-grid";
import { Image } from "@/components/ui/image";
import { Input } from "@/components/ui/input";
import { TabButton } from "@/components/ui/tab-button";
import { langfusePartnerProfiles } from "@/lib/partner-profiles";
import { cn } from "@/lib/utils";

type PartnerProfile = {
  name: string;
  url: string;
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    /** Set for a symbol-only mark so the partner name renders beside it. */
    showName?: boolean;
  };
  regions: readonly string[];
  capabilities: readonly string[];
  summary: string;
};

function matchesQuery(profile: PartnerProfile, query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return true;

  const haystack = [
    profile.name,
    profile.summary,
    ...profile.regions,
    ...profile.capabilities,
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

const nameClassName =
  "m-0 font-analog text-[20px] font-medium leading-[1.2] tracking-tight text-text-primary sm:text-[21px]";

function PartnerIdentity({ profile }: { profile: PartnerProfile }) {
  const { logo } = profile;

  if (!logo) {
    return <h3 className={nameClassName}>{profile.name}</h3>;
  }

  if (logo.showName) {
    return (
      <div className="flex items-center gap-2.5">
        <Image
          src={logo.src}
          alt=""
          width={logo.width}
          height={logo.height}
          className="h-5 w-auto shrink-0 brightness-0 dark:invert"
        />
        <h3 className={nameClassName}>{profile.name}</h3>
      </div>
    );
  }

  return (
    <>
      <Image
        src={logo.src}
        alt=""
        width={logo.width}
        height={logo.height}
        className="h-8 w-auto max-w-40 object-contain object-left brightness-0 dark:invert"
      />
      <h3 className="sr-only">{profile.name}</h3>
    </>
  );
}

function PartnerCard({ profile }: { profile: PartnerProfile }) {
  return (
    <article className="flex h-full flex-col">
      <div className="mb-4 flex min-h-8 items-center">
        <PartnerIdentity profile={profile} />
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <p className={cn(controlTextClassName, "m-0 text-text-tertiary")}>
          <span className="sr-only">Supported regions: </span>
          {profile.regions.join(", ")}
        </p>

        <p className="m-0 text-[13px] leading-[1.55] text-text-secondary">
          {profile.summary}
        </p>

        <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0">
          {profile.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-line-structure px-2.5 py-1 text-[11px] leading-snug text-text-secondary"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>

      <Button
        asChild
        size="default"
        className={cn(controlTextClassName, "mt-6 w-auto self-start px-[10px]")}
      >
        <a href={profile.url} target="_blank" rel="noopener noreferrer">
          Visit {profile.name}
        </a>
      </Button>
    </article>
  );
}

function BecomePartnerCard() {
  return (
    <article className="flex h-full flex-col">
      <p
        className={cn(
          controlTextClassName,
          "m-0 mb-4 flex min-h-8 items-center text-text-tertiary",
        )}
      >
        Services firm?
      </p>
      <h3 className={nameClassName}>Become a Langfuse partner</h3>
      <p className="mb-0 mt-2 text-[13px] leading-[1.55] text-text-secondary">
        See the path to delivery readiness and a directory listing.
      </p>
      <div className="mt-auto pt-6">
        <Button
          asChild
          size="default"
          className={cn(controlTextClassName, "w-auto px-[10px]")}
        >
          <a href="#become-delivery-ready">See the partner path</a>
        </Button>
      </div>
    </article>
  );
}

export function PartnerProfiles({
  profiles = langfusePartnerProfiles,
}: {
  profiles?: readonly PartnerProfile[];
}) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<string | null>(null);

  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => a.name.localeCompare(b.name)),
    [profiles],
  );
  const regions = useMemo(
    () =>
      Array.from(new Set(profiles.flatMap((profile) => profile.regions))).sort(
        (a, b) => a.localeCompare(b),
      ),
    [profiles],
  );

  if (!profiles.length) return null;

  const visibleProfiles = sortedProfiles.filter(
    (profile) =>
      (region === null || profile.regions.includes(region)) &&
      matchesQuery(profile, query),
  );
  const isFiltered = region !== null || query.trim() !== "";

  function clearFilters() {
    setQuery("");
    setRegion(null);
  }

  return (
    <section
      aria-label="Approved Langfuse partners"
      className="not-prose @container"
    >
      <div className="flex flex-col gap-3 @2xl:flex-row @2xl:items-center @2xl:justify-between">
        <label className="relative block w-full @2xl:max-w-xs">
          <span className="sr-only">Search partners</span>
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-text-tertiary"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, region, or service"
            className="pl-8"
          />
        </label>
        <div
          role="group"
          aria-label="Filter partners by region"
          className="-mx-1 flex flex-wrap items-center"
        >
          <TabButton
            active={region === null}
            aria-pressed={region === null}
            onClick={() => setRegion(null)}
          >
            All regions
          </TabButton>
          {regions.map((option) => (
            <TabButton
              key={option}
              active={region === option}
              aria-pressed={region === option}
              onClick={() => setRegion(region === option ? null : option)}
            >
              {option}
            </TabButton>
          ))}
        </div>
      </div>

      <div
        className={cn(
          controlTextClassName,
          "mb-2 mt-4 flex items-center justify-between gap-4 text-text-tertiary",
        )}
      >
        <span>Partner directory</span>
        <span aria-live="polite">
          {isFiltered
            ? `${visibleProfiles.length} of ${profiles.length} partners`
            : `${profiles.length} partners`}
        </span>
      </div>

      {visibleProfiles.length ? (
        <CornerGrid role="list">
          {visibleProfiles.map((profile, index) => (
            <CornerGridItem key={profile.name} index={index} role="listitem">
              <PartnerCard profile={profile} />
            </CornerGridItem>
          ))}
          {!isFiltered ? (
            <CornerGridItem index={visibleProfiles.length} role="listitem">
              <BecomePartnerCard />
            </CornerGridItem>
          ) : null}
        </CornerGrid>
      ) : (
        <div className="border border-dashed border-line-structure bg-surface-bg px-4 py-10 text-center">
          <p className="m-0 text-[13px] text-text-secondary">
            No partners match your search yet.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className={cn(
              controlTextClassName,
              "mt-2 cursor-pointer text-text-primary underline underline-offset-2",
            )}
          >
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
