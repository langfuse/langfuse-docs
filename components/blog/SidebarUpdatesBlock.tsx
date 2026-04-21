import { Text } from "@/components/ui/text";
import { ProductUpdateSignup } from "@/components/ProductUpdateSignup";

export function SidebarUpdatesBlock({ source }: { source: string }) {
  return (
    <div className="pb-px bg-line-structure">
      <div className="px-4 py-4 rounded-sm bg-surface-1">
        <Text
          size="s"
          className="mb-2 font-[430] text-left text-[13px] text-text-primary"
        >
          Receive Updates
        </Text>
        <Text
          size="s"
          className="mb-3 text-left text-[13px] text-text-tertiary leading-snug"
        >
          One email per month with our latest ships and product announcements.
        </Text>
        <ProductUpdateSignup
          source={source}
          small
          compact
          className="flex-col items-start"
        />
      </div>
    </div>
  );
}
