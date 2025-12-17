import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface LaunchItemProps {
  title: string;
  date: string;
  description: string;
}

function LaunchItem({ title, date, description }: LaunchItemProps) {
  return (
    <div className="p-6 lg:p-8 h-full">
      <div className="text-sm text-muted-foreground">{date}</div>
      <h3 className="mt-2 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

// Placeholder launches - to be populated from changelog
const launches = [
  {
    title: "Feature 1",
    date: "January 2025",
    description: "Description of the feature launch",
  },
  {
    title: "Feature 2",
    date: "February 2025",
    description: "Description of the feature launch",
  },
  {
    title: "Feature 3",
    date: "March 2025",
    description: "Description of the feature launch",
  },
  {
    title: "Feature 4",
    date: "April 2025",
    description: "Description of the feature launch",
  },
];

export function Launches() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Launches"
        subtitle="Everything we shipped in 2025"
      />
      <WrappedGrid>
        {launches.map((launch, index) => (
          <WrappedGridItem key={index}>
            <LaunchItem {...launch} />
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}

