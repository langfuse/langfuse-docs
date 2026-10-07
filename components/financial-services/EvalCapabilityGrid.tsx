import { Check } from "lucide-react";
import { financialServicesEvalCapabilities } from "./content";

export function EvalCapabilityGrid() {
  return (
    <ul className="mt-8 grid list-none gap-x-10 gap-y-5 p-0 md:grid-cols-2">
      {financialServicesEvalCapabilities.map((item) => (
        <li key={item.title} className="flex gap-3">
          <Check
            className="mt-0.5 h-4 w-4 shrink-0 text-text-primary"
            strokeWidth={2.5}
            aria-hidden
          />
          <p className="m-0 text-[14px] leading-[1.45] text-text-secondary">
            <span className="font-medium text-text-primary">{item.title}</span>
            {": "}
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
