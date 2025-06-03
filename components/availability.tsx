import { Check, X } from "lucide-react";

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
  shortLabel?: string;
  Icon: any;
}[] = [
  {
    id: "ee",
    label: "Enterprise Edition",
    shortLabel: "Enterprise",
    Icon: Check,
  },
  {
    id: "team-add-on",
    label: "Team Add-On",
    shortLabel: "Team",
    Icon: Check,
  },
  { id: "full", Icon: Check },
  { id: "private-beta", label: "Private Beta", Icon: Check },
  { id: "public-beta", label: "Public Beta", Icon: Check },
  { id: "not-available", label: "Not Available", Icon: X },
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
    <div className="border-t border-b py-3 my-4">
      <div className="font-semibold text-primary/60 mb-2">
        Where is this feature available?
      </div>
      <ul className="flex flex-row gap-3 w-full justify-between flex-wrap">
        {availablePlans.map((plan) => (
          <li
            key={plan.id}
            className="flex flex-row gap-2 md:flex-col md:items-center"
          >
            <div className="font-medium">{plan.label}</div>
            <div className="md:flex md:items-center">
              <plan.availability.Icon className="w-4 h-4 inline-block mr-1 lg:mr-2" />
              {plan.availability.label && (
                <span className="hidden md:inline-block text-xs">
                  ({plan.availability.label})
                </span>
              )}
              {plan.availability.shortLabel && (
                <span className="inline-block md:hidden text-xs">
                  ({plan.availability.shortLabel})
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
