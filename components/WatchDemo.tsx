import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CheckCircle2, FileText, PlayCircle } from "lucide-react";
import { Quote } from "@/components/Quote";
import Link from "next/link";
import { useRouter } from "next/router";
import { Cards as NextraCards } from "nextra/components";
import { HomeSection } from "./home/components/HomeSection";

const DEMO_TABS = [
  {
    id: "intro",
    label: "Introduction",
    title: "Introduction to Langfuse",
    description:
      "Get an overview of the complete Langfuse platform and learn how it helps teams build better LLM applications through observability, prompt management, and evaluation.",
    icon: PlayCircle,
    videoSrc:
      "https://www.youtube-nocookie.com/embed/zzOlFH0iD0k?si=7-0CQ_19-kgjmuEB",
    cta: "Any questions after watching this video? Consider watching the other videos, check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      { title: "Technical documentation", href: "/docs" },
      { title: "Why Langfuse?", href: "/why" },
      { title: "Interactive demo project", href: "/docs/demo" },
      { title: "Enterprise resources", href: "/enterprise" },
      {
        title: "Create a free Langfuse Cloud account",
        href: "https://cloud.langfuse.com",
      },
      { title: "Self-hosting documentation", href: "/self-hosting" },
      { title: "Talk to us", href: "/talk-to-us" },
    ],
  },
  {
    id: "observability",
    label: "Observability",
    title: "LLM Observability & Tracing",
    description:
      "Learn how to trace, monitor, and debug your LLM applications with comprehensive observability features including traces, generations, and performance metrics.",
    icon: BarChart3,
    videoSrc:
      "https://www.youtube-nocookie.com/embed/pTneXS_m1rk?si=tldcmS8TvZSkrL8m",
    cta: "Any questions after watching this video? Check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      {
        title: "Introduction to LLM/Agent Observability",
        href: "/docs/observability",
      },
      {
        title: "Get started guide",
        href: "/docs/observability/get-started",
      },
      {
        title:
          "Integration overview (SDKs, Frameworks, Model providers, Gateways, OpenTelemetry)",
        href: "/integrations",
      },
      {
        title: "Observability data model",
        href: "/docs/observability/data-model",
      },
    ],
  },
  {
    id: "prompt",
    label: "Prompts",
    title: "Prompt Management & Engineering",
    description:
      "Discover how to manage, version, and optimize your prompts with collaborative editing, A/B testing, and seamless integration with your applications.",
    icon: FileText,
    videoSrc:
      "https://www.youtube-nocookie.com/embed/KGyj_NJgKDY?si=UbUDinSYl01doQFQ",
    cta: "Any questions after watching this video? Check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      {
        title: "Introduction to Prompt Management",
        href: "/docs/prompt-management",
      },
      {
        title: "Get started guide",
        href: "/docs/prompt-management/get-started",
      },
    ],
  },
  {
    id: "evaluation",
    label: "Evaluation",
    title: "LLM Application Evaluation",
    description:
      "Explore how to systematically evaluate your LLM applications using datasets, scoring methods, and automated evaluation workflows to ensure quality and performance.",
    icon: CheckCircle2,
    videoSrc:
      "https://www.youtube-nocookie.com/embed/hlgfW0IyREc?si=PTj8K2cDbnumIpBL",
    cta: "Any questions after watching this video? Check out the resources at the bottom of the page, or reach out to us.",
    learnMoreLinks: [
      {
        title:
          "Introduction to Evaluation (online/offline, evaluation methods)",
        href: "/docs/evaluation",
      },
    ],
  },
];

export function WatchDemoPage() {
  const router = useRouter();

  // Get current tab from query param or default to first tab
  const activeTab = (() => {
    const tab = router.query.tab as string;
    if (tab && DEMO_TABS.some((t) => t.id === tab)) {
      return tab;
    }
    return DEMO_TABS[0].id;
  })();

  // Handle tab change and update URL query param
  const handleTabChange = (value: string) => {
    const query = { ...router.query };

    query.tab = value;

    router.replace({ pathname: router.pathname, query }, undefined, {
      shallow: true,
    });
  };

  return (
    <HomeSection className="px-0">
      <Header
        title="Langfuse Demo"
        description="End-to-end demo of all Langfuse platform features"
        h="h1"
      />
      <div className="flex flex-col gap-8 items-center">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="h-auto p-2 gap-2 md:gap-4 flex-wrap justify-center mx-auto flex-col sm:flex-row">
            {DEMO_TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-none h-auto items-center justify-center md:gap-2 md:px-4 md:py-3 text-center whitespace-nowrap flex-row"
              >
                <tab.icon className="size-5" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {DEMO_TABS.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              className="mt-2 p-4 border rounded bg-card"
            >
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{tab.title}</h3>
                <p>{tab.description}</p>
                <Quote
                  quote={tab.cta}
                  authorName="Marc Klingen"
                  authorTitle="Co-founder and CEO"
                  authorImageSrc="/images/people/marcklingen.jpg"
                  className="mt-4"
                />
              </div>
              <iframe
                width="100%"
                className="aspect-[16/9] rounded border w-full"
                src={tab.videoSrc}
                title={`Langfuse ${tab.label.toLowerCase()} video`}
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              <div className="mt-4">
                <div className="text-sm font-medium mb-1">Learn more:</div>
                <ul className="list-disc list pl-6">
                  {tab.learnMoreLinks.map((item) => (
                    <li key={`${tab.id}-${item.href}`} className="my-2">
                      <Link
                        className="_text-primary-600 _underline _decoration-from-font [text-underline-position:from-font]"
                        href={item.href}
                      >
                        <span className="">{item.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </HomeSection>
  );
}

export const WatchDemoCards = () => (
  <NextraCards num={2}>
    {DEMO_TABS.map((tab) => (
      <NextraCards.Card
        key={tab.id}
        title={tab.title}
        href={`/watch-demo?tab=${tab.id}`}
        icon={<tab.icon />}
      />
    ))}
  </NextraCards>
);
