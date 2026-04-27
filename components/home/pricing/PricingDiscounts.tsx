import { Button } from "@/components/ui/button";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import Link from "next/link";

const discounts = [
  {
    name: "Early-stage startups",
    description: "50% off, first year",
    cta: {
      text: "Learn more and apply",
      href: "/startups",
    },
  },
  {
    name: "Research / Students",
    description: "Up to 100% off, limits apply",
    cta: {
      text: "Learn more and apply",
      href: "/research",
    },
  },
  {
    name: "Non-profits",
    description: "USD 199 in credits / month",
    cta: {
      text: "Learn more and apply",
      href: "/non-profit",
    },
  },
  {
    name: "Open-source projects",
    description: "USD 300 in credits / month, first year",
  },
];

export const PricingDiscounts = () => (
  <div className="pt-8 mx-auto mt-8" id="discounts">
    <div>
      <Heading as="h2" size="normal" className="text-left mb-4">
        Discounts
      </Heading>
      <div className="grid grid-cols-1 mt-3 sm:grid-cols-2 lg:grid-cols-4">
        {discounts.map((discount) => (
          <CornerBox
            key={discount.name}
            hoverStripes
            className="p-4 -mt-px -ml-px flex flex-col gap-2"
          >
            <Text
              as="dt"
              className="text-left font-medium text-text-secondary"
            >
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
        to apply for a discount. We want all startups, educational users,
        non-profits and open source projects to build with Langfuse and are
        happy to work with you to make that happen.
      </Text>
    </div>
  </div>
);
