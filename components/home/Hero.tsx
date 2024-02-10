import Link from "next/link";
import { YCLogo } from "./img/ycLogo";
import { Button } from "../ui/button";
import Image from "next/image";
import phLight from "./img/ph_product_of_the_day_light.png";
import phDark from "./img/ph_product_of_the_day_dark.png";
import { CloudflareVideo } from "../Video";

export function Hero() {
  return (
    <section className="flex flex-col items-start pt-5 px-5 md:min-h-[calc(100vh-100px)]">
      <div className="flex flex-col self-stretch w-[100%] md:w-[70%] lg:w-[50%] md:ml-auto md:order-none order-last mt-5 md:mt-0">
        {/* <div className="aspect-video bg-blue-200"></div> */}
        <CloudflareVideo
          videoId="ff57153dd945da86f7549c1f30daaea2"
          aspectRatio={1.71}
        />

        <div className="flex flex-row items-center gap-4 justify-center mt-2 shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-x-2 gap-y-1">
            <div className="text-primary/70 text-sm">Backed by</div>
            <YCLogo />
          </div>
          <div className="w-52">
            <ProductHuntBadge />
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-4 md:min-h-0" />
      <h1 className="text-5xl sm:text-7xl lg:text-8xl leading-tight">
        Open Source
        <br />
        LLM Engineering Platform
      </h1>
      <span className="mt-3 text-primary/70 text-2xl sm:text-3xl lg:text-4xl md:text-balance font-medium leading-tight">
        <span className="underline">Traces</span>,{" "}
        <span className="underline">evals</span>,{" "}
        <span className="underline">prompt management</span> and{" "}
        <span className="underline">metrics</span> to debug and improve your LLM
        application.
      </span>

      <div className="flex gap-4 flex-wrap items-center justify-center my-4">
        <Button size="lg" asChild>
          <Link href="/docs/demo">Live demo</Link>
        </Button>
        <Button variant="secondary" size="lg" asChild>
          <Link href="/docs/get-started">Get started</Link>
        </Button>
      </div>
    </section>
  );
}

const ProductHuntBadge = () => (
  <a
    href="https://www.producthunt.com/posts/langfuse?utm_source=badge-top-post-badge&utm_medium=badge&utm_souce=badge-langfuse"
    target="_blank"
  >
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
  </a>
);
