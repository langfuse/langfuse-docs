const path = require('path');

// Shared configuration for all author/contributor scripts
const CONFIG = {
    // Output files
    contributors: path.join(__dirname, '../../data/generated/contributors.json'),
    authors: path.join(__dirname, '../../data/authors.json'),

    // Documentation sections to analyze for contributor data
    // Each section is a top-level directory under content/ (App Router)
    sections: ['docs', 'self-hosting', 'security', 'guides', 'integrations', 'faq', 'handbook'].map(section => ({
        name: section.replace('-', ''),
        dirPath: path.join(__dirname, `../../content/${section}`),
        gitPaths: [`content/${section}/`],
        urlPrefix: `/${section}`
    })),

    // GitHub API settings
    github: {
        repo: 'langfuse/langfuse-docs',
        apiBase: 'https://api.github.com',
        batchSize: 10,
        batchDelay: 100
    },

    // Contributors to exclude from the widget
    excludedContributors: ['cursoragent', 'ArkuVonSymfon']
};

module.exports = { CONFIG };
