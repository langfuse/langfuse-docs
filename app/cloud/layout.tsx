import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select a region",
  description: "Select a Langfuse Cloud region to continue.",
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
