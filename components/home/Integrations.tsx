"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { forwardRef, useRef, type ReactNode } from "react";
import { Code, MoreHorizontal } from "lucide-react";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { SiOpenai, SiPython, SiTypescript } from "react-icons/si";
import LlamaindexIcon from "./img/llamaindex_icon.png";
import Image from "next/image";

const Circle = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    title?: string;
    children?: ReactNode;
  }
>(({ className, children, title }, ref) => {
  return (
    <div className={cn("z-10 flex flex-row items-center gap-4", className)}>
      {title && (
        <span className="w-[4.4rem] md:w-20 text-right text-sm md:text-base">
          {title}
        </span>
      )}
      <div
        ref={ref}
        className="flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-200 text-black"
      >
        {children}
      </div>
    </div>
  );
});

export default function Integrations() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inPythonRef = useRef<HTMLDivElement>(null);
  const inTypescriptRef = useRef<HTMLDivElement>(null);
  const inOpenAiRef = useRef<HTMLDivElement>(null);
  const inLangchainRef = useRef<HTMLDivElement>(null);
  const inApiRef = useRef<HTMLDivElement>(null);
  const inLlamaindexRef = useRef<HTMLDivElement>(null);
  const inMoreRef = useRef<HTMLDivElement>(null);

  const langfuseNodeRef = useRef<HTMLDivElement>(null);
  const out1ref = useRef<HTMLDivElement>(null);
  const out2ref = useRef<HTMLDivElement>(null);
  const out3ref = useRef<HTMLDivElement>(null);

  return (
    <HomeSection>
      <Header
        title="Works with any LLM app and model"
        description="SDKs for Python & JS/TS and native integrations for popular libraries. Missing an integration? Let us know!"
        button={{
          href: "/docs/integrations/overview",
          text: "Integration docs",
        }}
      />
      <div
        className="relative flex w-full mx-auto max-w-3xl items-center justify-center overflow-hidden rounded border bg-background py-4 px-2 md:p-12"
        ref={containerRef}
      >
        <div className="flex h-full w-full flex-col items-stretch justify-between gap-2 md:gap-6">
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inPythonRef} title="Python SDK">
              <SiPython className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inTypescriptRef} title="JS/TS SDK">
              <SiTypescript className="h-6 w-6" />
            </Circle>
            <Circle ref={out1ref} className="hidden">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inOpenAiRef} title="OpenAI SDK">
              <SiOpenai className="h-6 w-6" />
            </Circle>
            <Circle ref={out2ref} className="hidden">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inLangchainRef} title="Langchain">
              <span>🦜&nbsp;🔗</span>
            </Circle>
            <Circle ref={langfuseNodeRef} className="h-16 w-16">
              <span className="text-3xl">🪢</span>
            </Circle>
            <Circle ref={out3ref} className="hidden">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inLlamaindexRef} title="Llama-Index">
              <Image
                src={LlamaindexIcon}
                alt="Llama-index"
                width={40}
                height={40}
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inApiRef} title="API">
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle ref={inMoreRef} title="Litellm, Flowise, Langflow">
              <MoreHorizontal className="h-5 w-5" />
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
          fromRef={inLlamaindexRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inMoreRef}
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
