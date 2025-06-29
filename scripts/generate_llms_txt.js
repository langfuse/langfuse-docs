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
    'self-hosting'
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
            other: [],
            optional: []
        };
        MAIN_SECTIONS.forEach(section => {
            urlsBySection[section] = [];
        });

        // Sort URLs into sections
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
            } else {
                urlsBySection.other.push({
                    title: url.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    url: url
                });
            }
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

        // Add optional integrations section at the end
        if (urlsBySection.optional.length > 0) {
            markdownContent += '## Optional\n\n';
            urlsBySection.optional.forEach(({ title, url }) => {
                markdownContent += `- [${title}](${url})\n`;
            });
        }

        // // Add other section
        // if (urlsBySection.other.length > 0) {
        //     markdownContent += '## Other\n\n';
        //     urlsBySection.other.forEach(({ title, url }) => {
        //         markdownContent += `- [${title}](${url})\n`;
        //     });
        //     markdownContent += '\n';
        // }

        // Write to llms.txt
        const outputPath = path.join(process.cwd(), 'public', 'llms.txt');
        fs.writeFileSync(outputPath, markdownContent);

        console.log('Successfully generated llms.txt');
    } catch (error) {
        console.error('Error generating llms.txt:', error);
    }
}

generateLLMsList(); 