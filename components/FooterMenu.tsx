import Link from "next/link";
import InkeepChatButton from "./inkeep/InkeepChatButton";
import IconGithub from "@/components/icons/github";
import IconDiscord from "@/components/icons/discord";
import IconX from "@/components/icons/x";
import IconYoutube from "@/components/icons/youtube";
import IconLinkedin from "@/components/icons/linkedin";

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/langfuse/langfuse",
    icon: IconGithub,
  },
  {
    name: "Discord",
    href: "/discord",
    icon: IconDiscord,
  },
  {
    name: "X",
    href: "https://x.com/langfuse",
    icon: IconX,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@langfuse",
    icon: IconYoutube,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/langfuse/",
    icon: IconLinkedin,
  },
];

const menuItems: {
  heading: string;
  items: { name: string; href: string }[];
}[] = [
  {
    heading: "Product",
    items: [
      { name: "Observability", href: "/docs/observability/overview" },
      {
        name: "Prompt Management",
        href: "/docs/prompt-management/overview",
      },
      { name: "Evaluation", href: "/docs/evaluation/overview" },
      { name: "Metrics", href: "/docs/metrics/overview" },
      {
        name: "Playground",
        href: "/docs/prompt-management/features/playground",
      },
      { name: "Pricing", href: "/pricing" },
      { name: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    heading: "Developers",
    items: [
      { name: "Documentation", href: "/docs" },
      { name: "Self-Hosting", href: "/self-hosting" },
      { name: "SDKs", href: "/docs/observability/sdk/overview" },
      { name: "Integrations", href: "/integrations" },
      {
        name: "API Reference",
        href: "/docs/api-and-data-platform/overview",
      },
      { name: "Status", href: "https://status.langfuse.com" },
      { name: "Talk to Us", href: "/talk-to-us" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { name: "Blog", href: "/blog" },
      { name: "Changelog", href: "/changelog" },
      { name: "Roadmap", href: "/docs/roadmap" },
      { name: "Interactive Demo", href: "/docs/demo" },
      { name: "Customers", href: "/customers" },
      { name: "AI Engineering Library", href: "/library" },
      { name: "Guides & Cookbooks", href: "/guides" },
    ],
  },
  {
    heading: "Company",
    items: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Security", href: "/security" },
      { name: "Support", href: "/support" },
      { name: "Open Source", href: "/handbook/chapters/open-source" },
    ],
  },
];

const bottomLinks: { name: string; href: string }[] = [
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
  { name: "Imprint", href: "/imprint" },
  { name: "Cookie Policy", href: "/cookie-policy" },
];

const FooterMenu = () => {
  return (
    <div className="w-full">
      {/* Link columns */}
      <div className="grid grid-cols-2 md:grid-cols-4 text-base gap-y-8 gap-x-2">
        {menuItems.map((menu) => (
          <div key={menu.heading}>
            <p className="pb-4 font-mono font-bold text-primary">
              {menu.heading}
            </p>
            <ul className="flex flex-col gap-3 items-start">
              {menu.items.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm hover:text-primary/80"
                    prefetch={false}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Legal bar + copyright */}
      <div className="border-t border-border/50 mt-8 pt-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
          &copy; 2022-{new Date().getFullYear()} Langfuse GmbH / Finto
          Technologies Inc.
        </span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-center flex-1">
          {bottomLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-xs text-muted-foreground hover:text-primary/80"
              prefetch={false}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-3 shrink-0">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            const isExternal = link.href.startsWith("http");
            return (
              <a
                key={link.name}
                href={link.href}
                aria-label={link.name}
                className="text-muted-foreground hover:text-primary transition-colors"
                {...(isExternal && {
                  target: "_blank",
                  rel: "nofollow noreferrer",
                })}
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>

      <InkeepChatButton />
    </div>
  );
};

export default FooterMenu;
