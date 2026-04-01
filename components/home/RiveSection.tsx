"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HomeSection } from "@/components/home/HomeSection";
import { CornerBox, Heading, TextHighlight } from "@/components/ui";
import { Text } from "@/components/ui/text";

const RiveAnimation = dynamic(
  () => import("@/components/rive/RiveAnimation").then((m) => m.RiveAnimation),
  { ssr: false }
);

const RIVE_FILE = "/animations/langfuse_axonometric.riv";

type RiveLabel = {
  heading: string;
  body: string;
};

const LABELS: Record<string, RiveLabel> = {
  "obs-active": { heading: "Observability", body: "Capture every LLM call, tool invocation, and user interaction as a structured trace." },
  "prompts-active": { heading: "Prompt Management", body: "Version, deploy, and A/B test prompts without redeploying your application." },
  "evals-active": { heading: "Evaluations", body: "Score model outputs with LLM-as-a-judge, human review, or custom scorers." },
  "playground-active": { heading: "Playground", body: "Iterate on prompts and model settings interactively against real production traces." },
  "human-active": { heading: "Human Annotation", body: "Route traces to reviewers, collect feedback, and build ground-truth datasets." },
  "exp-active": { heading: "Experiments", body: "Run offline evaluations against curated datasets to measure regressions before shipping." },
  "metrics-active": { heading: "Metrics", body: "Track cost, latency, and quality metrics across models, users, and releases." },
};

export const RiveSection = () => {
  const [label, setLabel] = useState<RiveLabel>(LABELS["obs-active"]);

  return (
    <HomeSection id="demo" className="pt-20 lg:pt-10 2xl:pt-20">
      <div className="flex flex-col gap-4 items-start">
        <Heading>
          Made for the <TextHighlight>entire development life-cycle.</TextHighlight>
        </Heading>
        <Text className="text-left max-w-[48ch]">
          Most teams build prompts locally, deploy them, then lose visibility.
          LLM Engineering Helps you ship AI Applications from prototype to production at scale.
        </Text>
      </div>
      <div className="p-4 -mt-px h-[480px]">
        <RiveAnimation
          src={RIVE_FILE}
          stateMachine="Langfuse_SM"
          fit="cover"
          zoom={1.3}
          className="w-full h-full"
          onStateChange={(states) => {
            const match = states.find((s) => s in LABELS);
            if (match) setLabel(LABELS[match]);
          }}
        />
      </div>
      <CornerBox className="p-4 -mt-px min-h-[72px] flex flex-col justify-center">
        <div key={label.heading} className="rive-text-enter flex flex-col gap-1.5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
            {label.heading}
          </p>
          <Text className="text-left">{label.body}</Text>
        </div>
      </CornerBox>
    </HomeSection>
  );
};
