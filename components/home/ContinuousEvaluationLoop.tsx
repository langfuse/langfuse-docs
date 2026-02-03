import { HomeSection } from "./components/HomeSection";

const EvaluationLoopDiagram = () => (
  <div className="w-full max-w-lg mx-auto">
    <div className="relative">
      {/* Top row boxes */}
      <div className="flex items-center justify-between mb-16">
        <div className="px-6 py-4 border-2 border-primary/20 rounded-lg bg-background text-center min-w-[120px]">
          <div className="font-medium text-sm leading-tight">Trace</div>
          <div className="font-medium text-sm leading-tight">Real User</div>
          <div className="font-medium text-sm leading-tight">Behavior</div>
        </div>

        <div className="px-6 py-4 border-2 border-primary/20 rounded-lg bg-background text-center min-w-[120px]">
          <div className="font-medium text-sm leading-tight">Eval &</div>
          <div className="font-medium text-sm leading-tight">Monitor</div>
        </div>
      </div>

      {/* Bottom box */}
      <div className="flex justify-center">
        <div className="px-8 py-4 border-2 border-primary/20 rounded-lg bg-background text-center min-w-[120px]">
          <div className="font-medium text-sm">Iterate</div>
        </div>
      </div>

      {/* Connecting arrows using SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 400 200"
        fill="none"
      >
        {/* Arrow from Trace to Eval & Monitor */}
        <path
          d="M 140 40 L 260 40"
          stroke="currentColor"
          strokeWidth="2"
          className="text-orange-500"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrow from Trace down and right to Iterate */}
        <path
          d="M 80 60 Q 80 120 200 160"
          stroke="currentColor"
          strokeWidth="2"
          className="text-orange-500"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Arrow from Eval & Monitor down and left to Iterate */}
        <path
          d="M 320 60 Q 320 120 200 160"
          stroke="currentColor"
          strokeWidth="2"
          className="text-orange-500"
          fill="none"
          markerEnd="url(#arrowhead)"
        />

        {/* Define arrowhead marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="currentColor"
              className="text-orange-500"
            />
          </marker>
        </defs>
      </svg>
    </div>
  </div>
);

export default function ContinuousEvaluationLoop() {
  return (
    <HomeSection>
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-8 sm:gap-y-20 xl:mx-0 xl:max-w-none xl:grid-cols-2 items-center">
        <div className="xl:pr-8 xl:pt-4">
          <div className="xl:max-w-lg">
            <h2 className="text-base font-semibold leading-7 text-primary/70">
              Continuous Improvement
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Production Evaluation Loop
            </p>
            <p className="mt-6 text-lg leading-8 text-primary/70">
              Close the loop between production monitoring and development. Use
              real user data to continuously improve your LLM application
              through systematic evaluation and iteration.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-primary">
                    Real-world insights
                  </p>
                  <p className="text-sm text-primary/70">
                    Learn from actual user interactions and edge cases in
                    production
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-primary">
                    Continuous monitoring
                  </p>
                  <p className="text-sm text-primary/70">
                    Track quality, cost, and latency metrics across all your LLM
                    calls
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-medium text-primary">
                    Systematic improvement
                  </p>
                  <p className="text-sm text-primary/70">
                    Use evaluation results to iterate and improve your
                    application systematically
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-center xl:order-last">
          <EvaluationLoopDiagram />
        </div>
      </div>
    </HomeSection>
  );
}
