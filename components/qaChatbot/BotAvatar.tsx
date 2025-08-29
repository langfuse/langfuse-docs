import Image from "next/image";
import { cn } from "@/lib/utils";

export function BotAvatar({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "flex h-6 w-6 items-center justify-center overflow-hidden rounded-full border bg-background", 
        className
      )} 
      aria-label="Langfuse"
    >
      <Image
        src="/langfuse_icon.svg"
        alt="Langfuse"
        width={20}
        height={20}
        priority
        className="h-5 w-5"
      />
    </div>
  );
}