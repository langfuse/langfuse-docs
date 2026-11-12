"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { CornerBox } from "@/components/ui/corner-box";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReinventOfferForm } from "@/components/reinvent/ReinventOfferForm";

const activities = [
  {
    kind: "Booth",
    title: "ClickHouse booth #706",
    when: "Nov 30, 4:00 pm to Dec 3, 2:00 pm PT",
    where: "Expo floor, Venetian",
    body: "Find the Langfuse team at the ClickHouse booth for live demos of tracing, evaluation, and agents on AWS.",
  },
  {
    kind: "Breakout",
    title:
      "Open source agent observability and evals with AgentCore and Langfuse",
    when: "Tuesday, Dec 1, 3:00–4:00 pm PT",
    where: "MGM Grand. Session AIM278-S",
    body: "Sixty minutes on capturing OpenTelemetry traces, debugging tool calls, and turning production failures into evaluations.",
  },
  {
    kind: "Partners LIVE",
    title: "AWS Partners LIVE! AI segment",
    when: "Tuesday, Dec 1, 11:20–11:50 am PT",
    where: "AWS Partner Zone, booth #1686-E, Venetian",
    body: "A short segment on the expo floor. Stop by the partner zone before the afternoon breakout.",
  },
  {
    kind: "Workshop",
    title: "Observability for AI agents: Strands, OpenTelemetry, and Langfuse",
    when: "Repeated through the week. Search OPN304 in the session catalog.",
    where: "AWS hands-on workshop",
    body: "Bring a laptop. AWS runs this session: deploy a Strands agent to AgentCore Runtime and send the traces to Langfuse.",
  },
] as const;

const integrations = [
  {
    title: "Amazon Bedrock AgentCore",
    href: "/integrations/frameworks/amazon-agentcore",
    logo: "/images/integrations/amazon_agentcore_icon.svg",
    body: "Trace agents on AgentCore Runtime, including tool calls and the OpenTelemetry spans around them.",
  },
  {
    title: "Strands Box",
    href: "/integrations/frameworks/strands-box",
    logo: "/images/integrations/strands_agents_icon.svg",
    body: "Run a Strands agent in Box, with declared filesystem, network, and credential access, and forward the trace through your own collector.",
  },
  {
    title: "Strands agents",
    href: "/integrations/frameworks/strands-agents",
    logo: "/images/integrations/strands_agents_icon.svg",
    body: "Instrument the Strands SDK with OpenTelemetry and inspect each model call, tool, and agent run.",
  },
  {
    title: "Amazon Bedrock",
    href: "/integrations/model-providers/amazon-bedrock",
    logo: "/images/integrations/bedrock_icon.svg",
    body: "Capture traces, tokens, and cost for Bedrock model calls from the SDK or from a framework Langfuse already supports.",
  },
  {
    title: "Amazon Bedrock Agents",
    href: "/integrations/model-providers/amazon-bedrock-agents",
    logo: "/images/integrations/bedrock_icon.svg",
    body: "Trace a Bedrock Agents invocation together with the model calls it makes.",
  },
  {
    title: "Bedrock in the AI Gateway",
    href: "/docs/gateway/features/models#supported-providers",
    logo: "/images/integrations/bedrock_icon.svg",
    body: "Send Bedrock model calls through the Langfuse AI Gateway so each request is traced and provider keys stay in one place.",
  },
  {
    title: "Self-host on AWS",
    href: "/self-hosting/deployment/aws",
    logo: null,
    body: "Deploy Langfuse in your own AWS account with the Terraform guide.",
  },
] as const;

function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("w-full px-4 md:px-8", className)}>
      {children}
    </section>
  );
}

