import type { Metadata } from "next";
import MarketingPage, { generateMarketingMetadata } from "../MarketingPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateMarketingMetadata("talk-to-us");
}

export default function Page() {
  return <MarketingPage section="talk-to-us" />;
}
