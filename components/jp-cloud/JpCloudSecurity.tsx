"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import IsoPNG from "@/components/home/security/iso27001.png";
import Soc2SVG from "@/components/home/security/soc2.svg";
import GdprSVG from "@/components/home/security/gdpr.svg";

const badges = [
  { src: Soc2SVG, alt: "SOC 2 Type II", href: "/security/soc2", className: "w-20 h-auto invert dark:invert-0" },
  { src: IsoPNG, alt: "ISO 27001", href: "/security/iso27001", className: "w-20 h-auto dark:invert" },
  { src: GdprSVG, alt: "GDPR", href: "/security/gdpr", className: "w-16 h-auto invert dark:invert-0" },
];

export function JpCloudSecurity() {
  return (
    <section className="py-16 lg:py-24 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-foreground">
          Enterprise Security
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          エンタープライズレベルのセキュリティ
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-2xl mx-auto">
          Langfuse Cloud is SOC 2 Type II and ISO 27001 certified, and fully
          GDPR compliant. The Japan region runs on ClickHouse and AWS
          infrastructure in ap-northeast-1 (Tokyo).
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground/70 max-w-2xl mx-auto">
          Langfuse CloudはSOC 2 Type IIおよびISO 27001認証を取得済みで、GDPRにも完全準拠しています。日本リージョンは東京（ap-northeast-1）のClickHouseおよびAWSインフラで運用されます。
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-10 flex items-center justify-center gap-10 sm:gap-14"
      >
        {badges.map((badge) => (
          <Link
            key={badge.alt}
            href={badge.href}
            className="transition-opacity hover:opacity-80"
          >
            <Image
              src={badge.src}
              alt={badge.alt}
              width={80}
              height={80}
              className={badge.className}
            />
          </Link>
        ))}
      </motion.div>
    </section>
  );
}