export function ReinventLanding() {
  return (
    <div className="flex flex-col gap-16 pb-20 pt-6 sm:gap-20 sm:pt-10">
      <Section>
        <div className="grid items-start gap-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[12px] text-text-tertiary">
              AWS re:Invent 2026, Las Vegas, Nov 30 to Dec 4
            </p>
            <Heading as="h1" size="big" className="mt-4 max-w-[12ch] text-left">
              Start building today!
            </Heading>
            <p className="mt-5 max-w-[42ch] text-[17px] leading-[150%] text-text-secondary">
              Sign up and get 90% off the Core Plan base fee for your first 12
              months. 100k monthly events included. Volume pricing applies.
            </p>
          </div>
          <ReinventOfferForm />
        </div>
      </Section>

      <Section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Heading
            as="h2"
            id="schedule"
            size="large"
            className="scroll-mt-24 text-left"
          >
            Where to find us
          </Heading>
          <p className="max-w-[62ch] text-[15px] leading-[150%] text-text-secondary">
            The Langfuse team is on the expo floor, in a breakout, at Partners
            LIVE!, and in the AWS workshop. Times are Pacific.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {activities.map((activity) => (
            <CornerBox key={activity.kind} className="flex flex-col gap-3 p-5">
              <p className="font-mono text-[12px] text-text-tertiary">
                {activity.kind}
              </p>
              <h3 className="text-[18px] font-medium leading-[130%] text-text-primary">
                {activity.title}
              </h3>
              <p className="text-[14px] leading-[150%] text-text-secondary">
                {activity.when}
              </p>
              <p className="text-[14px] leading-[150%] text-text-secondary">
                {activity.where}
              </p>
              <p className="text-[14px] leading-[150%] text-text-secondary">
                {activity.body}
              </p>
            </CornerBox>
          ))}
        </div>
        <CornerBox className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[12px] text-text-tertiary">Evening</p>
            <h3 className="text-[18px] font-medium leading-[130%] text-text-primary">
              ClickHouse House Party
            </h3>
            <p className="max-w-[62ch] text-[14px] leading-[150%] text-text-secondary">
              Tuesday, Dec 1, 9:00 pm to midnight PT at Intrigue in the Wynn.
              The Langfuse team will be there. Request a ticket if you want to
              join.
            </p>
          </div>
          <Button
            href="https://clickhouse.com/houseparty/reinvent"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="default"
            wrapperClassName="w-full sm:w-fit"
          >
            Request a ticket
          </Button>
        </CornerBox>
      </Section>

      <Section className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Heading
            as="h2"
            id="integrations"
            size="large"
            className="scroll-mt-24 text-left"
          >
            Langfuse on AWS
          </Heading>
          <p className="max-w-[62ch] text-[15px] leading-[150%] text-text-secondary">
            Guides for the AWS products we will be talking about at the booth
            and in the sessions.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {integrations.map((integration) => (
            <Link
              key={integration.href}
              href={integration.href}
              className="group block h-full no-underline"
            >
              <CornerBox
                hoverStripes
                className="flex h-full flex-col gap-3 p-5"
              >
                <div className="flex items-center gap-3">
                  {integration.logo ? (
                    <img
                      src={integration.logo}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7"
                    />
                  ) : null}
                  <h3 className="text-[16px] font-medium leading-[130%] text-text-primary">
                    {integration.title}
                  </h3>
                </div>
                <p className="text-[14px] leading-[150%] text-text-secondary">
                  {integration.body}
                </p>
                <span className="mt-auto text-[13px] text-text-primary underline">
                  Read the guide
                </span>
              </CornerBox>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <CornerBox className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex flex-col gap-2">
            <Heading as="h2" size="normal" className="text-left">
              Want time with the team
            </Heading>
            <p className="max-w-[52ch] text-[15px] leading-[150%] text-text-secondary">
              Tell us what you are building on AWS and we will find a slot
              during the week.
            </p>
          </div>
          <Button
            href="/talk-to-us"
            size="default"
            wrapperClassName="w-full sm:w-fit"
          >
            Talk to us
          </Button>
        </CornerBox>
      </Section>
    </div>
  );
}
