import { MainContentWrapper } from "@/components/MainContentWrapper";

/**
 * Content wrapper for marketing MDX pages (pricing, talk-to-us, startups, etc.).
 * HomeLayout is provided by the parent (home)/layout.tsx — this only adds
 * the max-w-7xl content constraint inside HomeMainArea.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <MainContentWrapper>{children}</MainContentWrapper>
    </div>
  );
}
