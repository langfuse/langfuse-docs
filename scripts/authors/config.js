const path = require('path');

// Shared configuration for all author/contributor scripts
const CONFIG = {
    // Output files
    contributors: path.join(__dirname, '../../data/generated/contributors.json'),
    authors: path.join(__dirname, '../../data/authors.json'),

    // Documentation sections to analyze
    sections: [
        {
            name: 'docs',
            dirPath: path.join(__dirname, '../../pages/docs'),
            gitPath: 'pages/docs/',
            urlPrefix: '/docs'
        },
        {
            name: 'selfHosting',
            dirPath: path.join(__dirname, '../../pages/self-hosting'),
            gitPath: 'pages/self-hosting/',
            urlPrefix: '/self-hosting'
        },
        {
            name: 'security',
            dirPath: path.join(__dirname, '../../pages/security'),
            gitPath: 'pages/security/',
            urlPrefix: '/security'
        }
    ],

    // GitHub API settings
    github: {
        repo: 'langfuse/langfuse-docs',
        apiBase: 'https://api.github.com',
        batchSize: 10,
        batchDelay: 100
    },

    // Contributors to exclude from the widget
    excludedContributors: ['cursoragent']
};

module.exports = { CONFIG };
