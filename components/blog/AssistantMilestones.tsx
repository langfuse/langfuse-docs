import milestones from "./assistant-milestones.json";

export function AssistantMilestones() {
  return (
    <figure className="not-prose py-6">
      <figcaption className="mb-8 text-sm text-primary/60">
        Assistant milestones in 2026
      </figcaption>
      <ol className="grid md:grid-cols-5">
        {milestones.map((milestone) => (
          <li
            key={milestone.date}
            className="group relative grid grid-cols-[0.5rem_1fr] gap-x-4 pb-6 last:pb-0 md:block md:pb-0"
          >
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[3px] top-2 w-px bg-border group-last:hidden md:bottom-auto md:left-1 md:top-8 md:h-px md:w-full"
            />
            <time
              dateTime={milestone.date}
              className="col-start-2 text-sm leading-4 text-primary/60 md:block"
            >
              {milestone.label}
            </time>
            <div
              aria-hidden="true"
              className="relative col-start-1 row-start-1 mt-1 h-2 w-2 bg-foreground md:my-3"
            />
            <p className="col-start-2 mt-2 text-sm leading-relaxed text-foreground md:pr-4">
              {milestone.description}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
