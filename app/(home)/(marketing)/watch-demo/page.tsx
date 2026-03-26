import type { Metadata } from "next";
import MarketingPage, { generateMarketingMetadata } from "../MarketingPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateMarketingMetadata("watch-demo");
}

export default function Page() {
  return <MarketingPage section="watch-demo" />;
}
