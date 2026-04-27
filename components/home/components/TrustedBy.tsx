/**
 * Customer data for the "Trusted by" section in pricing cards.
 *
 * This displays customer logos for each pricing tier.
 * When customers are available, shows logos with hover tooltips.
 * When no customers are assigned to a tier, falls back to "40,000+ builders" text.
 *
 * getting the logos from data/trusted-by.ts
 * Used by: components/home/components/TrustedBy.tsx
 * Displayed in: components/home/Pricing.tsx (cloud pricing cards only)
 */

import React from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Customer = {
  name: string;
  logo: string;
  caseStudyUrl?: string;
};

interface TrustedByProps {
  customers?: Customer[];
  fallbackText?: string;
  className?: string;
}

export function TrustedBy({
  customers,
  fallbackText = "40,000+ builders",
  className = "",
}: TrustedByProps) {
  return (
    <div className={`px-4 lg:px-6 h-[64px] flex items-center ${className}`}>
      <div className="flex items-center w-full">
        <div className="text-xs text-muted-foreground">Trusted by:</div>
        <div className="flex items-center pl-4">
          {customers && customers.length > 0 ? (
            <div className="flex items-center">
              {customers.map((customer, index) => (
                <HoverCard key={index} openDelay={100} closeDelay={150}>
                  <HoverCardTrigger asChild>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-125 hover:z-50 cursor-pointer shadow-md"
                      style={{
                        marginLeft: index > 0 ? "-10px" : "0",
                        zIndex: customers.length - index,
                      }}
                    >
                      <img
                        src={customer.logo}
                        alt={customer.name}
                        className="w-8 h-8 object-contain"
                      />
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-auto min-w-[120px] p-3 text-center">
                    <p className="text-sm font-medium">{customer.name}</p>
                    {customer.caseStudyUrl && (
                      <Link
                        href={customer.caseStudyUrl}
                        className="text-xs text-primary/80 hover:text-primary underline mt-1 block"
                      >
                        Read case study →
                      </Link>
                    )}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">{fallbackText}</div>
          )}
        </div>
      </div>
    </div>
  );
}
