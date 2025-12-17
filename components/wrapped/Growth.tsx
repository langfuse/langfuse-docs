import { WrappedSection } from "./components/WrappedSection";
import { SectionHeading } from "./components/SectionHeading";

export function Growth() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Growth"
        subtitle="How Langfuse scaled in 2025"
      />
      {/* Full-width chart placeholder */}
      <div className="w-full aspect-[21/9] rounded-xl border bg-card flex items-center justify-center">
        <span className="text-muted-foreground">
          Growth chart will be rendered here
        </span>
      </div>
    </WrappedSection>
  );
}

