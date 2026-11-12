import type { Metadata } from "next";
import { ReinventLanding } from "@/components/reinvent/ReinventLanding";

const title = "Start building today";
const description =
  "Sign up and get 90% off the Core Plan base fee for your first 12 months. 100k monthly events included. Volume pricing applies. AWS re:Invent, Las Vegas, Nov 30 to Dec 4, 2026.";

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
