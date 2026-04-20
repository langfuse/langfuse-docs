"use client";

import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";
import { FeaturedCustomers } from "./FeaturedCustomers";
import { BulletList } from "./BulletList";
import securityVisual from "./img/visuals/visual-security.svg";

const architecture = [
  { label: "Clickhouse OLAP database", href: "/self-hosting/deployment/infrastructure/clickhouse" },
  { label: "Async ingestion via Redis queue", href: "/self-hosting/deployment/infrastructure/cache" },
  { label: "S3/Blob storage for large payloads", href: "/self-hosting/deployment/infrastructure/blobstorage" },
  { label: "Edge-cached prompts", href: "/docs/prompt-management/features/caching" },
];

const openApis = [
  { label: "23M+ SDK installs/month", href: "/docs/observability/sdk/overview" },
  { label: "10+ billion observations processed per month" },
  { label: "2300+ customers" },
  { label: "99.9% uptime" },
];

const security = [
  { label: "SOC 2 Type II", href: "/security/soc2" },
  { label: "ISO 27001", href: "/security/iso27001" },
  { label: "GDPR", href: "/security/gdpr" },
  { label: "EU, US & Japan Data Regions", href: "/security/data-regions" },
  { label: "HIPAA eligible", href: "/security/hipaa" },
];

export const Enterprise = () => {
  return (
    <HomeSection id="scale-and-security" className="pt-[120px]">
      <div className="flex flex-col gap-4 items-start mb-10">
        <Heading>
          Enterprise <span className="min-[340px]:whitespace-nowrap"><TextHighlight>Scale<span className="hidden min-[340px]:inline">&nbsp;</span></TextHighlight><span className="whitespace-nowrap"><TextHighlight>and Security</TextHighlight>.</span></span>
        </Heading>
        <Text className="text-left max-w-[64ch]">
          Traditional observability handles many small spans. LLM systems run differently.
          Every step carries rich, verbose I/O that legacy platforms can't handle at scale.
          Langfuse ingests and queries LLM traces reliably at enterprise scale while following strict compliance frameworks.
        </Text>
      </div>

      <div className="flex flex-col-reverse items-stretch sm:grid sm:grid-cols-2">
        <div className="flex flex-col flex-1">
          <CornerBox hoverStripes className="flex flex-col flex-1 gap-3 p-3 -mt-px sm:p-4">
            <Text size="m" className="font-medium text-left text-text-secondary">Architecture</Text>
            <BulletList items={architecture} />
          </CornerBox>
          <CornerBox hoverStripes className="flex flex-col flex-1 gap-3 p-3 -mt-px sm:p-4">
            <Text size="m" className="font-medium text-left text-text-secondary">Reliability at Scale</Text>
            <BulletList items={openApis} />
          </CornerBox>
        </div>

        <CornerBox hoverStripes className="flex relative flex-col -mt-px md:-ml-px min-h-[350px]">
          <div className="flex flex-col gap-3 p-4">
            <Text size="m" className="font-medium text-left text-text-secondary">Security & Compliance</Text>
            <BulletList items={security} />
          </div>
          <div className="flex absolute bottom-0 flex-1 justify-center items-center pointer-events-none">
            <Image src={securityVisual} alt="Security" width={100} height={100} className="object-contain w-full h-full" />
          </div>
        </CornerBox>
      </div>

      <FeaturedCustomers />
    </HomeSection>
  );
};
