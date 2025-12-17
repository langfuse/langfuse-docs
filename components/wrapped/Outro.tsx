import { WrappedSection } from "./components/WrappedSection";

const outroMessages = [
  "Thank you for being part of our journey.",
  "Here's to an even bigger 2026.",
];

export function Outro() {
  return (
    <WrappedSection>
      <div className="flex flex-col gap-32 lg:gap-48">
        {outroMessages.map((message, index) => (
          <div
            key={index}
            className="min-h-[40vh] flex items-center justify-center"
          >
            <p className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-center text-balance max-w-4xl">
              {message}
            </p>
          </div>
        ))}
      </div>
    </WrappedSection>
  );
}

