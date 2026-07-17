"use client";

import { useEffect, useRef } from "react";
import { usePostHog } from "posthog-js/react";
import { Heading } from "@/components/ui/heading";
import { TextHighlight } from "@/components/ui";
import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";
import {
  HERO_SLOGAN_VARIANT_KEY,
  type HeroSloganVariant,
} from "@/lib/hero-slogan-variant";

function readStoredVariant(): HeroSloganVariant | null {
  try {
    const stored = localStorage.getItem(HERO_SLOGAN_VARIANT_KEY);
    if (stored === "ai-engineering" || stored === "agent-evals") {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g. private browsing restrictions)
  }
  return null;
}

function persistVariant(variant: HeroSloganVariant) {
  try {
    localStorage.setItem(HERO_SLOGAN_VARIANT_KEY, variant);
  } catch {
    // ignore write failures
  }
}

const headingClassName = cn(
  "flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 text-center font-medium leading-[105%] max-md:max-w-[500px]",
  "[leading-trim:both] [text-edge:cap]",
);

const desktopWordSpacing = "max-[499px]:pr-1.75 min-[500px]:pr-2";

function AiEngineeringSlogan() {
  return (
    <>
      <TextHighlight
        highlightClassName="mix-blend-multiply"
        className="whitespace-nowrap"
      >
        Open Source<span className="inline max-[499px]:hidden">&nbsp;</span>
      </TextHighlight>
      <span className="flex flex-wrap justify-center min-[500px]:inline">
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className={desktopWordSpacing}
        >
          AI
        </TextHighlight>
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className="min-[500px]:pr-2"
        >
          Engineering
        </TextHighlight>
      </span>
      <TextHighlight highlightClassName="mix-blend-multiply">
        Platform
      </TextHighlight>
    </>
  );
}

function AgentEvalsSlogan() {
  return (
    <>
      <TextHighlight
        highlightClassName="mix-blend-multiply"
        className="whitespace-nowrap"
      >
        Open Source
      </TextHighlight>
      <span className="flex flex-wrap justify-center min-[500px]:inline">
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className={desktopWordSpacing}
        >
          Agent
        </TextHighlight>
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className={desktopWordSpacing}
        >
          Evals
        </TextHighlight>
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className={desktopWordSpacing}
        >
          and
        </TextHighlight>
        <TextHighlight highlightClassName="mix-blend-multiply">
          Tracing
        </TextHighlight>
      </span>
    </>
  );
}

function trackHeroSloganExposure(
  posthog: ReturnType<typeof usePostHog>,
  capture: ReturnType<typeof usePostHogClientCapture>,
  variant: HeroSloganVariant,
  isNewAssignment: boolean,
) {
  posthog.register({ hero_slogan_variant: variant });
  capture("hero_slogan_exposure", {
    variant,
    is_new_assignment: isNewAssignment,
  });
}

export function HeroSlogan({
  initialVariant,
}: {
  initialVariant: HeroSloganVariant;
}) {
  const posthog = usePostHog();
  const capture = usePostHogClientCapture();
  const trackedRef = useRef(false);

  useEffect(() => {
    const hadLocalStorage = readStoredVariant() !== null;
    persistVariant(initialVariant);

    if (trackedRef.current) {
      return;
    }

    const runTracking = () => {
      if (trackedRef.current) {
        return;
      }
      trackedRef.current = true;
      trackHeroSloganExposure(
        posthog,
        capture,
        initialVariant,
        !hadLocalStorage,
      );
    };

    if ((posthog as { __loaded?: boolean }).__loaded) {
      runTracking();
      return;
    }

    posthog.onSessionId(runTracking);
  }, [capture, initialVariant, posthog]);

  return (
    <Heading as="h1" size="big" className={headingClassName}>
      {initialVariant === "ai-engineering" ? (
        <AiEngineeringSlogan />
      ) : (
        <AgentEvalsSlogan />
      )}
    </Heading>
  );
}
