import { financialServicesReasons } from "./content";

export function HeroReasons() {
  return (
    <ul className="mt-8">
      {financialServicesReasons.map((reason, index) => (
        <li
          key={reason.title}
          className="grid grid-cols-[36px_minmax(0,1fr)] gap-2 border-t border-dashed border-line-divider-dash py-3 first:border-t-0 first:pt-0"
        >
          <span className="pt-0.5 font-mono text-[11px] text-text-tertiary">
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
