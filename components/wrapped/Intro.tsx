import { WrappedSection } from "./components/WrappedSection";

const messages = [
  "2025 was a big year for Langfuse.",
  "We shipped more features than ever.",
  "Our community grew exponentially.",
  "Let's take a look back.",
];

export function Intro() {
  return (
    <WrappedSection>
      <div className="flex flex-col gap-32 lg:gap-48">
        {messages.map((message, index) => (
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

