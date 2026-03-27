import { Button } from "../ui/button";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { HomeSection } from "./components/HomeSection";
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
      <Box className="flex flex-col items-center px-4 py-8 -mb-px sm:px-8 sm:py-10">
        <Text className="max-w-xl">
          Tracing, prompt management, evaluation, and experiments. Debug
          production issues in minutes, not hours. Works with any model, any
          framework, any stack.
        </Text>
      </Box>
      <Box className="flex flex-col gap-10 items-center px-4 py-8 sm:px-8 sm:py-10">
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
          <div className="flex flex-wrap gap-4 justify-center items-center">
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
      </Box>
      <Box className="flex flex-col items-center px-4 py-8 -mt-px sm:px-8 sm:py-10">
        <Text className="max-w-xl">
          Tracing, prompt management, evaluation, and experiments. Debug
          production issues in minutes, not hours. Works with any model, any
          framework, any stack.
        </Text>
      </Box>

      {/* <div className="bg-blue-200 aspect-video"></div>
      <Video
        src="https://static.langfuse.com/docs-videos/langfuse-10min-demo-4k-60fps.mp4"
        aspectRatio={16 / 9}
        title="Langfuse Walkthrough"
        posterStartTime={86}
      /> */}
    </HomeSection>
  );
}
