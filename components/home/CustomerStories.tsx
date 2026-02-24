import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { CustomerCarousel } from "../customers/CustomerCarousel";
import { getPagesForRoute } from "@/lib/source";

export default function CustomerStories() {
  const stories = getPagesForRoute("/customers");

  return (
    <HomeSection>
      <Header
        title="Customer Stories"
        description="See what our customers are saying about Langfuse"
        className="mb-8"
        h="h2"
        buttons={[
          {
            href: "/customers",
            text: "See all customer stories",
          },
        ]}
      />
      <CustomerCarousel
        stories={stories as any}
        showDots={true}
        loop={true}
      />
    </HomeSection>
  );
}
