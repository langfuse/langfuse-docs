import { MagicCard, MagicContainer } from "../magicui/magic-card";

export const FeatOther = () => (
  <section className="flex flex-col gap-2 items-center">
    <h2 className="text-3xl">More features</h2>
    <MagicContainer className={"flex flex-col gap-4 lg:flex-row"}>
      <Card title="Magic" />
      <Card title="Card" />
    </MagicContainer>
  </section>
);

const Card = ({ title }: { title: string }) => (
  <MagicCard
    borderWidth={3}
    className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden p-20 shadow-2xl"
  >
    <p className="z-10 whitespace-nowrap text-4xl font-medium text-gray-800 dark:text-gray-200">
      {title}
    </p>
    <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
  </MagicCard>
);
