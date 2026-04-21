import { HomeLayout } from "@/components/layout";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HomeLayout>{children}</HomeLayout>;
}
