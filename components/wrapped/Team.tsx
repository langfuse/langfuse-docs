import { WrappedSection } from "./components/WrappedSection";
import { WrappedGrid, WrappedGridItem } from "./components/WrappedGrid";
import { SectionHeading } from "./components/SectionHeading";

interface TeamMemberProps {
  name: string;
  role: string;
}

function TeamMember({ name, role }: TeamMemberProps) {
  return (
    <div className="p-6 lg:p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4" />
      <h3 className="font-semibold">{name}</h3>
      <p className="text-sm text-muted-foreground">{role}</p>
    </div>
  );
}

// Placeholder team members
const teamMembers = [
  { name: "Team Member 1", role: "Role" },
  { name: "Team Member 2", role: "Role" },
  { name: "Team Member 3", role: "Role" },
  { name: "Team Member 4", role: "Role" },
];

export function Team() {
  return (
    <WrappedSection>
      <SectionHeading
        title="Team"
        subtitle="The people behind Langfuse"
      />
      <WrappedGrid className="!border-t-0 -mt-[1px]">
        {teamMembers.map((member, index) => (
          <WrappedGridItem key={index}>
            <TeamMember {...member} />
          </WrappedGridItem>
        ))}
      </WrappedGrid>
    </WrappedSection>
  );
}

