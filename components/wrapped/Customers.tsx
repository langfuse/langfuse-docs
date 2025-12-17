import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

export function Customers() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Customers"
        subtitle="Teams building with Langfuse"
      />
      <WrappedGrid>
        {/* Customer logo placeholders */}
        {Array.from({ length: 8 }).map((_, index) => (
          <WrappedGridItem key={index}>
            <div className="p-8 flex items-center justify-center aspect-[3/2]">
              <span className="text-muted-foreground">Customer {index + 1}</span>
            </div>
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}

