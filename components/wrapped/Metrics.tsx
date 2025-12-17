import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface MetricCardProps {
  value: string;
  label: string;
  description?: string;
}

function MetricCard({ value, label, description }: MetricCardProps) {
  return (
    <div className="p-6 lg:p-8">
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono">
        {value}
      </div>
      <div className="mt-2 text-lg font-semibold">{label}</div>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

const metrics = [
  { value: "10B+", label: "Traces processed", description: "Up from 1B in 2024" },
  { value: "50K+", label: "Projects created" },
  { value: "100K+", label: "Users" },
  { value: "5M+", label: "Evaluations run" },
  { value: "1M+", label: "Prompts managed" },
  { value: "99.9%", label: "Uptime" },
];

export function Metrics() {
  return (
    <WrappedSection>
      <SectionHeading
        title="By the numbers"
        subtitle="Key metrics from our platform in 2025"
      />
      <WrappedGrid>
        {metrics.map((metric, index) => (
          <WrappedGridItem key={index}>
            <MetricCard {...metric} />
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}

