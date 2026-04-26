import Link from "next/link";
import { cn } from "@/lib/utils";

type Language = {
  code: string;
  label: string;
  href: string;
};

export const BlogLanguageSwitcher = ({
  current,
  languages,
}: {
  current: string;
  languages: Language[];
}) => {
  return (
    <div className="flex gap-1.5 items-center justify-center my-4 not-prose">
      {languages.map((l) => {
        const isActive = l.code === current;
        return (
          <Link
            key={l.code}
            href={l.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-sm px-3 py-1 rounded-full border transition-colors no-underline",
              isActive
                ? "bg-secondary border-border text-foreground"
                : "border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
};
