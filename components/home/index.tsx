import { Background } from "../Background";
import { FeatTracing } from "./FeatTracing";
import { FromTheBlog } from "./FromTheBlog";
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
          <FromTheBlog />
        </div>
      </main>
      <Background />
    </>
  );
}
