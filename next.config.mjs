import path from "path";
import { fileURLToPath } from "url";
import { createMDX } from "fumadocs-mdx/next";
import NextBundleAnalyzer from "@next/bundle-analyzer";

import * as redirects from "./lib/redirects.js";
import contentDirMap from "./lib/content-dir-map.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// URL prefixes whose pages are mirrored as markdown by copy_md_sources.js,
// derived from the same map the copy script uses so a new content section is
// picked up automatically. The empty prefix (marketing pages, served from the
// site root) is dropped: those sit alongside app-only routes such as /cloud
// and /events that have no mirror, and a root-level matcher cannot tell them
// apart. Marketing pages still advertise their mirror through the <link> tag
// in buildSectionMetadata(), which is only emitted when the page exists.
const MIRRORED_URL_PREFIXES = Array.from(
  new Set(
    Object.values(contentDirMap.CONTENT_DIR_TO_URL_PREFIX).filter(Boolean),
  ),
).sort();

// File extensions that never negotiate to markdown: markdown, text and JSON
// indexes, the sitemap, the OpenAPI description, and static assets. Shared by
// the content-negotiation rewrite and its `Vary: Accept` header so a request
// for `/sitemap.xml` with `Accept: text/markdown` gets the sitemap, not a
// lookup for `/md-src/sitemap.xml.md`. The agent-traffic matcher in proxy.ts
// mirrors this list (minus `md`, which it tracks) — keep in sync.
const NON_NEGOTIATED_EXTENSIONS =
  "md|txt|json|ya?ml|png|jpe?g|gif|svg|ico|webp|avif|css|js|mjs|map|woff2?|ttf|otf|eot|mp4|webm|mp3|zip|pdf|xml|webmanifest|ipynb";
const NEGOTIATED_PATH = `/:path((?!api|_next|md-src|\\.well-known)(?!.*\\.(?:${NON_NEGOTIATED_EXTENSIONS})$).*)`;

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withMDX = createMDX();

/**
 * CSP headers
 * img-src https to allow loading images from SSO providers
 */
