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
import magicPatternsLight from "../home/img/magicpatterns_light.png";
import magicPatternsDark from "../home/img/magicpatterns_dark.png";

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
    name: "Springer Nature",
    lightImage: springernatureLight,
    darkImage: springernatureDark,
    href: "https://www.springernature.com",
  },
  {
    name: "Magic Patterns",
    lightImage: magicPatternsLight,
    darkImage: magicPatternsDark,
    href: "https://magicpatterns.com",
    customerStoryPath: "/customers/magic-patterns-ai-design-tools",
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
    <div className={`grid grid-cols-2 md:grid-cols-4 auto-rows-fr ${className}`}>
      {users.map((user) => (
        <div key={user.name} className={`relative overflow-hidden h-16 md:h-14 transition py-4 px-4 md:py-8 md:px-14 border border-gray-200 dark:border-gray-800 bg-card -mr-px -mb-px flex items-center justify-center ${user.customerStoryPath ? 'group hover:opacity-80' : ''}`}>
          {user.customerStoryPath ? (
            <a
              href={user.customerStoryPath}
              className="block"
            >
              <Image
                src={user.lightImage}
                alt={user.name}
                className="object-contain max-h-8 max-w-full hidden dark:block"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              <Image
                src={user.darkImage}
                alt={user.name}
                className="object-contain max-h-8 max-w-full dark:hidden"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            </a>
          ) : (
            <div className="block">
              <Image
                src={user.lightImage}
                alt={user.name}
                className="object-contain max-h-7 max-w-full hidden dark:block"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
              <Image
                src={user.darkImage}
                alt={user.name}
                className="object-contain max-h-7 max-w-full dark:hidden"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
              />
            </div>
          )}
          
          {/* Customer Story Badge */}
          {user.customerStoryPath && (
            <div className="absolute top-0 right-0 md:top-2 md:right-2 z-50">
              <a
                href={user.customerStoryPath}
                className="inline-flex items-center justify-center text-blue-500 md:bg-blue-500 md:text-white text-xs rounded-full md:w-6 md:h-6 group-hover:w-auto group-hover:h-auto group-hover:px-3 group-hover:py-1 px-2 py-1 md:px-0 md:py-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="md:hidden whitespace-nowrap">Read Story</span>
                <span className="hidden md:group-hover:inline">Read Customer Story</span>
                <span className="hidden md:block group-hover:hidden w-2 h-2 bg-white rounded-full"></span>
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 