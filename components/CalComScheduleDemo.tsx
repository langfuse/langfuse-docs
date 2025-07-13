import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export function ScheduleDemo({
  className,
  region,
}: {
  className?: string;
  region: "us" | "eu";
}) {
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

  const calLink =
    region === "us" ? "team/langfuse/intro" : "team/langfuse/intro-eu";

  return (
    <Cal
      calLink={calLink}
      className={className}
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view" }}
    />
  );
}
