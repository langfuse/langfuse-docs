"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import adobeLogo from "../home/img/adobe.svg";
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
import rocketMoneyLogo from "../home/img/rocket-money.svg";
import samsaraLogo from "../home/img/samsara.svg";
import sumupLogo from "../home/img/sumup.svg";
import telusLogo from "../home/img/telus.svg";
import twilioLogo from "../home/img/twilio.svg";
import { cn } from "@/lib/utils";
import { LinkBox } from "@/components/ui/link-box";

const MARQUEE_DURATION_SEC = 40;

type CompanyLogo = {
  name: string;
  logo: StaticImageData;
  customerStoryPath?: string;
  hidden?: boolean;
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
    hidden: true,
  },
  {
    name: "Merck",
    logo: merckLogo,
    customerStoryPath: "/users/merckgroup",
  },
  {
    name: "Samsara",
    logo: samsaraLogo,
  },
  {
    name: "freee",
    logo: freeeLogo,
    hidden: true,
  },
  {
    name: "Magic Patterns",
    logo: magicPatternsLogo,
    customerStoryPath: "/users/magic-patterns-ai-design-tools",
    hidden: true,
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
    name: "Rocket Money",
    logo: rocketMoneyLogo,
  },
  {
    name: "Pigment",
    logo: pigmentLogo,
    hidden: true,
  },
];

const LogoImage = ({
  logo,
  name,
  compact = false,
}: {
  logo: StaticImageData;
  name: string;
  compact?: boolean;
}) => {
  if (compact) {
    return (
      <div className="overflow-hidden h-[40px] -mx-5 flex items-center">
        <Image
          src={logo}
          alt={`${name} logo`}
          className="h-[56px] w-auto scale-125 transition-[filter] duration-200 hover:filter-[grayscale(1)_brightness(0)_contrast(1.15)] group-hover:filter-[grayscale(1)_brightness(0)_contrast(1.15)]"
          sizes="(max-width: 768px) 30vw"
          priority={false}
        />
      </div>
    );
  }

  return (
    <Image
      src={logo}
      alt={`${name} logo`}
      className="h-[56px] object-cover max-w-full transition-[filter] duration-200 hover:filter-[grayscale(1)_brightness(0)_contrast(1.15)] group-hover:filter-[grayscale(1)_brightness(0)_contrast(1.15)]"
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
      priority={false}
    />
  );
};

const visibleCompanies = companies.filter((c) => !c.hidden);

function LogoMarqueeItems({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <>
      {visibleCompanies.map((company) => {
        const hasStory = Boolean(company.customerStoryPath);
        return (
          <LinkBox
            key={company.name}
            href={company.customerStoryPath}
            tooltip={hasStory ? "Read story" : undefined}
            tooltipPlacement="bottom-center"
            className="shrink-0 flex items-center justify-center !p-0"
            aria-hidden={duplicate || undefined}
            tabIndex={duplicate ? -1 : undefined}
            aria-label={
              hasStory
                ? `Read ${company.name} user story`
                : `${company.name} uses Langfuse`
            }
          >
            <LogoImage logo={company.logo} name={company.name} compact />
          </LinkBox>
        );
      })}
    </>
  );
}

interface EnterpriseLogoGridProps {
  className?: string;
  small?: boolean;
}

export const EnterpriseLogoGrid = ({
  className = "",
  small = false,
}: EnterpriseLogoGridProps) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {/* Mobile: scrolling marquee or static scroll fallback */}
      {shouldReduceMotion ? (
        <div
          className={cn("sm:hidden overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
          aria-label="Enterprise customers using Langfuse"
        >
          <div className="flex items-center w-max py-2">
            <LogoMarqueeItems />
          </div>
        </div>
      ) : (
        <div
          className={cn("sm:hidden overflow-hidden w-full mask-[linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]", className)}
          aria-label="Enterprise customers using Langfuse"
        >
          <motion.div
            className="flex items-center w-max py-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: MARQUEE_DURATION_SEC,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <LogoMarqueeItems />
            <LogoMarqueeItems duplicate />
          </motion.div>
        </div>
      )}

      {/* Desktop: grid layout */}
      <div
        className={cn(
          "hidden sm:grid sm:grid-cols-6 auto-rows-fr px-2 py-2",
          small && "sm:grid-cols-3",
          className,
        )}
        role="grid"
        aria-label="Enterprise customers using Langfuse"
      >
        {visibleCompanies.map((company) => {
          const hasStory = Boolean(company.customerStoryPath);
          return (
            <LinkBox
              key={company.name}
              href={company.customerStoryPath}
              tooltip={hasStory ? "Read story" : undefined}
              tooltipPlacement="bottom-center"
              className="-mr-px -mb-px flex items-center justify-center !p-0"
              role="gridcell"
              aria-label={
                hasStory
                  ? `Read ${company.name} user story`
                  : `${company.name} uses Langfuse`
              }
            >
              <LogoImage logo={company.logo} name={company.name} />
            </LinkBox>
          );
        })}
      </div>
    </>
  );
};
