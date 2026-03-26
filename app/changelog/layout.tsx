import { HomeLayout } from "@/components/layout";

export default function ChangelogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout>{children}</HomeLayout>;
}
