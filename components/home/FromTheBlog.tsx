import { BlogIndex } from "../blog/BlogIndex";
import { HomeSection } from "./components/HomeSection";
import HomeSubHeader from "./components/HomeSubHeader";

export const FromTheBlog = () => (
  <HomeSection>
    <HomeSubHeader
      title="Blog"
      description="The latest updates and releases from Langfuse"
    />
    <BlogIndex maxItems={3} />
  </HomeSection>
);
