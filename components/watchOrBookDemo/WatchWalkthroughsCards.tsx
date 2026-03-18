import { Cards } from "@/components/docs";
import { WALKTHROUGH_TABS } from "./constants";

export const WatchWalkthroughsCards = () => (
  <Cards num={2}>
    {WALKTHROUGH_TABS.map((tab) => (
      <Cards.Card
        key={tab.id}
        title={tab.title}
        href={`/watch-demo?tab=${tab.id}`}
        icon={<tab.icon />}
      />
    ))}
  </Cards>
);
