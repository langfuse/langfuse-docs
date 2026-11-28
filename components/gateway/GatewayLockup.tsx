import Image from "next/image";
import { cn } from "@/lib/utils";

// "langfuse AI Gateway" lockup above the hero headline, with the beta tag.
// The SVG files are 4613 x 527.

export function GatewayLockup({ className }: { className?: string }) {
  return (
    <p
      className={cn("flex flex-wrap items-center gap-x-2.5 gap-y-1", className)}
    >
      <Image
        src="/images/gateway/langfuse-ai-gateway.svg"
        alt="Langfuse AI Gateway"
        width={219}
        height={25}
        priority
        className="h-[22px] w-auto dark:hidden sm:h-[25px]"
      />
      <Image
        src="/images/gateway/langfuse-ai-gateway-white.svg"
        alt="Langfuse AI Gateway"
        width={219}
        height={25}
        priority
        className="hidden h-[22px] w-auto dark:block sm:h-[25px]"
      />
      <span className="border border-line-structure bg-surface-1 px-1.5 py-1 font-mono text-[11px] leading-none text-text-secondary">
        Public beta
      </span>
    </p>
  );
}
