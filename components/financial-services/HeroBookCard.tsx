import { Button } from "@/components/ui/button";

const points = [
  "Deployment options for Cloud, VPC, or air-gapped environments",
  "Compliance needs around redaction, audit trails, and access control",
  "How teams like Trade Republic run Langfuse in production",
] as const;

export function HeroBookCard() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-6 border border-line-structure bg-surface-bg p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.09em] text-text-tertiary">
          Talk to an expert
        </p>
        <h2 className="text-[28px] leading-[1.1] text-text-primary sm:text-[32px]">
          Tell us what you&apos;re building
        </h2>
        <p className="max-w-[36ch] text-[14px] leading-[1.45] text-text-secondary">
          A short conversation about your stack, compliance needs, and where
          Langfuse should run.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {points.map((point) => (
          <li
            key={point}
            className="grid grid-cols-[12px_minmax(0,1fr)] gap-3 text-[13px] leading-[1.45] text-text-secondary"
          >
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 rounded-full bg-text-primary"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-2">
        <Button href="#book" shortcutKey="T" wrapperClassName="w-auto">
          Book a conversation
        </Button>
      </div>
    </div>
  );
}
