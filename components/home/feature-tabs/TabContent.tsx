import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ai-elements/code-block";
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

export const TabContent = ({
  feature,
  isActive,
  className,
}: TabContentProps) => {
  const [activeLanguage, setActiveLanguage] = useState<"python" | "javascript">(
    "python"
  );

  const activeCodeSnippet = useMemo(() => {
    if (!feature.code?.snippets) return "";
    return feature.code.snippets[activeLanguage] || "";
  }, [feature.code?.snippets, activeLanguage]);

  const availableLanguages = useMemo(() => {
    if (!feature.code?.snippets) return [];
    return Object.keys(feature.code.snippets) as ("python" | "javascript")[];
  }, [feature.code?.snippets]);

  const displayMode = feature.displayMode || "default";

  if (!isActive) {
    return null;
  }

  // Default mode: Original layout with header + split content
  return (
    <>
      {/* Row B: Content based on display mode */}
      {displayMode === "image-only" && (
        // Image-only: Full width image
        <div className="relative w-full aspect-[12/5] border-t border-solid">
          <Image
            src={feature.image.light}
            alt={feature.image.alt}
            fill
            className="object-cover object-left-top dark:hidden"
            sizes="100vw"
            priority={isActive}
          />
          <Image
            src={feature.image.dark}
            alt={feature.image.alt}
            fill
            className="object-cover object-left-top hidden dark:block"
            sizes="100vw"
            priority={isActive}
          />
        </div>
      )}
      {displayMode === "code-only" && (
        // Code-only: Full width code block
        <div className="w-full aspect-[12/5] flex flex-col border-t border-solid relative">
          <div className="bg-card flex-shrink-0 w-full min-w-full max-w-full justify-between flex flex-row items-center overflow-x-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="absolute top-0 left-0 right-0 mr-4 h-[36px] z-10 ">
              <div className="flex flex-row items-center px-2 pt-1 w-full bg-card">
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
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-scroll h-content overflow-x-hidden pt-[36px]">
            <CodeBlock
              code={activeCodeSnippet}
              language={feature.code?.language || "typescript"}
              className="bg-card relative overflow-x-scroll rounded-none border-none [&_pre]:!overflow-auto [&_pre]:!height-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-min-content"
              customStyle={{
                fontSize: "0.725rem",
                borderRadius: "0",
                height: "auto",
                width: "fit-content",
                maxWidth: "unset",
                background: "hsl(var(--card))",
              }}
            />
          </div>
          {feature.quickstartHref && (
            <div className="absolute bottom-0 right-0 px-6 py-2.5">
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
      )}
      {displayMode === "feature-only" && (
        // Feature-only: Just statements, full width
        <div className="w-full aspect-[12/5] border-t border-solid">
          {feature.statements ? (
            <div className="flex-1 p-4 overflow-auto h-full">
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
          ) : (
            <div className="w-full h-full bg-muted/5" />
          )}
        </div>
      )}
      {displayMode === "default" && (
        // Default: Split layout with code/statements + image
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-hidden border-t border-solid">
          {/* Code block or Statements */}
          <div className="relative lg:col-span-6 order-2 lg:order-1 aspect-[6/5] flex flex-col border-r border-solid ">
            {feature.code ? (
              // Code block section (takes precedence over feature statements)
              <>
                <div className="bg-card flex-shrink-0 w-full min-w-full max-w-full justify-between flex flex-row items-center overflow-x-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="absolute top-0 left-0 right-0 mr-4 h-[36px] z-10 ">
                    <div className="flex flex-row items-center px-2 pt-1 w-full bg-card">
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
                  </div>
                </div>
                <div className="flex-1 min-h-0 overflow-y-scroll h-content overflow-x-hidden pt-[36px]">
                  <CodeBlock
                    code={activeCodeSnippet}
                    language={feature.code.language}
                    className="bg-card relative overflow-x-scroll rounded-none border-none [&_pre]:!overflow-auto [&_pre]:!height-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-min-content"
                    customStyle={{
                      fontSize: "0.725rem",
                      borderRadius: "0",
                      height: "auto",
                      width: "fit-content",
                      maxWidth: "unset",
                      background: "hsl(var(--card))",
                    }}
                  />
                </div>
                {feature.quickstartHref && (
                  <div className="absolute bottom-0 right-0 px-6 py-2.5">
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
      )}

      {/* Row A: Value text + Docs/Video links */}
      <div
        className={cn(
          "grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-6 pt-6 pb-6 lg:h-36 lg:overflow-y-hidden border-t border-solid border-border",
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
          <div className="space-y-3">
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
    </>
  );
};
