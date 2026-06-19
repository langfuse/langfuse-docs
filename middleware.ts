import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  HERO_SLOGAN_VARIANT_KEY,
  isHeroSloganVariant,
  pickHeroSloganVariant,
} from "@/lib/hero-slogan-variant";

const HERO_SLOGAN_VARIANT_HEADER = "x-hero-slogan-variant";

export function middleware(request: NextRequest) {
  const existing = request.cookies.get(HERO_SLOGAN_VARIANT_KEY)?.value;
  const variant =
    existing && isHeroSloganVariant(existing)
      ? existing
      : pickHeroSloganVariant();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(HERO_SLOGAN_VARIANT_HEADER, variant);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (!existing || !isHeroSloganVariant(existing)) {
    response.cookies.set(HERO_SLOGAN_VARIANT_KEY, variant, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: "/",
};
