import { useState, useEffect } from "react";
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

// Calculate graduated pricing
const calculateGraduatedPrice = (events: number): number => {
  if (events <= 100000) return 0; // First 100k are free

  let totalCost = 0;
  let processedEvents = 100000; // Start after free tier

  for (let i = 1; i < pricingTiers.length; i++) {
    const tier = pricingTiers[i];
    if (events <= processedEvents) break;

    const tierStart = Math.max(processedEvents, tier.min);
    const tierEnd = tier.max === Infinity ? events : Math.min(events, tier.max);
    const eventsInTier = tierEnd - tierStart;

    if (eventsInTier > 0) {
      totalCost += (eventsInTier / 100000) * tier.rate;
      processedEvents = tierEnd;
    }
  }

  return Math.round(totalCost * 100) / 100;
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

// Calculate events and cost for a specific tier
const calculateTierBreakdown = (
  events: number,
  tier: (typeof pricingTiers)[0],
  index: number
) => {
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

  return { eventsInTier, costForTier, tierRate };
};

export function PricingCalculator({
  initialPlan = "Core",
}: {
  initialPlan?: string;
}) {
  const [monthlyEvents, setMonthlyEvents] = useState<string>("200,000");
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan);
  const [currentBaseFee, setCurrentBaseFee] = useState<number>(
    PLAN_CONFIGS.find((p) => p.name === initialPlan)?.baseFee || 0
  );

  // Calculate price when events change
  useEffect(() => {
    const events = parseInt(monthlyEvents.replace(/,/g, "")) || 0;
    setCalculatedPrice(calculateGraduatedPrice(events));
  }, [monthlyEvents]);

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
      <h2 className="text-2xl font-bold leading-10 tracking-tight text-primary mb-2">
        Pricing Calculator
      </h2>
      <p className="text-base text-muted-foreground mb-6">
        Enter your monthly billable units to see the graduated pricing
        breakdown.
      </p>
      <Card>
        <CardContent className="space-y-6 pt-6">
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
              <div className="flex items-center gap-1">
                <Label htmlFor="events">Monthly Units</Label>
                <Link
                  href="/docs/tracing-data-model#billable-units"
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

          <div className="border bg-secondary p-6 rounded-lg">
            {currentBaseFee > 0 ? (
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 text-lg font-medium">
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {formatCurrency(currentBaseFee)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedPlan} Base
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xl">+</div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {formatCurrency(calculatedPrice)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Usage
                    </div>
                  </div>
                  <div className="text-muted-foreground text-xl">=</div>
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {formatCurrency(calculatedPrice + currentBaseFee)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Total / Month
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {formatCurrency(calculatedPrice)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total Usage Cost / Month
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="font-medium">Pricing tiers breakdown:</div>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Tier</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Your Units</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pricingTiers.map((tier, index) => {
                    const events =
                      parseInt(monthlyEvents.replace(/,/g, "")) || 0;
                    const { eventsInTier, costForTier, tierRate } =
                      calculateTierBreakdown(events, tier, index);

                    return (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {tier.description}
                        </TableCell>
                        <TableCell className="text-right">{tierRate}</TableCell>
                        <TableCell className="text-right">
                          {eventsInTier > 0 ? formatNumber(eventsInTier) : "—"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {eventsInTier > 0 ? formatCurrency(costForTier) : "—"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {/* Total row */}
                  <TableRow className="border-t-2 bg-muted/30">
                    <TableCell className="font-semibold">Total</TableCell>
                    <TableCell className="text-right"></TableCell>
                    <TableCell className="text-right font-semibold">
                      {monthlyEvents}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
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
