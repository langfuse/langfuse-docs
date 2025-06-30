#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import the authors data to build dynamic email mapping
const authorsPath = path.join(__dirname, '../components/Authors.tsx');
const authorsContent = fs.readFileSync(authorsPath, 'utf8');

// Extract the allAuthors object from the file
// This is a simple regex-based extraction - in production you might want a more robust parser
const allAuthorsMatch = authorsContent.match(/export const allAuthors = ({[\s\S]*?}) as const;/);
if (!allAuthorsMatch) {
  throw new Error('Could not find allAuthors object in Authors.tsx');
}

// Evaluate the allAuthors object (this is safe since we control the content)
const allAuthorsString = allAuthorsMatch[1];
const allAuthors = eval(`(${allAuthorsString})`);

// Function to find author by email
function findAuthorByEmail(email) {
  for (const [authorKey, authorData] of Object.entries(allAuthors)) {
    // Check primary GitHub email
    if (authorData.githubEmail === email) {
      return authorKey;
    }
    
    // Check alternative emails (array)
    if (authorData.githubEmailAlt && Array.isArray(authorData.githubEmailAlt)) {
      if (authorData.githubEmailAlt.includes(email)) {
        return authorKey;
      }
    }
  }
  return null;
}

// Log all available email mappings for debugging
console.log('📧 Available email mappings:');
Object.entries(allAuthors).forEach(([authorKey, authorData]) => {
  if (authorData.githubEmail) {
    console.log(`   ${authorData.githubEmail} → ${authorKey}`);
  }
  if (authorData.githubEmailAlt && Array.isArray(authorData.githubEmailAlt)) {
    authorData.githubEmailAlt.forEach(email => {
      console.log(`   ${email} → ${authorKey} (alt)`);
    });
  }
});
console.log();

function getAllDocsFiles() {
  try {
    const output = execSync('find pages/docs -name "*.mdx" -o -name "*.md"', { encoding: 'utf8' });
    return output.trim().split('\n').filter(file => file.length > 0);
  } catch (error) {
    console.error('Error finding docs files:', error.message);
    return [];
  }
}

function getContributorsForFile(filePath) {
  try {
    // Get all commit authors for this file (email and name)
    // Use maxBuffer to handle large outputs and ignore stderr
    const gitCommand = `git log --pretty=format:"%ae|%an" --no-merges -- "${filePath}" 2>/dev/null || true`;
    const output = execSync(gitCommand, { 
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
      stdio: ['pipe', 'pipe', 'ignore'] // Ignore stderr
    });
    
    if (!output.trim()) {
      return [];
    }

    const commits = output.trim().split('\n');
    const contributorEmails = new Set();
    
    commits.forEach(commit => {
      const [email, name] = commit.split('|');
      if (email && email.trim() && !email.includes('fatal:')) {
        contributorEmails.add(email.trim());
      }
    });

    // Map emails to known authors
    const contributors = Array.from(contributorEmails)
      .map(email => findAuthorByEmail(email))
      .filter(author => author); // Only include known authors

    return [...new Set(contributors)]; // Remove duplicates
  } catch (error) {
    console.error(`Error getting contributors for ${filePath}:`, error.message);
    return [];
  }
}

function generateContributorsData() {
  console.log('🔍 Finding all docs files...');
  const docsFiles = getAllDocsFiles();
  console.log(`📄 Found ${docsFiles.length} docs files`);

  const contributorsData = {};
  const unmappedEmails = new Set();

  docsFiles.forEach((filePath, index) => {
    console.log(`⚙️  Processing ${index + 1}/${docsFiles.length}: ${filePath}`);
    
    try {
      // Get all emails for this file to track unmapped ones
      const gitCommand = `git log --pretty=format:"%ae" --no-merges -- "${filePath}" 2>/dev/null || true`;
      const output = execSync(gitCommand, { 
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10,
        stdio: ['pipe', 'pipe', 'ignore']
      });
      
      if (output.trim()) {
        const emails = output.trim().split('\n').filter(email => 
          email && email.trim() && !email.includes('fatal:')
        );
        emails.forEach(email => {
          const cleanEmail = email.trim();
          if (cleanEmail && !findAuthorByEmail(cleanEmail)) {
            unmappedEmails.add(cleanEmail);
          }
        });
      }

      // Get mapped contributors
      const contributors = getContributorsForFile(filePath);
      
      // Convert file path to URL path (remove pages/ prefix and file extension)
      const urlPath = filePath
        .replace(/^pages/, '')
        .replace(/\.(mdx?|md)$/, '')
        .replace(/\/index$/, ''); // Handle index files

      if (contributors.length > 0) {
        contributorsData[urlPath] = contributors;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });

  // Write the contributors data
  const outputPath = 'data/contributors.json';
  fs.writeFileSync(outputPath, JSON.stringify(contributorsData, null, 2));
  console.log(`✅ Contributors data written to ${outputPath}`);

  // Report unmapped emails
  if (unmappedEmails.size > 0) {
    console.log('\n⚠️  Unmapped emails found:');
    Array.from(unmappedEmails).forEach(email => {
      console.log(`   - ${email}`);
    });
    console.log('\nThese emails need to be mapped to known authors in the emailToAuthor object.');
  }

  console.log(`\n📊 Summary:`);
  console.log(`   - Total docs files: ${docsFiles.length}`);
  console.log(`   - Files with contributors: ${Object.keys(contributorsData).length}`);
  console.log(`   - Unmapped emails: ${unmappedEmails.size}`);

  return contributorsData;
}

// Create data directory if it doesn't exist
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Run the script
generateContributorsData();