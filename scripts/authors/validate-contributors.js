#!/usr/bin/env node

const fs = require("fs");
const { CONFIG } = require("./config");

function validateContributors(filePath = CONFIG.contributors) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Contributor snapshot is missing: ${filePath}`);
  }

  let contributors;
  try {
    contributors = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`Contributor snapshot is not valid JSON: ${error.message}`);
  }

  if (
    contributors === null ||
    Array.isArray(contributors) ||
    typeof contributors !== "object"
  ) {
    throw new Error("Contributor snapshot must be an object");
  }

  for (const [pagePath, usernames] of Object.entries(contributors)) {
    if (!pagePath.startsWith("/")) {
      throw new Error(`Contributor page path must start with "/": ${pagePath}`);
    }
    if (!Array.isArray(usernames)) {
      throw new Error(`Contributors for ${pagePath} must be an array`);
    }
    if (
      usernames.some(
        (username) => typeof username !== "string" || username.length === 0,
      )
    ) {
      throw new Error(
        `Contributors for ${pagePath} must contain non-empty usernames`,
      );
    }
  }

  return contributors;
}

if (require.main === module) {
  try {
    const contributors = validateContributors();
    console.log(
      `Validated contributors.json (${Object.keys(contributors).length} pages)`,
    );
  } catch (error) {
    console.error(`Contributor snapshot validation failed: ${error.message}`);
    process.exit(1);
  }
}

module.exports = { validateContributors };
