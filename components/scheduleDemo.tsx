"use client";

import { useRouter } from "next/router";
import { Background } from "./Background";
import { Header } from "./Header";
import { ScheduleDemo } from "./CalComScheduleDemo";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { getGitHubStars } from "@/lib/github-stars";
import Link from "next/link";
import { SDK_INSTALLS_PER_MONTH, DOCKER_PULLS } from "@/components/home/Usage";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { WatchWalkthroughsPage } from "@/components/walkthroughs/WatchWalkthroughsPage";
import { HomeSection } from "./home/components/HomeSection";
import { EnterpriseLogoGrid } from "./shared/EnterpriseLogoGrid";

function SwitchToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <span className="text-sm font-medium">Talk to us</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} alwaysOn />
      <span className="text-sm font-medium">Discover yourself</span>
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
        <span className="text-sm font-semibold">{name}</span>
        <span className="text-xs text-muted-foreground">{title}</span>
      </div>
    </div>
  );
}

function TalkToUsContent() {
  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">Talk to a human</h2>
      <div>
        <p>
          Get all of Langfuse's core features plus enterprise capabilities to
          suit your business and workflow:
        </p>
        <ul className="flex flex-col gap-2 mt-2">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <span>Get a Demo</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <span>Get Volume Pricing</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <span>Pay by Invoice</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <span>Ask questions about our Security & Compliance Policies</span>
          </li>
        </ul>
      </div>
      <p>
        Langfuse is the most widely adopted LLM Engineering platform with over{" "}
        <strong className="font-semibold">
          {getGitHubStars().toLocaleString()} GitHub stars
        </strong>
        ,{" "}
        <strong className="font-semibold">
          {(SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(1)}M+ SDK installs per
          month
        </strong>
        , and{" "}
        <strong className="font-semibold">
          {(DOCKER_PULLS / 1_000_000).toFixed(0)}M+ Docker pulls
        </strong>
        . Selected customers who built great LLM applications with Langfuse:
      </p>
      <EnterpriseLogoGrid small />

      <div className="mt-2">
        <p>We are looking forward to talk to you,</p>
        <div className="flex flex-col sm:flex-row gap-6 mt-4">
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
    { href: "/pricing", label: "Pricing" },
    { href: "/enterprise", label: "Enterprise FAQ" },
    { href: "/docs", label: "Documentation" },
    { href: "/self-hosting", label: "Self-hosting docs" },
    { href: "/demo", label: "Interactive Example Project" },
    { href: "/security", label: "Security Center" },
    { href: "/ask-ai", label: "Questions? Ask AI" },
    { href: "/support", label: "Contact Support" },
    {
      href: "https://cloud.langfuse.com",
      label: "Create a free account (no credit card required)",
    },
  ];

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight">
        Discover Langfuse yourself
      </h2>
      <div>
        <p>Explore our resources to learn more about Langfuse:</p>
        <ul className="flex flex-col gap-2 mt-2">
          {links.map((link) => (
            <li key={link.href} className="flex items-start gap-3">
              <ArrowRight className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <Link
                href={link.href}
                className="text-primary underline underline-offset-4 hover:text-primary/80 hover:underline-offset-2 transition-all font-medium"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <p>
          Questions?{" "}
          <Link
            href="/ask-ai"
            className="text-primary underline underline-offset-4 hover:text-primary/80 hover:underline-offset-2 transition-all font-medium"
          >
            Ask AI
          </Link>{" "}
          or{" "}
          <Link
            href="/support"
            className="text-primary underline underline-offset-4 hover:text-primary/80 hover:underline-offset-2 transition-all font-medium"
          >
            reach out to us
          </Link>
          ,
        </p>
        <div className="flex flex-col sm:flex-row gap-6 mt-4">
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

function CalendarSection() {
  return (
    <div className="min-h-[300px] overflow-y-auto max-w-sm mx-auto rounded-lg border overflow-hidden">
      <ScheduleDemo />
    </div>
  );
}

export function ScheduleDemoPage() {
  const router = useRouter();

  // Get current mode from query param
  const isDiscoverOpen = (() => {
    const mode = router.query.mode as string;
    return mode === "discover";
  })();

  // Handle switch change and update URL query param
  const handleSwitchChange = (checked: boolean) => {
    const query = { ...router.query };
    if (checked) {
      query.mode = "discover";
    } else {
      delete query.mode;
    }

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <HomeSection>
      <Header
        title="Get a Demo"
        h="h1"
        description="Learn more about Langfuse — talk to us or discover yourself"
      />

      <div className="w-full max-w-6xl px-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Left Column: Content based on switch */}
          <div className="flex-1 flex flex-col gap-4">
            <SwitchToggle
              checked={isDiscoverOpen}
              onCheckedChange={handleSwitchChange}
            />
            {!isDiscoverOpen ? (
              <TalkToUsContent />
            ) : (
              <DiscoverYourselfContent />
            )}
          </div>

          {/* Right Column: Calendar or Walkthroughs */}
          <div className="flex-1">
            {!isDiscoverOpen ? <CalendarSection /> : <WatchWalkthroughsPage />}
          </div>
        </div>
      </div>

      <Background />
    </HomeSection>
  );
}
