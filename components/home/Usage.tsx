import Image, { type StaticImageData } from "next/image";
import { HomeSection } from "./components/HomeSection";
import pigmentLight from "./img/pigment_light.svg";
import pigmentDark from "./img/pigment_dark.svg";
import circlebackLight from "./img/circleback_light.png";
import circlebackDark from "./img/circleback_dark.png";
import samsaraLight from "./img/samsara_light.png";
import samsaraDark from "./img/samsara_dark.png";
import posthogLight from "./img/posthog_light.svg";
import posthogDark from "./img/posthog_dark.svg";
import fortoLight from "./img/forto_light.svg";
import fortoDark from "./img/forto_dark.svg";
import juiceboxLight from "./img/juicebox_light.svg";
import juiceboxDark from "./img/juicebox_dark.svg";
import khanacademyLight from "./img/khanacademy_light.png";
import khanacademyDark from "./img/khanacademy_dark.png";
import NumberTicker from "@/components/ui/number-ticker";
import twilioLight from "./img/twilio_light.svg";
import twilioDark from "./img/twilio_dark.svg";

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
    name: "Samsara",
    lightImage: samsaraLight,
    darkImage: samsaraDark,
    href: "https://www.samsara.com",
  },
  {
    name: "Circleback",
    lightImage: circlebackLight,
    darkImage: circlebackDark,
    href: "https://circleback.ai",
  },
  {
    name: "Khan Academy",
    lightImage: khanacademyLight,
    darkImage: khanacademyDark,
    href: "https://www.khanacademy.org",
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
    name: "Juicebox",
    lightImage: juiceboxLight,
    darkImage: juiceboxDark,
    href: "https://juicebox.ai/",
  },
  {
    name: "Twilio",
    lightImage: twilioLight,
    darkImage: twilioDark,
    href: "https://www.twilio.com",
  },
];

const stats = [
  { name: "SDK installs / month", value: 3_000_000 },
  { name: "GitHub stars", value: 6_000 },
  { name: "Docker pulls", value: 1_800_000 },
];

export const Usage = () => (
  <HomeSection className="pt-2 sm:pt-2 lg:pt-2 xl:pt-2">
    <div className="py-14">
      <h2 className="text-center text-lg font-semibold leading-8 mb-8">
        Teams building complex LLM apps rely on Langfuse
      </h2>
      <div className="flex flex-col gap-8">
        <div className="relative">
          <div className="flex flex-wrap xl:flex-nowrap justify-between">
            {users.map((user) => (
              <a
                key={user.name}
                href={user.href}
                className="overflow-hidden w-1/2 md:w-1/4 xl:w-[12%] h-16 hover:opacity-80 transition py-4 px-3"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src={user.lightImage}
                  alt={user.name}
                  className="object-contain h-full w-full hidden dark:block"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
                <Image
                  src={user.darkImage}
                  alt={user.name}
                  className="object-contain h-full w-full dark:hidden"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-around sm:justify-center sm:gap-10">
          {stats.map((item) => (
            <div key={item.name} className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-primary/80 font-mono">
                <NumberTicker value={item.value} />
                <span className="ml-1 hidden sm:inline">{"+"}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm text-primary/70">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </HomeSection>
);
