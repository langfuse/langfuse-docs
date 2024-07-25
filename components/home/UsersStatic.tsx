import Image, { type StaticImageData } from "next/image";
import pigmentLight from "./img/pigment_light.svg";
import pigmentDark from "./img/pigment_dark.svg";
import alphawatchLight from "./img/alphawatch_light.png";
import alphawatchDark from "./img/alphawatch_dark.png";
import frontifyLight from "./img/frontify_light.svg";
import frontifyDark from "./img/frontify_dark.svg";
import posthogLight from "./img/posthog_light.svg";
import posthogDark from "./img/posthog_dark.svg";
import fortoLight from "./img/forto_light.svg";
import fortoDark from "./img/forto_dark.svg";
import fletchLight from "./img/fletch_light.svg";
import fletchDark from "./img/fletch_dark.svg";
import sumupLight from "./img/sumup_light.svg";
import sumupDark from "./img/sumup_dark.svg";
import khanacademyLight from "./img/khanacademy_light.png";
import khanacademyDark from "./img/khanacademy_dark.png";
import { HomeSection } from "./components/HomeSection";

type User = {
  name: string;
  lightImage: StaticImageData;
  darkImage: StaticImageData;
  href: string;
  className?: string;
};

const users: User[] = [
  {
    name: "PostHog",
    lightImage: posthogLight,
    darkImage: posthogDark,
    href: "https://posthog.com",
  },
  {
    name: "Frontify",
    lightImage: frontifyLight,
    darkImage: frontifyDark,
    href: "https://www.frontify.com",
  },
  {
    name: "Alphawatch",
    lightImage: alphawatchLight,
    darkImage: alphawatchDark,
    href: "https://alphawatch.ai",
    className: "w-16 sm:w-24",
  },
  {
    name: "Khan Academy",
    lightImage: khanacademyLight,
    darkImage: khanacademyDark,
    href: "https://www.khanacademy.org",
    className: "w-30 sm:w-44",
  },
  {
    name: "Pigment",
    lightImage: pigmentLight,
    darkImage: pigmentDark,
    href: "https://pigment.com",
  },
  {
    name: "Forto",
    lightImage: fortoLight,
    darkImage: fortoDark,
    href: "https://forto.com",
  },
  {
    name: "Fletch",
    lightImage: fletchLight,
    darkImage: fletchDark,
    href: "https://fletch.ai/",
    className: "w-16 sm:w-24",
  },
  {
    name: "Sumup",
    lightImage: sumupLight,
    darkImage: sumupDark,
    href: "https://sumup.com",
  },
];

export const UsersStatic = () => (
  <HomeSection className="pt-2 sm:pt-2 lg:pt-2 xl:pt-2">
    <div className="py-14">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-center text-lg font-semibold leading-8 mb-6">
          Teams building complex LLM apps rely on Langfuse
        </h2>
        <div className="relative mt-6">
          <div className="flex flex-row flex-wrap xl:flex-nowrap justify-between">
            {users.map((user) => (
              <a
                key={user.name}
                href={user.href}
                className="overflow-hidden w-1/2 md:w-1/4 xl:w-auto h-16 hover:opacity-100 opacity-80 transition p-4 xl:p-5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={user.lightImage}
                  alt={user.name}
                  className="object-contain h-full w-full hidden dark:block"
                  sizes="(min-width: 768px) 10vw, 20vw"
                />
                <Image
                  src={user.darkImage}
                  alt={user.name}
                  className="object-contain h-full w-full dark:hidden"
                  sizes="(min-width: 768px) 10vw, 20vw"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </HomeSection>
);
