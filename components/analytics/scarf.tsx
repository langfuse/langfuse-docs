"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Scarf web traffic pixel (https://docs.scarf.sh/web-traffic/).
//
// Scarf is a cookie-free, privacy-preserving analytics pixel — it sets no
// cookies and stores no IP/PII — so it needs no consent banner and can fire on
// every page.
//
// Scarf infers which page was viewed from the request's `Referer` header, so
// the pixel MUST be loaded with `referrerPolicy="no-referrer-when-downgrade"`.
// This site sends `Referrer-Policy: strict-origin-when-cross-origin` by default
// (see next.config.mjs), which would strip the path on the cross-origin request
// to static.scarf.sh and leave Scarf unable to segment traffic by route
// (self-hosting, Docker Compose, Kubernetes/Helm, Terraform, pricing, SDK docs,
// …). Setting the policy on the element overrides the document default for this
// one request, so the full URL is sent and Scarf can segment by path.
//
// Because this is a client-side-routed Next.js app, a static pixel would only
// fire on the initial load. We re-fire it on every route change (`usePathname`)
// — the same approach `PostHogProvider` uses for `$pageview` — so client-side
// navigations are counted too. Scarf responds with `no-store`, so each new
// request reaches Scarf without a cache-busting query param.
const SCARF_PIXEL_ID = "e976646f-b5b2-4877-83ea-6d52444533ea";

export function ScarfPixel() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) return;

    const pixel = new Image();
    pixel.referrerPolicy = "no-referrer-when-downgrade";
    pixel.src = `https://static.scarf.sh/a.png?x-pxid=${SCARF_PIXEL_ID}`;
  }, [pathname]);

  return null;
}
