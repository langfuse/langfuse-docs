import type { Metadata } from "next";
import MarketingPage, { generateMarketingMetadata } from "../MarketingPage";

export async function generateMetadata(): Promise<Metadata> {
  return generateMarketingMetadata("pricing-self-host");
}

export default function Page() {
  return <MarketingPage section="pricing-self-host" />;
}
