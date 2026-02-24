<!-- Pseudo change to test Langfuse tracing integration - 2026-02-24T6 -->
![GitHub Banner](https://github.com/langfuse/langfuse-docs/assets/2834609/e403ad73-73fa-43f0-9925-292b05ce58de)

# Langfuse Docs

Repo for [langfuse.com](https://langfuse.com). Based on [Nextra](https://nextra.site/).

## GitHub Codespaces

You can easily contribute to the docs using GitHub Codespaces. Just click on the "Code" button and select "Open with Codespaces". This will open a new Codespace with all the dependencies installed and the development server running.

## Local Development

Pre-requisites: Node.js 22, pnpm v9.5.0

1. Optional: Create env based on [.env.template](./.env.template)
2. Run `pnpm i` to install the dependencies.
3. Run `pnpm dev` to start the development server on localhost:3333

## Python cookbooks

All Jupyter notebooks are in the `cookbook/` directory. For JS/TS notebooks we use Deno, see Readme in cookbook folder for more details.

To render them within the documentation site, we convert them to markdown using `jupyter nbconvert`, move them to right path in the pages/ directory where they are rendered by Nextra (remark).

Steps after updating notebooks:

1. Ensure you have [uv](https://docs.astral.sh/uv/) installed
2. Run `bash scripts/update_cookbook_docs.sh` (uv will automatically handle dependencies)
3. Commit the changed markdown files

**Note**: All `.md` files or `.mdx` files that contain "source: ⚠️ Jupyter Notebook" on top in the `pages/` directory are automatically generated from Jupyter notebooks. Do not edit them manually as they will be overwritten. Always edit the Jupyter notebooks and run the conversion script.

## Media

### Images

We store all images in the `public/images/` directory. To use them in the markdown files, use the absolute path `/images/your-image.png`.

### Videos / Gifs

We use a bucket on Cloudflare R2 to store all video. It is hosted on https://static.langfuse.com/docs-videos. Ping one of the maintainers to upload a video to the bucket and get the src.

To embed a video, use the Video component and set a title and fixed aspect ratio. Point src to the mp4 file in the bucket.

To embed a "gif", actually embed a video and use `gifMode` (`<Video src="" gifMode />`). This will look like a gif, but at a much smaller file size and higher quality.

## Stack

- [Nextra](https://nextra.site/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/)

Interested in stack of Q&A docs chatbot? Checkout the [blog post](https://langfuse.com/blog/qa-chatbot-for-langfuse-docs) for implementation details (all open source)

## LLM Features

The docs site includes four interconnected features designed to make documentation accessible to LLMs and AI tools:

1. **Markdown URL endpoints** (`.md` suffix): Append `.md` to any URL (e.g., `/docs.md`) to get raw markdown. Built at compile time via `scripts/copy_md_sources.js` which copies all `.mdx` files from `/pages` to `/public/md-src/` as static `.md` files with inlined MDX components.

2. **Copy as Markdown button**: UI button on docs pages that fetches the `.md` endpoint and copies to clipboard for pasting into ChatGPT/Claude/Cursor.

3. **Export as PDF links**: API endpoint `/api/md-to-pdf` that fetches markdown from `.md` URLs and converts to PDF using Puppeteer. Used on legal pages (terms, privacy, DPA, etc.).

4. **MCP Server**: Model Context Protocol server at `/api/mcp` with three tools:
   - `searchLangfuseDocs`: RAG search via Inkeep API
   - `getLangfuseDocsPage`: Fetches specific page markdown from `.md` URLs
   - `getLangfuseOverview`: Returns `llms.txt` overview

All three user-facing features (Copy, PDF, MCP) depend on the same foundation of pre-built static markdown files, making them fast, cacheable, and reliable. See [RESEARCH-LLM-FEATURES.md](./RESEARCH-LLM-FEATURES.md) for detailed implementation details.

## Bundle analysis

Run `pnpm run analyze` to analyze the bundle size of the production build using `@next/bundle-analyzer`.
