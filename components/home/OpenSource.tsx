import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { BulletList } from "./BulletList";

const cards = [
  {
    title: "MIT License",
    bullets: [
      "Same code for cloud and self-hosted.",
      "All product features licensed.",
      "Fork, modify, contribute.",
    ],
  },
  {
    title: "Large OSS Community",
    bullets: [
      "22,000+ GitHub stars",
      "400+ contributors",
      "5,000+ Discord members",
    ],
  },
  {
    title: "OpenTelemetry Native",
    bullets: [
      "SDKs built on OTEL.",
      "Standard trace format.",
      "Export anywhere, import from any OTEL library.",
    ],
  },
  {
    title: "Open APIs",
    bullets: [
      "REST API for everything.",
      "Query SDK.",
      "Export to S3, blob storage, BigQuery, Snowflake, etc.",
    ],
  },
];

export const OpenSource = () => {
  return (
    <HomeSection id="open-source" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading className="text-left max-w-[12ch] sm:max-w-none">
          <TextHighlight>Open Platform.</TextHighlight> Open Source.
        </Heading>
        <Text className="text-left max-w-[48ch]">
          We are huge fans of open standards and data portability. Langfuse won&apos;t lock in your data, ever.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2">
        {cards.map((card) => {
          return (
            <CornerBox
              key={card.title}
              hoverStripes
              className="flex flex-col gap-1 p-3 -mt-px -ml-px sm:p-4"
            >
              <Text className="font-medium text-left text-text-secondary">
                {card.title}
              </Text>
              <BulletList items={card.bullets.map((b) => ({ label: b }))} />
            </CornerBox>
          );
        })}
      </div>
    </HomeSection>
  );
};
