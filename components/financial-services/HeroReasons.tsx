import { financialServicesReasons } from "./content";

type Reason = { title: string; body: string };

export function HeroReasons({
  reasons = financialServicesReasons,
}: {
  reasons?: readonly Reason[];
} = {}) {
  return (
    <ul className="mt-8">
      {reasons.map((reason, index) => (
        <li
          key={reason.title}
          className="grid grid-cols-[36px_minmax(0,1fr)] items-center gap-2 border-t border-dashed border-line-divider-dash py-3 first:border-t-0 first:pt-0"
        >
          <span className="font-mono text-[11px] leading-none text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="text-[14px] leading-[1.45] text-text-secondary">
            <span className="font-medium text-text-primary">
              {reason.title}
            </span>
            : {reason.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
