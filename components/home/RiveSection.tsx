"use client";

import { useState, useRef, useCallback, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import RiveMock from "@/components/home/img/rive-mock.png";
import { cn } from "@/lib/utils";

const RiveAnimation = dynamic(
  () => import("@/components/rive/RiveAnimation").then((m) => m.RiveAnimation),
  { ssr: false }
);

const RIVE_FILE = "/animations/langfuse_axonometric.riv";

type RiveLabel = {
  heading: string;
  body: string;
};

const OVERVIEW: RiveLabel = {
  heading: "Langfuse covering the whole loop",
  body: "General note about how Langfuse help you build LLM apps across the whole production cycle from development to production.",
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

const MOBILE_TABS: Array<{ key: string; label: string } & RiveLabel> = [
  { key: "overview", label: "Overview", ...OVERVIEW },
  ...Object.entries(LABELS).map(([key, val]) => ({
    key,
    label: val.heading,
    ...val,
  })),
];

const noopSubscribe = () => () => { };

/** Radix Tabs uses React useId(); defer mounting until after hydration to avoid SSR/client ID drift. */
function useTabsClientMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Same chrome as Radix tabs, default “Overview” — no useId, matches server + first client paint. */
function MobileTabsShell() {
  return (
    <CornerBox className="-mt-px">
      <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="flex px-4 min-w-max border-b border-line-structure"
          role="tablist"
          aria-label="Product areas"
        >
          {MOBILE_TABS.map((tab) => (
            <span
              key={tab.key}
              className={cn(
                "shrink-0 px-3 py-3 text-sm whitespace-nowrap",
                tab.key === "overview"
                  ? "border-b-[1.5px] border-text-primary -mb-px font-bold text-text-primary"
                  : "text-text-tertiary"
              )}
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>
      <div className="rive-text-enter flex flex-col gap-1.5 p-4 min-h-[72px] justify-center">
        <Text className="font-medium text-left text-text-primary">{OVERVIEW.heading}</Text>
        <Text size="s" className="text-left max-w-[74ch]">
          {OVERVIEW.body}
        </Text>
      </div>
    </CornerBox>
  );
}

export const RiveSection = () => {
  const [label, setLabel] = useState<RiveLabel>(OVERVIEW);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastRevTimeRef = useRef<number>(0);
  const logTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStateChange = useCallback((states: string[]) => {
    if (logTimerRef.current) clearTimeout(logTimerRef.current);
    logTimerRef.current = setTimeout(() => console.log("[Rive]", states), 0);

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

  const mobileTabsMounted = useTabsClientMounted();

  return (
    <HomeSection id="llm-engineering-loop" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start">
        <Heading>
          <TextHighlight>Launch,</TextHighlight><TextHighlight className="pl-1.5">observe,</TextHighlight><TextHighlight className="min-[393px]:pl-1.5">improve</TextHighlight> — repeat.
        </Heading>
        <Text className="text-left max-w-[64ch]">
          Langfuse helps you ship AI Agents/Products from prototype to production and beyond. Once in production we power your continous improvement loop using production data to make your agents and LLM applications ever more powerful.
        </Text>
      </div>

      {/* Mobile: static image + tabs (below lg) */}
      <div className="flex flex-col -mt-px lg:hidden">
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

        {mobileTabsMounted ? (
          <TabsPrimitive.Root defaultValue="overview" className="flex flex-col">
            <CornerBox className="-mt-px">
              <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <TabsPrimitive.List className="flex px-4 min-w-max border-b border-line-structure">
                  {MOBILE_TABS.map((tab) => (
                    <TabsPrimitive.Trigger
                      key={tab.key}
                      value={tab.key}
                      className={cn(
                        "shrink-0 px-3 py-3 text-sm text-text-tertiary whitespace-nowrap cursor-pointer",
                        "border-b-[1.5px] border-transparent -mb-px",
                        "data-[state=active]:font-[580] data-[state=active]:text-text-primary data-[state=active]:border-text-primary",
                        "transition-colors duration-150 outline-none"
                      )}
                    >
                      {tab.label}
                    </TabsPrimitive.Trigger>
                  ))}
                </TabsPrimitive.List>
              </div>

              {MOBILE_TABS.map((tab) => (
                <TabsPrimitive.Content key={tab.key} value={tab.key}>
                  <div className="rive-text-enter flex flex-col gap-1.5 p-4 min-h-[72px] justify-center">
                    <Text className="font-medium text-left text-text-primary">
                      {tab.heading}
                    </Text>
                    <Text size="s" className="text-left max-w-[74ch]">
                      {tab.body}
                    </Text>
                  </div>
                </TabsPrimitive.Content>
              ))}
            </CornerBox>
          </TabsPrimitive.Root>
        ) : (
          <MobileTabsShell />
        )}
      </div>

      {/* Desktop: Rive animation + dynamic label (lg and above) */}
      <div className="hidden lg:block">
        <div
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
          />
        </div>
        <CornerBox className="p-2 sm:p-4 -mt-px min-h-[110px] bg-transparent flex flex-col justify-start">
          <div key={label.heading} className="rive-text-enter flex flex-col gap-1.5">
            <Text className="font-medium text-left text-text-primary">
              {label.heading}
            </Text>
            <Text size="s" className="text-left max-w-[60ch]">{label.body}</Text>
          </div>
        </CornerBox>
      </div>
    </HomeSection>
  );
};
