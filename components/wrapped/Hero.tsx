import { WrappedSection } from "./components/WrappedSection";

export function Hero() {
  return (
    <WrappedSection className="py-0 pt-0 lg:py-0 lg:pt-0 pb-0 lg:pb-0 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <span className="text-primary/70 text-lg font-semibold">2025</span>
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold font-mono text-balance">
          Langfuse Wrapped
        </h1>
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl">
          A year in review
        </p>
      </div>
    </WrappedSection>
  );
}

