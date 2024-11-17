import { Background } from "./Background";
import { ScheduleDemo } from "./CalComScheduleDemo";
import { Header } from "./Header";

export function ScheduleDemoPage() {
  return (
    <section className="flex flex-col gap-10 w-full min-h-screen items-center py-20">
      <Header
        title="Talk to us"
        description="Get a demo by one of the founders to learn more about Langfuse"
        h="h1"
        buttons={[
          {
            href: "/enterprise",
            text: "Enterprise FAQ",
          },
          {
            href: "/video",
            text: "Watch 3 min demo",
          },
          {
            href: "/docs",
            text: "Docs",
          },
        ]}
      />
      <ScheduleDemo />
      <Background />
    </section>
  );
}
