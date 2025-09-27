import { Cards } from "nextra/components";
import { Users } from "lucide-react";
import { TEAMS } from "@/pages/handbook/_meta";

export const TeamsIndex = () => {
  return (
    <div className="my-6">
      <Cards num={3}>
        {Object.entries(TEAMS).map(([path, team]) => (
          <Cards.Card
            href={`/handbook/${path}/${team.firstPage}`}
            key={path}
            title={team.name}
            icon={<Users size={20} />}
            arrow
          />
        ))}
      </Cards>
    </div>
  );
};
