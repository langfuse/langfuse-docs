import { ChangelogIndex } from "@/components/changelog/ChangelogIndex";
import { Header } from "@/components/Header";
import { ProductUpdateSignup } from "@/components/productUpdateSignup";
import Link from "next/link";

export default function ChangelogIndexPage() {
  return (
    <div className="md:container">
      <div className="flex flex-col items-center content-center text-center my-10">
        <Header
          title="Changelog"
          description={
            <>
              Latest release updates from the Langfuse team. Check out our{" "}
              <Link href="/docs/roadmap" className="underline">
                Roadmap
              </Link>{" "}
              to see what&apos;s next.
            </>
          }
          className="mb-8"
          h="h1"
        />
        <div className="mb-8">
          <ProductUpdateSignup source="changelog" />
        </div>
      </div>
      <ChangelogIndex />
    </div>
  );
}
