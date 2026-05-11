const plans = [
  { id: "hobby", label: "Hobby" },
  { id: "core", label: "Core" },
  { id: "pro", label: "Pro" },
  { id: "enterprise", label: "Enterprise" },
  { id: "selfHosted", label: "Self Hosted" },
] as const;

const availabilities: {
  id: string;
  label?: string;
}[] = [
    {
      id: "ee",
      label: "Enterprise Edition",
    },
    {
      id: "team-add-on",
      label: "Teams Add-on required",
    },
    { id: "full", label: "Available" },
    { id: "private-beta", label: "Private Beta" },
    { id: "public-beta", label: "Public Beta" },
    { id: "not-available", label: "Not Available" },
  ];

export function AvailabilityBanner(props: {
  availability: Record<
    (typeof plans)[number]["id"],
    (typeof availabilities)[number]["id"]
  >;
}) {
  const availablePlans = plans
    .filter((plan) => plan.id in props.availability)
    .map((plan) => ({
      ...plan,
      availability: availabilities.find(
        (availability) => availability.id === props.availability[plan.id]
      ),
    }));

  return (
    <div className="my-4 border relative border-line-structure bg-surface-bg">
      <div className="flex list-none items-center justify-between px-4 py-2 text-text-primary with-stripes border-b border-line-structure">
        Where is this feature available?
      </div>
      <ul className="grid justify-between px-0! my-0! divide-y md:divide-x md:divide-y-0 md:grid-cols-5 grid-cols-1 not-prose">
        {availablePlans.map((plan) => (
          <li
            key={plan.id}
            className="grid grid-cols-2 md:grid-cols-1 relative px-4 py-2 md:py-4 not-prose items-center gap-y-1"
          >
            <div className="text-xs font-medium">{plan.label}</div>
            <span className="text-xs">
              {plan.availability.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
