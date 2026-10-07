import { financialServicesTrustPoints } from "./content";

export function TrustPoints() {
  return (
    <ol>
      {financialServicesTrustPoints.map((point, index) => (
        <li
          key={point.title}
          className="grid grid-cols-[36px_minmax(0,1fr)] gap-2 border-t border-dashed border-line-divider-dash py-4 first:border-t-0 first:pt-0"
        >
          <span className="font-mono text-[11px] text-text-tertiary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div>
            <p className="text-[16px] font-medium leading-[1.3] text-text-primary">
              {point.title}
            </p>
            <p className="mt-1 text-[14px] leading-[1.45] text-text-secondary">
              {point.body}{" "}
              <a
                href={point.href}
                className="text-text-primary underline decoration-line-structure underline-offset-4 hover:text-text-primary"
              >
                {"Docs →"}
              </a>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
