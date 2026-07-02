export const HERO_SLOGAN_VARIANT_HEADER = "x-hero-slogan-variant";

export const HERO_SLOGAN_VARIANT_KEY = "langfuse-hero-slogan-variant";

export type HeroSloganVariant = "ai-engineering" | "agent-evals";

export function isHeroSloganVariant(value: string): value is HeroSloganVariant {
  return value === "ai-engineering" || value === "agent-evals";
}

export function pickHeroSloganVariant(): HeroSloganVariant {
  return Math.random() < 0.5 ? "ai-engineering" : "agent-evals";
}

export function getHeroSloganVariantFromCookieValue(
  value: string | undefined,
): HeroSloganVariant {
  if (value && isHeroSloganVariant(value)) {
    return value;
  }
  return pickHeroSloganVariant();
}
