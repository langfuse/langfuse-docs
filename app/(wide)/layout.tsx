import { HomeLayout } from "@/components/layout";
import { MainContentWrapper } from "@/components/MainContentWrapper";

/**
 * Layout for wide marketing sections (pricing, enterprise, etc.) that have
 * their own route folders. No sidebar, no prose, max-w-7xl content.
 */
export default function WideSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <HomeLayout>
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <MainContentWrapper>{children}</MainContentWrapper>
      </div>
    </HomeLayout>
  );
}
