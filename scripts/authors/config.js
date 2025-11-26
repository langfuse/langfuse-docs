const path = require("path");

// Shared configuration for all author/contributor scripts
const CONFIG = {
  // Output files
  contributors: path.join(__dirname, "../../data/generated/contributors.json"),
  authors: path.join(__dirname, "../../data/authors.json"),

  // Documentation sections to analyze for contributor data
  // Each section corresponds to a top-level directory in the pages folder
  // and represents a major documentation area (e.g., /docs, /self-hosting)
  sections: [
    "docs",
    "self-hosting",
    "security",
    "guides",
    "integrations",
    "faq",
    "handbook",
  ].map((section) => ({
    name: section.replace("-", ""),
    dirPath: path.join(__dirname, `../../pages/${section}`),
    gitPath: `pages/${section}/`,
    urlPrefix: `/${section}`,
  })),

  // GitHub API settings
  github: {
    repo: "langfuse/langfuse-docs",
    apiBase: "https://api.github.com",
    batchSize: 10,
    batchDelay: 100,
  },

  // Contributors to exclude from the widget
  excludedContributors: ["cursoragent"],
};

module.exports = { CONFIG };
