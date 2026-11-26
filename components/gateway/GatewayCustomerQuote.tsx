import Image from "next/image";
import Link from "next/link";
import sumupLogo from "@/components/home/img/sumup.svg";
import { wordmarkDisplaySize } from "@/components/shared/wordmark";

const linkClass =
  "whitespace-nowrap text-[13px] text-text-secondary underline decoration-line-structure underline-offset-4 hover:text-text-primary";

export function GatewayCustomerQuote() {
  const { width, height } = wordmarkDisplaySize(sumupLogo, 64);

  return (
    <figure className="flex max-w-[1000px] flex-col gap-7">
      <blockquote className="font-analog text-[28px] leading-[1.15] tracking-[-0.01em] text-text-primary sm:text-[36px] lg:text-[42px]">
        {
          "“Building on Langfuse we saved 30% of external BPO cost by deflecting 50% of support conversations to AI.”"
        }
      </blockquote>
      <figcaption className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <Image
          src={sumupLogo}
          alt="SumUp logo"
          width={width}
          height={height}
          unoptimized
          className="h-auto w-auto opacity-70 grayscale dark:invert"
        />
        <span className="text-[13px] text-text-tertiary">
          Ana Casado, Head of Operations Data and AI at SumUp
        </span>
      </figcaption>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href="/users/sumup" className={linkClass}>
          Read the SumUp story →
        </Link>
        <Link href="/users" className={linkClass}>
          All customer stories →
        </Link>
      </div>
    </figure>
  );
}
