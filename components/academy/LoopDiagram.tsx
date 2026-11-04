import { AcademyRowVisual } from "@/components/home/academy-loop/AcademyRowVisual";
import type { LoopStepId } from "@/components/home/academy-loop/steps";

export function LoopDiagram({ highlight }: { highlight?: LoopStepId } = {}) {
  return <AcademyRowVisual highlight={highlight} className="my-8" />;
}
