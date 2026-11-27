"use client";

import { useRef } from "react";
import { customerLogoNames } from "@/components/gateway/content";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GatewayMoire } from "./GatewayMoire";
import styles from "./GatewayHero.module.css";

/** "70": full-bleed field with the copy on the left. "72": centred copy above a band. */
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

export function GatewayHero({ layout }: { layout: GatewayHeroLayout }) {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <>
      {layout === "70" ? (
        <section
          ref={heroRef}
          data-use-case-section="hero"
          className="relative h-[560px] overflow-hidden"
        >
          <GatewayMoire
            pointerScopeRef={heroRef}
            className={styles.fadeVertical}
          />
          <div className={styles.clearing} aria-hidden />
          <div className="relative flex h-full flex-col items-start justify-center px-5 sm:px-10">
            <HeroCopy />
          </div>
        </section>
      ) : (
        <section
          ref={heroRef}
          data-use-case-section="hero"
          className="relative overflow-hidden"
        >
          <div className="mx-auto flex max-w-[760px] flex-col items-center px-5 pt-[70px] text-center sm:px-10">
            <HeroCopy centered />
          </div>
          <div className="relative mt-[26px] h-[320px]">
            <GatewayMoire
              pointerScopeRef={heroRef}
              className={styles.fadeAllEdges}
            />
          </div>
        </section>
      )}

      <section
        data-use-case-section="logos"
        className="border-t border-line-structure px-2 py-2"
      >
        <EnterpriseLogoGrid
          names={customerLogoNames}
          className="sm:grid-cols-4 lg:grid-cols-8"
          hideStoryTags
        />
      </section>
    </>
  );
}
