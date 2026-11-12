import type { Metadata } from "next";
import { ReinventLanding } from "@/components/reinvent/ReinventLanding";

const title = "Meet Langfuse at AWS re:Invent 2026";
const description =
  "Langfuse at AWS re:Invent in Las Vegas, Nov 30 to Dec 4, 2026. Get a Langfuse Cloud discount code, find the booth, breakout, and workshop, and start with AgentCore, Strands, and Bedrock.";

const ogImageUrl = `https://langfuse.com/api/og?${new URLSearchParams({
  title,
  description,
}).toString()}`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "https://langfuse.com/reinvent",
  },
  openGraph: {
    type: "website",
    title,
    description,
    url: "https://langfuse.com/reinvent",
    images: [{ url: ogImageUrl }],
  },
  // Next.js replaces the twitter object from the root layout, so set the
  // campaign image here. Otherwise X keeps the generic site image.
  twitter: {
    card: "summary_large_image",
    site: "langfuse.com",
    title,
    description,
    images: [{ url: ogImageUrl }],
  },
};

export default function ReinventPage() {
  return <ReinventLanding />;
}
