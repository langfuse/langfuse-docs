"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import RiveMock from "@/components/home/img/rive-mock.png";

const RiveAnimation = dynamic(
  () => import("@/components/rive/RiveAnimation").then((m) => m.RiveAnimation),
  { ssr: false }
);

const RIVE_FILE = "/animations/langfuse_axonometric.riv";
const RIVE_IN_VIEW_THRESHOLD = 0.45;
const RIVE_IN_VIEW_ACTIVATION_DELAY_MS = 250;

/**
 * View Model boolean path for the load trigger (`VmMainScene` is the VM in the editor, not a state machine).
 * If the animation does not run, try `"isLoad"` if the property sits on the default instance root.
 */
const RIVE_LOAD_VIEW_MODEL_PATH = "isLoad";

type RiveLabel = {
  heading: string;
  body: string;
};

const OVERVIEW: RiveLabel = {
  heading: "The full LLM engineering loop",
  body: "Langfuse brings observability, prompts, evals, experiments, and human annotation into one connected workflow — so you can move from prototype to production and keep improving with real usage data. Hover any part of the diagram to learn more.",
};

const LABELS: Record<string, RiveLabel> = {
  "obs-active": {
    heading: "Observability",
    body: "Use Observability to gain deep understanding of what happens under the hood of your application and inside the LLMs you are using. It helps you during development and when debugging in production.",
  },
  "prompts-active": {
    heading: "Prompts",
    body: "Prompt Management lets you separate prompts from code logic. This makes it much faster to build and iterate in your development process. It also allows Product Managers, domain experts, and QA to participate in writing prompts.",
  },
  "evals-active": {
    heading: "Evals",
    body: "Evals are a set of tools to monitor your application quality during development and production. Use LLM-as-a-Judge or fully custom setups via the API and SDKs to score the behavior of your application.",
  },
  "playground-active": {
    heading: "Playground",
    body: "The Playground is useful during development and in production. In development you can quickly try out different prompts and models side by side. In production it is handy to replay detailed logs of specific traces to better understand why an error occurred.",
  },
  "human-active": {
    heading: "Human Annotation",
    body: "Human Annotation workflows can be used in development or production to manually score the behavior and outputs of your application and learn how users use your service. They help you build collaborative workflows across teams.",
  },
  "exp-active": {
    heading: "Experiments",
    body: "Use Experiments during development to remove the guesswork from changes. They help you quickly test different prompt versions, models, or code variations and compare them against each other.",
  },
  "metrics-active": {
    heading: "Cost & Latency",
    body: "Cost and Latency help you monitor your application in production. Customize dashboards aggregating data from across Langfuse. Understand how cost, usage, quality, and other metrics perform over time.",
  },
};

export const RiveSection = () => {
  const [label, setLabel] = useState<RiveLabel>(OVERVIEW);
  const [riveSectionInView, setRiveSectionInView] = useState(false);
  const riveViewportRef = useRef<HTMLDivElement>(null);
  const inViewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRevTimeRef = useRef<number>(0);

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
      { threshold: RIVE_IN_VIEW_THRESHOLD, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (inViewTimerRef.current) clearTimeout(inViewTimerRef.current);
    };
  }, []);

  const loadViewModelBooleans = useMemo(
    () => ({ [RIVE_LOAD_VIEW_MODEL_PATH]: riveSectionInView }),
    [riveSectionInView]
  );

  const handleStateChange = useCallback((states: string[]) => {
    if (states.some((s) => s.includes("-rev"))) {
      lastRevTimeRef.current = Date.now();
      return;
    }

    if (Date.now() - lastRevTimeRef.current < 250) return;

    const match = states.find((s) => s in LABELS);
    if (!match) return;

    setLabel(LABELS[match]);
  }, []);

  const handlePointerLeave = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      setLabel(OVERVIEW);
      resetTimerRef.current = null;
    }, 150);
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  return (
    <HomeSection id="llm-engineering-loop" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start">
        <Heading>
          <TextHighlight className="whitespace-nowrap">Launch,&nbsp;</TextHighlight><TextHighlight className="whitespace-nowrap">observe,&nbsp;</TextHighlight><TextHighlight className="whitespace-nowrap">improve</TextHighlight> — repeat.
        </Heading>
        <Text className="text-left max-w-[64ch]">
          Langfuse helps you ship AI Agents/Products from prototype to production and beyond. Once in production we power your continous improvement loop using production data to make your agents and LLM applications ever more powerful.
        </Text>
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
            priority
          />
        </div>
      </div>

      {/* Desktop: Rive animation + dynamic label (lg and above) */}
      <div className="hidden md:block">
        <div
          ref={riveViewportRef}
          className="p-4 -mt-px h-[500px]"
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          <RiveAnimation
            src={RIVE_FILE}
            stateMachine="Langfuse_SM"
            fit="cover"
            zoom={1.4}
            className="w-full h-full -translate-x-4 -translate-y-6"
            onStateChange={handleStateChange}
            viewModelBooleanInputs={loadViewModelBooleans}
          />
        </div>
        <CornerBox className="flex min-h-[120px] w-full flex-col justify-start bg-surface-bg p-2 sm:p-4 -mt-px">
          <div
            key={label.heading}
            className="rive-text-enter flex w-full flex-col gap-1.5"
          >
            <Text className="font-medium text-left text-text-primary">
              {label.heading}
            </Text>
            <Text size="s" className="w-full max-w-none text-left">
              {label.body}
            </Text>
          </div>
        </CornerBox>
      </div>
    </HomeSection>
  );
};
