"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";

export const Enterprise = () => {
  return (
    <HomeSection id="enterprise" className="pt-20 lg:pt-10 2xl:pt-20">
      <div className="flex flex-col gap-4 items-start">
        <Heading>
          Enterprise-Grade <TextHighlight>Scale and Security</TextHighlight>
        </Heading>
        <Text className="text-left max-w-[48ch]">
          Traditional observability backends choke on LLM trace volumes.
          A single agent run generates thousands of spans.
          Langfuse is made for AI workloads at enterprise scale and security.
        </Text>
      </div>
      <div>
      </div>
      <CornerBox className="p-4 -mt-px min-h-[72px] flex flex-col justify-center">
      </CornerBox>
    </HomeSection>
  );
};
