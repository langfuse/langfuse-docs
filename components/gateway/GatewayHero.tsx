"use client";

import { useRef } from "react";
import { customerLogoNames } from "@/components/gateway/content";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GatewayMoire } from "./GatewayMoire";
import { GatewayLockup } from "./GatewayLockup";
import styles from "./GatewayHero.module.css";

function HeroCopy() {
  return (
    <>
      <GatewayLockup />
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
      <p className="mt-4 max-w-[52ch] text-[18px] leading-[1.4] text-text-secondary">
        Route every model call through one gateway. Track spend, set budgets and
        manage access across your organization.
      </p>
      <div className="-mx-1 -mb-1 mt-6 flex flex-wrap gap-3">
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
          href="/docs/gateway/get-started/first-request"
          variant="secondary"
          size="default"
          shortcutKey="d"
          className="w-auto"
          wrapperClassName="w-fit"
        >
          Send your first request
        </Button>
      </div>
    </>
  );
}

// Cancels the page column padding so the hero runs edge to edge under the nav.
const BLEED = "not-prose -mx-4 -mt-4 sm:-mx-6 md:-mx-8 md:-mt-8";

/** Full-bleed hero above the page panel: the line field behind the copy. */
export function GatewayHero() {
  const heroRef = useRef<HTMLElement>(null);

  return (
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
  );
}

/** Logo strip that opens the page panel under the new hero. */
export function GatewayHeroLogos() {
  return (
    <section data-use-case-section="logos" className="px-2 py-2">
      <EnterpriseLogoGrid
        names={customerLogoNames}
        className="sm:grid-cols-4 xl:grid-flow-col xl:auto-cols-max xl:grid-cols-none xl:justify-between xl:px-8"
        hideStoryTags
      />
    </section>
  );
}
