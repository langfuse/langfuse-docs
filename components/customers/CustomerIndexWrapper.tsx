// Server component — no "use client". Fetches customer stories server-side
// and passes them as props to the client-side CustomerIndex.
// Use this in MDX files instead of CustomerIndex when you need path-based fetching.
import { getPagesForRoute } from "@/lib/source";
import { CustomerIndex } from "./CustomerIndex";
import { type CustomerStory } from "./CustomerCarousel";

interface CustomerIndexWrapperProps {
  path?: string;
  maxItems?: number;
}

export function CustomerIndexWrapper({
  path = "/customers",
  maxItems,
}: CustomerIndexWrapperProps) {
  const stories = getPagesForRoute(path) as CustomerStory[];
  return <CustomerIndex stories={stories} maxItems={maxItems} />;
}
