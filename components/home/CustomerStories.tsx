import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { CustomerCarousel } from "../customers/CustomerCarousel";

export const CustomerStories = () => {
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
        path="/customers"
        showDots={true}
        loop={true}
      />
    </HomeSection>
  );
};

export default CustomerStories;
