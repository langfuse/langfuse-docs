import { financialServicesReasons } from "./content";

export function HeroReasons() {
  return (
    <ul className="mt-6 space-y-3">
      {financialServicesReasons.map((reason, index) => (
        <li key={reason.title} className="flex gap-3">
          <span className="pt-0.5 font-mono text-[10px] text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-[14px] leading-[1.3] text-text-primary">
              {reason.title}
            </p>
            <p className="mt-0.5 text-[13px] leading-[1.4] text-text-secondary">
              {reason.body}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
