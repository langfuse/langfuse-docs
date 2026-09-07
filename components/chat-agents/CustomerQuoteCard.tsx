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
  quoteAuthorImage?: string;
};

export function CustomerQuoteCard({
  route,
  quote,
  quoteAuthor,
  quoteRole,
  quoteCompany,
  customerLogo,
  customerLogoDark,
  quoteAuthorImage,
}: CustomerQuoteCardProps) {
  return (
    <article className="flex h-full flex-col border border-line-structure bg-surface-bg p-5">
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

      <p className="mt-4 h-[126px] overflow-hidden break-words text-[14px] leading-[1.45] text-text-primary">
        “{quote}”
      </p>

      <footer className="mt-auto border-t border-line-structure pt-4 md:h-[116px]">
        {(quoteAuthor || quoteRole || quoteCompany) && (
          <div className="flex items-start gap-2.5">
            {quoteAuthorImage ? (
              <Image
                src={quoteAuthorImage}
                alt={
                  quoteAuthor ? `${quoteAuthor} profile image` : "Profile image"
                }
                width={34}
                height={34}
                className="h-[34px] w-[34px] shrink-0 rounded-full border border-line-structure object-cover"
                unoptimized
              />
            ) : null}
            <p className="m-0 break-words text-[13px] leading-[1.45] text-text-tertiary">
              {quoteAuthor}
              {quoteRole ? `, ${quoteRole}` : ""}
              {quoteCompany ? ` · ${quoteCompany}` : ""}
            </p>
          </div>
        )}
      </footer>
    </article>
  );
}
