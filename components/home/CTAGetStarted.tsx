import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  CheckCircle2,
  Eye,
  MessageCircle,
  ExternalLink,
  ArrowDown,
} from "lucide-react";

export function CTAGetStarted() {
  return (
    <HomeSection>
      <Header
        title="Start building with Langfuse today."
        description="Choose your path to start building better LLM applications"
      />

      <div className="flex flex-col gap-4 mt-12 max-w-2xl mx-auto">
        {/* Integrate into your own project */}
        <Card className="col-span-2 relative overflow-hidden border-2 hover:border-primary/20 transition-all duration-300 group">
          <CardContent className="space-y-4 mt-6">
            {/* Get Started Links as Main Buttons */}
            <div className="space-y-2">
              <Button
                size="lg"
                variant="outline"
                asChild
                className="justify-start h-auto p-4 w-full"
              >
                <Link
                  href="/docs/observability/get-started"
                  className="flex items-center gap-4"
                >
                  <BarChart3 className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-semibold text-foreground">
                      Observability (15 min)
                    </h4>
                    <p className="text-sm text-primary/70 text-wrap">
                      Trace and monitor your LLM applications/agents
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-primary/50" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="justify-start h-auto p-4 w-full"
              >
                <Link
                  href="/docs/prompt-management/get-started"
                  className="flex items-center gap-4"
                >
                  <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-semibold text-foreground">
                      Prompt Management (5 min)
                    </h4>
                    <p className="text-sm text-primary/70 text-wrap">
                      Version and optimize your prompts collaboratively
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-primary/50" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                asChild
                className="justify-start h-auto p-4 w-full"
              >
                <Link
                  href="/docs/evaluation/overview"
                  className="flex items-center gap-4"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 text-left min-w-0">
                    <h4 className="font-semibold text-foreground">
                      Evaluation (15-30 min)
                    </h4>
                    <p className="text-sm text-primary/70 text-wrap">
                      Test and improve your LLM outputs with online/offline
                      evals
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-primary/50" />
                </Link>
              </Button>
            </div>

            {/* Horizontal divider */}
            <div className="border-t border-border"></div>

            {/* Example Project Section */}
            <Button
              size="lg"
              variant="outline"
              asChild
              className="justify-start h-auto p-4 w-full"
            >
              <Link href="/docs/demo" className="flex items-center gap-4">
                <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-semibold text-foreground">
                    Example Project (1 min)
                  </h4>
                  <p className="text-sm text-primary/70 text-wrap">
                    Click around and explore all features in the view-only
                    example project
                  </p>
                </div>
                <ArrowRight size={16} className="text-primary/50" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </HomeSection>
  );
}
