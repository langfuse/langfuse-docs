import type { Metadata } from "next";
import { ReinventLanding } from "@/components/reinvent/ReinventLanding";
import { buildOgImageUrl } from "@/lib/og-url";

const title = "Langfuse at AWS re:Invent 2026";
const description =
  "Ship reliable AI agents on AWS, get 90% off Langfuse Cloud. Find the Langfuse team in Las Vegas, Nov 30 to Dec 4, and every way to use Langfuse with AWS.";

const ogImageUrl = buildOgImageUrl({ title, description });

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
