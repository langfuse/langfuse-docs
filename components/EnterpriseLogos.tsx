import Image from "next/image";
import pigmentLight from "./home/img/pigment_light.svg";
import pigmentDark from "./home/img/pigment_dark.svg";
import samsaraLight from "./home/img/samsara_light.png";
import samsaraDark from "./home/img/samsara_dark.png";
import springernatureLight from "./home/img/springernature_light.svg";
import springernatureDark from "./home/img/springernature_dark.svg";
import khanacademyLight from "./home/img/khanacademy_light.png";
import khanacademyDark from "./home/img/khanacademy_dark.png";
import twilioLight from "./home/img/twilio_light.svg";
import twilioDark from "./home/img/twilio_dark.svg";
import sumupLight from "./home/img/sumup_light.svg";
import sumupDark from "./home/img/sumup_dark.svg";
import telusLight from "./home/img/telus_light.png";
import telusDark from "./home/img/telus_dark.png";

type User = {
  name: string;
  lightImage: any;
  darkImage: any;
  href: string;
};

const users: User[] = [
  {
    name: "Samsara",
    lightImage: samsaraLight,
    darkImage: samsaraDark,
    href: "https://www.samsara.com",
  },
  {
    name: "Twilio",
    lightImage: twilioLight,
    darkImage: twilioDark,
    href: "https://www.twilio.com",
  },
  {
    name: "SumUp",
    lightImage: sumupLight,
    darkImage: sumupDark,
    href: "https://sumup.com",
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
    name: "Springer Nature",
    lightImage: springernatureLight,
    darkImage: springernatureDark,
    href: "https://www.springernature.com",
  },
  {
    name: "Telus",
    lightImage: telusLight,
    darkImage: telusDark,
    href: "https://telus.com",
  },
];

export const EnterpriseLogos = () => {
  return (
    <div className="py-8">
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
  );
};
