const plans = [
  { id: "hobby", label: "Hobby" },
  { id: "core", label: "Core" },
  { id: "pro", label: "Pro" },
  { id: "enterprise", label: "Enterprise" },
  { id: "selfHosted", label: "Self Hosted" },
  { id: "government", label: "Government" },
] as const;

const availabilities: {
  id: string;
  label?: string;
}[] = [
  {
    id: "ee",
    label: "Enterprise Edition",
  },
  { id: "gov", label: "Government plan" },
  {
    id: "team-add-on",
    label: "Teams Add-on required",
  },
  { id: "full", label: "Available" },
  { id: "v4", label: "Langfuse v4+" },
  { id: "v3.179", label: "Langfuse v3.179.0+" },
  { id: "private-beta", label: "Private Beta" },
  { id: "public-beta", label: "Public Beta" },
  { id: "not-available", label: "Not Available" },
];

type PlanId = (typeof plans)[number]["id"];
type AvailabilityId = (typeof availabilities)[number]["id"];

// Government is a self-hosted plan that includes every Enterprise Edition
// feature, so unless a page sets it, it follows the Self Hosted column.
function withGovernment(
  availability: Partial<Record<PlanId, AvailabilityId>>,
): Partial<Record<PlanId, AvailabilityId>> {
  if (availability.government || !availability.selfHosted) return availability;
  const { selfHosted } = availability;
  return {
    ...availability,
    government:
      selfHosted === "ee" || selfHosted === "gov" ? "full" : selfHosted,
  };
}

export function AvailabilityBanner(props: {
  availability: Record<Exclude<PlanId, "government">, AvailabilityId> &
    Partial<Record<"government", AvailabilityId>>;
}) {
  const availability = withGovernment(props.availability);
  const availablePlans = plans
    .filter((plan) => plan.id in availability)
    .map((plan) => ({
      ...plan,
      availability: availabilities.find(
        (option) => option.id === availability[plan.id],
      ),
    }));

  return (
    <div className="my-4 border relative border-line-structure bg-surface-bg">
      <div className="flex list-none items-center justify-between px-4 py-2 text-text-primary with-stripes border-b border-line-structure">
        Where is this feature available?
      </div>
      <ul className="grid justify-between px-0! my-0! divide-y md:divide-x md:divide-y-0 md:grid-cols-6 grid-cols-1 not-prose">
        {availablePlans.map((plan) => (
          <li
            key={plan.id}
            className="grid grid-cols-2 md:grid-cols-1 relative px-4 py-2 md:py-4 not-prose items-center gap-y-1"
          >
            <div className="text-xs font-medium">{plan.label}</div>
            <span className="text-xs">{plan.availability.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
