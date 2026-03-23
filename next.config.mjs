import path from "path";
import { fileURLToPath } from "url";
import { createMDX } from "fumadocs-mdx/next";
import NextBundleAnalyzer from "@next/bundle-analyzer";

import * as redirects from "./lib/redirects.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
  },
  // Reduce memory usage during build
  productionBrowserSourceMaps: false,
  turbopack: {
    // Fix Turbopack panic when running from a git worktree with multiple lockfiles.
    // Tell Turbopack to use this worktree's directory as the root.
    root: __dirname,
  },
  transpilePackages: ["react-tweet", "react-syntax-highlighter", "geist"],
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/md-to-pdf": ["node_modules/@sparticuz/chromium/bin/**"],
  },

  webpack(config, { isServer, webpack }) {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "nextra/context": path.resolve(__dirname, "lib/nextra-shim/context.tsx"),
      "nextra/hooks": path.resolve(__dirname, "lib/nextra-shim/hooks.ts"),
      nextra: path.resolve(__dirname, "lib/nextra-shim/nextra-types.ts"),
      "nextra-theme-docs": path.resolve(__dirname, "lib/nextra-shim/theme-docs.tsx"),
      "nextra/components": path.resolve(__dirname, "lib/nextra-shim/components.tsx"),
    };
    // Prevent recharts (and its exclusive deps: redux toolkit, immer, etc.) from
    // being hoisted into a synchronous shared chunk that loads on every page.
    // Recharts is only used on the /wrapped page — keep it in async-only chunks
    // so it's never downloaded unless the wrapped page actually renders it.
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
        })
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
    ],
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
        // /support.md → raw markdown from the Support page (content/marketing/support.mdx → md-src/marketing/support.md)
        {
          source: "/support.md",
          destination: "/md-src/marketing/support.md",
        },

        // Optional: make "/" negotiable too (remove if you don't have md-src/index.md)
        {
          source: "/",
          has: [{ type: "header", key: "accept", value: ".*text/markdown.*" }],
          destination: "/md-src/index.md",
        },

        // Content negotiation: /docs or /docs/observability/overview -> /md-src/... .md
        // Excludes /api, /_next, md-src, .md files, and .txt files (served directly from public/).
        {
          source: "/:path((?!api|_next|md-src)(?!.*\\.md$)(?!.*\\.txt$).*)",
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
