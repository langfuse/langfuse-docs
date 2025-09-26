import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import { cn } from "@/lib/utils";
import { ExternalLink, BookOpen, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { TabContentProps } from "./types";

const languages = ["python", "js"];

export const TabContent = ({ feature, isActive }: TabContentProps) => {
  const [activeLanguage, setActiveLanguage] = useState<string>("python");

  const activeCodeSnippet = useMemo(() => {
    // TODO: Replace the language with the active language
    return feature.code.snippet
  }, [feature.code.snippet, activeLanguage]);


  if (!isActive) {
    return null;
  }

  return (
    <>
        {/* Row A: Value text + Docs/Video links */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-6 pt-6 pb-6 min-h-32">
          {/* Value paragraph */}
          <div className="lg:col-span-8">
            <p className="text-lg leading-relaxed font-bold">{feature.title}</p>
            <p className="text-md leading-relaxed text-muted-foreground">
              {feature.body}
            </p>
          </div>

          {/* Links card */}
          <div className="lg:col-span-4">
            <div className=" space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link href={feature.docsHref}>
                  <BookOpen size={16} />
                  Documentation
                  <ExternalLink size={14} className="ml-auto" />
                </Link>
              </Button>

              {feature.videoHref && (
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href={feature.videoHref}>
                    <Play size={16} />
                    Watch Demo
                    <ExternalLink size={14} className="ml-auto" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Row B: Code block + Product screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-hidden border-t border-solid">
          {/* Code block */}
          <div className="lg:col-span-6 order-2 lg:order-1 aspect-[3/2] flex flex-col border-r border-solid">
            <div className="relative bg-background flex-shrink-0">
              <div className="flex flex-row items-center overflow-x-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 pt-1">
                <div
                  className={cn([
                    "text-xs border-b border-transparent p-2  cursor-pointer",
                    activeLanguage == "python"
                      ? "border-foreground"
                      : "border-transparent",
                  ])}
                  onClick={() => setActiveLanguage("python")}
                >
                  Python SDK
                </div>
                <div
                  className={cn([
                    "text-xs border-b border-transparent p-2  cursor-pointer",
                    activeLanguage == "js"
                      ? "border-foreground"
                      : "border-transparent",
                  ])}
                  onClick={() => setActiveLanguage("js")}
                >
                  JS/TS SDK
                </div>
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-auto ">
              <CodeBlock
                code={activeCodeSnippet}
                language={feature.code.language}
                className="relative overflow-scroll rounded-none border-none h-full [&_pre]:!overflow-auto [&_pre]:!height-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-min-content"
                customStyle={{
                  fontSize: "0.725rem",
                  borderRadius: "0",
                  height: "auto",
                  width: "fit-content",
                  maxWidth: "unset`",
                }}
              ></CodeBlock>
            </div>
          </div>

          {/* Product screenshot */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative w-full aspect-[3/2]">
              {/* Light theme image */}
              <Image
                src={feature.image.light}
                alt={feature.image.alt}
                fill
                className="object-cover object-left-top dark:hidden"
                sizes="(min-width: 1024px) 33vw, 100vw"
                priority={isActive}
              />

              {/* Dark theme image */}
              <Image
                src={feature.image.dark}
                alt={feature.image.alt}
                fill
                className="object-cover object-left-top hidden dark:block"
                sizes="(min-width: 1024px) 33vw, 100vw"
                priority={isActive}
              />
            </div>
          </div>
        </div>
       {/* </CardContent>
     </Card> */}
    </>
  );
};