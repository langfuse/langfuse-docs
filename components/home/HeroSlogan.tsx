"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Heading } from "@/components/ui/heading";
import { TextHighlight } from "@/components/ui";
import { cn } from "@/lib/utils";
import { usePostHogClientCapture } from "@/src/usePostHogClientCapture";

const STORAGE_KEY = "langfuse-hero-slogan-variant";

type HeroSloganVariant = "ai-engineering" | "agent-evals";

function pickVariant(): HeroSloganVariant {
  return Math.random() < 0.5 ? "ai-engineering" : "agent-evals";
}

function readStoredVariant(): HeroSloganVariant | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, variant);
  } catch {
    // ignore write failures
  }
}

const headingClassName = cn(
  "flex-col items-center gap-0.5 sm:gap-1 md:gap-1.5 text-center font-medium leading-[105%] max-md:max-w-[500px]",
  "[leading-trim:both] [text-edge:cap]",
);

function AiEngineeringSlogan() {
  return (
    <>
      <TextHighlight
        highlightClassName="mix-blend-multiply"
        className="whitespace-nowrap"
      >
        Open Source<span className="inline max-[499px]:hidden">&nbsp;</span>
      </TextHighlight>
      <span className="flex min-[500px]:inline">
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className="max-[499px]:pr-1.75"
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
        Open Source<span className="inline max-[499px]:hidden">&nbsp;</span>
      </TextHighlight>
      <span className="flex min-[500px]:inline">
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className="max-[499px]:pr-1.75"
        >
          Agent
        </TextHighlight>
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className="max-[499px]:pr-1.75"
        >
          Evals
        </TextHighlight>
        <TextHighlight
          highlightClassName="mix-blend-multiply"
          className="max-[499px]:pr-1.75"
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

export function HeroSlogan() {
  const posthog = usePostHog();
  const capture = usePostHogClientCapture();
  const [variant, setVariant] = useState<HeroSloganVariant>("ai-engineering");

  useEffect(() => {
    const stored = readStoredVariant();
    const nextVariant = stored ?? pickVariant();
    const isNewAssignment = !stored;

    if (!stored) {
      persistVariant(nextVariant);
    }

    setVariant(nextVariant);

    posthog.register({ hero_slogan_variant: nextVariant });
    capture("hero_slogan_exposure", {
      variant: nextVariant,
      is_new_assignment: isNewAssignment,
    });
    // Track once when the hero mounts on the homepage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Heading as="h1" size="big" className={headingClassName}>
      {variant === "ai-engineering" ? (
        <AiEngineeringSlogan />
      ) : (
        <AgentEvalsSlogan />
      )}
    </Heading>
  );
}
