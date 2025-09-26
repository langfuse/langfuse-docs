import { Cards } from "nextra/components";
import { Users } from "lucide-react";
import { TEAMS_CONFIG } from "@/pages/handbook/_meta";

export const TeamsIndex = () => {
  return (
    <div className="my-6">
      <Cards num={3}>
        {Object.entries(TEAMS_CONFIG).map(([path, config]) => (
          <Cards.Card
            href={`/handbook/${path}/${config.firstPage}`}
            key={path}
            title={config.title}
            icon={<Users size={20} />}
            arrow
          />
        ))}
      </Cards>
    </div>
  );
};
