#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Author email to username mapping for known contributors
const emailToAuthor = {
  'max@langfuse.com': 'maxdeichmann',
  'marc@langfuse.com': 'marcklingen', 
  'clemens@langfuse.com': 'clemensrawert',
  'hassieb@langfuse.com': 'hassiebpakzad',
  'marlies@langfuse.com': 'marliesmayerhofer',
  'jannik@langfuse.com': 'jannikmaierhoefer',
  'steffen@langfuse.com': 'steffenschmitz',
  'lydia@langfuse.com': 'lydiayou',
  'richard@langfuse.com': 'richardkruemmel',
  'felix@langfuse.com': 'felixkrauth',
  'nimar@langfuse.com': 'nimarblume',
  // Add more mappings as needed
  'hello@langfuse.com': 'maxdeichmann', // fallback
};

// Name to username mapping as fallback
const nameToAuthor = {
  'Max Deichmann': 'maxdeichmann',
  'Marc Klingen': 'marcklingen',
  'Clemens Rawert': 'clemensrawert',
  'Hassieb Pakzad': 'hassiebpakzad',
  'Marlies Mayerhofer': 'marliesmayerhofer',
  'Jannik Maierhöfer': 'jannikmaierhoefer',
  'Steffen Schmitz': 'steffenschmitz',
  'Lydia You': 'lydiayou',
  'Richard Krümmel': 'richardkruemmel',
  'Felix Krauth': 'felixkrauth',
  'Nimar Blume': 'nimarblume',
};

function getAllAuthorsAtOnce() {
  try {
    // Get all contributors at once, more efficient
    const gitLog = execSync(
      `git log --format="%ae|%an" --name-only pages/docs/`,
      { encoding: 'utf8', cwd: process.cwd(), timeout: 30000 }
    );
    
    const contributors = new Set();
    const lines = gitLog.trim().split('\n').filter(line => line);
    
    for (const line of lines) {
      if (line.includes('|')) {
        const [email, name] = line.split('|');
        
        // Try to map email first, then name
        let authorKey = emailToAuthor[email.toLowerCase()];
        if (!authorKey) {
          authorKey = nameToAuthor[name];
        }
        
        if (authorKey) {
          contributors.add(authorKey);
        }
      }
    }
    
    return Array.from(contributors);
  } catch (error) {
    console.warn('Warning: Could not get authors via bulk method:', error.message);
    return ['maxdeichmann']; // fallback to default author
  }
}

function getAuthorsForFile(filePath) {
  try {
    // Get all contributors to the file with their emails
    const gitLog = execSync(
      `git log --format="%ae|%an" --follow "${filePath}"`,
      { encoding: 'utf8', cwd: process.cwd(), timeout: 5000 }
    );
    
    const contributors = new Set();
    const lines = gitLog.trim().split('\n').filter(line => line);
    
    for (const line of lines) {
      const [email, name] = line.split('|');
      
      // Try to map email first, then name
      let authorKey = emailToAuthor[email.toLowerCase()];
      if (!authorKey) {
        authorKey = nameToAuthor[name];
      }
      
      if (authorKey) {
        contributors.add(authorKey);
      }
    }
    
    return Array.from(contributors);
  } catch (error) {
    console.warn(`Warning: Could not get authors for ${filePath}:`, error.message);
    return [];
  }
}

function findDocsFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  const docsDir = 'pages/docs';
  const files = findDocsFiles(docsDir);
  const sampleMode = process.argv.includes('--sample');
  
  // In sample mode, only process first 10 files
  const filesToProcess = sampleMode ? files.slice(0, 10) : files;
  
  const authorsMap = {};
  
  console.log(`Processing ${filesToProcess.length} documentation files${sampleMode ? ' (sample mode)' : ''}...`);
  
  // First, try to get all authors at once for fallback
  const allAuthors = getAllAuthorsAtOnce();
  console.log(`Found ${allAuthors.length} total authors:`, allAuthors.join(', '));
  
  for (const file of filesToProcess) {
    // Convert file path to URL path
    const urlPath = '/' + file.replace(/^pages\//, '').replace(/\.(md|mdx)$/, '');
    const authors = getAuthorsForFile(file);
    
    // If no authors found for specific file, use all authors as fallback
    const finalAuthors = authors.length > 0 ? authors : allAuthors;
    
    if (finalAuthors.length > 0) {
      authorsMap[urlPath] = finalAuthors;
      console.log(`${urlPath}: ${finalAuthors.join(', ')}`);
    }
  }
  
  // Write the mapping to a JSON file
  const outputPath = sampleMode ? 'lib/docs-authors-sample.json' : 'lib/docs-authors.json';
  fs.writeFileSync(outputPath, JSON.stringify(authorsMap, null, 2));
  
  console.log(`\nAuthors mapping written to ${outputPath}`);
  console.log(`Total files with authors: ${Object.keys(authorsMap).length}`);
}

if (require.main === module) {
  main();
}

module.exports = { getAuthorsForFile, emailToAuthor, nameToAuthor };