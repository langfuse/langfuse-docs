import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select a region",
  description: "Select a Langfuse Cloud region to continue.",
  // This region selector (including deep links) is a navigation utility.
  robots: { index: false, follow: true },
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
