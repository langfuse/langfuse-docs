import { getIndexCustomerStories } from "@/lib/getCustomerStories";
import { CustomerStoriesHero } from "./CustomerStoriesHero";

export function CustomerStoriesHeroWrapper() {
  return <CustomerStoriesHero stories={getIndexCustomerStories()} />;
}
