import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  FileText,
  CheckCircle2,
  Eye,
  Play,
  BookOpen,
} from "lucide-react";

export default function CTAGetStarted() {
  return (
    <HomeSection>
      <Header
        title="Start building with Langfuse today."
        description="Choose your path to start building better LLM applications"
      />

      <div className="mt-12 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Integrate into your application */}
          <Card>
            <CardContent className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Integrate into your application
              </h3>
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
                      <h4 className="font-semibold text-foreground text-wrap">
                        Integrate Observability (15 min)
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
                      <h4 className="font-semibold text-foreground text-wrap">
                        Integrate Prompt Management (5 min)
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
                      <h4 className="font-semibold text-foreground text-wrap">
                        Run Evaluations (15-30 min)
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
            </CardContent>
          </Card>

          {/* Right Card - Dive deeper */}
          <Card>
            <CardContent className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Dive deeper
              </h3>
              <div className="space-y-2">
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="justify-start h-auto p-4 w-full"
                >
                  <Link href="/docs/demo" className="flex items-center gap-4">
                    <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-semibold text-foreground text-wrap">
                        Explore Example Project (1 min)
                      </h4>
                      <p className="text-sm text-primary/70 text-wrap">
                        Click around and test all features in a live demo
                        project
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
                  <Link href="/watch-demo" className="flex items-center gap-4">
                    <Play className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-semibold text-foreground text-wrap">
                        Watch Walkthroughs (20 min)
                      </h4>
                      <p className="text-sm text-primary/70 text-wrap">
                        Get to know all platform areas via pre-recorded demo
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
                  <Link href="/docs" className="flex items-center gap-4">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 text-left min-w-0">
                      <h4 className="font-semibold text-foreground text-wrap">
                        Read Documentation
                      </h4>
                      <p className="text-sm text-primary/70 text-wrap">
                        Technical docs, examples, and guides to understand all
                        details of the platform
                      </p>
                    </div>
                    <ArrowRight size={16} className="text-primary/50" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </HomeSection>
  );
}
