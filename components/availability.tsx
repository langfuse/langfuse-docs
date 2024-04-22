import { Check, X } from "lucide-react";

const plans = [
  { id: "hobby", label: "Hobby" },
  { id: "pro", label: "Pro" },
  { id: "team", label: "Team" },
  { id: "selfHosted", label: "Self Hosted" },
] as const;

const availabilities = [
  { id: "full", label: "Full", Icon: Check },
  { id: "private-beta", label: "Private Beta", Icon: Check },
  { id: "public-beta", label: "Public Beta", Icon: Check },
  { id: "not-available", label: "Not Available", Icon: X },
] as const;

export function AvailabilitySidebar(props: {
  frontMatter: Record<string, any>;
}) {
  const relevantFrontMatter = Object.entries(props.frontMatter)
    .filter(([key, value]) => key.startsWith("availability"))
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

  if (Object.keys(relevantFrontMatter).length === 0) return null;

  return (
    <div className="flex flex-col space-y-2 text-primary/60 w-full align-middle border-y py-2">
      <div className="font-bold">Availability</div>
      <ul className="flex flex-col space-y-1">
        {plans
          .filter((plan) => `availability.${plan.id}` in relevantFrontMatter)
          .map((plan) => {
            const availability = availabilities.find(
              (availability) =>
                relevantFrontMatter[`availability.${plan.id}`] ===
                availability.id
            );
            if (!availability) return null;
            return (
              <li key={plan.id} className="flex flex-row gap-2">
                <availability.Icon className="w-4 h-4 inline-block" />
                <div className="font-bold">{plan.label}</div>
                <div>{availability.label}</div>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

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
      <ul className="flex flex-row gap-2 w-full justify-between">
        {availablePlans.map((plan) => (
          <li key={plan.id} className="flex flex-col gap-1">
            <div className="font-bold">{plan.label}</div>
            <div>
              <plan.availability.Icon className="w-4 h-4 inline-block mr-1 lg:mr-2" />
              <span className="hidden md:inline-block text-xs lg:text-sm">
                {plan.availability.label}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
