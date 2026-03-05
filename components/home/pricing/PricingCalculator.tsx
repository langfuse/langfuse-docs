"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { InfoIcon } from "lucide-react";

// Graduated pricing tiers
const pricingTiers = [
  { min: 0, max: 100000, rate: 0, description: "0-100k units" },
  { min: 100001, max: 1000000, rate: 8, description: "100k-1M units" },
  { min: 1000001, max: 10000000, rate: 7, description: "1-10M units" },
  {
    min: 10000001,
    max: 50000000,
    rate: 6.5,
    description: "10-50M units",
  },
  { min: 50000001, max: Infinity, rate: 6, description: "50M+ units" },
];

// Calculate pricing breakdown for all tiers
type TierBreakdown = {
  tier: (typeof pricingTiers)[0];
  eventsInTier: number;
  costForTier: number;
  tierRate: string;
};

const calculatePricingBreakdown = (events: number): TierBreakdown[] => {
  return pricingTiers.map((tier, index) => {
    let eventsInTier = 0;
    let costForTier = 0;
    let tierRate = "";

    if (index === 0) {
      // Free tier
      eventsInTier = Math.min(events, 100000);
      costForTier = 0;
      tierRate = "Free";
    } else {
      // Paid tiers
      if (events >= tier.min) {
        const tierStart = tier.min;
        const tierEnd =
          tier.max === Infinity ? events : Math.min(events, tier.max);
        eventsInTier = Math.max(0, tierEnd - tierStart + 1);
        costForTier = (eventsInTier / 100000) * tier.rate;
      }
      tierRate = `$${tier.rate}/100k`;
    }

    return {
      tier,
      eventsInTier,
      costForTier,
      tierRate,
    };
  });
};

// Plan configuration
type PlanConfig = {
  name: string;
  baseFee: number;
};

const PLAN_CONFIGS: PlanConfig[] = [
  { name: "Core", baseFee: 29 },
  { name: "Pro", baseFee: 199 },
  { name: "Pro + Teams", baseFee: 499 },
  { name: "Enterprise", baseFee: 2499 },
];

// Utility functions
const formatNumber = (num: number) => num.toLocaleString();

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const formatEventsInput = (value: string) => {
  const numbersOnly = value.replace(/\D/g, "");
  return numbersOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export function PricingCalculator({
  initialPlan = "Core",
}: {
  initialPlan?: string;
}) {
  const [monthlyEvents, setMonthlyEvents] = useState<string>("200,000");
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);
  const [currentBaseFee, setCurrentBaseFee] = useState<number>(
    PLAN_CONFIGS.find((p) => p.name === initialPlan)?.baseFee || 0
  );

  // Calculate pricing breakdown (single source of truth)
  const pricingBreakdown = useMemo(() => {
    const events = parseInt(monthlyEvents.replace(/,/g, "")) || 0;
    return calculatePricingBreakdown(events);
  }, [monthlyEvents]);

  // Derive total cost from breakdown
  const calculatedPrice = useMemo(() => {
    const total = pricingBreakdown.reduce(
      (sum, item) => sum + item.costForTier,
      0
    );
    return Math.round(total * 100) / 100;
  }, [pricingBreakdown]);

  const handlePlanChange = (value: string) => {
    const newPlan = PLAN_CONFIGS.find((plan) => plan.name === value);
    setSelectedPlan(value);
    setCurrentBaseFee(newPlan?.baseFee || 0);
  };

  const handleEventsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyEvents(formatEventsInput(e.target.value));
  };

  return (
    <div className="mx-auto max-w-4xl" id="pricing-calculator">
      <h2 className="mb-2 text-2xl font-bold tracking-tight leading-10 text-primary">
        Pricing Calculator
      </h2>
      <p className="mb-6 text-base text-muted-foreground">
        Enter your monthly billable units to see the graduated pricing
        breakdown.


      </p>
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="plan" className="block">
                Plan
              </Label>
              <Select value={selectedPlan} onValueChange={handlePlanChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_CONFIGS.map((plan) => (
                    <SelectItem key={plan.name} value={plan.name}>
                      {plan.name}{" "}
                      {plan.baseFee > 0 ? `($${plan.baseFee}/month)` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="flex gap-1 items-center">
                <Label htmlFor="events">Monthly Units</Label>
                <Link
                  href="/docs/administration/billable-units"
                  target="_blank"
                >
                  <InfoIcon className="size-3" />
                </Link>
              </div>
              <Input
                id="events"
                type="text"
                value={monthlyEvents}
                onChange={handleEventsChange}
                placeholder="Enter number of units per month"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg border bg-secondary sm:p-6">
            {currentBaseFee > 0 ? (
              <div className="text-center">
                <div className="flex flex-col gap-2 justify-center items-center text-base font-medium sm:flex-row sm:gap-4 sm:text-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary sm:text-2xl">
                      {formatCurrency(currentBaseFee)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {selectedPlan} Base
                    </div>
                  </div>
                  <div className="text-lg text-muted-foreground sm:text-xl">+</div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary sm:text-2xl">
                      {formatCurrency(calculatedPrice)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Usage
                    </div>
                  </div>
                  <div className="text-lg text-muted-foreground sm:text-xl">=</div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary sm:text-2xl">
                      {formatCurrency(calculatedPrice + currentBaseFee)}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Total / Month
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-center">
                  <div className="text-2xl font-bold sm:text-3xl text-primary">
                    {formatCurrency(calculatedPrice)}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    Total Usage Cost / Month
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="font-medium">Pricing tiers breakdown:</div>
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Tier</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">
                      <div className="flex gap-1 justify-end items-center">
                        Your Units
                        <Link aria-label="Learn more about billable units"
                          href="/docs/administration/billable-units"
                          target="_blank"
                        >
                          <InfoIcon className="size-3" />
                        </Link>
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingBreakdown.map((breakdown, index) => {
                    const { tier, eventsInTier, costForTier, tierRate } =
                      breakdown;

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {tier.description}
                        </TableCell>
                        <TableCell className="text-right">{tierRate}</TableCell>
                        <TableCell className="text-right">
                          {eventsInTier > 0 ? formatNumber(eventsInTier) : "—"}
                        </TableCell>
                        <TableCell className="font-medium text-right">
                          {eventsInTier > 0 ? formatCurrency(costForTier) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Total row */}
                  <TableRow className="border-t-2 bg-muted/30">
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="font-semibold text-right">
                      {(() => {
                        const totalUnits = parseInt(monthlyEvents.replace(/,/g, "")) || 0;
                        if (totalUnits === 0) return "—";
                        const avgRate = (calculatedPrice / totalUnits) * 100000;
                        return formatCurrency(avgRate) + "/100k";
                      })()}
                    </TableCell>
                    <TableCell className="font-semibold text-right">
                      {monthlyEvents}
                    </TableCell>
                    <TableCell className="font-semibold text-right text-primary">
                      {formatCurrency(calculatedPrice)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
