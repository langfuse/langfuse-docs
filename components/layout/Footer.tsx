import { CornerBox } from "@/components/ui/corner-box";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import IconGithub from "@/components/icons/github";
import IconDiscord from "@/components/icons/discord";
import IconX from "@/components/icons/x";
import IconYoutube from "@/components/icons/youtube";
import IconLinkedin from "@/components/icons/linkedin";
import InkeepChatButton from "@/components/inkeep/InkeepChatButton";
import { cn } from "@/lib/utils";

const socialLinks = [
  { name: "GitHub", href: "https://github.com/langfuse/langfuse", icon: IconGithub },
  { name: "Discord", href: "/discord", icon: IconDiscord },
  { name: "X", href: "https://x.com/langfuse", icon: IconX },
  { name: "YouTube", href: "https://www.youtube.com/@langfuse", icon: IconYoutube },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/langfuse/", icon: IconLinkedin },
];

const menuItems: { heading: string; items: { name: string; href: string }[] }[] = [
  {
    heading: "Product",
    items: [
      { name: "Observability", href: "/docs/observability/overview" },
      { name: "Prompt Management", href: "/docs/prompt-management/overview" },
      { name: "Evaluations", href: "/docs/evaluation/overview" },
      { name: "Metrics", href: "/docs/metrics/overview" },
      { name: "Playground", href: "/docs/prompt-management/features/playground" },
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
      { name: "API Reference", href: "/docs/api-and-data-platform/overview" },
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
      { name: "Customers", href: "/users" },
      { name: "AI Engineering Library", href: "/library" },
      { name: "Guides & Cookbooks", href: "/guides" },
    ],
  },
  {
    heading: "Company",
    items: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Media Kit", href: "/media-kit" },
      { name: "Press", href: "/press" },
      { name: "Security", href: "/security" },
      { name: "Support", href: "/support" },
      { name: "Open source", href: "/handbook/chapters/open-source" },
    ],
  },
];

const bottomLinks = [
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
  { name: "Imprint", href: "/imprint" },
  { name: "Cookie Policy", href: "/cookie-policy" },
];

const linkClassName =
  "text-text-tertiary transition-colors hover:text-text-primary";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("mx-auto w-full px-4 sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px] pb-8 mt-20", className)}>
      {/* Social icons row */}
      <CornerBox className="flex gap-5 items-center p-4 -mb-px">
        {socialLinks.map((s) => {
          const Icon = s.icon;
          const isExternal = s.href.startsWith("http");
          return (
            <Link
              key={s.name}
              href={s.href}
              aria-label={s.name}
              className={linkClassName}
              {...(isExternal && { target: "_blank", rel: "nofollow noreferrer" })}
            >
              <Icon className="size-5" />
            </Link>
          );
        })}
      </CornerBox>
      <CornerBox className="flex flex-col">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 p-4 md:grid-cols-4">
          {menuItems.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <Text
                size="s"
                className="font-mono text-left text-text-disabled"
              >
                {col.heading}
              </Text>
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={linkClassName}>
                      <Text size="m" className="text-left text-inherit transition-[color]">
                        {item.name}
                      </Text>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CornerBox>
      <CornerBox className="flex flex-col -mt-px">
        {/* Bottom bar */}
        <div className="flex flex-wrap gap-y-2 gap-x-6 items-center p-4">
          <div className="flex flex-wrap gap-y-1 gap-x-4">
            {bottomLinks.map((link) => (
              <Link key={link.name} href={link.href} className={linkClassName}>
                <Text size="s" className="text-left font-mono text-inherit transition-[color]">
                  {link.name}
                </Text>
              </Link>
            ))}
          </div>
        </div>
      </CornerBox>
      <CornerBox className="flex justify-between items-center p-4 -mt-px">
        <Text size="s" className="font-mono text-left text-text-disabled">
          &copy; 2022&ndash;{new Date().getFullYear()} Langfuse GmbH / Finto Technologies Inc.
        </Text>
        <Text size="s" className="font-mono text-left text-text-disabled">
          Design by{" "}
          <Link
            href="https://altalogy.com"
            target="_blank"
            rel="nofollow noreferrer"
            className={linkClassName}
          >
            <span>Altalogy</span>
          </Link>
        </Text>
      </CornerBox>
      <InkeepChatButton />
    </footer>
  );
}
