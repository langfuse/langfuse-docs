"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { forwardRef, useRef, type ReactNode } from "react";
import { ArrowUpRightFromSquare, Code, MoreHorizontal } from "lucide-react";
import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import LlamaindexIcon from "./img/llamaindex_icon.png";
import LangfuseIcon from "@/public/icon.svg";
import LangchainIcon from "./img/langchain_icon.png";
import HaystackIcon from "./img/haystack_icon.png";
import LitellmIcon from "./img/litellm_icon.png";
import Image from "next/image";
import Link from "next/link";
import IconPython from "../icons/python";
import IconTypescript from "../icons/typescript";
import IconOpenai from "../icons/openai";

const Circle = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    title?: string;
    href?: string;
    children?: ReactNode;
  }
>(({ className, children, title, href }, ref) => {
  // Conditionally render as next/Link if href is provided
  const Component = href ? Link : "div";

  return (
    <Component
      className={cn(
        "z-10 flex flex-row items-center gap-4 group",
        href ? "cursor-pointer" : "cursor-default",
        className
      )}
      title={"Langfuse " + title + " documentation"}
      href={href}
    >
      {title && (
        <span
          className={cn(
            "w-[4.4rem] md:w-36 text-right text-sm md:text-base",
            title.length > 20 && "text-xs md:text-xs"
          )}
        >
          {title}
        </span>
      )}
      <div
        ref={ref}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full border-2 bg-white dark:bg-slate-200 text-black",
          href && "group-hover:bg-slate-200"
        )}
      >
        {href && (
          <ArrowUpRightFromSquare
            className="hidden group-hover:block"
            size={18}
          />
        )}
        <span className={cn(href && "group-hover:hidden")}>{children}</span>
      </div>
    </Component>
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
  const inLitellmRef = useRef<HTMLDivElement>(null);
  const inHaystackRef = useRef<HTMLDivElement>(null);
  const inMoreRef = useRef<HTMLDivElement>(null);

  const langfuseNodeRef = useRef<HTMLDivElement>(null);

  return (
    <HomeSection>
      <Header
        title="Works with any LLM app and model"
        description="SDKs for Python & JS/TS and native integrations for popular libraries. Missing an integration? Let us know!"
        buttons={[
          {
            href: "/docs/integrations/overview",
            text: "Integration docs",
          },
        ]}
      />
      <div
        className="relative flex w-full mx-auto max-w-3xl items-center justify-center overflow-hidden rounded border bg-background py-4 px-2 md:p-12"
        ref={containerRef}
      >
        <div className="flex h-full w-full flex-col items-stretch justify-between gap-2 md:gap-4">
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inPythonRef}
              title="Python SDK"
              href="/docs/sdk/python"
            >
              <IconPython className="h-9 w-9" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inTypescriptRef}
              title="JS/TS SDK"
              href="/docs/sdk/typescript/guide"
            >
              <IconTypescript className="h-7 w-7" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inOpenAiRef}
              title="OpenAI SDK"
              href="/docs/integrations/openai/get-started"
            >
              <IconOpenai className="h-7 w-7" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inLangchainRef}
              title="Langchain"
              href="/docs/integrations/langchain/tracing"
            >
              <Image
                src={LangchainIcon}
                alt="Langchain Icon"
                width={40}
                height={40}
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inLlamaindexRef}
              title="Llama-Index"
              href="/docs/integrations/llama-index/get-started"
            >
              <Image
                src={LlamaindexIcon}
                alt="Llama-index Icon"
                width={35}
                height={35}
              />
            </Circle>
            <Circle ref={langfuseNodeRef} className="h-16 w-16">
              <Image
                src={LangfuseIcon}
                alt="Langfuse Icon"
                width={28}
                height={28}
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inLitellmRef}
              title="LiteLLM (proxy)"
              href="/docs/integrations/litellm"
            >
              <Image
                src={LitellmIcon}
                alt="Langchain Icon"
                width={40}
                height={40}
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inHaystackRef}
              title="Haystack"
              href="/docs/integrations/haystack"
            >
              <Image
                src={HaystackIcon}
                alt="Langchain Icon"
                width={28}
                height={28}
              />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inApiRef}
              title="API"
              href="https://api.reference.langfuse.com/"
            >
              <Code className="h-6 w-6" />
            </Circle>
          </div>
          <div className="flex flex-row items-center justify-between">
            <Circle
              ref={inMoreRef}
              title="Dify, Flowise, Langflow, Instructor, Vercel AI SDK, Mirascope, Superagent, ..."
              href="/docs/integrations/overview"
            >
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
          fromRef={inLitellmRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inHaystackRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={inMoreRef}
          toRef={langfuseNodeRef}
          duration={3}
        />
      </div>
    </HomeSection>
  );
}
