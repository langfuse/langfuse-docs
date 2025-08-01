"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CustomerQuoteProps {
  quote: string;
  name: string;
  role: string;
  company?: string;
  image?: string;
  className?: string;
}

export const CustomerQuote = ({ 
  quote, 
  name, 
  role, 
  company, 
  image,
  className = "" 
}: CustomerQuoteProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsAnimating(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (isAnimating) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < quote.length) {
          setDisplayedText(quote.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
        }
      }, 7.5); // 15ms streaming speed

      return () => clearInterval(interval);
    }
  }, [isAnimating, quote]);

  const quoteMarkStyle = "font-serif text-[32px] leading-none text-gray-600 dark:text-gray-400";
  const openingQuoteStyle = "font-serif text-[32px] leading-none -ml-3 text-gray-600 dark:text-gray-400";

  return (
    <div ref={ref} className={`my-24 ${className}`}>
      <blockquote className="text-2xl font-normal leading-relaxed mb-4 relative">
        {/* Hidden text to maintain layout height */}
        <span className="invisible" aria-hidden="true">
          <span className={openingQuoteStyle}>"</span>{quote}<span className={quoteMarkStyle}>"</span>
        </span>
        
        {/* Visible streaming text positioned absolutely */}
        <span className="absolute inset-0 text-gray-800 dark:text-gray-200">
          <span className={`${openingQuoteStyle} mr-1`}>"</span>
          <span className="text-2xl">{hasAnimated ? displayedText : quote}</span>
          {hasAnimated && !isAnimating && (
            <span className={`${quoteMarkStyle} ml-1`}>"</span>
          )}
          {isAnimating && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block ml-1 text-2xl"
            >
              |
            </motion.span>
          )}
        </span>
      </blockquote>
      
      <motion.div 
        className="flex items-center gap-4 justify-end"
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {image && (
          <div className="flex-shrink-0">
            <Image
              src={image}
              alt={name}
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
        )}
        <div>
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{name}</span>, {role}{company && ` at ${company}`}
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 