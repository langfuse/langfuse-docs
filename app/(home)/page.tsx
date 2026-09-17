import { Home } from "@/components/home";
import type { Metadata } from "next";

// Keep this on the homepage: a layout canonical would be inherited by children.
export const metadata: Metadata = {
  title: {
    absolute: "Langfuse: Open Source Agent Evals & Observability",
  },
  alternates: { canonical: "https://langfuse.com/" },
};

export default function HomePage() {
  return <Home />;
}
