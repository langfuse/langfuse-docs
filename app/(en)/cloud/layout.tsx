import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Select Cloud Region",
  description:
    "Select the Langfuse Cloud region and continue to your destination.",
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
