"use client";

import { useState, useRef, useEffect, useMemo, type ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { Button, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import RiveMock from "@/components/home/img/rive-mock.png";
import { MD_MIN_WIDTH_QUERY, useMinWidth } from "@/lib/use-min-width";
import { TabButton } from "@/components/ui/tab-button";
import { NestedLoopsVisual } from "@/components/home/academy-loop/NestedLoopsVisual";
import { AcademyRowVisual } from "@/components/home/academy-loop/AcademyRowVisual";
import { InfinityLoopVisual } from "@/components/home/academy-loop/InfinityLoopVisual";

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

      <LoopVisualSwitcher />
    </HomeSection>
  );
};

const RiveLoopVisual = () => {
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
    <>
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
    </>
  );
};

// Temporary review switcher: flip between loop visuals before picking one.
// Deep link a variant with `?loop=current|1|2|3`.
const LOOP_VISUALS: { id: string; label: string; render: () => ReactNode }[] = [
  { id: "1", label: "Inner & outer loop", render: () => <NestedLoopsVisual /> },
  { id: "2", label: "Academy loop", render: () => <AcademyRowVisual /> },
  { id: "3", label: "Figure eight", render: () => <InfinityLoopVisual /> },
  { id: "current", label: "Current", render: () => <RiveLoopVisual /> },
];

function LoopVisualSwitcher() {
  const [selected, setSelected] = useState(LOOP_VISUALS[0].id);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("loop");
    if (fromUrl && LOOP_VISUALS.some((v) => v.id === fromUrl)) {
      setSelected(fromUrl);
    }
  }, []);

  const select = (id: string) => {
    setSelected(id);
    const url = new URL(window.location.href);
    url.searchParams.set("loop", id);
    window.history.replaceState(null, "", url);
  };

  const visual = LOOP_VISUALS.find((v) => v.id === selected) ?? LOOP_VISUALS[0];
  const isRive = visual.id === "current";

  return (
    <>
      <div
        role="tablist"
        aria-label="Loop visual options"
        className="relative z-10 mt-8 flex flex-wrap items-center gap-x-1 gap-y-0 border border-dashed border-line-divider-dash px-1"
      >
        <span className="px-2 font-mono text-[10px] text-text-tertiary">
          review
        </span>
        {LOOP_VISUALS.map((v, i) => (
          <TabButton
            key={v.id}
            role="tab"
            aria-selected={v.id === selected}
            active={v.id === selected}
            onClick={() => select(v.id)}
            wrapperClassName="w-auto"
          >
            {v.id === "current" ? v.label : `${i + 1}. ${v.label}`}
          </TabButton>
        ))}
      </div>
      <div className={isRive ? "" : "mt-10"}>{visual.render()}</div>
    </>
  );
}
