import { PageChrome } from "@/components/home/layout/PageChrome";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageChrome>{children}</PageChrome>;
}
