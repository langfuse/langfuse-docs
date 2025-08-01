import Image from "next/image";
import pigmentLight from "../home/img/pigment_light.svg";
import pigmentDark from "../home/img/pigment_dark.svg";
import circlebackLight from "../home/img/circleback_light.png";
import circlebackDark from "../home/img/circleback_dark.png";
import samsaraLight from "../home/img/samsara_light.png";
import samsaraDark from "../home/img/samsara_dark.png";
import springernatureLight from "../home/img/springernature_light.svg";
import springernatureDark from "../home/img/springernature_dark.svg";
import khanacademyLight from "../home/img/khanacademy_light.png";
import khanacademyDark from "../home/img/khanacademy_dark.png";
import twilioLight from "../home/img/twilio_light.svg";
import twilioDark from "../home/img/twilio_dark.svg";
import sumupLight from "../home/img/sumup_light.svg";
import sumupDark from "../home/img/sumup_dark.svg";
import telusLight from "../home/img/telus_light.png";
import telusDark from "../home/img/telus_dark.png";

type User = {
  name: string;
  lightImage: any;
  darkImage: any;
  href: string;
  className?: string;
  customerStoryPath?: string;
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
    customerStoryPath: "/customers/khan-academy",
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
  {
    name: "Circleback",
    lightImage: circlebackLight,
    darkImage: circlebackDark,
    href: "https://circleback.ai",
  },
];

interface EnterpriseLogoGridProps {
  className?: string;
}

export const EnterpriseLogoGrid = ({ 
  className = "" 
}: EnterpriseLogoGridProps) => {
  return (
    <div className={`grid grid-cols-4 auto-rows-fr ${className}`}>
      {users.map((user) => (
        <div key={user.name} className="relative overflow-hidden h-32 hover:opacity-80 transition py-8 px-12 border border-gray-200 dark:border-gray-800 dark:bg-gray-900/50 -mr-px -mb-px flex items-center justify-center">
          <a
            href={user.href}
            className="block"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={user.lightImage}
              alt={user.name}
              className="object-contain max-h-12 max-w-full hidden dark:block"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
            <Image
              src={user.darkImage}
              alt={user.name}
              className="object-contain max-h-12 max-w-full dark:hidden"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          </a>
          
          {/* Customer Story Badge */}
          {user.customerStoryPath && (
            <div className="absolute top-2 right-2 group z-50">
              <a
                href={user.customerStoryPath}
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white text-xs w-6 h-6 rounded-full transition-all duration-200 group-hover:w-auto group-hover:h-auto group-hover:px-3 group-hover:py-1 "
                onClick={(e) => e.stopPropagation()}
              >
                <span className="hidden group-hover:inline whitespace-nowrap">Read Customer Story</span>
                <span className="group-hover:hidden w-2 h-2 bg-white rounded-full"></span>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 