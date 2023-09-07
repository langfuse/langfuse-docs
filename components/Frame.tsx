import { cn } from "@/lib/utils";

export const Frame = ({
  children,
  className,
  border = false,
}: {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}) => (
  <div
    className={cn(
      "my-4",
      border &&
        "p-1 pb-0 bg-gradient-to-tr from-blue-300/50 via-green-200/50 to-yellow-300/50 inline-block rounded-lg sm:rounded-2xl",
      className
    )}
  >
    <div className="inline-block rounded-md sm:rounded-xl overflow-hidden max-w-2xl bg-primary/5">
      {children}
    </div>
  </div>
);
