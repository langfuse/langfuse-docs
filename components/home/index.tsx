import { Background } from "../Background";
import { FeatTracing } from "./FeatTracing";
import { FeatAnalytics } from "./FeatAnalytics";
import { FromTheBlog } from "./FromTheBlog";
import { Pricing } from "./Pricing";

export const Home = () => (
  <>
    <main className="relative overflow-hidden w-full">
      <div className="px-2 md:container">
        <FeatTracing />
        <FeatAnalytics />
        <Pricing />
        <FromTheBlog />
        {/* <CTA /> */}
      </div>
    </main>
    <Background />
  </>
);
