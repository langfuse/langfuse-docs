"use client";

import { motion } from "framer-motion";
import { getGitHubStars } from "@/lib/github-stars";
import {
  SDK_INSTALLS_PER_MONTH,
  DOCKER_PULLS,
} from "@/components/home/Usage";

const stats = [
  {
    getValue: () => (getGitHubStars() / 1000).toFixed(0) + "K+",
    en: "GitHub Stars",
    jp: "GitHub スター",
  },
  {
    getValue: () => (SDK_INSTALLS_PER_MONTH / 1_000_000).toFixed(0) + "M+",
    en: "SDK Installs / Month",
    jp: "SDK インストール / 月",
  },
  {
    getValue: () => (DOCKER_PULLS / 1_000_000).toFixed(0) + "M+",
    en: "Docker Pulls",
    jp: "Docker プル",
  },
];

export function JpCloudSocialProof() {
  return (
    <section className="py-20 lg:py-28 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono text-foreground">
          Trusted Worldwide
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          世界中で信頼されています
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.en}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono text-foreground">
              {stat.getValue()}
            </div>
            <div className="mt-2 text-sm font-medium text-muted-foreground">
              {stat.en}
            </div>
            <div className="text-xs text-muted-foreground/60">{stat.jp}</div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
