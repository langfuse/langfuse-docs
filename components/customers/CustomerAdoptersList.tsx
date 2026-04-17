import Link from "next/link";

const ADOPTERS: Array<{ name: string; href?: string }> = [
  { name: "Canva", href: "/users/canva" },
  { name: "SumUp", href: "/users/sumup" },
  { name: "Khan Academy", href: "/users/khan-academy" },
  { name: "Magic Patterns", href: "/users/magic-patterns-ai-design-tools" },
  { name: "Merck", href: "/users/merckgroup" },
  { name: "Twilio" },
  { name: "Samsara" },
  { name: "Adobe" },
  { name: "Telus" },
  { name: "Intuit" },
  { name: "Circleback" },
  { name: "freee" },
  { name: "Pigment" },
];

export function CustomerAdoptersList() {
  return (
    <section className="mt-8 rounded-sm border border-line-structure bg-surface-1 p-4">
      <h2 className="font-analog text-[18px] text-text-primary mb-2">
        Longest-standing adopters
      </h2>
      <p className="text-text-tertiary text-[15px]">
        {ADOPTERS.map((adopter, index) => (
          <span key={adopter.name}>
            {adopter.href ? (
              <Link href={adopter.href} className="underline hover:text-text-primary">
                {adopter.name}
              </Link>
            ) : (
              adopter.name
            )}
            {index < ADOPTERS.length - 1 ? ", " : "."}
          </span>
        ))}
      </p>
    </section>
  );
}

