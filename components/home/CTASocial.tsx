import Link from "next/link";
import { UsersMarquee } from "./UsersMarquee";
import { Button } from "../ui/button";
import Image from "next/image";
import phLight from "./img/ph_product_of_the_day_light.png";
import phDark from "./img/ph_product_of_the_day_dark.png";
import GoldenKittyAwardSVG from "./img/ph_gke_ai_infra.svg";
import GoldenKittyAwardSVGWhite from "./img/ph_gke_ai_infra_white.svg";
import { YCLogo } from "./img/ycLogo";

export function CTASocial() {
  return (
    <section className="py-20 lg:py-32 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10 flex flex-col items-center">
      {/* Social/Award Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-4 items-center justify-items-center my-4 flex-wrap">
        <div>
          <img
            alt="Langfuse Github stars"
            src="https://img.shields.io/github/stars/langfuse/langfuse?label=langfuse&style=social"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1">
          <div className="text-primary/70 text-sm">Backed by</div>
          <YCLogo />
        </div>
        <div>
          <Image
            src={GoldenKittyAwardSVG}
            alt="Langfuse won #1 Golden Kitty in AI Infra Category"
            className="block dark:hidden"
          />
          <Image
            src={GoldenKittyAwardSVGWhite}
            alt="Langfuse won #1 Golden Kitty in AI Infra Category"
            className="hidden dark:block"
          />
        </div>
        <div className="max-w-full w-52 px-1">
          <Image
            src={phLight}
            alt="Product Hunt - Product of the Day"
            width={250}
            height={54}
            className="block dark:hidden"
          />
          <Image
            src={phDark}
            alt="Product Hunt - Product of the Day"
            width={250}
            height={54}
            className="hidden dark:block"
          />
        </div>
      </div>
      {/* Headline */}
      <h2 className="mt-4 mb-4 text-4xl font-bold tracking-tight sm:text-7xl text-balance font-mono text-foreground text-center">
        Start building with Langfuse today.
      </h2>
      {/* CTA Button */}
      <div className="mt-4 mb-0">
        <Button size="lg" variant="cta" asChild>
          <Link href="https://cloud.langfuse.com">Start building</Link>
        </Button>
      </div>
    </section>
  );
}
