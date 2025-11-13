import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function ScheduleDemo({ className }: { className?: string }) {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        styles: { branding: { brandColor: "#000000" } },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      calLink="team/langfuse/intro"
      className={className}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
