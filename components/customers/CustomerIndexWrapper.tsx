// Server component — fetches customer stories server-side and passes them to CustomerIndex.
import { getIndexCustomerStories } from "@/lib/getCustomerStories";
import { CustomerIndex } from "./CustomerIndex";

interface CustomerIndexWrapperProps {
  maxItems?: number;
  initialVisible?: number;
  showHeader?: boolean;
  /** Accepted for MDX call sites (e.g. press page); unused. */
  path?: string;
}

export function CustomerIndexWrapper({
  maxItems,
  initialVisible,
  showHeader = true,
}: CustomerIndexWrapperProps) {
  return (
    <CustomerIndex
      stories={getIndexCustomerStories()}
      maxItems={maxItems}
      initialVisible={initialVisible}
      showHeader={showHeader}
    />
  );
}
