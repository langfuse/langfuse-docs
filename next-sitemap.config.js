const cookbookRoutes = require("./cookbook/_routes.json");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.CF_PAGES_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ?? 'https://langfuse.com',
    generateRobotsTxt: true,
    changefreq: 'daily',
    additionalPaths: async (config) => [{
        loc: '/',
        priority: 1,
        changefreq: 'daily',
        lastmod: new Date().toISOString()
    }],
    exclude: [
        // Exclude non-canonical pages from sitemap which are also part of the docs
        ...cookbookRoutes
            .filter(({ docsPath }) => !!docsPath)
            .map(({ notebook }) => `/guides/cookbook/${notebook.replace(".ipynb", "")}`),
        // Exclude _meta files
        '*/_meta',
        '/events/*',
        // Exclude API routes for static export
        ...(process.env.STATIC_EXPORT === 'true' ? ['/api/*'] : [])
    ],

}