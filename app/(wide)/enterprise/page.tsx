import type { Metadata } from "next";
import WideSectionPage, { generateWideSectionMetadata } from "../WideSectionPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateWideSectionMetadata("enterprise");
}

export default function Page() {
  return <WideSectionPage section="enterprise" />;
}
