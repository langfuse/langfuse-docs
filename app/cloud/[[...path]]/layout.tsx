import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}): Promise<Metadata> {
  const { path = [] } = await params;
  const isLoginPage = path.length === 0;

  // The base route serves branded login searches. Project-specific deep
  // links remain crawlable navigation utilities, not search landing pages.
  return {
    robots: { index: isLoginPage, follow: true },
    ...(isLoginPage
      ? { alternates: { canonical: "https://langfuse.com/cloud" } }
      : {}),
  };
}

export default function CloudPathLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
