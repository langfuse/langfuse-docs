import { getCustomerStories } from "@/lib/getCustomerStories";
import { CustomerHoverList } from "./CustomerHoverList";

export function CustomerHoverListWrapper({ maxItems }: { maxItems?: number }) {
  return (
    <CustomerHoverList stories={getCustomerStories()} maxItems={maxItems} />
  );
}
