"use client";

import Image from "next/image";
import Link from "next/link";
import IsoPNG from "./home/security/iso27001.png";
import Soc2SVG from "./home/security/soc2.svg";
import GdprSVG from "./home/security/gdpr.svg";
import HipaaSVG from "./home/security/hipaa.svg";

/**
 * Security certification badge grid.
 * Implemented as a Client Component so that static SVG/PNG imports are bundled
 * in the client bundle rather than serialised through the RSC payload, which
 * would fail because Turbopack treats SVG imports as ES module namespace objects.
 */
export function SecurityBadgesGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 place-items-center gap-8 sm:gap-10 md:gap-16 my-10">
      <Link href="/security/iso27001">
        <Image
          src={IsoPNG}
          alt="ISO 27001"
          width={100}
          height={100}
          className="w-24 h-auto dark:invert"
        />
      </Link>
      <Link href="/security/soc2">
        <Image
          src={Soc2SVG}
          alt="SOC 2"
          width={100}
          height={100}
          className="w-24 h-auto invert dark:invert-0"
        />
      </Link>
      <Link href="/security/gdpr">
        <Image
          src={GdprSVG}
          alt="GDPR"
          width={80}
          height={80}
          className="w-20 h-auto invert dark:invert-0"
        />
      </Link>
      <Link href="/security/hipaa">
        <Image
          src={HipaaSVG}
          alt="HIPAA"
          width={59}
          height={40}
          className="w-20 h-auto dark:invert"
        />
      </Link>
    </div>
  );
}
