import type { Metadata } from "next";
import WideSectionPage, { generateWideSectionMetadata } from "../WideSectionPage";

export const metadata: Metadata = await generateWideSectionMetadata("watch-demo");

export default function Page() {
  return <WideSectionPage section="watch-demo" />;
}
