import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import { TestimonialsGrid } from "./TestimonialsGrid";

export const WallOfLove = () => {
  return (
    <HomeSection>
      <Header
        title="Join the Community"
        description="80.000+ people have built on Langfuse."
        buttons={[
          { href: "https://x.com/langfuse", text: "Follow @langfuse", target: "_blank" },
          { href: "https://x.com/compose/post", text: "Share some love", target: "_blank" }
        ]}
      />

      <TestimonialsGrid />
    </HomeSection>
  );
};

export default WallOfLove; 