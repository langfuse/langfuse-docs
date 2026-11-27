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
      <p className="text-[15px] leading-none text-text-secondary">
        Langfuse AI Gateway{" "}
        <span className="text-text-tertiary">(public beta)</span>
      </p>
      <h2
        id="see-and-control"
        data-toc-title="Langfuse AI Gateway"
        className="mt-4 text-balance text-[40px] leading-[1.02] tracking-[-0.02em] text-text-primary sm:text-[60px]"
      >
        <span className="-mx-1.5 bg-surface-cta-primary box-decoration-clone px-1.5">
          See and control
        </span>{" "}
        all AI usage
      </h2>
      <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.4] text-text-tertiary">
        AI governance across your organization: route all model calls through
        the gateway instead of losing track of keys and budgets.
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

/** Full-bleed hero that sits above the page panel, on the page background. */
export function GatewayHero({ layout }: { layout: GatewayHeroLayout }) {
  const heroRef = useRef<HTMLElement>(null);

  return layout === "70" ? (
    <section
      ref={heroRef}
      data-use-case-section="hero"
      className={cn("relative h-[560px] overflow-hidden", styles.hero, BLEED)}
    >
      <GatewayMoire
        pointerScopeRef={heroRef}
        className={styles.fadeAroundCopy}
      />
      <div
        className={cn(
          "relative flex h-full flex-col items-start justify-center",
          styles.copy,
        )}
      >
        <HeroCopy />
      </div>
    </section>
  ) : (
    <section
      ref={heroRef}
      data-use-case-section="hero"
      className={cn("relative overflow-hidden", styles.hero, BLEED)}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[760px] flex-col items-center pt-[70px] text-center",
          styles.copy,
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
