import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PageFooterNavItem = {
  name: string;
  description?: string;
  url: string;
};

type PageFooterNavProps = React.ComponentProps<"div"> & {
  items?: {
    previous?: PageFooterNavItem;
    next?: PageFooterNavItem;
  };
};

export function PageFooterNav({
  items,
  className,
  ...props
}: PageFooterNavProps) {
  const { previous, next } = items ?? {};

  if (!previous && !next) return null;

  return (
    <div
      className={cn("flex flex-col gap-2 sm:flex-row", className)}
      {...props}
    >
      {previous ? (
        <Button
          href={previous.url}
          variant="secondary"
          size="small"
          wrapperClassName="flex-1 min-w-0 sm:max-w-[50%]"
          icon={<ArrowLeft className="h-3.5 w-3.5" />}
        >
          {previous.name}
        </Button>
      ) : (
        <div className="hidden flex-1 sm:block" />
      )}

      {next ? (
        <Button
          href={next.url}
          variant="secondary"
          size="small"
          className="!justify-end"
          wrapperClassName="flex-1 min-w-0 sm:max-w-[50%] sm:ml-auto"
          icon={<ArrowRight className="h-3.5 w-3.5" />}
          iconPosition="end"
        >
          {next.name}
        </Button>
      ) : null}
    </div>
  );
}
