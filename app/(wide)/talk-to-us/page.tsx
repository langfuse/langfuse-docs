import type { Metadata } from "next";
import WideSectionPage, { generateWideSectionMetadata } from "../WideSectionPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateWideSectionMetadata("talk-to-us");
}

export default function Page() {
  return <WideSectionPage section="talk-to-us" />;
}
