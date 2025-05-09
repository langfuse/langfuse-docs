import Link from "next/link";
import InkeepChatButton from "./inkeep/InkeepChatButton";

const menuItems: {
  heading: string;
  items: (
    | { name: string; href: string; notificationCount?: number }
    | "separator"
  )[];
}[] = [
  {
    heading: "Platform",
    items: [
      {
        name: "LLM Tracing",
        href: "/docs/tracing",
      },
      {
        name: "Prompt Management",
        href: "/docs/prompts/get-started",
      },
      {
        name: "Evaluation",
        href: "/docs/scores/overview",
      },
      {
        name: "Manual Annotation",
        href: "/docs/scores/annotation",
      },
      {
        name: "Datasets",
        href: "/docs/datasets/overview",
      },
      {
        name: "Metrics",
        href: "/docs/analytics",
      },
      {
        name: "Playground",
        href: "/docs/playground",
      },
    ],
  },
  {
    heading: "Integrations",
    items: [
      {
        name: "Python SDK",
        href: "/docs/sdk/python",
      },
      {
        name: "JS/TS SDK",
        href: "/docs/sdk/typescript/guide",
      },
      {
        name: "OpenAI SDK",
        href: "/docs/integrations/openai/get-started",
      },
      {
        name: "Langchain",
        href: "/docs/integrations/langchain/tracing",
      },
      {
        name: "Llama-Index",
        href: "/docs/integrations/llama-index/get-started",
      },
      {
        name: "Litellm",
        href: "/docs/integrations/litellm/tracing",
      },
      {
        name: "Dify",
        href: "/docs/integrations/dify",
      },
      {
        name: "Flowise",
        href: "/docs/integrations/flowise",
      },
      {
        name: "Langflow",
        href: "/docs/integrations/langflow",
      },
      {
        name: "Vercel AI SDK",
        href: "/docs/integrations/vercel-ai-sdk",
      },
      {
        name: "Instructor",
        href: "/docs/integrations/instructor",
      },
      {
        name: "Mirascope",
        href: "/docs/integrations/mirascope",
      },
      {
        name: "API",
        href: "/docs/api",
      },
    ],
  },
  {
    heading: "Resources",
    items: [
      { name: "Documentation", href: "/docs" },
      {
        name: "Interactive Demo",
        href: "/demo",
      },
      {
        name: "Video demo (10 min)",
        href: "/watch-demo",
      },
      {
        name: "Changelog",
        href: "/changelog",
      },
      {
        name: "Roadmap",
        href: "/docs/roadmap",
      },
      {
        name: "Pricing",
        href: "/pricing",
      },
      {
        name: "Enterprise",
        href: "/enterprise",
      },
      {
        name: "Self-hosting",
        href: "/self-hosting",
      },
      {
        name: "Open Source",
        href: "/open-source",
      },
      { name: "Why Langfuse?", href: "/why" },
      {
        name: "Langfuse Academy",
        href: "/academy",
      },
      {
        name: "Status",
        href: "https://status.langfuse.com",
      },
      {
        name: "🇯🇵 Japanese",
        href: "/jp",
      },
      {
        name: "🇰🇷 Korean",
        href: "/kr",
      },
      {
        name: "🇨🇳 Chinese",
        href: "/cn",
      },
    ],
  },
  {
    heading: "About",
    items: [
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers", notificationCount: 4 },
      {
        name: "About us",
        href: "/about",
      },
      { name: "Support", href: "/support" },
      {
        name: "Schedule Demo",
        href: "/schedule-demo",
      },
      {
        name: "OSS Friends",
        href: "/oss-friends",
      },
      {
        name: "Twitter",
        href: "https://x.com/langfuse",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/company/langfuse/",
      },
    ],
  },

  {
    heading: "Legal",
    items: [
      { name: "Security", href: "/security" },
      { name: "Imprint", href: "/imprint" },
      {
        name: "Terms",
        href: "/terms",
      },
      {
        name: "Privacy",
        href: "/privacy",
      },
      "separator",
      {
        name: "SOC 2 Type II",
        href: "/security/soc2",
      },
      {
        name: "ISO 27001",
        href: "/security/iso27001",
      },
      {
        name: "GDPR",
        href: "/security/gdpr",
      },
      {
        name: "HIPAA",
        href: "/security/hipaa",
      },
    ],
  },
];

const FooterMenu = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-5 text-base gap-y-8 gap-x-2">
        {menuItems.map((menu) => (
          <div key={menu.heading}>
            <p className="pb-4 font-mono font-bold text-primary">
              {menu.heading}
            </p>
            <ul className="flex flex-col gap-3 items-start">
              {menu.items.map((item, index) => {
                if (item === "separator") {
                  return (
                    <li key={`separator-${index}`} className="w-4 my-1">
                      <hr className="border-border/50" />
                    </li>
                  );
                }
                return (
                  <li key={item.name} className="relative flex gap-1">
                    <Link
                      href={item.href}
                      className="text-sm hover:text-primary/80"
                    >
                      {item.name}
                    </Link>
                    {item.notificationCount > 0 && (
                      <span className="transform -translate-y-1/4 bg-primary text-primary-foreground rounded-full h-3 w-3 text-[0.6rem] flex items-center justify-center">
                        {item.notificationCount}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
        <div />
      </div>
      <div className="my-8 font-mono text-sm">
        © 2022-{new Date().getFullYear()} Langfuse GmbH / Finto Technologies
        Inc.
      </div>
      <InkeepChatButton />
    </div>
  );
};

export default FooterMenu;
