import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { CustomerCarousel, type CustomerStory } from "../customers/CustomerCarousel";

export type { CustomerStory };

export default function CustomerStories({ stories }: { stories: CustomerStory[] }) {
  return (
    <HomeSection id="customers">
      <Header
        title="User Stories"
        description="See what our users are saying about Langfuse"
        className="mb-8"
        h="h2"
        buttons={[
          {
            href: "/users",
            text: "See all user stories",
          },
        ]}
      />
      <CustomerCarousel
        stories={stories}
        showDots={true}
        loop={true}
      />
    </HomeSection>
  );
}
