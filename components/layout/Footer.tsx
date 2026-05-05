import { CornerBox } from "@/components/ui/corner-box";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import IconGithub from "@/components/icons/github";
import IconDiscord from "@/components/icons/discord";
import IconX from "@/components/icons/x";
import IconYoutube from "@/components/icons/youtube";
import IconLinkedin from "@/components/icons/linkedin";
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
      { name: "Handbook", href: "/handbook" },
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
const footerTextClassName = "text-[13px] leading-[150%] lg:leading-[150%]";
const footerMonoTextClassName = cn(footerTextClassName, "font-mono");
const footerLinkTextClassName = cn(
  footerTextClassName,
  "text-left text-inherit transition-[color]"
);
const footerMonoLinkTextClassName = cn(
  footerMonoTextClassName,
  "text-left text-inherit transition-[color]"
);
const footerMutedTextClassName = cn(
  footerMonoTextClassName,
  "text-left text-text-disabled"
);

export function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "px-4 pb-8 mx-auto mt-20 w-full sm:px-8 md:px-0 md:max-w-[680px] xl:max-w-[840px]",
        className
      )}
    >
      {/* Social icons row */}
      <CornerBox className="flex gap-5 items-center p-4 -mb-px bg-transparent">
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
      <CornerBox className="flex flex-col bg-transparent">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 justify-between items-stretch p-4 md:flex md:flex-row">
          {menuItems.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <Text
                size="s"
                className={footerMutedTextClassName}
              >
                {col.heading}
              </Text>
              <ul className="flex flex-col gap-3">
                {col.items.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className={linkClassName}>
                      <Text
                        size="s"
                        className={footerLinkTextClassName}
                      >
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
      <CornerBox className="flex flex-col -mt-px bg-transparent">
        {/* Bottom bar */}
        <div className="flex flex-wrap gap-y-2 gap-x-6 items-center px-4 py-2.5">
          <div className="flex flex-wrap gap-y-1 gap-x-4 max-[390px]:gap-x-3">
            {bottomLinks.map((link) => (
              <Link key={link.name} href={link.href} className={linkClassName}>
                <Text
                  size="s"
                  className={footerMonoLinkTextClassName}
                >
                  {link.name}
                </Text>
              </Link>
            ))}
          </div>
        </div>
      </CornerBox>
      <CornerBox className="flex flex-col gap-y-4 sm:flex-row justify-between sm:items-center px-4 py-2.5 -mt-px bg-transparent">
        <div className="flex flex-col md:flex-row">
          <Text
            size="s"
            className={footerMutedTextClassName}
          >
            &copy; 2022&ndash;{new Date().getFullYear()} Langfuse GmbH
          </Text>
          {' '}
          <Text
            size="s"
            className={footerMutedTextClassName}
          >
            / Finto Technologies Inc.
          </Text>
        </div>
        <Text size="s" className={footerMutedTextClassName}>
          Design by{" "}
          <Link
            href="https://altalogy.com/?ref=langfuse"
            target="_blank"
            rel="nofollow noreferrer"
            className={linkClassName}
          >
            <span>Altalogy</span>
          </Link>
        </Text>
      </CornerBox>
    </footer>
  );
}
