import { Background } from "./Background";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function ScheduleDemoPage() {
  return (
    <section className="flex flex-col gap-10 w-full min-h-screen items-center py-20">
      <div className="text-center">
        <h1>Schedule Demo</h1>
        <p className="text-lg text-primary/80 mt-3">
          Talk to the founders to learn more about AssistMe
        </p>
      </div>
      <ScheduleDemo />
      <Background />
    </section>
  );
}

export function ScheduleDemo() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);
  return (
    <Cal
      calLink="marc-kl/demo"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
