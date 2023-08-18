import { Background } from "../Background";
import { FeatTracing } from "./FeatTracing";
import { Hero } from "./Hero";
import { Users } from "./Users";

export function Home() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <div className="container">
          <Hero />
          <Users />
          <FeatTracing />
        </div>
      </main>
      <Background />
    </>
  );
}
