"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { forwardRef, useRef, type ReactNode } from "react";
import { Code } from "lucide-react";
import { HomeSection } from "./components/HomeSection";
import HomeSubHeader from "./components/HomeSubHeader";
import { SiOpenai, SiPython, SiTypescript } from "react-icons/si";

const Circle = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    titleLeft?: string;
    titleRight?: string;
    children?: ReactNode;
  }
>(({ className, children, titleLeft }, ref) => {
  return (
    <div className={cn("z-10 flex flex-row items-center gap-4", className)}>
      {titleLeft && (
        <span className="w-[4.4rem] md:w-20 text-right text-sm md:text-base">
          {titleLeft}
        </span>
      )}
      <div
        ref={ref}
        className="flex h-16 w-16 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-200 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] text-black"
      >
        {children}
      </div>
    </div>
  );
});

export function Integrations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inPythonRef = useRef<HTMLDivElement>(null);
  const inTypescriptRef = useRef<HTMLDivElement>(null);
  const inOpenAiRef = useRef<HTMLDivElement>(null);
  const inLangchainRef = useRef<HTMLDivElement>(null);
  const inApiRef = useRef<HTMLDivElement>(null);
  const langfuseNodeRef = useRef<HTMLDivElement>(null);
  const out1ref = useRef<HTMLDivElement>(null);
  const out2ref = useRef<HTMLDivElement>(null);
  const out3ref = useRef<HTMLDivElement>(null);

  return (
    <HomeSection>
      <HomeSubHeader
        title="Works with any LLM app"
        description="Typed SDKs for Python & JS/TS. Native integrations for popular frameworks and libraries such as OpenAI and Langchain. Missing an integration? Let us know!"
        button={{
          href: "/docs/integrations/overview",
          text: "Integration docs",
        }}
      />
      <div
        className="relative flex w-full mx-auto max-w-3xl items-center justify-center overflow-hidden rounded border bg-background p-8 md:p-12"
        ref={containerRef}
      >
        <div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inPythonRef} titleLeft="Python SDK">
              <SiPython className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inTypescriptRef} titleLeft="Typescript SDK">
              <SiTypescript className="h-6 w-6" />
            </Circle>
            <Circle ref={out1ref} className="hidden">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inOpenAiRef} titleLeft="OpenAI SDK">
              <SiOpenai className="h-6 w-6" />
            </Circle>
            <Circle ref={langfuseNodeRef} className="h-16 w-16">
              <span className="text-3xl">🪢</span>
            </Circle>
            <Circle ref={out2ref} className="hidden">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inLangchainRef} titleLeft="Langchain">
              <span>🦜&nbsp;🔗</span>
            </Circle>
            <Circle ref={out3ref} className="hidden">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inApiRef} titleLeft="API">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
        </div>

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inPythonRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inTypescriptRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inLangchainRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inOpenAiRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inApiRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={out1ref}
          toRef={langfuseNodeRef}
          className="hidden"
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={out2ref}
          toRef={langfuseNodeRef}
          className="hidden"
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={out3ref}
          toRef={langfuseNodeRef}
          className="hidden"
          duration={3}
        />
      </div>
    </HomeSection>
  );
}
