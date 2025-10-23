import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const CustomerStoryCTA = () => {
  return (
    <div className="flex flex-col gap-6 pt-14 border-t dark:border-neutral-800 mb-10">
      <div className="text-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-8 rounded-lg border">
        <h3 className="text-2xl font-bold mb-4">
          Ready to get started with Langfuse?
        </h3>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
          Join thousands of teams building better LLM applications with Langfuse's 
          open-source observability platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" variant="cta" asChild>
            <Link href="https://cloud.langfuse.com">
              Start for free <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/docs">
              View documentation
            </Link>
          </Button>
        </div>
        <div className="mt-4">
          <span className="text-sm text-muted-foreground">or </span>
          <Link href="/talk-to-us" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline">
            Talk to an expert
          </Link>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required • Free tier available • Self-hosting option
        </p>
      </div>
    </div>
  );
}; 