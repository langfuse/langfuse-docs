"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export function HiringBadge() {
  const [isHovered, setIsHovered] = useState(false);
  const [goats, setGoats] = useState<Array<{ id: number; x: number; y: number; delay: number; duration: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const goatIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Throttle goat spawning (spawn every 100ms)
    const now = Date.now();
    if (isHovered && now - lastSpawnTimeRef.current > 100) {
      lastSpawnTimeRef.current = now;
      
      const newGoat = {
        id: goatIdRef.current++,
        x,
        y,
        delay: 0,
        duration: 1.5 + (Math.random() * 0.6),
      };
      setGoats((prev) => [...prev, newGoat]);

      // Remove goat after animation completes
      setTimeout(() => {
        setGoats((prev) => prev.filter((goat) => goat.id !== newGoat.id));
      }, (newGoat.duration + 0.5) * 1000);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setGoats([]);
  };

  return (
    <div 
      ref={containerRef}
      className="relative hidden lg:block"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href="/careers"
        className={cn(
          buttonVariants({ variant: "outline", size: "pill" }),
          "inline-flex h-6 px-2.5 text-[11px] font-medium bg-white text-foreground hover:bg-accent/50 items-center gap-1.5 relative z-10"
        )}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        style={{ width: "max-content" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[theme(colors.orange.400)] shrink-0" />
        <span className="relative">
          <span className={cn("block", isHovered && "invisible")}>
            Hiring in Berlin and SF
          </span>
          <span className={cn("absolute left-0 top-0", !isHovered && "invisible")}>
            Looking for GOATS!
          </span>
        </span>
      </Link>
      
      {/* Falling goats animation */}
      {isHovered && (
        <div className="fixed pointer-events-none overflow-visible z-50" style={{ 
          top: 0, 
          left: 0, 
          width: "100vw", 
          height: "100vh",
        }}>
          {goats.map((goat) => {
            if (!containerRef.current) return null;
            const rect = containerRef.current.getBoundingClientRect();
            const absoluteX = rect.left + goat.x;
            const absoluteY = rect.top + goat.y;
            
            return (
              <span
                key={goat.id}
                className="absolute text-lg animate-fall"
                style={{
                  left: `${absoluteX}px`,
                  top: `${absoluteY}px`,
                  animationDelay: `${goat.delay}s`,
                  animationDuration: `${goat.duration}s`,
                }}
              >
                🐐
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
