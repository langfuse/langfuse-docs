#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const authorsPath = path.join(__dirname, "../../data/authors.json");

// Helper function to read the authors JSON file
function getCurrentAuthors() {
  return JSON.parse(fs.readFileSync(authorsPath, "utf8"));
}

// Helper function to get all unique emails from git history
function getAllGitEmails() {
  try {
    const output = execSync(
      'git log --pretty=format:"%ae" --no-merges -- pages/docs/ 2>/dev/null || true',
      {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "ignore"],
      }
    );

    if (!output.trim()) {
      return [];
    }

    const emails = output
      .trim()
      .split("\n")
      .map((email) => email.trim())
      .filter((email) => email && !email.includes("fatal:"));

    return [...new Set(emails)].sort();
  } catch (error) {
    console.error("Error getting git emails:", error.message);
    return [];
  }
}

// Function to find author by email
function findAuthorByEmail(email, allAuthors) {
  for (const [authorKey, authorData] of Object.entries(allAuthors)) {
    if (authorData.githubEmail === email) {
      return authorKey;
    }

    if (authorData.githubEmailAlt && Array.isArray(authorData.githubEmailAlt)) {
      if (authorData.githubEmailAlt.includes(email)) {
        return authorKey;
      }
    }
  }
  return null;
}

// Main function to analyze and suggest updates
function analyzeEmails() {
  console.log("🔍 Analyzing git emails and current author mappings...\n");

  const allAuthors = getCurrentAuthors();
  const gitEmails = getAllGitEmails();

  console.log(`📧 Found ${gitEmails.length} unique emails in git history\n`);

  // Show current mappings
  console.log("✅ Current email mappings:");
  Object.entries(allAuthors).forEach(([authorKey, authorData]) => {
    if (authorData.githubEmail) {
      console.log(`   ${authorData.githubEmail} → ${authorKey}`);
    }
    if (authorData.githubEmailAlt && Array.isArray(authorData.githubEmailAlt)) {
      authorData.githubEmailAlt.forEach((email) => {
        console.log(`   ${email} → ${authorKey} (alt)`);
      });
    }
  });

  // Find unmapped emails
  const unmappedEmails = gitEmails.filter(
    (email) => !findAuthorByEmail(email, allAuthors)
  );

  if (unmappedEmails.length > 0) {
    console.log("\n⚠️  Unmapped emails that need attention:");
    unmappedEmails.forEach((email) => {
      console.log(`   - ${email}`);
    });

    console.log("\n💡 To add mappings:");
    console.log("   1. Add githubEmail field to existing authors");
    console.log(
      "   2. Add emails to githubEmailAlt array for alternative emails"
    );
    console.log("   3. Create new author entries if needed");
    console.log("\n📝 Example:");
    console.log("   someauthor: {");
    console.log('     firstName: "Name",');
    console.log('     name: "Full Name",');
    console.log('     image: "/images/people/author.jpg",');
    console.log('     githubEmail: "primary@email.com",');
    console.log('     githubEmailAlt: ["alt@email.com", "another@email.com"],');
    console.log("   }");
  } else {
    console.log("\n✅ All git emails are mapped to known authors!");
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Total authors: ${Object.keys(allAuthors).length}`);
  console.log(`   - Total git emails: ${gitEmails.length}`);
  console.log(
    `   - Mapped emails: ${gitEmails.length - unmappedEmails.length}`
  );
  console.log(`   - Unmapped emails: ${unmappedEmails.length}`);
}

// Function to add email mapping to an existing author
function addEmailMapping(authorKey, email, isAlternative = false) {
  const allAuthors = getCurrentAuthors();

  if (!allAuthors[authorKey]) {
    console.error(`❌ Author '${authorKey}' not found`);
    return false;
  }

  // Check if email is already mapped
  if (findAuthorByEmail(email, allAuthors)) {
    console.error(`❌ Email '${email}' is already mapped`);
    return false;
  }

  if (isAlternative) {
    // Add to githubEmailAlt array
    if (!allAuthors[authorKey].githubEmailAlt) {
      allAuthors[authorKey].githubEmailAlt = [];
    }
    allAuthors[authorKey].githubEmailAlt.push(email);
  } else {
    // Add as primary githubEmail
    allAuthors[authorKey].githubEmail = email;
  }

  // Write the updated JSON back to file
  fs.writeFileSync(authorsPath, JSON.stringify(allAuthors, null, 2));
  console.log(
    `✅ Added email '${email}' to author '${authorKey}' ${isAlternative ? "(alternative)" : "(primary)"}`
  );
  return true;
}

// CLI interface
const command = process.argv[2];
const authorKey = process.argv[3];
const email = process.argv[4];
const isAlternative = process.argv[5] === "--alt";

switch (command) {
  case "analyze":
    analyzeEmails();
    break;

  case "add-email":
    if (!authorKey || !email) {
      console.error(
        "Usage: node scripts/authors/update-authors.js add-email <authorKey> <email> [--alt]"
      );
      process.exit(1);
    }
    addEmailMapping(authorKey, email, isAlternative);
    break;

  default:
    console.log("Langfuse Authors Management Tool\n");
    console.log("Commands:");
    console.log(
      "  analyze                                    - Analyze git emails and show unmapped ones"
    );
    console.log(
      "  add-email <authorKey> <email>             - Add primary email to author"
    );
    console.log(
      "  add-email <authorKey> <email> --alt       - Add alternative email to author"
    );
    console.log("\nExamples:");
    console.log("  node scripts/authors/update-authors.js analyze");
    console.log(
      '  node scripts/authors/update-authors.js add-email marcklingen "marc@example.com"'
    );
    console.log(
      '  node scripts/authors/update-authors.js add-email marcklingen "marc.alt@example.com" --alt'
    );
}
