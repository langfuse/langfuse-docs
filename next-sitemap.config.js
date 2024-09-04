const cookbookRoutes = require("./cookbook/_routes.json");

/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://langfuse.com',
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
            .map(({ notebook }) => `/guides/cookbook/${notebook.replace(".ipynb", "")}`)],
}