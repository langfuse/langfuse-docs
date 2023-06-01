import { Stream } from "@cloudflare/stream-react";

export default function DemoVideo() {
  const cloudflareVideoId = "dd8e215b11a494d2ce4409e4a95b52df";

  return (
    <div className="mt-3 mb-6 overflow-hidden rounded-xl shadow-lg aspect-[1.55] ring-1 ring-slate-700 bg-slate-50 bg-cover bg-[url('/demo_thumbnail.jpg')]">
      <Stream
        controls
        src={cloudflareVideoId}
        poster="https://langfuse.com/demo_thumbnail.jpg"
      />
    </div>
  );
}
