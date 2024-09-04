import { HomeSection } from "./components/HomeSection";
import { Header } from "../Header";
import IsoSVG from "./security/iso27001.svg";
import Soc2SVG from "./security/soc2.svg";
import GdprSVG from "./security/gdpr.svg";
import Image from "next/image";

export default function Security() {
  return (
    <HomeSection className="flex flex-col items-center">
      <Header
        title="Enterprise Security"
        description={
          <span>
            Langfuse is built with security in mind. Langfuse Cloud is SOC 2 Type II and ISO 27001 certified and GDPR compliant.
          </span>
        }
        className="mb-0"
        buttons={[
          { href: "/docs/data-security-privacy", text: "Security" },
          { href: "/enterprise", text: "Enterprise FAQ" },
        ]}
      />
      <div className="flex flex-row gap-10 md:gap-20 mt-10">
        <Image
          src={IsoSVG}
          alt="ISO 27001"
          width={100}
          height={100}
          className="invert dark:invert-0"
        />
        <Image
          src={Soc2SVG}
          alt="SOC 2"
          width={100}
          height={100}
          className="invert dark:invert-0"
        />
        <Image
          src={GdprSVG}
          alt="GDPR"
          width={80}
          height={80}
          className="invert dark:invert-0"
        />
      </div>
    </HomeSection>
  );
}
