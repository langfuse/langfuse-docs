import type { Metadata } from "next";
import WideSectionPage, { generateWideSectionMetadata } from "../WideSectionPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateWideSectionMetadata("watch-demo");
}

export default function Page() {
  return <WideSectionPage section="watch-demo" />;
}
