const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

const SITEMAP_PATH = 'public/sitemap-0.xml';
const TITLE = 'Langfuse';
const INTRO_DESCRIPTION = 'Langfuse is an **open-source LLM engineering platform** ([GitHub](https://github.com/langfuse/langfuse)) that helps teams collaboratively debug, analyze, and iterate on their LLM applications. All platform features are natively integrated to accelerate the development workflow.';
const MAIN_SECTIONS = [
    'docs',
];
const OPTIONAL_SECTIONS = [
    'guides',
    'changelog',
    'blog',
    'faq'
];

async function generateLLMsList() {
    try {
        const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');

        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(sitemapContent);

        // Start building markdown content with the title and blockquote
        let markdownContent = `# ${TITLE}\n\n`;
        markdownContent += `> ${INTRO_DESCRIPTION}\n\n`;

        // Create a map to store URLs by section
        const urlsBySection = {
            optional: []
        };
        MAIN_SECTIONS.forEach(section => {
            urlsBySection[section] = [];
        });

        // Sort URLs into sections (only include main and optional sections)
        const urls = result.urlset.url.map(url => url.loc[0]);
        urls.forEach(url => {
            const urlPath = new URL(url).pathname.split('/')[1]; // Get first part of path

            if (MAIN_SECTIONS.includes(urlPath)) {
                urlsBySection[urlPath].push({
                    title: url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    url: url
                });
            } else if (OPTIONAL_SECTIONS.includes(urlPath)) {
                urlsBySection.optional.push({
                    title: url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    url: url
                });
            }
            // Note: Removed the "other" section - URLs that don't match main or optional sections are now ignored
        });

        // Generate markdown for main sections
        MAIN_SECTIONS.forEach(section => {
            if (urlsBySection[section].length > 0) {
                markdownContent += `## ${section.charAt(0).toUpperCase() + section.slice(1)}\n\n`;
                urlsBySection[section].forEach(({ title, url }) => {
                    markdownContent += `- [${title}](${url})\n`;
                });
                markdownContent += '\n';
            }
        });

        // Add optional sections at the end
        if (urlsBySection.optional.length > 0) {
            markdownContent += '## Optional\n\n';
            urlsBySection.optional.forEach(({ title, url }) => {
                markdownContent += `- [${title}](${url})\n`;
            });
        }

        // Write to llms.txt
        const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
        fs.writeFileSync(outputPath, markdownContent);

        console.log('Successfully generated llms.txt');
    } catch (error) {
        console.error('Error generating llms.txt:', error);
    }
}

generateLLMsList(); 