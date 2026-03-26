import type { Metadata } from "next";
import MarketingPage, { generateMarketingMetadata } from "../MarketingPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateMarketingMetadata("pricing");
}

export default function Page() {
  return <MarketingPage section="pricing" />;
}
