import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { CustomerCarousel } from "../customers/CustomerCarousel";

export default function CustomerStories() {
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
      <CustomerCarousel path="/users" showDots={true} loop={true} />
    </HomeSection>
  );
}
