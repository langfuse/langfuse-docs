import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface OSSMetricProps {
  value: string;
  label: string;
}

function OSSMetric({ value, label }: OSSMetricProps) {
  return (
    <div className="p-6 lg:p-8">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono">
        {value}
      </div>
      <div className="mt-2 text-lg font-semibold">{label}</div>
    </div>
  );
}

const ossMetrics = [
  { value: "15K+", label: "GitHub Stars" },
  { value: "500+", label: "Contributors" },
  { value: "1000+", label: "Pull Requests merged" },
  { value: "50+", label: "Community integrations" },
];

export function OSS() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Open Source"
        subtitle="Built in the open, with the community"
      />
      <WrappedGrid>
        {ossMetrics.map((metric, index) => (
          <WrappedGridItem key={index}>
            <OSSMetric {...metric} />
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}

