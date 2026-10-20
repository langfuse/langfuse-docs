import { cn } from "@/lib/utils";

export const HEX_PUBLIC_METRICS_EMBED_URL =
  "https://app.hex.tech/clickhouse-analytics/app/0349rZiOtG8QDXATQrRCSI/latest?embedded=true";

interface HexDashboardProps {
  title?: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function HexDashboard({
  title = "Langfuse Public Metrics Dashboard",
  width = "100%",
  height = 1200,
  className,
}: HexDashboardProps) {
  return (
    <div
      className={cn(
        "relative mt-5 w-full overflow-hidden rounded border bg-card",
        className,
      )}
    >
      <iframe
        src={HEX_PUBLIC_METRICS_EMBED_URL}
        title={title}
        width={width}
        height={height}
        style={{ border: "none" }}
        loading="lazy"
        className="w-full"
      />
      <a
        href="https://hex.tech/?embed"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-[18px] left-4"
      >
        <img
          src="https://static.hex.site/embed/hex-logo-embed.png"
          alt="Hex - a modern data workspace for collaborative notebooks, data apps, dashboards, and reports."
          className="h-[14px] w-[36.4px] bg-background"
        />
      </a>
    </div>
  );
}
