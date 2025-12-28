"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { WrappedSection } from "./components/WrappedSection";

export function CTA() {
  return (
    <WrappedSection className="text-center relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      {/* Decorative star emojis */}
      <motion.div
        className="absolute top-[10%] sm:top-0 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: -12 }}
        transition={{
          delay: 0.2,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15
        }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute top-[55%] sm:top-[60%] right-[5%] sm:right-[8%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: 15 }}
        transition={{
          delay: 0.4,
          duration: 0.5,
          type: "spring",
          stiffness: 150,
          damping: 12
        }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute bottom-[15%] sm:bottom-[20%] left-[8%] sm:left-[15%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg"
        initial={{ opacity: 0, scale: 0, rotate: 180, x: -100 }}
        animate={{ opacity: 1, scale: 1, rotate: -8, x: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.7,
          type: "spring",
          stiffness: 180,
          damping: 14
        }}
      >
        ⭐
      </motion.div>
      <div className="relative z-10">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-mono text-balance">
          We could only wish for one thing...
        </h2>
        <div className="flex gap-4 flex-wrap items-center justify-center mt-8">
          <Button variant="cta" size="lg" asChild>
            <Link href="https://github.com/langfuse/langfuse">Leave a ⭐ on GitHub</Link>
          </Button>
        </div>
      </div>
    </WrappedSection>
  );
}

