import Link from "next/link";

const menuItems: {
  heading: string;
  items: { name: string; href: string }[];
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
        href: "/docs/integrations/litellm",
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
        href: "/docs/sdk/typescript/example-vercel-ai",
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
        href: "https://api.reference.langfuse.com/",
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
        name: "Video demo (3 min)",
        href: "/video",
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
        href: "/docs/deployment/self-host",
      },
      {
        name: "Open Source",
        href: "/docs/open-source",
      },
      { name: "Why Langfuse?", href: "/why" },
      {
        name: "Status",
        href: "https://status.langfuse.com",
      },
    ],
  },
  {
    heading: "About",
    items: [
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
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
    ],
  },
];

const FooterMenu = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-5 text-base gap-y-8 gap-x-2">
        {menuItems.map((menu) => (
          <div key={menu.heading}>
            <p className="pb-2 font-mono font-bold text-primary">
              {menu.heading}
            </p>
            <ul className="flex flex-col gap-2">
              {menu.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm leading-tight hover:text-primary/80"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div />
      </div>
      <div className="my-8 font-mono text-sm">
        © 2022-{new Date().getFullYear()} Langfuse GmbH
      </div>
    </div>
  );
};

export default FooterMenu;