const cspHeader =
  process.env.NODE_ENV === "production"
    ? `
  default-src 'self' https: wss:;
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;
  style-src 'self' 'unsafe-inline' https:;
  img-src 'self' https: blob: data:;
  media-src 'self' https: blob: data:;
  font-src 'self' https:;
  frame-src 'self' https:;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
  block-all-mixed-content;
`
    : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export when STATIC_EXPORT env var is set
  ...(process.env.STATIC_EXPORT === "true" && {
    output: "export",
    trailingSlash: true,
    // Disable server-side features for static export
    distDir: "out",
  }),
  experimental: {
    scrollRestoration: true,
    // Reduce peak memory during production build (helps avoid OOM on Vercel)
    webpackMemoryOptimizations: true,
    serverSourceMaps: false,
    optimizePackageImports: [
      "lucide-react",
      "@icons-pack/react-simple-icons",
      "fumadocs-ui",
      "recharts",
      "@radix-ui/react-accordion",
      "@radix-ui/react-avatar",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-presence",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-use-controllable-state",
    ],
  },
  // Reduce memory usage during build
  productionBrowserSourceMaps: false,
  turbopack: {
    // Fix Turbopack panic when running from a git worktree with multiple lockfiles.
    // Tell Turbopack to use this worktree's directory as the root.
    root: __dirname,
  },
  transpilePackages: ["react-tweet", "react-syntax-highlighter", "geist"],

  // Sparticuz Chromium ships brotli-compressed binaries under `bin/`; Next's file tracer
  // often omits them from the serverless bundle, breaking `executablePath()` on Vercel.
  // Keys are matched with picomatch against normalized app routes (e.g. `/app/api/md-to-pdf`
  // matches `/api/md-to-pdf` via `contains: true`).
  outputFileTracingIncludes: {
    "/api/md-to-pdf": [
      "./lib/stripMdxForPlainMarkdown.js",
      "./node_modules/@sparticuz/chromium/**",
      "./node_modules/.pnpm/@sparticuz+chromium@*/node_modules/@sparticuz/chromium/**",
    ],
  },

  webpack(config, { isServer, webpack }) {
    config.resolve = config.resolve ?? {};
    // Prevent recharts (and its exclusive deps: redux toolkit, immer, etc.) from
    // being hoisted into a synchronous shared chunk that loads on every page.
    // Recharts is only used on the /wrapped page — keep it in async-only chunks
    // so it's never downloaded unless the wrapped page actually renders it.
    // webpack-only: Turbopack ignores splitChunks. Recharts isolation there is
    // the real import() in components/wrapped/index.tsx.
    if (!isServer) {
      const sc = config.optimization?.splitChunks;
      if (sc && typeof sc === "object") {
        sc.cacheGroups = sc.cacheGroups ?? {};
        sc.cacheGroups.rechartsVendor = {
          test: /[\\/]node_modules[\\/](@reduxjs[\\/]toolkit|recharts|victory-vendor|react-redux|immer|reselect|decimal\.js-light|eventemitter3)[\\/]/,
          name: "vendor-recharts",
          chunks: "async", // never pulled into initial/synchronous bundles
          priority: 30,
          enforce: true,
        };
      }
    }

    // Prevent client bundle from failing on Node built-ins (e.g. fumadocs-mdx using fs/promises)
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "fs/promises": false,
        path: false,
        os: false,
        url: false,
        module: false,
        stream: false,
        buffer: false,
      };
      // Strip the node: URI scheme prefix so webpack can apply the fallback above.
      // fumadocs-mdx server code uses `import 'node:fs/promises'` which webpack
      // doesn't handle natively in browser bundles.
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, "");
        }),
      );
    }
    return config;
  },

  images: {
    // Disable image optimization for static export
    ...(process.env.STATIC_EXPORT === "true" && { unoptimized: true }),
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.langfuse.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "langfuse.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.lumacdn.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    qualities: [75, 85, 90, 100],
  },
  headers() {
    const headers = [
      {
        source: "/:path*",
        headers: [
          {
            key: "x-frame-options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "autoplay=*, fullscreen=*, microphone=*",
          },
        ],
      },
      {
        source: "/:path((?!api).*)*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\n/g, ""),
          },
        ],
      },
      // The Japanese pages serve Japanese content, so they declare the
      // document language at the transport level too. `<html lang>` itself is
      // set by `components/DocumentLanguage.tsx`, because Next.js only lets
      // the root layout render `<html>`.
      {
        source: "/japan",
        headers: [{ key: "Content-Language", value: "ja" }],
      },
      {
        source: "/academy/japan/:path*",
        headers: [{ key: "Content-Language", value: "ja" }],
      },
      // Agent discovery documents (Agent Skills index, MCP manifest and server
      // cards, ARD / AI Catalog, RFC 9727 API catalog) — CORS and caching, so
      // browser-based agents and crawlers can fetch them cross-origin.
      {
        source: "/.well-known/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
      // Langfuse Cloud already sends CORS on the proxied spec; set it here too
      // so the on-domain URL does not depend on upstream headers. Caching is
      // left to the upstream response.
      {
        source: "/openapi.:ext(yml|yaml)",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
      {
        source: "/.well-known/mcp/:card(langfuse|langfuse-docs).json",
        headers: [
          { key: "Content-Type", value: "application/mcp-server-card+json" },
        ],
      },
      {
        source: "/.well-known/api-catalog",
        headers: [
          {
            key: "Content-Type",
            value:
              'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
          },
        ],
      },
      // Content negotiation: these paths return markdown instead of HTML when
      // the request carries `Accept: text/markdown` (see the rewrites in
      // `beforeFiles`). `Vary: Accept` tells caches and intermediaries that
      // Accept is part of the cache key, so a cached HTML response is never
      // served to a markdown request or vice versa.
      //
      // Static assets are excluded: they never negotiate, and declaring a Vary
      // they do not honour would fragment CDN cache entries per Accept string
      // for every asset on the site. The extension list mirrors the matcher in
      // proxy.ts, plus `.md` — a `.md` URL is always markdown, so it does not
      // vary on Accept either.
      {
        source: "/",
        headers: [
          { key: "Vary", value: "Accept" },
          // RFC 8288 discovery for agents that read headers before parsing
          // HTML: the markdown mirror, the sitemap, the ARD catalog, the
          // RFC 9727 API catalog, and the public API's OpenAPI description.
          {
            key: "Link",
            value: [
              '</index.md>; rel="alternate"; type="text/markdown"',
              '</sitemap.xml>; rel="sitemap"; type="application/xml"',
              '</.well-known/ard.json>; rel="ard"; type="application/json"',
              '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
              '</openapi.yml>; rel="service-desc"; type="application/vnd.oai.openapi"',
            ].join(", "),
          },
        ],
      },
      {
        source: NEGOTIATED_PATH,
        headers: [{ key: "Vary", value: "Accept" }],
      },
      // Advertise the markdown representation over HTTP as well as in the HTML
      // head, per the llms.txt v2 link relations, so agents that read headers
      // only can discover it.
      //
      // Scoped to a mirrored section prefix plus at least one path segment.
      // Section roots are excluded because some of them (/blog, /changelog,
      // /resources) are listing routes with no markdown mirror, and anything
      // outside these prefixes is excluded because app routes such as /cloud
      // and /events have no mirror either. Advertising a Link that 404s is
      // worse than advertising nothing.
      {
        source: `/:section(${MIRRORED_URL_PREFIXES.join("|")})/:path((?!.*\\.md$).+)`,
        headers: [
          {
            key: "Link",
            value:
              '</:section/:path.md>; rel="alternate"; type="text/markdown"',
          },
        ],
      },
      // Mark markdown endpoints as noindex and ensure correct content type
      {
        source: "/:path*.md",
        headers: [
          { key: "X-Robots-Tag", value: "noindex" },
          { key: "Content-Type", value: "text/markdown; charset=utf-8" },
        ],
      },
    ];

    // Do not index Vercel preview deployments
    if (process.env.NEXT_PUBLIC_VERCEL_ENV === "preview") {
      headers.push({
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      });
    }

    return headers;
  },
  redirects: async () => [
    ...redirects.nonPermanentRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: false,
    })),
    ...redirects.permanentRedirects.map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    })),
  ],
  async rewrites() {
    // Serve any ".md" path by mapping to the static copy in public/md-src
    // Example: /docs.md -> /md-src/docs.md, /docs/observability/overview.md -> /md-src/docs/observability/overview.md
    return {
      // Run BEFORE Next serves content/public files so it can override HTML routes
      // when the client explicitly asks for markdown.
      beforeFiles: [
        // Agent Skills Discovery (RFC 8615 .well-known URI)
        {
          source: "/.well-known/agent-skills",
          destination: "/well-known-agent-skills.json",
        },
        {
          source: "/.well-known/agent-skills/index.json",
          destination: "/well-known-agent-skills.json",
        },
        // Agentic Resource Discovery: ard.json is the ARD canonical path,
        // ai-catalog.json the AI Catalog Standard's. Both serve one file.
        {
          source: "/.well-known/ard.json",
          destination: "/.well-known/ai-catalog.json",
        },
        // MCP discovery document (servers[] plus the mcpServers client
        // config). `/.well-known/mcp/` itself holds the server cards.
        {
          source: "/.well-known/mcp",
          destination: "/.well-known/mcp.json",
        },
        // RFC 9727 API catalog
        {
          source: "/.well-known/api-catalog",
          destination: "/well-known-api-catalog.json",
        },
        // On-domain OpenAPI description of the public API, proxied from
        // Langfuse Cloud so it always matches the deployed API.
        {
          source: "/openapi.:ext(yml|yaml)",
          destination: "https://cloud.langfuse.com/generated/api/openapi.yml",
        },

        // Optional: make "/" negotiable too (remove if you don't have md-src/index.md)
        {
          source: "/",
          has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
          destination: "/md-src/index.md",
        },

        // Content negotiation: /docs or /docs/observability/overview -> /md-src/... .md
        // Excludes /api, /_next, md-src, .well-known, and NON_NEGOTIATED_EXTENSIONS
        // (served directly from public/ or by their own rewrites).
        // The agent-traffic matcher in proxy.ts mirrors these exclusions — keep in sync.
        {
          source: NEGOTIATED_PATH,
          has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
          destination: "/md-src/:path.md",
        },
      ],

      // Keep your existing "manual .md" access:
      afterFiles: [
        {
          source: "/:path*.md",
          destination: "/md-src/:path*.md",
        },
      ],
    };
  },
};

export default withBundleAnalyzer(withMDX(nextConfig));
