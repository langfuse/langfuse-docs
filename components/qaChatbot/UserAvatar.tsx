import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserAvatar({ className }: { className?: string }) {
  return (
    <div 
      className={cn(
        "flex h-6 w-6 items-center justify-center rounded-full border bg-muted text-muted-foreground", 
        className
      )} 
      aria-label="User"
    >
      <UserRound className="h-4 w-4" aria-hidden />
    </div>
  );
}