"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";

import { controlTextClassName } from "@/components/ui/button";
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
  "m-0 font-analog text-[22px] font-medium leading-tight text-text-primary";

function PartnerIdentity({ profile }: { profile: PartnerProfile }) {
  const { logo } = profile;

  if (!logo) {
    return <h3 className={cn(nameClassName, "mt-2")}>{profile.name}</h3>;
  }

  if (logo.showName) {
    return (
      <div className="mt-3 flex h-8 items-center gap-2.5">
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
        className="mt-3 h-8 w-auto max-w-40 object-contain object-left brightness-0 dark:invert"
      />
      <h3 className="sr-only">{profile.name}</h3>
    </>
  );
}

function PartnerCard({ profile }: { profile: PartnerProfile }) {
  return (
    <article className="corner-box-corners relative flex h-full w-full flex-col overflow-hidden border border-line-structure bg-surface-bg">
      <span
        aria-hidden="true"
        className="bg-stripe-pattern pointer-events-none absolute right-0 top-0 h-12 w-12 opacity-70 [clip-path:polygon(0_0,100%_0,100%_100%)]"
      />
      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="pr-10">
          <p className="m-0 font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
            <span className="sr-only">Supported regions: </span>
            {profile.regions.join(", ")}
          </p>
          <PartnerIdentity profile={profile} />
        </div>

        <p className="m-0 text-[13px] leading-[1.55] text-text-secondary">
          {profile.summary}
        </p>

        <ul className="m-0 mt-auto flex list-none flex-wrap gap-1.5 p-0">
          {profile.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-line-structure bg-surface-1 px-2.5 py-1 text-[11px] leading-none text-text-secondary"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>

      <a
        href={profile.url}
        target="_blank"
        rel="noreferrer"
        className={cn(
          controlTextClassName,
          "flex items-center justify-between gap-3 border-t border-dashed border-line-structure px-4 py-3 text-text-secondary no-underline transition-colors hover:bg-[#FBFF7A]/20 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:px-5",
        )}
      >
        <span>Visit {profile.name}</span>
        <ArrowUpRight className="size-4" aria-hidden="true" />
      </a>
    </article>
  );
}

function BecomePartnerCard() {
  return (
    <a
      href="#become-delivery-ready"
      className="group flex h-full min-h-[220px] w-full flex-col justify-between border border-dashed border-line-structure bg-surface-bg p-4 no-underline transition-colors hover:bg-[#FBFF7A]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:p-5"
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-text-tertiary">
        Services firm?
      </span>
      <span>
        <span className="block font-analog text-[22px] font-medium leading-tight text-text-primary">
          Become a Langfuse partner
        </span>
        <span className="mt-2 block text-[13px] leading-[1.55] text-text-secondary">
          See the path to delivery readiness and a directory listing.
        </span>
      </span>
      <span
        className={cn(
          controlTextClassName,
          "flex items-center justify-between gap-3 text-text-secondary group-hover:text-text-primary",
        )}
      >
        <span>See the partner path</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </a>
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
        <ul className="m-0 grid list-none grid-cols-1 gap-2 bg-surface-2 p-2 @xl:grid-cols-2 @5xl:grid-cols-3">
          {visibleProfiles.map((profile) => (
            <li key={profile.name} className="flex">
              <PartnerCard profile={profile} />
            </li>
          ))}
          {!isFiltered ? (
            <li className="flex">
              <BecomePartnerCard />
            </li>
          ) : null}
        </ul>
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
