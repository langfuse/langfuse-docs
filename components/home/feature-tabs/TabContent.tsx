import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { CodeBlock,  } from "@/components/ai-elements/code-block";
import { cn } from "@/lib/utils";
import { ExternalLink, BookOpen, Play, Code2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { FeatureTabData } from "./types";

export interface TabContentProps {
  feature: FeatureTabData;
  isActive: boolean;
  className?: string;
}

export const TabContent = ({ feature, isActive, className }: TabContentProps) => {
  const [activeLanguage, setActiveLanguage] = useState<"python" | "javascript">("python");

  const activeCodeSnippet = useMemo(() => {
    if (!feature.code?.snippets) return "";
    return feature.code.snippets[activeLanguage] || "";
  }, [feature.code?.snippets, activeLanguage]);

  const availableLanguages = useMemo(() => {
    if (!feature.code?.snippets) return [];
    return Object.keys(feature.code.snippets) as ("python" | "javascript")[];
  }, [feature.code?.snippets]);


  if (!isActive) {
    return null;
  }

  return (
    <>
      {/* Row A: Value text + Docs/Video links */}
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-6 pt-6 pb-6 lg:h-36 lg:overflow-y-hidden",
          className
        )}
      >
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
            <Button asChild variant="outline" className="w-full justify-start">
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

      {/* Row B: Code block OR Statements + Product screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-hidden border-t border-solid">
        {/* Code block or Statements */}
        <div className="lg:col-span-6 order-2 lg:order-1 aspect-[6/5] flex flex-col border-r border-solid">
          {feature.code ? (
            // Code block section
            <>
              <div className="relative bg-background flex-shrink-0 w-full min-w-full max-w-full justify-between flex flex-row items-center overflow-x-scroll ">
                <div className="flex flex-row items-center px-2 pt-1">
                  {availableLanguages.map((lang) => (
                    <div
                      key={lang}
                      className={cn([
                        "text-xs border-b border-transparent p-2 cursor-pointer flex-nowrap whitespace-nowrap",
                        activeLanguage === lang
                          ? "border-foreground"
                          : "border-transparent",
                      ])}
                      onClick={() => setActiveLanguage(lang)}
                    >
                      {lang === "python" ? "Python SDK" : "JS/TS SDK"}
                    </div>
                  ))}
                </div>
                {feature.quickstartHref && (
                  <div className="px-2 pt-2">
                    <Button
                      asChild
                      variant="outline"
                      size="xs"
                      className="justify-start items-center self-end"
                    >
                      <Link href={feature.quickstartHref}>
                        <Code2 size={16} />
                        Quickstart
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0 overflow-y-scroll h-content overflow-x-hidden">
                <CodeBlock
                  code={activeCodeSnippet}
                  language={feature.code.language}
                  className="relative overflow-x-scroll rounded-none border-none [&_pre]:!overflow-auto [&_pre]:!height-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-min-content"
                  customStyle={{
                    fontSize: "0.725rem",
                    borderRadius: "0",
                    height: "auto",
                    width: "fit-content",
                    maxWidth: "unset",
                  }}
                ></CodeBlock>
              </div>
            </>
          ) : feature.statements ? (
            // Statements section
            <div className="flex-1 p-4 overflow-auto">
              <div className="space-y-4">
                {feature.statements.map((statement, index) => (
                  <div
                    key={index}
                    className="space-y-2 border border-solid border-border p-4 rounded-md hover:bg-muted/10"
                  >
                    <h4 className="text-sm font-semibold text-foreground">
                      {statement.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {statement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : // Fallback empty state
          null}
        </div>

        {/* Product screenshot */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <div className="relative w-full aspect-[6/5]">
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
    </>
  );
};