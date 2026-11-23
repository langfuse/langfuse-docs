import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";

const discounts = [
  {
    name: "Early-stage startups",
    description: "US$2,000 in credits, first year",
    cta: {
      text: "Learn more and apply",
      href: "/startups",
    },
  },
  {
    name: "Research / Students",
    description: "US$2,000 in credits, first year",
    cta: {
      text: "Learn more and apply",
      href: "/research",
    },
  },
];

export const PricingDiscounts = () => (
  <div className="pt-8 mx-auto mt-8" id="discounts">
    <div>
      <Heading as="h2" size="normal" className="text-left mb-4">
        Discounts
      </Heading>
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-3">
        {discounts.map((discount) => (
          <CornerBox
            key={discount.name}
            hoverStripes
            className="p-4 -mt-px -ml-px flex flex-col gap-2"
          >
            <Text as="dt" className="text-left font-medium text-text-secondary">
              {discount.name}
            </Text>
            <Text as="dd" size="s" className="text-left">
              {discount.description}
            </Text>
            {discount.cta && (
              <div className="mt-auto pt-2 self-start">
                <Button
                  size="small"
                  variant="secondary"
                  href={discount.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group-hover:border-line-structure hover:border-line-cta"
                >
                  {discount.cta.text}
                </Button>
              </div>
            )}
          </CornerBox>
        ))}
      </div>
      <Text size="s" className="mt-6 max-w-4xl text-left">
        Reach out to{" "}
        <Link href="mailto:support@langfuse.com" className="underline">
          support@langfuse.com
        </Link>{" "}
        if you have questions about a discount. We want all startups and
        educational users to build with Langfuse and are happy to work with you
        to make that happen.
      </Text>
    </div>
  </div>
);
