"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BilingualHeading } from "./BilingualBlock";

export function JpCloudHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-5 sm:px-7 xl:px-10">
      {/* Decorative floating emoji tiles — hidden on mobile, pushed to corners on desktop */}
      <motion.div
        className="hidden md:flex absolute top-[12%] left-[3%] lg:left-[6%] w-18 lg:w-24 h-18 lg:h-24 bg-card rounded-2xl items-center justify-center text-3xl lg:text-5xl shadow-lg border"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{
          delay: 0.3,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
      >
        🇯🇵
      </motion.div>
      <motion.div
        className="hidden md:flex absolute top-[10%] right-[3%] lg:right-[6%] w-18 lg:w-24 h-18 lg:h-24 bg-card rounded-2xl items-center justify-center text-3xl lg:text-5xl shadow-lg border"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 10 }}
        transition={{
          delay: 0.5,
          duration: 0.5,
          type: "spring",
          stiffness: 150,
          damping: 12,
        }}
      >
        🌸
      </motion.div>
      <motion.div
        className="hidden md:flex absolute bottom-[10%] left-[3%] lg:left-[8%] w-18 lg:w-24 h-18 lg:h-24 bg-card rounded-2xl items-center justify-center text-3xl lg:text-5xl shadow-lg border"
        initial={{ opacity: 0, scale: 0, rotate: 180, x: -50 }}
        animate={{ opacity: 1, scale: 1, rotate: -8, x: 0 }}
        transition={{
          delay: 0.7,
          duration: 0.7,
          type: "spring",
          stiffness: 180,
          damping: 14,
        }}
      >
        ⛩️
      </motion.div>
      <motion.div
        className="hidden md:flex absolute bottom-[12%] right-[3%] lg:right-[8%] w-18 lg:w-24 h-18 lg:h-24 bg-card rounded-2xl items-center justify-center text-3xl lg:text-5xl shadow-lg border"
        initial={{ opacity: 0, scale: 0, rotate: -90 }}
        animate={{ opacity: 1, scale: 1, rotate: 6 }}
        transition={{
          delay: 0.9,
          duration: 0.5,
          type: "spring",
          stiffness: 160,
          damping: 13,
        }}
      >
        🗾
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(to right, #c084fc, #f97316)",
            }}
          >
            Coming Soon
          </span>
        </motion.div>

        <motion.h1
          className="mt-8 text-4xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Langfuse Cloud
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <BilingualHeading
            en="Japan Region"
            jp="日本リージョン"
            className="mt-4 text-2xl sm:text-4xl lg:text-5xl font-bold font-mono tracking-tight"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <BilingualHeading
            en="LLM observability, prompt management & evaluation — hosted in Japan"
            jp="LLMオブザーバビリティ・プロンプト管理・評価基盤を日本リージョンで提供"
            className="mt-6 text-base sm:text-lg lg:text-xl font-medium text-muted-foreground"
          />
        </motion.div>

        <motion.div
          className="mt-10 flex gap-4 flex-wrap items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button variant="cta" size="xl" asChild>
            <a href="https://langfuse.app.n8n.cloud/form/b6fd623f-0d23-43ba-9c69-077675fe9f62">Join our Japan Mailing List / メーリングリストに参加</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
