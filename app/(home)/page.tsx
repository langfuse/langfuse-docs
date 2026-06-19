import { cookies, headers } from "next/headers";
import { Home } from "@/components/home";
import {
  HERO_SLOGAN_VARIANT_HEADER,
  HERO_SLOGAN_VARIANT_KEY,
  getHeroSloganVariantFromCookieValue,
} from "@/lib/hero-slogan-variant";

export default async function HomePage() {
  const [cookieStore, headerStore] = await Promise.all([
    cookies(),
    headers(),
  ]);
  const heroSloganVariant = getHeroSloganVariantFromCookieValue(
    headerStore.get(HERO_SLOGAN_VARIANT_HEADER) ??
      cookieStore.get(HERO_SLOGAN_VARIANT_KEY)?.value,
  );

  return <Home heroSloganVariant={heroSloganVariant} />;
}
