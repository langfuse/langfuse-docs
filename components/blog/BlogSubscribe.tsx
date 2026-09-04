import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { ProductUpdateSignup } from "@/components/ProductUpdateSignup";

export function BlogSubscribe() {
  return (
    <div className="mt-12">
      <CornerBox hoverStripes className="flex flex-col gap-5 px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-2">
          <Heading as="h2" size="normal" className="text-left text-[24px]">
            Get the monthly note
          </Heading>
          <Text className="max-w-[48ch] text-left">
            One email per month with new posts, ships, and product
            announcements. No weekly drip.
          </Text>
        </div>
        <ProductUpdateSignup source="blog-index" />
      </CornerBox>
    </div>
  );
}
