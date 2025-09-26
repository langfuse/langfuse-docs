import { Cards } from "nextra/components";
import { Users } from "lucide-react";
import { TEAMS_PATHS, TEAMS_FIRST_PAGES } from "@/pages/handbook/_meta";

export const TeamsIndex = () => {
  return (
    <div className="my-6">
      <Cards num={3}>
        {Object.entries(TEAMS_PATHS).map(([path, title]) => (
          <Cards.Card
            href={`/handbook/${path}/${TEAMS_FIRST_PAGES[path]}`}
            key={path}
            title={title}
            icon={<Users size={20} />}
            arrow
          />
        ))}
      </Cards>
    </div>
  );
};
