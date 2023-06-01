import { Stream } from "@cloudflare/stream-react";

export default function DemoVideo() {
  const cloudflareVideoId = "dd8e215b11a494d2ce4409e4a95b52df";

  return (
    <div className="mt-1 mb-4 overflow-hidden rounded-lg shadow-lg aspect-[1.55] bg-slate-50 bg-cover bg-[url('/demo_thumbnail.jpg')]">
      <Stream
        controls
        src={cloudflareVideoId}
        poster="https://langfuse.com/demo_thumbnail.jpg"
      />
    </div>
  );
}
