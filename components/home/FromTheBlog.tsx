import { Suspense } from "react";
import { BlogIndex } from "../blog/BlogIndex";
import { HomeSection } from "./HomeSection";
import { Header } from "../Header";

export const FromTheBlog = () => (
  <HomeSection>
    <Header
      title="Blog"
      description="The latest updates and releases from Langfuse"
    />
    {/* Suspense required because BlogIndex uses useSearchParams() */}
    <Suspense>
      <BlogIndex maxItems={3} />
    </Suspense>
  </HomeSection>
);
