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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Customer = {
  name: string;
  logo: string;
};

interface TrustedByProps {
  customers?: Customer[];
  fallbackText?: string;
  className?: string;
}

export function TrustedBy({ 
  customers, 
  fallbackText = "40,000+ builders",
  className = ""
}: TrustedByProps) {
  return (
    <div className={`px-4 lg:px-6 h-[64px] flex items-center ${className}`}>
      <div className="flex items-center w-full">
        <div className="text-xs text-muted-foreground">
          Trusted by:
        </div>
        <div className="flex items-center pl-4">
          {customers && customers.length > 0 ? (
            <TooltipProvider delayDuration={200}>
              <div className="flex items-center">
                {customers.map((customer, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden transition-transform duration-200 hover:scale-125 hover:z-50 cursor-pointer shadow-md"
                        style={{
                          marginLeft: index > 0 ? '-10px' : '0',
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
                    <TooltipContent>
                      <p>{customer.name}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          ) : (
            <div className="text-xs text-muted-foreground">
              {fallbackText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 