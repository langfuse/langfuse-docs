/**
 * Largest monthly unit count that can be priced exactly.
 * Pasted values above this are not safe integers: `parseInt` / `Number`
 * round them, and the graduated-price formula then renders a nonsense total
 * that overflows the calculator.
 */
export const MAX_MONTHLY_UNITS = Number.MAX_SAFE_INTEGER;

// Graduated pricing tiers
export const pricingTiers = [
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

export type PricingTier = (typeof pricingTiers)[number];

export type TierBreakdown = {
  tier: PricingTier;
  eventsInTier: number;
  costForTier: number;
  tierRate: string;
};

const clampDigitString = (digits: string, max: number): string => {
  const maxDigits = String(max);
  if (
    digits.length > maxDigits.length ||
    (digits.length === maxDigits.length && digits > maxDigits)
  ) {
    return maxDigits;
  }
  return digits;
};

/** Keep the typed or pasted value inside the range the calculator can price. */
export const formatEventsInput = (value: string): string => {
  const numbersOnly = value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  if (numbersOnly.length === 0) return "";

  return clampDigitString(numbersOnly, MAX_MONTHLY_UNITS).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );
};

/** Parse a formatted units field. Unsafe or empty input never reaches the formula. */
export const parseMonthlyUnits = (formatted: string): number => {
  const digits = formatted.replace(/[^\d]/g, "").replace(/^0+(?=\d)/, "");
  if (digits.length === 0) return 0;
  return Number(clampDigitString(digits, MAX_MONTHLY_UNITS));
};

const sanitizeMonthlyUnits = (events: number): number => {
  if (!Number.isFinite(events) || events <= 0) return 0;
  const whole = Math.trunc(events);
  if (!Number.isSafeInteger(whole)) return MAX_MONTHLY_UNITS;
  return whole;
};

export const calculatePricingBreakdown = (events: number): TierBreakdown[] => {
  const units = sanitizeMonthlyUnits(events);

  return pricingTiers.map((tier, index) => {
    let eventsInTier = 0;
    let costForTier = 0;
    let tierRate = "";

    if (index === 0) {
      // Free tier
      eventsInTier = Math.min(units, 100000);
      costForTier = 0;
      tierRate = "Free";
    } else if (units >= tier.min) {
      const tierEnd = tier.max === Infinity ? units : Math.min(units, tier.max);
      eventsInTier = Math.max(0, tierEnd - tier.min + 1);
      costForTier = (eventsInTier / 100000) * tier.rate;
      tierRate = `$${tier.rate}/100k`;
    } else {
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

export const usageCost = (breakdown: TierBreakdown[]): number => {
  const total = breakdown.reduce((sum, item) => sum + item.costForTier, 0);
  if (!Number.isFinite(total)) return 0;
  return Math.round(total * 100) / 100;
};
