import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import IsoSVG from "./security/iso27001.svg";
import Soc2SVG from "./security/soc2.svg";
import GdprSVG from "./security/gdpr.svg";
import HipaaSVG from "./security/hipaa.svg";
import Image from "next/image";
import Link from "next/link";

export default function Security() {
  return (
    <HomeSection className="flex flex-col items-center">
      <Header
        title="Enterprise Security"
        description={
          <span>
            Langfuse is built with security in mind. Langfuse Cloud is SOC 2
            Type II and ISO 27001 certified, GDPR compliant and aligned with
            HIPAA.
          </span>
        }
        className="mb-0"
        buttons={[
          { href: "/docs/data-security-privacy", text: "Security" },
          { href: "/enterprise", text: "Enterprise FAQ" },
        ]}
      />
      <div className="grid grid-cols-2 md:grid-cols-4 place-items-center gap-8 sm:gap-10 md:gap-16 mt-10">
        <Link href="/docs/data-security-privacy#compliance">
          <Image
            src={IsoSVG}
            alt="ISO 27001"
            width={100}
            height={100}
            className="w-24 h-auto invert dark:invert-0"
          />
        </Link>
        <Link href="/docs/data-security-privacy#compliance">
          <Image
            src={Soc2SVG}
            alt="SOC 2"
            width={100}
            height={100}
            className="w-24 h-auto invert dark:invert-0"
          />
        </Link>
        <Link href="/docs/data-security-privacy#compliance">
          <Image
            src={GdprSVG}
            alt="GDPR"
            width={80}
            height={80}
            className="w-20 h-auto invert dark:invert-0"
          />
        </Link>
        <Link href="/docs/data-security-privacy#compliance">
          <Image
            src={HipaaSVG}
            alt="HIPAA"
            width={59}
            height={40}
            className="w-20 h-auto dark:invert"
          />
        </Link>
      </div>
    </HomeSection>
  );
}
