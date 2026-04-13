"use client";

import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";
import { BulletList } from "./BulletList";
import securityVisual from "./img/visuals/visual-security.svg";

const architecture = [
  { label: "ClickHouse backend" },
  { label: "Async ingestion via Redis queue" },
  { label: "S3/Blob storage for large payloads" },
  { label: "Edge-cached prompts" },
];

const openApis = [
  { label: "23M+ SDK installs/month" },
  { label: "10+ billion observations processed per month" },
  { label: "2300+ customers, including 19 Fortune 50 companies" },
  { label: "99.9% uptime SLA" },
];

const security = [
  { label: "SOC 2 Type II certified", href: "/security" },
  { label: "ISO 27001 certified", href: "/security" },
  { label: "GDPR compliant", href: "/security" },
  { label: "HIPAA eligible", href: "/security" },
];

export const Enterprise = () => {
  return (
    <HomeSection id="enterprise" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading>
          Enterprise <TextHighlight>Scale and Security</TextHighlight>.
        </Heading>
        <Text className="text-left max-w-[48ch]">
          Traditional observability backends choke on LLM trace volumes.
          A single agent run generates thousands of spans. Langfuse is
          made for AI workloads at enterprise scale and security.
        </Text>
      </div>

      <div className="flex flex-col-reverse items-stretch sm:grid sm:grid-cols-2">
        <div className="flex flex-col flex-1">
          <CornerBox hoverStripes className="flex flex-col flex-1 gap-3 p-3 -mt-px sm:p-4">
            <Text size="s" className="font-medium text-left text-text-secondary">Architecture</Text>
            <BulletList items={architecture} />
          </CornerBox>
          <CornerBox hoverStripes className="flex flex-col flex-1 gap-3 p-3 -mt-px sm:p-4">
            <Text size="s" className="font-medium text-left text-text-secondary">Open APIs</Text>
            <BulletList items={openApis} />
          </CornerBox>
        </div>

        <CornerBox hoverStripes className="flex relative flex-col -mt-px -ml-px min-h-[350px]">
          <div className="flex flex-col gap-3 p-4">
            <Text size="s" className="font-medium text-left text-text-secondary">Security</Text>
            <BulletList items={security} />
          </div>
          <div className="flex absolute bottom-0 flex-1 justify-center items-center">
            <Image src={securityVisual} alt="Security" width={100} height={100} className="object-contain w-full h-full" />
          </div>
        </CornerBox>
      </div>

      <FeaturedCustomers />
    </HomeSection>
  );
};
