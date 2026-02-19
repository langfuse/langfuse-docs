"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { testimonials } from "../../data/testimonials";

const PLATFORMS = {
  xcom: {
    logo: "/images/xcom.png",
    color: "text-slate-600",
    name: "X"
  },
  producthunt: {
    logo: "/images/producthunt.png",
    color: "text-orange-600",
    name: "Product Hunt"
  },
  linkedin: {
    logo: "/images/linkedin.png",
    color: "text-muted-foreground",
    name: "LinkedIn"
  }
} as const;

const CARDS_CONFIG = {
  INITIAL: 3,
  EXPANDED: 5,
  ALL: 15
} as const;

// Helper to render content; card is already a link so we use span for @langfuse to avoid nested <a>
const renderContent = (content: string, platform: string) => {
  if (platform === "xcom" && content.includes("@langfuse")) {
    const parts = content.split("@langfuse");
    const elements = [];
    for (let i = 0; i < parts.length; i++) {
      elements.push(parts[i]);
      if (i < parts.length - 1) {
        elements.push(
          <span
            key={i}
            className="text-blue-500 hover:text-blue-600 hover:underline"
          >
            @langfuse
          </span>
        );
      }
    }
    return elements;
  }
  return content;
};

export const TestimonialsGrid = () => {
  const [cardsPerColumn, setCardsPerColumn] = useState(CARDS_CONFIG.INITIAL);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const columns = useMemo(() => {
    const cols = [[], [], []];
    testimonials.forEach((testimonial, index) => {
      cols[index % 3].push(testimonial);
    });
    return cols;
  }, []);

  const getButtonText = () => {
    if (cardsPerColumn === CARDS_CONFIG.INITIAL) return 'Show more';
    if (cardsPerColumn === CARDS_CONFIG.EXPANDED) return 'Show all';
    if (cardsPerColumn === CARDS_CONFIG.ALL) return 'Show less';
    return null;
  };

  const handleShowMore = () => {
    if (cardsPerColumn === CARDS_CONFIG.INITIAL) {
      setCardsPerColumn(CARDS_CONFIG.EXPANDED);
    } else if (cardsPerColumn === CARDS_CONFIG.EXPANDED) {
      setCardsPerColumn(CARDS_CONFIG.ALL);
    } else if (cardsPerColumn === CARDS_CONFIG.ALL) {
      setCardsPerColumn(CARDS_CONFIG.INITIAL);
    }
  };

  if (!isClient) {
    return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3" />;
  }

  return (
    <>
      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.slice(0, cardsPerColumn).map((testimonial) => (
              <a
                key={testimonial.id}
                href={testimonial.postURL}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-6 rounded-lg border transition-all duration-200 cursor-pointer bg-card break-inside-avoid hover:border-gray-300 dark:hover:border-gray-600"
              >
                {/* Profile Header */}
                <div className="flex gap-3 items-start mb-4">
                  {testimonial.avatar && (
                    <div className="relative">
                      <Image
                        src={testimonial.avatar}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div className="absolute -right-1 -bottom-1 bg-white rounded-full border shadow-sm">
                        {PLATFORMS[testimonial.platform].logo.startsWith('/') ? (
                          <Image
                            src={PLATFORMS[testimonial.platform].logo}
                            alt={testimonial.platform}
                            width={12}
                            height={12}
                            className="object-contain"
                          />
                        ) : (
                          <span className={`text-xs ${PLATFORMS[testimonial.platform].color}`}>
                            {PLATFORMS[testimonial.platform].name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center">
                      <h4 className="text-sm font-medium truncate text-foreground">
                        {testimonial.name}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.handle}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm leading-relaxed text-foreground">
                  {renderContent(testimonial.content, testimonial.platform)}
                </div>
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* Show More Button */}
      {getButtonText() && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="text-sm underline transition-colors text-muted-foreground hover:text-foreground"
          >
            {getButtonText()}
          </button>
        </div>
      )}
    </>
  );
}; 