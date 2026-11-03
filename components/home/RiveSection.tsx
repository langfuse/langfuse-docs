"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { Button, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import RiveMock from "@/components/home/img/rive-mock.png";
import { MD_MIN_WIDTH_QUERY, useMinWidth } from "@/lib/use-min-width";

const RiveAnimation = dynamic(
  () => import("@/components/rive/RiveAnimation").then((m) => m.RiveAnimation),
  { ssr: false },
);

const RIVE_FILE = "/animations/langfuse_axonometric.riv";
const RIVE_IN_VIEW_THRESHOLD = 0.45;
const RIVE_IN_VIEW_ACTIVATION_DELAY_MS = 250;

/**
 * View Model boolean path for the load trigger (`VmMainScene` is the VM in the editor, not a state machine).
 * If the animation does not run, try `"isLoad"` if the property sits on the default instance root.
 */
const RIVE_LOAD_VIEW_MODEL_PATH = "isLoad";

export const RiveSection = () => {
  const isMd = useMinWidth(MD_MIN_WIDTH_QUERY);
  const [riveSectionInView, setRiveSectionInView] = useState(false);
  const riveViewportRef = useRef<HTMLDivElement>(null);
  const inViewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = riveViewportRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (inViewTimerRef.current) clearTimeout(inViewTimerRef.current);
          inViewTimerRef.current = setTimeout(() => {
            setRiveSectionInView(true);
            inViewTimerRef.current = null;
          }, RIVE_IN_VIEW_ACTIVATION_DELAY_MS);
          return;
        }
        if (inViewTimerRef.current) {
          clearTimeout(inViewTimerRef.current);
          inViewTimerRef.current = null;
        }
        setRiveSectionInView(false);
      },
      { threshold: RIVE_IN_VIEW_THRESHOLD, rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (inViewTimerRef.current) clearTimeout(inViewTimerRef.current);
    };
  }, []);

  const loadViewModelBooleans = useMemo(
    () => ({ [RIVE_LOAD_VIEW_MODEL_PATH]: riveSectionInView }),
    [riveSectionInView],
  );

  return (
    <HomeSection id="llm-engineering-loop" className="pt-[120px]">
      <div className="relative z-10 flex flex-col gap-4 items-start">
        <Heading className="text-left">
          <TextHighlight className="whitespace-nowrap">
            Learn how&nbsp;
          </TextHighlight>
          <TextHighlight className="whitespace-nowrap">
            the best teams
          </TextHighlight>{" "}
          build with AI.
        </Heading>
        <Text className="text-left max-w-[64ch]">
          Langfuse is the platform. The Langfuse Academy is how you, and your
          agents, learn what to do with it: the AI engineering loop of tracing,
          monitoring, datasets, experiments, and evals, with worked examples
          from real applications. Free, open, and readable as Markdown for
          coding agents.
        </Text>
        <Button
          variant="secondary"
          size="default"
          href="/academy"
          wrapperClassName="mt-2"
        >
          Explore the Academy
        </Button>
      </div>

      {/* Mobile: static image + tabs (below lg) */}
      <div className="flex flex-col -mt-20 pointer-events-none md:hidden -z-1">
        <div className="overflow-hidden relative w-full aspect-4/3">
          <Image
            src={RiveMock}
            alt="Langfuse platform overview"
            fill
            className="object-cover object-center -translate-y-4"
            sizes="(max-width: 768px) 100vw, 800px"
            quality={100}
          />
        </div>
      </div>

      {/* Desktop slot stays in the layout (CSS-hidden on small viewports) so
          SSR/desktop height does not shift. RiveAnimation mounts only at md+
          so phones never fetch rive.wasm. */}
      <div className="hidden md:block">
        <div ref={riveViewportRef} className="p-4 -mt-px h-[500px]">
          {isMd ? (
            <RiveAnimation
              src={RIVE_FILE}
              stateMachine="Langfuse_SM"
              fit="cover"
              zoom={1.4}
              className="w-full h-full -translate-x-4 -translate-y-6"
              viewModelBooleanInputs={loadViewModelBooleans}
            />
          ) : null}
        </div>
      </div>
    </HomeSection>
  );
};
