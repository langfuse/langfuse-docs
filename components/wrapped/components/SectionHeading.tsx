import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 lg:mb-16", className)}>
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-mono text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

