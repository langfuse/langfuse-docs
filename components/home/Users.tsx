import { Fragment } from "react";
import Image from "next/image";
import fastgenLight from "./img/fastgen_light.svg";
import fastgenDark from "./img/fastgen_dark.svg";
import alphawatchLight from "./img/alphawatch_light.png";
import alphawatchDark from "./img/alphawatch_dark.png";
import juiceboxLight from "./img/juicebox_light.png";
import juiceboxDark from "./img/juicebox_dark.png";
import nucleusLight from "./img/nucleus_light.png";
import nucleusDark from "./img/nucleus_dark.png";

const users = [
  {
    name: "Alphawatch",
    lightImage: alphawatchLight,
    darkImage: alphawatchDark,
    href: "https://alphawatch.ai",
  },
  {
    name: "Juicebox",
    lightImage: juiceboxLight,
    darkImage: juiceboxDark,
    href: "https://www.juicebox.work",
  },
  {
    name: "Fastgen",
    lightImage: fastgenLight,
    darkImage: fastgenDark,
    href: "https://fastgen.com",
  },
  {
    name: "Nucleus",
    lightImage: nucleusLight,
    darkImage: nucleusDark,
    href: "https://usenucleus.io",
  },
] as const;

export const Users = () => (
  <div className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="text-center text-lg font-semibold leading-8">
        Teams building complex LLM apps rely on Langfuse
      </h2>
      <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-4">
        {users.map((user) => (
          <a
            href={user.href}
            key={user.name}
            className="col-span-2 lg:col-span-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              className="max-h-10 object-contain hidden dark:block grayscale hover:grayscale-0 transition"
              src={user.lightImage}
              alt={user.name}
            />
            <Image
              className="max-h-10 object-contain dark:hidden grayscale hover:grayscale-0 transition"
              src={user.darkImage}
              alt={user.name}
            />
          </a>
        ))}
      </div>
    </div>
  </div>
);
