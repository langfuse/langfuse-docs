"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { WrappedSection } from "./components/WrappedSection";

export function Outro() {
  return (
    <WrappedSection className="text-center relative overflow-hidden min-h-[90vh] flex items-center justify-center">
      <div className="relative z-10">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-mono text-balance max-w-4xl px-4 mx-auto mb-4">
          Thank you for being part of this journey!
        </h2>
        <p className="text-lg sm:text-xl text-muted-foreground text-balance max-w-4xl px-4 mx-auto mb-8">
          If there was one thing we could wish for...
        </p>
        <div className="flex gap-4 flex-wrap items-center justify-center">
          <Button variant="cta" size="lg" asChild>
            <Link href="https://github.com/langfuse/langfuse" target="_blank" rel="noopener noreferrer">Leave a ⭐ on GitHub</Link>
          </Button>
        </div>
      </div>
      {/* Decorative star emojis */}
      <div className="absolute top-[15%] sm:top-[5%] left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg pointer-events-none -rotate-12">
        ⭐
      </div>
      <div className="absolute top-[55%] sm:top-[60%] right-[5%] sm:right-[8%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg pointer-events-none rotate-[15deg]">
        ⭐
      </div>
      <div className="absolute bottom-[15%] sm:bottom-[20%] left-[8%] sm:left-[15%] w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl lg:text-5xl shadow-lg pointer-events-none -rotate-12">
        ⭐
      </div>
    </WrappedSection>
  );
}

