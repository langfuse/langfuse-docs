import { Background } from "../Background";
import { FeatTracing } from "./FeatTracing";
import { FromTheBlog } from "./FromTheBlog";
import { Hero } from "./Hero";
import { Pricing } from "./Pricing";
import { Users } from "./Users";

export function Home() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <div className="container">
          <Hero />
          <Users />
          <FeatTracing />
          <Pricing />
          <FromTheBlog />
        </div>
      </main>
      <Background />
    </>
  );
}
