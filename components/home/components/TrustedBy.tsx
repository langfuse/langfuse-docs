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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
            <TooltipProvider disableHoverableContent={false}>
              <div className="flex items-center">
                {customers.map((customer, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
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
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={4}
                      className="h-auto w-auto min-w-[120px] rounded-none border border-line-structure bg-surface-1 p-3 font-sans text-sm text-popover-foreground shadow-md"
                    >
                      <div className="text-center">
                        <p className="font-medium">{customer.name}</p>
                        {customer.caseStudyUrl && (
                          <Link
                            href={customer.caseStudyUrl}
                            className="text-xs text-primary/80 hover:text-primary underline mt-1 block"
                          >
                            Read case study →
                          </Link>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          ) : (
            <div className="text-xs text-muted-foreground">{fallbackText}</div>
          )}
        </div>
      </div>
    </div>
  );
}
