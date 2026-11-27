import Link from "next/link";
import { CornerBox } from "@/components/ui/corner-box";
import { FeatureSketch } from "./GatewayFeatureSketch";
import { openSource } from "./content";

// Self-hosting guide on /gateway. Keep it in sync with md-override/gateway.md.

export function GatewayOpenSource() {
  return (
    <div className="grid items-start gap-10 @3xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
      <div className="flex min-w-0 flex-col gap-4">
        <p className="max-w-[46ch] text-[16px] leading-[1.5] text-text-secondary">
          Like the rest of Langfuse, the AI Gateway is MIT-licensed. Run it next
          to your self-hosted Langfuse as a single 22 MB Docker image with no
          extra dependencies, or use it fully managed on Langfuse Cloud.
        </p>
        <FeatureSketch sketch={openSource.sketch} className="max-w-[420px]" />
      </div>
      <CornerBox className="grid gap-px bg-line-structure">
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
