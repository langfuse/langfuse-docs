"use client";

import { useEffect, useId, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
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
  };
  regions: readonly string[];
  capabilities: readonly string[];
  summary: string;
};

export function PartnerProfiles({
  profiles = langfusePartnerProfiles,
}: {
  profiles?: readonly PartnerProfile[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);
  const carouselId = useId();
  const hasMultiplePartners = profiles.length > 1;
  const isPlaying = hasMultiplePartners && !isPaused && reduceMotion === false;
  const activeIndex = profiles.length ? currentIndex % profiles.length : 0;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setCurrentIndex((index) => (index + 1) % profiles.length);
      }
    }, 7000);

    return () => window.clearInterval(interval);
  }, [isPlaying, isHovered, profiles.length]);

  function showPartner(index: number) {
    setIsPaused(true);
    setCurrentIndex((index + profiles.length) % profiles.length);
  }

  if (!profiles.length) return null;

  return (
    <section
      aria-label="Approved Langfuse partners"
      aria-roledescription={hasMultiplePartners ? "carousel" : undefined}
      className="not-prose"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setIsHovered(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") setIsHovered(false);
      }}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-rotation-control]")) {
          setIsPaused(true);
        }
      }}
    >
      <div
        id={carouselId}
        className="grid"
        aria-live={isPlaying ? "off" : "polite"}
      >
        {profiles.map((profile, index) => (
          <CornerBox
            key={profile.name}
            role="group"
            aria-roledescription={hasMultiplePartners ? "slide" : undefined}
            aria-label={`${profile.name}, ${index + 1} of ${profiles.length}`}
            aria-hidden={index !== activeIndex}
            inert={index !== activeIndex}
            className={cn(
              "col-start-1 row-start-1 overflow-hidden transition-opacity duration-300 motion-reduce:transition-none",
              index === activeIndex
                ? "visible opacity-100"
                : "invisible opacity-0",
            )}
          >
            <div className="flex flex-col gap-5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  {profile.logo ? (
                    <Image
                      src={profile.logo.src}
                      alt={profile.logo.alt}
                      width={profile.logo.width}
                      height={profile.logo.height}
                      className="h-12 w-auto max-w-32 object-contain"
                    />
                  ) : null}
                  <div>
                    <p className="m-0 font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      <span className="sr-only">Supported regions: </span>
                      {profile.regions.join(", ")}
                    </p>
                    <h3 className="m-0 mt-1 text-xl font-medium text-text-primary">
                      {profile.name}
                    </h3>
                  </div>
                </div>
                <Link
                  href={profile.url}
                  variant="text"
                  className="inline-flex w-fit items-center gap-1.5 text-sm"
                >
                  Visit {profile.name}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <p className="m-0 max-w-3xl text-sm leading-6 text-text-secondary">
                {profile.summary}
              </p>

              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {profile.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-line-structure bg-surface-bg px-3 py-1.5 text-xs text-text-secondary"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </CornerBox>
        ))}
      </div>
      {hasMultiplePartners ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {profiles.map((profile, index) => (
              <button
                key={profile.name}
                type="button"
                aria-label={`Show ${profile.name}`}
                aria-controls={carouselId}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => showPartner(index)}
                className="flex size-10 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "size-2 rounded-full",
                    index === activeIndex
                      ? "bg-text-primary"
                      : "bg-text-tertiary",
                  )}
                />
              </button>
            ))}
            <span className="ml-2 font-mono text-xs text-text-tertiary">
              {activeIndex + 1} / {profiles.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {!reduceMotion ? (
              <Button
                type="button"
                variant="secondary"
                size="default"
                aria-label={
                  isPaused ? "Start partner rotation" : "Pause partner rotation"
                }
                aria-controls={carouselId}
                data-rotation-control
                onClick={() => setIsPaused(!isPaused)}
                icon={
                  isPaused ? (
                    <Play className="size-4" aria-hidden="true" />
                  ) : (
                    <Pause className="size-4" aria-hidden="true" />
                  )
                }
              />
            ) : null}
            <Button
              type="button"
              variant="secondary"
              size="default"
              aria-label="Previous partner"
              aria-controls={carouselId}
              onClick={() => showPartner(activeIndex - 1)}
              icon={<ArrowLeft className="size-4" aria-hidden="true" />}
            />
            <Button
              type="button"
              variant="secondary"
              size="default"
              aria-label="Next partner"
              aria-controls={carouselId}
              onClick={() => showPartner(activeIndex + 1)}
              icon={<ArrowRight className="size-4" aria-hidden="true" />}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
