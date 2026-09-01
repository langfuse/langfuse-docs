import { PageChrome } from "@/components/layout";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageChrome>{children}</PageChrome>;
}
