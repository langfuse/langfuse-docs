#!/usr/bin/env node

/**
 * Generate Cloudflare Pages _redirects file from redirect configuration
 * 
 * This script reads the redirects configuration from lib/redirects.js and converts
 * them to the Cloudflare Pages _redirects file format for static deployments.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { nonPermanentRedirects, permanentRedirects } from '../lib/redirects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load redirects from the dedicated redirects file
async function loadRedirects() {
    try {
        console.log('📚 Loading redirects from lib/redirects.js');
        return { nonPermanentRedirects, permanentRedirects };
    } catch (error) {
        console.error('Error loading redirects:', error.message);
        process.exit(1);
    }
}

/**
 * Convert Next.js redirect pattern to Cloudflare Pages format
 * 
 * Next.js patterns:
 * - :param (single segment) -> works the same in Cloudflare
 * - :param* (catch-all) -> * in source, :splat in destination
 * - /* (catch-all) -> * in source, :splat in destination
 * 
 * @param {string} nextjsPattern - The Next.js pattern
 * @param {boolean} isDestination - Whether this is a destination pattern
 */
function convertPattern(nextjsPattern, isDestination = false) {
    let result = nextjsPattern;

    if (isDestination) {
        // For destinations: :param* becomes :splat, /* becomes :splat
        result = result
            .replace(/:([a-zA-Z0-9_]+)\*/g, ':splat')  // :param* -> :splat
            .replace(/\/\*$/, '/:splat')               // /* -> /:splat
            .replace(/\/\*([^*]*)\*/, '/:splat');      // /*anything* -> /:splat
    } else {
        // For sources: :param* becomes *, /* stays *
        result = result
            .replace(/:([a-zA-Z0-9_]+)\*/g, '*')       // :param* -> *
            .replace(/\/\*$/, '/*')                    // /* -> /* (no change)
            .replace(/\/\*([^*]*)\*/, '/*');           // /*anything* -> /*
    }

    return result;
}

/**
 * Generate _redirects file content
 */
function generateRedirectsContent(nonPermanentRedirects, permanentRedirects) {
    const lines = [];

    // Add header comment
    lines.push('# Cloudflare Pages redirects file');
    lines.push('# Generated from Next.js configuration');
    lines.push('# Format: source destination [status]');
    lines.push('');

    // Add non-permanent redirects (302)
    if (nonPermanentRedirects.length > 0) {
        lines.push('# Non-permanent redirects (302)');
        nonPermanentRedirects.forEach(([source, destination]) => {
            const convertedSource = convertPattern(source, false);      // source pattern
            const convertedDestination = convertPattern(destination, true); // destination pattern
            lines.push(`${convertedSource} ${convertedDestination} 302`);
        });
        lines.push('');
    }

    // Add permanent redirects (301)
    if (permanentRedirects.length > 0) {
        lines.push('# Permanent redirects (301)');
        permanentRedirects.forEach(([source, destination]) => {
            const convertedSource = convertPattern(source, false);      // source pattern
            const convertedDestination = convertPattern(destination, true); // destination pattern
            lines.push(`${convertedSource} ${convertedDestination} 301`);
        });
        lines.push('');
    }

    return lines.join('\n');
}

/**
 * Write _redirects file to the output directory
 */
function writeRedirectsFile(content) {
    const outputPath = path.join(__dirname, `../out`);
    const redirectsFile = path.join(outputPath, '_redirects');

    // Ensure output directory exists
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    // Write the _redirects file
    fs.writeFileSync(redirectsFile, content, 'utf-8');

    console.log(`✅ Generated _redirects file: ${redirectsFile}`);

    // Count redirects for validation
    const redirectCount = content.split('\n').filter(line =>
        line.trim() && !line.startsWith('#')
    ).length;

    console.log(`📊 Total redirects: ${redirectCount}`);

    // Warn if approaching Cloudflare limits
    if (redirectCount > 1900) {
        console.warn(`⚠️  Warning: Approaching Cloudflare Pages redirect limit (2,100 total, you have ${redirectCount})`);
    }

    return redirectsFile;
}

/**
 * Main function
 */
async function main() {
    console.log('🚀 Generating Cloudflare Pages _redirects file...');

    try {
        // Load redirects from dedicated redirects file
        const { nonPermanentRedirects, permanentRedirects } = await loadRedirects();

        console.log(`📝 Found ${nonPermanentRedirects.length} non-permanent redirects`);
        console.log(`📝 Found ${permanentRedirects.length} permanent redirects`);

        // Generate _redirects content
        const content = generateRedirectsContent(nonPermanentRedirects, permanentRedirects);

        // Write the file
        const redirectsFile = writeRedirectsFile(content);

        console.log('✨ Cloudflare Pages _redirects file generated successfully!');

        return redirectsFile;
    } catch (error) {
        console.error('❌ Error generating _redirects file:', error.message);
        process.exit(1);
    }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main, generateRedirectsContent, convertPattern };
