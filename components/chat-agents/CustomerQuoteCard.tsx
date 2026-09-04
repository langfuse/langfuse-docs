import Image from "next/image";
import Link from "next/link";

type CustomerQuoteCardProps = {
  route: string;
  quote: string;
  quoteAuthor?: string;
  quoteRole?: string;
  quoteCompany?: string;
  customerLogo?: string;
  customerLogoDark?: string;
};

export function CustomerQuoteCard({
  route,
  quote,
  quoteAuthor,
  quoteRole,
  quoteCompany,
  customerLogo,
  customerLogoDark,
}: CustomerQuoteCardProps) {
  return (
    <article className="flex h-full flex-col border border-line-structure bg-surface-bg p-5">
      <blockquote className="m-0 min-h-[126px] text-[14px] leading-[1.45] text-text-primary">
        “{quote}”
      </blockquote>
      <footer className="mt-4 border-t border-line-structure pt-4">
        <Link href={route} className="inline-flex items-center no-underline">
          {customerLogo ? (
            <div className="relative h-6 w-[132px]">
              {customerLogoDark ? (
                <>
                  <Image
                    src={customerLogo}
                    alt={`${quoteCompany ?? "Customer"} logo`}
                    fill
                    sizes="132px"
                    className="object-contain object-left dark:hidden"
                    unoptimized
                  />
                  <Image
                    src={customerLogoDark}
                    alt={`${quoteCompany ?? "Customer"} logo`}
                    fill
                    sizes="132px"
                    className="hidden object-contain object-left dark:block"
                    unoptimized
                  />
                </>
              ) : (
                <Image
                  src={customerLogo}
                  alt={`${quoteCompany ?? "Customer"} logo`}
                  fill
                  sizes="132px"
                  className="object-contain object-left dark:invert dark:brightness-0 dark:contrast-200"
                  unoptimized
                />
              )}
            </div>
          ) : (
            <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-tertiary">
              {quoteCompany ?? "Customer"}
            </span>
          )}
        </Link>
        {(quoteAuthor || quoteRole || quoteCompany) && (
          <p className="mt-3 text-[13px] leading-[1.45] text-text-tertiary">
            {quoteAuthor}
            {quoteRole ? `, ${quoteRole}` : ""}
            {quoteCompany ? ` · ${quoteCompany}` : ""}
          </p>
        )}
      </footer>
    </article>
  );
}
