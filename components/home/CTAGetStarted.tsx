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
import Image from "next/image";
import phLight from "./img/ph_product_of_the_day_light.png";
import phDark from "./img/ph_product_of_the_day_dark.png";
import GoldenKittyAwardSVG from "./img/ph_gke_ai_infra.svg";
import GoldenKittyAwardSVGWhite from "./img/ph_gke_ai_infra_white.svg";
import { YCLogo } from "./img/ycLogo";
import {
  ArrowRight,
  BarChart3,
  FileText,
  CheckCircle2,
  Eye,
  MessageCircle,
  ExternalLink,
  ArrowDown,
  Play,
} from "lucide-react";

export function CTAGetStarted() {
  return (
    <HomeSection>
      {/* Social/Award Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 items-center justify-items-center my-8 flex-wrap">
        <div>
          <img
            alt="Langfuse Github stars"
            src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1">
          <div className="text-primary/70 text-sm">Backed by</div>
          <YCLogo />
        </div>
        <div>
          <Image
            src={GoldenKittyAwardSVG}
            alt="Langfuse won #1 Golden Kitty in AI Infra Category"
            className="block dark:hidden"
          />
          <Image
            src={GoldenKittyAwardSVGWhite}
            alt="Langfuse won #1 Golden Kitty in AI Infra Category"
            className="hidden dark:block"
          />
        </div>
        <div className="max-w-full w-52 px-1">
          <Image
            src={phLight}
            alt="Product Hunt - Product of the Day"
            width={250}
            height={54}
            className="block dark:hidden"
          />
          <Image
            src={phDark}
            alt="Product Hunt - Product of the Day"
            width={250}
            height={54}
            className="hidden dark:block"
          />
        </div>
      </div>

      <Header
        title="Start building with Langfuse today."
        description="Choose your path to start building better LLM applications"
      />

      <div className="flex flex-col gap-4 mt-12 max-w-xl mx-auto">
        <Card>
          {/* Get Started Links */}
          <CardContent className="space-y-4 mt-6">
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
                    <h4 className="font-semibold text-foreground">
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
                    <h4 className="font-semibold text-foreground">
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

          {/* Full-width horizontal separator */}
          <div className="border-t border-border"></div>

          {/* Example Project Section */}
          <CardContent className="mt-6">
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
                    <h4 className="font-semibold text-foreground">
                      Explore Example Project (1 min)
                    </h4>
                    <p className="text-sm text-primary/70 text-wrap">
                      Click around and test all features in a live demo project
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
                    <h4 className="font-semibold text-foreground">
                      Watch Walkthroughs (20 min)
                    </h4>
                    <p className="text-sm text-primary/70 text-wrap">
                      Get to know all platform areas via pre-recorded demo
                    </p>
                  </div>
                  <ArrowRight size={16} className="text-primary/50" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </HomeSection>
  );
}
