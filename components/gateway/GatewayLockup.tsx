import Image from "next/image";
import { cn } from "@/lib/utils";

// "langfuse AI Gateway" lockup above the hero headline, with the beta note.
// The SVG files are 4613 x 527.

export function GatewayLockup({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] leading-none text-text-tertiary",
        className,
      )}
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
      <span>(public beta)</span>
    </p>
  );
}
