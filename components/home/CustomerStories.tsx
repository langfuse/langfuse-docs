import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { CustomerCarousel } from "../customers/CustomerCarousel";
import { getPagesForRoute } from "@/lib/source";

export default function CustomerStories() {
  const stories = getPagesForRoute("/users");

  return (
    <HomeSection>
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
        path="/users"
        stories={stories as any}
        showDots={true}
        loop={true}
      />
    </HomeSection>
  );
}
