// Server component — fetches customer stories server-side and passes them to CustomerIndex.
import { usersSource } from "@/lib/source";
import { CustomerIndex } from "./CustomerIndex";
import { type CustomerStory } from "./CustomerCarousel";

interface CustomerIndexWrapperProps {
  maxItems?: number;
}

export function CustomerIndexWrapper({ maxItems }: CustomerIndexWrapperProps) {
  const stories: CustomerStory[] = usersSource.getPages().map((page) => ({
    route: page.url,
    frontMatter: page.data as unknown as CustomerStory["frontMatter"],
  }));
  return <CustomerIndex stories={stories} maxItems={maxItems} />;
}
