import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock, CodeBlockCopyButton } from "@/components/ai-elements/code-block";
import { cn } from "@/lib/utils";
import { ExternalLink, BookOpen, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { TabContentProps } from "./types";

export const TabContent = ({ feature, isActive }: TabContentProps) => {
  if (!isActive) return null;

  return (
  <Card className="p-4">
    <CardContent
      role="tabpanel"
      id={`tabpanel-${feature.id}`}
      aria-labelledby={`tab-${feature.id}`}
      className="space-y-8 pt-4"
    >
      {/* Row A: Value text + Docs/Video links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Value paragraph */}
        <div className="lg:col-span-8">
          <p className="text-lg leading-relaxed text-muted-foreground">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Code block */}
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="relative">
            <CodeBlock
              code={feature.code.snippet}
              language={feature.code.language}
              className="relative text-xs"
            >
              <CodeBlockCopyButton />
            </CodeBlock>

            {/* Quickstart CTA - floating pill button */}
            <div className="absolute -bottom-3 left-4">
              <Button
                asChild
                size="pill"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              >
                <Link href={feature.quickstartHref}>
                  Get Started
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Product screenshot */}
        <div className="lg:col-span-6 order-1 lg:order-2">
          <Card className="overflow-hidden">
            <div className="relative aspect-[4/3] bg-muted/30">
              {/* Light theme image */}
              <Image
                src={feature.image.light}
                alt={feature.image.alt}
                fill
                className="object-contain dark:hidden"
                sizes="(min-width: 1024px) 33vw, 100vw"
                priority={isActive}
              />

              {/* Dark theme image */}
              <Image
                src={feature.image.dark}
                alt={feature.image.alt}
                fill
                className="object-contain hidden dark:block"
                sizes="(min-width: 1024px) 33vw, 100vw"
                priority={isActive}
              />
            </div>
          </Card>
          </div>
        </div>
      </CardContent>
    </Card>
    
  );
};