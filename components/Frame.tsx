import { cn } from "@/lib/utils";

export const Frame = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-md sm:rounded-xl overflow-hidden max-w-2xl my-4 bg-primary/5",
      className
    )}
  >
    {children}
  </div>
);
