import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import circlebackLight from "../home/img/circleback_light.png";
import circlebackDark from "../home/img/circleback_dark.png";
import samsaraLight from "../home/img/samsara_light.png";
import samsaraDark from "../home/img/samsara_dark.png";
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
import merckLight from "../home/img/merck-dark.png";
import merckDark from "../home/img/merck-light.png";
import { cn } from "@/lib/utils";

type CompanyLogo = {
  name: string;
  lightImage: StaticImageData | string;
  darkImage: StaticImageData | string;
  customerStoryPath?: string;
};

const companies: CompanyLogo[] = [
  {
    name: "Samsara",
    lightImage: samsaraLight,
    darkImage: samsaraDark,
  },
  {
    name: "Twilio",
    lightImage: twilioLight,
    darkImage: twilioDark,
  },
  {
    name: "SumUp",
    lightImage: sumupLight,
    darkImage: sumupDark,

    customerStoryPath: "/customers/sumup",
  },
  {
    name: "Khan Academy",
    lightImage: khanacademyLight,
    darkImage: khanacademyDark,

    customerStoryPath: "/customers/khan-academy",
  },
  {
    name: "Magic Patterns",
    lightImage: magicPatternsLight,
    darkImage: magicPatternsDark,

    customerStoryPath: "/customers/magic-patterns-ai-design-tools",
  },
  // {
  //   name: "Springer Nature",
  //   lightImage: springernatureLight,
  //   darkImage: springernatureDark,
  //   href: "https://www.springernature.com",
  // },
  {
    name: "Merck",
    lightImage: merckLight,
    darkImage: merckDark,

    customerStoryPath: "/customers/merckgroup",
  },
  {
    name: "Telus",
    lightImage: telusLight,
    darkImage: telusDark,
  },
  {
    name: "Circleback",
    lightImage: circlebackLight,
    darkImage: circlebackDark,
  },
];

// Reusable component for company logos with light/dark theme support
const LogoImage = ({
  lightImage,
  darkImage,
  name,
}: {
  lightImage: StaticImageData | string;
  darkImage: StaticImageData | string;
  name: string;
}) => (
  <>
    <Image
      src={lightImage}
      alt={`${name} logo`}
      className="object-contain max-h-8 max-w-full hidden dark:block"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
      priority={false}
    />
    <Image
      src={darkImage}
      alt={`${name} logo`}
      className="object-contain max-h-8 max-w-full dark:hidden"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
      priority={false}
    />
  </>
);

// Customer story badge component
const CustomerStoryBadge = ({ small }: { small?: boolean }) => (
  <div
    className={cn(
      "absolute top-0 right-0 z-10 pointer-events-none",
      !small && "md:top-2 md:right-2",
    )}
  >
    <div
      className={cn(
        "inline-flex items-center justify-center text-blue-500  text-xs rounded-full  group-hover:w-auto group-hover:h-auto group-hover:px-3 group-hover:py-1 px-2 py-1 transition-all duration-200",
        !small && "md:bg-blue-500 md:text-white md:px-0 md:py-0 md:w-6 md:h-6",
      )}
    >
      {small ? (
        <span className="whitespace-nowrap">Read Story</span>
      ) : (
        <>
          <span className="md:hidden whitespace-nowrap">Read Story</span>
          <span className="hidden md:group-hover:inline">
            Read Customer Story
          </span>
          <span className="hidden md:block group-hover:hidden w-2 h-2 bg-white rounded-full"></span>
        </>
      )}
    </div>
  </div>
);

interface EnterpriseLogoGridProps {
  className?: string;
  small?: boolean;
}

export const EnterpriseLogoGrid = ({
  className = "",
  small = false,
}: EnterpriseLogoGridProps) => {
  // Shared CSS classes for grid cells
  const baseCellClasses =
    "relative overflow-hidden h-16 md:h-14 transition-all duration-200 py-4 px-4 md:py-8 md:px-14 border border-gray-200 dark:border-gray-800 bg-card -mr-px -mb-px flex items-center justify-center";
  const smallCellClasses = "px-3 md:px-4 py-3 md:py-4";
  const clickableCellClasses = "group hover:opacity-80 cursor-pointer";

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 auto-rows-fr",
        small && "grid-cols-4",
        className,
      )}
      role="grid"
      aria-label="Enterprise customers using Langfuse"
    >
      {companies.map((company) => {
        const cellContent = (
          <>
            <LogoImage
              lightImage={company.lightImage}
              darkImage={company.darkImage}
              name={company.name}
            />
            {company.customerStoryPath && <CustomerStoryBadge small={small} />}
          </>
        );

        return company.customerStoryPath ? (
          <Link
            key={company.name}
            href={company.customerStoryPath}
            className={cn(
              baseCellClasses,
              clickableCellClasses,
              small && smallCellClasses,
            )}
            aria-label={`Read ${company.name} customer story`}
            role="gridcell"
          >
            {cellContent}
          </Link>
        ) : (
          <div
            key={company.name}
            className={cn(baseCellClasses, small && smallCellClasses)}
            role="gridcell"
            aria-label={`${company.name} uses Langfuse`}
          >
            {cellContent}
          </div>
        );
      })}
    </div>
  );
};
