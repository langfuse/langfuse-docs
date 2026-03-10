"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BilingualHeading } from "./BilingualBlock";

export function JpCloudCTA() {
  return (
    <section
      id="waitlist"
      className="py-24 lg:py-32 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10 text-center relative overflow-hidden"
    >
      {/* Decorative flag */}
      <motion.div
        className="hidden md:flex absolute top-8 right-[5%] lg:right-[10%] w-18 lg:w-24 h-18 lg:h-24 bg-card rounded-2xl items-center justify-center text-3xl lg:text-5xl shadow-lg border"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 8 }}
        viewport={{ once: true }}
        transition={{
          delay: 0.3,
          duration: 0.5,
          type: "spring",
          stiffness: 150,
          damping: 12,
        }}
      >
        🇯🇵
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <BilingualHeading
          en="Be the first to know"
          jp="いち早くお知らせを受け取る"
          className="text-3xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight"
        />

        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          Join our Japan mailing list to stay updated on the cloud region
          launch, events in Japan, and Japan-specific Langfuse news.
        </p>
        <p className="mt-2 text-base text-muted-foreground/70 max-w-2xl mx-auto">
          日本メーリングリストにご登録いただくと、クラウドリージョンのローンチ、日本でのイベント、日本向けのLangfuse最新情報をお届けします。
        </p>

        <div className="mt-10 flex gap-4 flex-wrap items-center justify-center">
          <Button variant="cta" size="xl" asChild>
            <a href="#waitlist">
              Join our Japan Mailing List / メーリングリストに参加
            </a>
          </Button>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/50">
          You can unsubscribe at any time. / いつでも配信停止できます。
        </p>
      </motion.div>
    </section>
  );
}
