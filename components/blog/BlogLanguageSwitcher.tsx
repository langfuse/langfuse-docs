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
    <div
      className="my-4 flex justify-center not-prose"
      aria-label="Article language"
    >
      <div className="inline-flex w-fit items-center justify-center gap-0.5 rounded-[1px] border border-line-structure bg-surface-bg p-0.5">
        {languages.map((l) => {
          const isActive = l.code === current;
          return (
            <Link
              key={l.code}
              href={l.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "inline-flex min-h-[26px] items-center justify-center gap-1.5 rounded-[1px] border border-transparent px-2 text-[12px] font-[450] leading-[150%] tracking-[-0.06px] text-text-secondary no-underline shadow-none whitespace-nowrap transition-colors hover:bg-[#403d3909] hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive &&
                  "border-line-structure bg-[#403d391a] text-text-primary"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
