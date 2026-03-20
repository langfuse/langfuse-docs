import { Layout } from "@/components/layout";

export default function HomeLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
