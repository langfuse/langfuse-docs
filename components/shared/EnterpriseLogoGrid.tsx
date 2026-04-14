"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import adobeLogo from "../home/img/adobe.svg";
import appleLogo from "../home/img/apple.svg";
import canvaLogo from "../home/img/canva.svg";
import circlebackLogo from "../home/img/circleback.svg";
import ciscoLogo from "../home/img/cisco.svg";
import expediaGroupLogo from "../home/img/expedia.svg";
import freeeLogo from "../home/img/freee.svg";
import intuitLogo from "../home/img/intuit.svg";
import khanacademyLogo from "../home/img/khan.svg";
import magicPatternsLogo from "../home/img/magic.svg";
import merckLogo from "../home/img/merck.svg";
import pigmentLogo from "../home/img/pigment.svg";
import samsaraLogo from "../home/img/samsara.svg";
import sumupLogo from "../home/img/sumup.svg";
import telusLogo from "../home/img/telus.svg";
import twilioLogo from "../home/img/twilio.svg";
import { cn } from "@/lib/utils";
import { LinkBox } from "@/components/ui/link-box";

type CompanyLogo = {
  name: string;
  logo: StaticImageData;
  customerStoryPath?: string;
};

const companies: CompanyLogo[] = [
  {
    name: "Canva",
    logo: canvaLogo,
    customerStoryPath: "/users/canva",
  },
  {
    name: "Twilio",
    logo: twilioLogo,
  },
  {
    name: "Adobe",
    logo: adobeLogo,
  },
  {
    name: "Khan Academy",
    logo: khanacademyLogo,
    customerStoryPath: "/users/khan-academy",
  },
  {
    name: "Telus",
    logo: telusLogo,
  },
  {
    name: "Intuit",
    logo: intuitLogo,
  },
  {
    name: "SumUp",
    logo: sumupLogo,
    customerStoryPath: "/users/sumup",
  },
  {
    name: "Circleback",
    logo: circlebackLogo,
  },
  {
    name: "Apple",
    logo: appleLogo,
  },
  {
    name: "Samsara",
    logo: samsaraLogo,
  },
  {
    name: "freee",
    logo: freeeLogo,
  },
  {
    name: "Magic Patterns",
    logo: magicPatternsLogo,
    customerStoryPath: "/users/magic-patterns-ai-design-tools",
  },
  {
    name: "Cisco",
    logo: ciscoLogo,
  },
  {
    name: "Expedia Group",
    logo: expediaGroupLogo,
  },
  {
    name: "Merck",
    logo: merckLogo,
    customerStoryPath: "/users/merckgroup",
  },
  {
    name: "Pigment",
    logo: pigmentLogo,
  },
];

const LogoImage = ({
  logo,
  name,
}: {
  logo: StaticImageData;
  name: string;
}) => {
  return (
    <Image
      src={logo}
      alt={`${name} logo`}
      className="object-cover max-w-full transition-[filter] duration-200 h-[40px] hover:filter-[grayscale(1)_brightness(0)_contrast(1.15)] group-hover:filter-[grayscale(1)_brightness(0)_contrast(1.15)]"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
      priority={false}
    />
  );
};

interface EnterpriseLogoGridProps {
  className?: string;
  small?: boolean;
}

export const EnterpriseLogoGrid = ({
  className = "",
  small = false,
}: EnterpriseLogoGridProps) => {
  const baseCellClasses =
    "-mr-px -mb-px flex items-center justify-center !p-0 min-h-[44px]";
  const smallCellClasses = "px-3 md:px-4 py-3 md:py-4";

  const cellClassName = cn(baseCellClasses, small && smallCellClasses);

  return (
    <div
      className={cn(
        "grid grid-cols-3 sm:grid-cols-4 auto-rows-fr",
        small && "grid-cols-4",
        className,
      )}
      role="grid"
      aria-label="Enterprise customers using Langfuse"
    >
      {companies.map((company, index) => {
        const hasStory = Boolean(company.customerStoryPath);
        return (
          <LinkBox
            key={company.name}
            href={company.customerStoryPath}
            tooltip={hasStory ? "Case study" : undefined}
            tooltipPlacement="bottom-center"
            className={cn(cellClassName, index > 11 ? "hidden lg:flex" : index > 5 ? "hidden sm:flex" : "flex")}
            role="gridcell"
            aria-label={
              hasStory
                ? `Read ${company.name} user story`
                : `${company.name} uses Langfuse`
            }
          >
            <LogoImage
              logo={company.logo}
              name={company.name}
            />
          </LinkBox>
        );
      })}
    </div>
  );
};
