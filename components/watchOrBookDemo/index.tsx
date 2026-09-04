"use client";

import { MarketoContactForm } from "@/components/MarketoContactForm";
import { CheckCircle2 } from "lucide-react";
import { getGitHubStars } from "@/lib/github-stars";
import {
  DOCKER_PULLS,
  formatSdkInstallsPerMonth,
} from "@/components/home/Usage";
import Image from "next/image";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { TextHighlight } from "@/components/ui/text-highlight";

function TeamMemberCard({
  imageSrc,
  name,
  title,
  alt,
}: {
  imageSrc: string;
  name: string;
  title: string;
  alt: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={imageSrc}
        alt={alt}
        width={36}
        height={36}
        className="rounded-full aspect-square object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-[580]">{name}</span>
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
    </div>
  );
}

function TalkToUsContent() {
  return (
    <>
      <Heading as="h2">Talk to a human</Heading>
      <div className="not-prose">
        <Text className="text-left">
          Get all of Langfuse's core features plus enterprise capabilities to
          suit your business and workflow:
        </Text>
        <ul className="flex flex-col gap-2 my-4">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">
              Get a Demo
            </Text>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">
              Get Volume Pricing
            </Text>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">
              Pay by Invoice
            </Text>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">
              Ask questions about our Security & Compliance Policies
            </Text>
          </li>
        </ul>
      </div>
      <Text className="text-left not-prose">
        Langfuse is the most widely adopted AI Engineering platform with{" "}
        <strong className="font-[580]">
          {getGitHubStars().toLocaleString()} GitHub stars
        </strong>
        ,{" "}
        <strong className="font-[580]">
          {formatSdkInstallsPerMonth()} SDK installs per month
        </strong>
        , and{" "}
        <strong className="font-[580]">
          {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+ Docker pulls
        </strong>
        .
      </Text>
      <Text className="text-left not-prose">
        Selected customers who built great LLM applications with Langfuse:
      </Text>
      <EnterpriseLogoGrid small />

      <div className="mt-2">
        <Text className="text-left not-prose">
          We are looking forward to talk to you,
        </Text>
        <div className="flex flex-col gap-6 mt-4">
          <TeamMemberCard
            imageSrc="/images/people/akionuernberger.jpg"
            name="Akio Nuernberger"
            title="Enterprise & Partnerships"
            alt="Akio Nuernberger"
          />
          <TeamMemberCard
            imageSrc="/images/people/marcklingen.jpg"
            name="Marc Klingen"
            title="Co-founder & CEO"
            alt="Marc Klingen"
          />
        </div>
      </div>
    </>
  );
}

function ContactFormSection() {
  return (
    <div className="relative w-full max-w-md mx-auto p-4 bg-stripe-pattern corner-box-corners border border-line-structure">
      <MarketoContactForm />
    </div>
  );
}

export function Demo() {
  return (
    <HomeSection>
      <div className="not-prose flex flex-col gap-2 mb-6 items-center text-center text-balance">
        <Heading as="h1" size="large" className="m-0">
          <TextHighlight>Get a demo</TextHighlight>
        </Heading>
        <Text className="m-0">
          Learn more about how Langfuse can help your team
        </Text>
      </div>

      <div className="w-full max-w-6xl px-4 not-prose">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Value proposition */}
          <div className="flex flex-1 flex-col gap-8">
            <TalkToUsContent />
          </div>

          {/* Right Column: Contact form */}
          <div className="flex-1">
            <ContactFormSection />
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
