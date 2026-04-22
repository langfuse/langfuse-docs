import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import IconGithub from "@/components/icons/github";
import IconX from "@/components/icons/x";
import { AskAIButton } from "@/components/inkeep/ask-ai-button";
import { Text } from "@/components/ui/text";

type TocCommunityProps = {
  className?: string;
};

export default function TocCommunity({ className }: TocCommunityProps) {
  return (
    <div className={cn("px-2 pb-4 pt-4", className)}>
      <Text size="s" className="font-[580] text-left text-text-primary mb-3">Community</Text>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/langfuse/langfuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-disabled hover:text-text-primary transition-colors"
            aria-label="GitHub"
          >
            <IconGithub className="size-5" />
          </Link>
          <Link
            href="https://x.com/langfuse"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-disabled hover:text-text-primary transition-colors mt-0.5"
            aria-label="X / Twitter"
          >
            <IconX className="size-5" />
          </Link>
        </div>
        <AskAIButton />
      </div>
    </div>
  );
}
