import Image from "next/image";
import pigmentLight from "./img/pigment_light.svg";
import pigmentDark from "./img/pigment_dark.svg";
import alphawatchLight from "./img/alphawatch_light.png";
import alphawatchDark from "./img/alphawatch_dark.png";
import mavaLight from "./img/mava_light.png";
import mavaDark from "./img/mava_dark.png";
import frontifyLight from "./img/frontify_light.svg";
import frontifyDark from "./img/frontify_dark.svg";
import berryLight from "./img/berry_light.png";
import berryDark from "./img/berry_light.png";

const users = [
  {
    name: "Pigment",
    lightImage: pigmentLight,
    darkImage: pigmentDark,
    href: "https://pigment.com",
  },
  {
    name: "frontify",
    lightImage: frontifyLight,
    darkImage: frontifyDark,
    href: "https://www.frontify.com",
  },
  {
    name: "Alphawatch",
    lightImage: alphawatchLight,
    darkImage: alphawatchDark,
    href: "https://alphawatch.ai",
  },
  {
    name: "Berry",
    lightImage: berryLight,
    darkImage: berryDark,
    href: "https://www.berryapp.io",
  },
  {
    name: "Mava",
    lightImage: mavaLight,
    darkImage: mavaDark,
    href: "https://mava.app",
  },
] as const;

export const Users = () => (
  <section className="py-24 sm:py-32">
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <h2 className="text-center text-lg font-semibold leading-8">
        Teams building complex LLM apps rely on AssistMe
      </h2>
      <div className="mx-auto mt-10 grid max-w-lg items-center gap-x-8 gap-y-8 sm:max-w-xl sm:gap-x-10 lg:mx-0 lg:max-w-none grid-cols-2 lg:grid-cols-5">
        {users.map((user) => (
          <a
            href={user.href}
            key={user.name}
            className="relative overflow-hidden h-12 sm:h-16 w-20 sm:w-40 mx-auto last:col-span-2 last:lg:col-span-1"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image
              className="object-contain hidden dark:block grayscale hover:grayscale-0 transition dark:opacity-90 opacity-80 hover:opacity-100"
              src={user.lightImage}
              alt={user.name}
              fill={true}
            />
            <Image
              className="object-contain dark:hidden grayscale hover:grayscale-0 transition dark:opacity-90 opacity-80 hover:opacity-100"
              src={user.darkImage}
              alt={user.name}
              fill={true}
            />
          </a>
        ))}
      </div>
    </div>
  </section>
);
