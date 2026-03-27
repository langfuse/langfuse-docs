"use client";

import dynamic from "next/dynamic";

const RiveAnimation = dynamic(
  () => import("@/components/rive/RiveAnimation").then((m) => m.RiveAnimation),
  { ssr: false }
);

const FILE = "/animations/langfuse_axonometric.riv";

/**
 * /rive — Rive animation test page.
 * State machine: "Langfuse_SM"
 */
export default function RiveTestPage() {
  return (
    <div className="flex flex-col gap-10 px-6 py-12 mx-auto max-w-4xl">
      <h1 className="mb-1 text-2xl font-semibold">Rive animation test</h1>
      <section className="flex flex-col gap-2">
        <div className="overflow-hidden w-full rounded-lg border h-100 border-line-structure bg-surface-1">
          <RiveAnimation
            src={FILE}
            stateMachine="Langfuse_SM"
            fit="cover"
            className="w-full h-full"
          />
        </div>
      </section>
    </div>
  );
}
