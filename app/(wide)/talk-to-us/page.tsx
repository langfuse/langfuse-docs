import type { Metadata } from "next";
import WideSectionPage, { generateWideSectionMetadata } from "../WideSectionPage";

export const metadata: Metadata = await generateWideSectionMetadata("talk-to-us");

export default function Page() {
  return <WideSectionPage section="talk-to-us" />;
}
