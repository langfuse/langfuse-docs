import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Langfuse login" },
  description:
    "Log in to Langfuse Cloud. Choose your region to access your projects, traces, prompts, and evaluations.",
};

export default function CloudLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
