import type { Metadata } from "next";
import WideSectionPage, { generateWideSectionMetadata } from "../WideSectionPage";

export const metadata: Metadata = await generateWideSectionMetadata("pricing-self-host");

export default function Page() {
  return <WideSectionPage section="pricing-self-host" />;
}
