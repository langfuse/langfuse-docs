import Link from "next/link";
import { CornerBox } from "@/components/ui/corner-box";
import { FeatureSketch } from "./GatewayFeatureSketch";
import { openSource } from "./content";

// Self-hosting guide on /gateway. Keep it in sync with md-override/gateway.md.

export function GatewayOpenSource() {
  return (
    // Two joined boxes, like the homepage's scale and security section.
    <div className="grid items-stretch @3xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
      <CornerBox className="flex min-w-0 flex-col">
        <p className="px-5 py-5 text-[16px] leading-[1.5] text-text-secondary">
          MIT-licensed, like the rest of Langfuse. Run it as a single 22 MB
          Docker image, or use it managed on Langfuse Cloud.
        </p>
        <FeatureSketch sketch={openSource.sketch} className="mt-auto" />
      </CornerBox>
      <CornerBox className="-mt-px grid gap-px bg-line-structure @3xl:-ml-px @3xl:mt-0">
        {openSource.steps.map((step, i) => (
          <div
            key={step.title}
            className="flex min-w-0 flex-col gap-2 bg-surface-bg px-5 py-5"
          >
            <div className="font-mono text-[11px] text-text-tertiary">
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="font-analog text-[20px] leading-[1.2] text-text-primary">
              {step.title}
            </h3>
            <p className="text-[14px] leading-[1.5] text-text-secondary">
              {step.body}
            </p>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
              {step.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="whitespace-nowrap text-[13px] text-text-secondary underline decoration-line-structure underline-offset-4 hover:text-text-primary"
                >
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        ))}
      </CornerBox>
    </div>
  );
}
