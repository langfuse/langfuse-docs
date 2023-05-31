import { Stream } from "@cloudflare/stream-react";

export default function DemoVideo() {
  const cloudflareVideoId = "babadb14f745612e7bd428f53c8cc1c6";

  return (
    <div className="mt-1 mb-4 overflow-hidden rounded-lg shadow-lg aspect-[1.6] bg-slate-50 bg-cover bg-[url('/demo_thumbnail.jpg')]">
      <Stream
        controls
        src={cloudflareVideoId}
        poster="https://langfuse.com/demo_thumbnail.jpg"
      />
    </div>
  );
}
