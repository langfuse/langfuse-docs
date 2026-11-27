"use client";

import { useRef } from "react";
import { customerLogoNames } from "@/components/gateway/content";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GatewayMoire } from "./GatewayMoire";
import styles from "./GatewayHero.module.css";

/** "70": field behind the copy on the left. "72": centred copy above a band. */
export type GatewayHeroLayout = "70" | "72";

function HeroCopy({ centered = false }: { centered?: boolean }) {
  return (
    <>
      <p className="font-mono text-[12px] leading-none tracking-[0.06em] text-text-secondary">
        PUBLIC BETA
      </p>
      <h2
        id="introducing-ai-gateway"
        className="mt-4 text-[40px] leading-[1.02] tracking-[-0.02em] text-text-primary sm:text-[60px]"
      >
        Introducing AI Gateway
      </h2>
      <p className="mt-4 text-[18px] leading-[1.4] text-text-tertiary">
        One endpoint for Claude Code, Codex and your apps.
      </p>
      <div
        className={cn(
          "-mx-1 -mb-1 mt-6 flex flex-wrap gap-3",
          centered && "justify-center",
        )}
      >
        <Button
          href="/cloud"
          size="default"
          shortcutKey="s"
          className="w-auto"
          wrapperClassName="w-fit"
        >
          Start free
        </Button>
        <Button
          href="/docs/gateway/overview"
          variant="secondary"
          size="default"
          shortcutKey="d"
          className="w-auto"
          wrapperClassName="w-fit"
        >
          Documentation
        </Button>
      </div>
    </>
  );
}

// Cancels the page column padding so the hero runs edge to edge under the nav.
const BLEED = "not-prose -mx-4 -mt-4 sm:-mx-6 md:-mx-8 md:-mt-8";
// Column padding plus the panel's section padding: the copy lines up with the panel text.
const COPY_INSET = "px-9 sm:px-16 md:px-18";

/** Full-bleed hero that sits above the page panel, on the page background. */
export function GatewayHero({ layout }: { layout: GatewayHeroLayout }) {
  const heroRef = useRef<HTMLElement>(null);

  return layout === "70" ? (
    <section
      ref={heroRef}
      data-use-case-section="hero"
      className={cn("relative h-[560px] overflow-hidden", BLEED)}
    >
      <GatewayMoire pointerScopeRef={heroRef} className={styles.fadeVertical} />
      <div
        className={cn(
          "relative flex h-full flex-col items-start justify-center",
          COPY_INSET,
        )}
      >
        <div className="relative isolate flex flex-col items-start">
          <div className={styles.clearing} aria-hidden />
          <HeroCopy />
        </div>
      </div>
    </section>
  ) : (
    <section
      ref={heroRef}
      data-use-case-section="hero"
      className={cn("relative overflow-hidden", BLEED)}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[760px] flex-col items-center pt-[70px] text-center",
          COPY_INSET,
        )}
      >
        <HeroCopy centered />
      </div>
      <div className="relative mt-[26px] h-[320px]">
        <GatewayMoire
          pointerScopeRef={heroRef}
          className={styles.fadeAllEdges}
        />
      </div>
    </section>
  );
}

/** Logo strip that opens the page panel under the new hero. */
export function GatewayHeroLogos() {
  return (
    <section data-use-case-section="logos" className="px-2 py-2">
      <EnterpriseLogoGrid
        names={customerLogoNames}
        className="sm:grid-cols-4 lg:grid-cols-8"
        hideStoryTags
      />
    </section>
  );
}
