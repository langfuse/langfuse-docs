import { PageChrome } from "@/components/layout";

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageChrome>{children}</PageChrome>;
}
