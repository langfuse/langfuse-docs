// Shared by the pricing UI, calculator, and Markdown renderer. Update the
// review date when changing these facts; never substitute a build timestamp.
const CLOUD_PRICING_REVIEWED_ON = "2026-09-10";
const CLOUD_PLAN_FEES = { Core: 29, Pro: 199, Enterprise: 2499 };
const TEAMS_ADDON_FEE = 300;
const CLOUD_PLAN_CONFIGS = [
  { name: "Core", baseFee: CLOUD_PLAN_FEES.Core },
  { name: "Pro", baseFee: CLOUD_PLAN_FEES.Pro },
  { name: "Pro + Teams", baseFee: CLOUD_PLAN_FEES.Pro + TEAMS_ADDON_FEE },
  { name: "Enterprise", baseFee: CLOUD_PLAN_FEES.Enterprise },
];
const CLOUD_USAGE_TIERS = [
  { min: 0, max: 100000, rate: 0, description: "0-100k units" },
  { min: 100001, max: 1000000, rate: 8, description: "100k-1M units" },
  { min: 1000001, max: 10000000, rate: 7, description: "1-10M units" },
  { min: 10000001, max: 50000000, rate: 6.5, description: "10-50M units" },
  { min: 50000001, max: Infinity, rate: 6, description: "50M+ units" },
];

const CLOUD_PRICING_VALUES = {
  reviewed: `Cloud plan prices and usage rates reviewed on ${CLOUD_PRICING_REVIEWED_ON} (USD).`,
  corePrice: `$${CLOUD_PLAN_FEES.Core}`,
  proPrice: `$${CLOUD_PLAN_FEES.Pro}`,
  enterprisePrice: `$${CLOUD_PLAN_FEES.Enterprise.toLocaleString("en-US")}`,
  teamsPrice: `$${TEAMS_ADDON_FEE}`,
  hobbyUnits: "50k",
  paidUnits: `${CLOUD_USAGE_TIERS[0].max / 1000}k`,
  hobbyHistory: "30 days",
  coreHistory: "90 days",
  proHistory: "3 years",
  startingRate: `$${CLOUD_USAGE_TIERS[1].rate}/100k units`,
};

function getCloudPricingValue(name) {
  if (!Object.hasOwn(CLOUD_PRICING_VALUES, name)) {
    throw new Error(`Unknown cloud pricing value: ${name}`);
  }
  return CLOUD_PRICING_VALUES[name];
}

function calculateCloudPricingBreakdown(events) {
  return CLOUD_USAGE_TIERS.map((tier, index) => {
    let eventsInTier = 0;
    let costForTier = 0;
    let tierRate = "";

    if (index === 0) {
      // Free tier
      eventsInTier = Math.min(events, CLOUD_USAGE_TIERS[0].max);
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
}

module.exports = {
  calculateCloudPricingBreakdown,
  CLOUD_PLAN_CONFIGS,
  CLOUD_PRICING_VALUES,
  CLOUD_USAGE_TIERS,
  getCloudPricingValue,
};
