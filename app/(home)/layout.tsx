import { HomeLayout } from "@/components/layout";

export default function HomeLayoutRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HomeLayout>{children}</HomeLayout>
    </>
  );
}
