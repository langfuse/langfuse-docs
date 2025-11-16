import { Cards as NextraCards } from "nextra/components";
import { WALKTHROUGH_TABS } from "./constants";

export const WatchWalkthroughsCards = () => (
  <NextraCards num={2}>
    {WALKTHROUGH_TABS.map((tab) => (
      <NextraCards.Card
        key={tab.id}
        title={tab.title}
        href={`/watch-demo?tab=${tab.id}`}
        icon={<tab.icon />}
      />
    ))}
  </NextraCards>
);
