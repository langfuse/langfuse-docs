import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Text } from "@/components/ui/text";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Dot } from "@/components/ui/dot";
import { cn } from "@/lib/utils";

/**
 * One line: sharp-edged yellow bar sized to the line (screenshot 1), not a
 * single merged block. Multiply only on the bar; text stays opaque on top.
 */
function HeroTitleLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block isolate relative rounded-none">
      <span
        className="pointer-events-none absolute inset-0 top-[10px] max-h-[51px] rounded-none bg-[#FBFF7A] mix-blend-multiply"
        aria-hidden
      />
      <span className="relative z-10 text-text-primary">{children}</span>
    </span>
  );
}

export function Hero() {
  return (
    <HomeSection className="pt-[40px]">
      <CornerBox className="flex gap-6 justify-center items-center px-4 py-[10px] -mb-px">
        <Text size="s"><b className="text-primary">19</b> of Fortune 50</Text>
        <Dot />
        <Text size="s"><b className="text-primary">10+ billion</b> observations/month</Text>
        <Dot />
        <Text size="s"><b className="text-primary">100,000+</b> engineers building on Langfuse</Text>
      </CornerBox>
      <CornerBox className="flex flex-col gap-10 items-center px-4 py-8 sm:px-8 sm:py-10">
        <h1
          className={cn(
            "flex flex-col items-center gap-1.5 text-center font-sans text-[68px] font-medium not-italic leading-[105%] text-balance",
            "[leading-trim:both] [text-edge:cap]"
          )}
        >
          <HeroTitleLine>Open Source LLM</HeroTitleLine>
          <HeroTitleLine>Engineering Platform</HeroTitleLine>
        </h1>
        <div className="flex flex-col gap-6">
          <Text className="max-w-xl">
            Tracing, prompt management, evaluation, and experiments. Debug
            production issues in minutes, not hours. Works with any model, any
            framework, any stack.
          </Text>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              variant="primary"
              shortcutKey="s"
              href="https://cloud.langfuse.com"
            >
              Start free
            </Button>
            <Button variant="secondary" shortcutKey="d" href="/docs">
              Documentation
            </Button>
          </div>
        </div>
      </CornerBox>
      <CornerBox className="-mt-px">
        <EnterpriseLogoGrid />
      </CornerBox>
    </HomeSection>
  );
}
