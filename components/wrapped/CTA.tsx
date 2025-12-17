import Link from "next/link";
import { Button } from "../ui/button";
import { WrappedSection } from "./components/WrappedSection";

export function CTA() {
  return (
    <WrappedSection className="text-center">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-mono text-balance">
        Ready to build?
      </h2>
      <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
        Join thousands of teams using Langfuse to build better LLM applications.
      </p>
      <div className="flex gap-4 flex-wrap items-center justify-center mt-8">
        <Button variant="cta" size="lg" asChild>
          <Link href="https://cloud.langfuse.com">Sign up</Link>
        </Button>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/docs">View docs</Link>
        </Button>
      </div>
    </WrappedSection>
  );
}

