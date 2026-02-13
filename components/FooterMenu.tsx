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
      { name: "Metrics", href: "/docs/metrics" },
      { name: "Playground", href: "/docs/playground" },
      { name: "Pricing", href: "/pricing" },
      { name: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    heading: "Developers",
    items: [
      { name: "Documentation", href: "/docs" },
      { name: "Python SDK", href: "/docs/sdk/python/sdk-v3" },
      { name: "JS/TS SDK", href: "/docs/sdk/typescript/guide" },
      { name: "Integrations", href: "/integrations" },
      {
        name: "API Reference",
        href: "/docs/api-and-data-platform/overview",
      },
      { name: "Self-Hosting", href: "/self-hosting" },
      { name: "Guides & Cookbooks", href: "/guides" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { name: "Blog", href: "/blog" },
      { name: "Changelog", href: "/changelog" },
      { name: "Roadmap", href: "/docs/roadmap" },
      { name: "Interactive Demo", href: "/demo" },
      { name: "Customers", href: "/customers" },
      { name: "AI Engineering Library", href: "/library" },
      { name: "Status", href: "https://status.langfuse.com" },
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
      { name: "Talk to Us", href: "/talk-to-us" },
      { name: "Open Source", href: "/open-source" },
    ],
  },
];

const bottomLinks: { name: string; href: string }[] = [
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
  { name: "Imprint", href: "/imprint" },
  { name: "Cookie Policy", href: "/cookie-policy" },
  { name: "SOC 2 Type II", href: "/security/soc2" },
  { name: "ISO 27001", href: "/security/iso27001" },
  { name: "GDPR", href: "/security/gdpr" },
  { name: "HIPAA", href: "/security/hipaa" },
  { name: "\u{1F1EF}\u{1F1F5} Japanese", href: "/jp" },
  { name: "\u{1F1F0}\u{1F1F7} Korean", href: "/kr" },
  { name: "\u{1F1E8}\u{1F1F3} Chinese", href: "/cn" },
];

const FooterMenu = () => {
  return (
    <div className="w-full">
      {/* Social icons */}
      <div className="flex justify-end gap-4 pb-6 mb-6 border-b border-border/50">
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
              <Icon className="h-5 w-5" />
            </a>
          );
        })}
      </div>

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
      <div className="border-t border-border/50 mt-8 pt-4">
        <div className="flex flex-wrap gap-x-4 gap-y-2">
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
        <div className="mt-4 font-mono text-sm">
          &copy; 2022-{new Date().getFullYear()} Langfuse GmbH / Finto
          Technologies Inc.
        </div>
      </div>

      <InkeepChatButton />
    </div>
  );
};

export default FooterMenu;
