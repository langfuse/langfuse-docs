"use client";

import { Suspense } from "react";
import { Header } from "@/components/Header";
import { ContactSalesForm } from "@/components/ContactSalesForm";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getGitHubStars } from "@/lib/github-stars";
import { Link } from "@/components/ui/link";
import { SDK_INSTALLS_PER_MONTH, DOCKER_PULLS } from "@/components/home/Usage";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { WatchWalkthroughs } from "@/components/watchOrBookDemo/WatchWalkthroughs";
import { HomeSection } from "@/components/home/HomeSection";
import { EnterpriseLogoGrid } from "@/components/shared/EnterpriseLogoGrid";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";

function SwitchToggle({
  checked,
  page,
}: {
  checked: boolean;
  page: "talk-to-us" | "watch-demo";
}) {
  const switchHref = page === "talk-to-us" ? "/watch-demo" : "/talk-to-us";

  return (
    <div className="flex items-center justify-center md:justify-start gap-3 -mt-2 mb-6 md:mb-0">
      <Link
        href="/talk-to-us"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Talk to us
      </Link>
      <Link href={switchHref} className="mt-1.5">
        <Switch checked={checked} alwaysOn />
      </Link>
      <Link
        href="/watch-demo"
        className="text-sm font-medium hover:text-primary transition-colors"
      >
        Watch videos
      </Link>
    </div>
  );
}

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
            <Text size="s" className="text-left text-text-secondary">Get a Demo</Text>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">Get Volume Pricing</Text>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">Pay by Invoice</Text>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-4 w-4 text-primary mt-0.25 shrink-0" />
            <Text size="s" className="text-left text-text-secondary">Ask questions about our Security & Compliance Policies</Text>
          </li>
        </ul>
      </div>
      <Text className="text-left not-prose">
        Langfuse is the most widely adopted LLM Engineering platform with{" "}
        <strong className="font-[580]">
          {getGitHubStars().toLocaleString()} GitHub stars
        </strong>
        ,{" "}
        <strong className="font-[580]">
          {(SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(0)}M+ SDK installs per
          month
        </strong>
        , and{" "}
        <strong className="font-[580]">
          {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+ Docker pulls
        </strong>
        .
      </Text>
      <Text className="text-left not-prose">Selected customers who built great LLM applications with Langfuse:</Text>
      <EnterpriseLogoGrid small />

      <div className="mt-2">
        <Text className="text-left not-prose">We are looking forward to talk to you,</Text>
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

function DiscoverYourselfContent() {
  const links = [
    { href: "/docs", label: "Documentation" },
    { href: "/self-hosting", label: "Self-hosting docs" },
    { href: "/demo", label: "Interactive Example Project" },
    { href: "/pricing", label: "Pricing" },
    { href: "/enterprise", label: "Enterprise FAQ" },
    { href: "/security", label: "Security Center" },
    { href: "/ask-ai", label: "Questions? Ask AI" },
    { href: "/support", label: "Contact Support" },
    {
      href: "/cloud",
      label: "Create a free account (no credit card required)",
    },
  ];

  return (
    <>
      <Heading as="h2">
        Self-serve resources
      </Heading>
      <div>
        <Text className="text-left">Everything you need to get started:</Text>
        <ul className="flex flex-col gap-2 mt-2">
          {links.map((link) => (
            <li key={link.href} className="flex items-start gap-3">
              <ArrowRight className="h-3 w-3 text-text-tertiary mt-0.75 shrink-0" />
              <Link href={link.href} variant="text">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <p>
          Questions?{" "}
          <Link href="/ask-ai" variant="text">
            Ask AI
          </Link>{" "}
          or{" "}
          <Link href="/support" variant="text">
            reach out to us
          </Link>
          .
        </p>
        <div className="flex flex-col gap-6 mt-4">
          <TeamMemberCard
            imageSrc="/images/people/jannikmaierhoefer.jpg"
            name="Jannik Maierhöfer"
            title="Growth Engineer"
            alt="Jannik Maierhöfer"
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
    <div className="relative max-w-md mx-auto p-4 bg-stripe-pattern corner-box-corners border border-line-structure">
      <ContactSalesForm />
    </div>
  );
}

export function Demo({ page }: { page: "talk-to-us" | "watch-demo" }) {
  const isDiscoverOpen = page === "watch-demo";

  return (
    <HomeSection>
      <Header
        title={isDiscoverOpen ? "See Langfuse in Action" : "Get a Demo"}
        h="h1"
        description={
          isDiscoverOpen
            ? "Watch short videos to see how Langfuse helps you build better LLM applications"
            : "Learn more about Langfuse — talk to us or watch videos"
        }
      />

      <div className="w-full max-w-6xl px-4 not-prose">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column: Content based on switch */}
          <div
            className={`flex flex-col gap-8 ${isDiscoverOpen ? "flex-1 md:flex-[0.4]" : "flex-1"
              }`}
          >
            <SwitchToggle checked={isDiscoverOpen} page={page} />
            {!isDiscoverOpen ? (
              <TalkToUsContent />
            ) : (
              <DiscoverYourselfContent />
            )}
          </div>

          {/* Right Column: Calendar or Walkthroughs */}
          <div className={isDiscoverOpen ? "flex-1 md:flex-[0.6]" : "flex-1"}>
            {!isDiscoverOpen ? <ContactFormSection /> : <Suspense><WatchWalkthroughs /></Suspense>}
          </div>
        </div>
      </div>
    </HomeSection>
  );
}
