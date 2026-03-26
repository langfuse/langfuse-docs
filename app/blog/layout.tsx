import { HomeLayout } from "@/components/layout";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout>{children}</HomeLayout>;
}
