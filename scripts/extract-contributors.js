#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Email to author mapping based on the allAuthors data
const emailToAuthor = {
  "git@marcklingen.com": "marcklingen",
  "68423100+hassiebp@users.noreply.github.com": "hassiebpakzad",
  "74332854+marliessophie@users.noreply.github.com": "marliesmayerhofer",
  "48529566+jannikmaierhoefer@users.noreply.github.com": "jannikmaierhoefer",
  "jannik@langfuse.com": "jannikmaierhoefer",
  "steffen@langfuse.com": "steffenschmitz",
  "57024447+felixkrrr@users.noreply.github.com": "felixkrauth",
  "l.nimar.b@gmail.com": "nimarblume",
  "121163007+clemra@users.noreply.github.com": "clemensrawert",
  "clemens@langfuse.com": "clemensrawert",
  "lydia.g.you@gmail.com": "lydiayou",
};

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
      .map(email => emailToAuthor[email])
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
          if (cleanEmail && !emailToAuthor[cleanEmail]) {
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