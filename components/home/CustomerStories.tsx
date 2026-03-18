import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { CustomerCarousel, type CustomerStory } from "../customers/CustomerCarousel";
import { usersSource } from "@/lib/source";

export default function CustomerStories() {
  const stories: CustomerStory[] = usersSource.getPages().map((page) => ({
    route: page.url,
    frontMatter: page.data as CustomerStory["frontMatter"],
  }));

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
        stories={stories}
        showDots={true}
        loop={true}
      />
    </HomeSection>
  );
}
