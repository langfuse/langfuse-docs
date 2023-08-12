import { Features } from "./Features";
import { Hero } from "./Hero";
import { Meteors } from "@/components/magicui/meteors";

export function Home() {
  return (
    <div className="relative overflow-hidden w-full">
      <Meteors />
      <div className="container">
        <Hero />
        <Features />
      </div>
    </div>
  );
}
