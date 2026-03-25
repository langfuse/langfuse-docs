"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import canvaLight from "@/components/home/img/canva_light.png";
import canvaDark from "@/components/home/img/canva_dark.png";
import twilioLight from "@/components/home/img/twilio_light.svg";
import twilioDark from "@/components/home/img/twilio_dark.svg";
import intuitLight from "@/components/home/img/intuit_light.svg";
import intuitDark from "@/components/home/img/intuit_dark.svg";
import freeeLight from "@/components/home/img/freee_light.png";
import freeeDark from "@/components/home/img/freee_dark.png";

type Logo = {
  name: string;
  light: StaticImageData;
  dark: StaticImageData;
};

const logos: Logo[] = [
  { name: "freee", light: freeeDark, dark: freeeLight },
  { name: "Canva", light: canvaDark, dark: canvaLight },
  { name: "Twilio", light: twilioDark, dark: twilioLight },
  { name: "Intuit", light: intuitLight, dark: intuitDark },
];

export function JpCloudLogos() {
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
          Trusted by Industry Leaders
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          グローバル企業の本番環境で採用されています
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-0"
      >
        {logos.map((logo) => (
          <div
            key={logo.name}
            className="flex items-center justify-center h-16 md:h-20 px-6 md:px-10 border border-border/50 -mr-px -mb-px bg-card"
          >
            <Image
              src={logo.light}
              alt={`${logo.name} logo`}
              className="object-contain max-h-8 max-w-full dark:hidden"
              sizes="(max-width: 768px) 40vw, 20vw"
            />
            <Image
              src={logo.dark}
              alt={`${logo.name} logo`}
              className="object-contain max-h-8 max-w-full hidden dark:block"
              sizes="(max-width: 768px) 40vw, 20vw"
            />
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-8 text-center"
      >
        <Button variant="ghost" asChild>
          <Link href="/users">
            View all customer stories / 導入事例を見る
            <ArrowRight size={14} className="ml-2" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
