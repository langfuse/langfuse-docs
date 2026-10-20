"use client";

import { motion } from "framer-motion";
import { WrappedSection } from "./components/WrappedSection";
import { Heading } from "@/components/ui/heading";

const messages = [
  "2025 was a big year at 🪢 Langfuse.",
  "We 🚢 more than ever.",
  "The community is growing faster than ever... 📈",
  "...and so are your applications 🚀",
  "Let's take a l👀k back.",
];

export function Intro() {
  return (
    <WrappedSection className="pt-10 lg:pt-16">
      <div className="flex flex-col">
        {messages.map((message) => (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center min-h-[28vh] py-8"
          >
            <Heading
              size="large"
              className="text-center text-balance max-w-3xl"
            >
              {message}
            </Heading>
          </motion.div>
        ))}
      </div>
    </WrappedSection>
  );
}
