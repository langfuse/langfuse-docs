import { Stream } from "@cloudflare/stream-react";

export default function DemoVideo() {
  const cloudflareVideoId = "babadb14f745612e7bd428f53c8cc1c6";

  return (
    <div
      style={{
        marginTop: "1rem",
        marginBottom: "4rem",
        overflow: "hidden",
        borderRadius: "0.5rem",
        boxShadow: "0 0 25px 1px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Stream controls src={cloudflareVideoId} />
    </div>
  );
}
