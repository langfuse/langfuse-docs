![GitHub Banner](https://github.com/langfuse/langfuse-docs/assets/2834609/e403ad73-73fa-43f0-9925-292b05ce58de)

# Langfuse Docs

Repo for [langfuse.com](https://langfuse.com). Based on [Nextra](https://nextra.site/).

## GitHub Codespaces

You can easily contribute to the docs using GitHub Codespaces. Just click on the "Code" button and select "Open with Codespaces". This will open a new Codespace with all the dependencies installed and the development server running.

## Local Development

Pre-requisites: Node.js 20+, pnpm v9.5.0

1. Optional: Create env based on [.env.template](./.env.template)
2. Run `pnpm i` to install the dependencies.
3. Run `pnpm dev` to start the development server on localhost:3333

## Python cookbooks

All Jupyter notebooks are in the `cookbook/` directory. For JS/TS notebooks we use Deno, see Readme in cookbook folder for more details.

To render them within the documentation site, we convert them to markdown using `jupyter nbconvert`, move them to right path in the pages/ directory where they are rendered by Nextra (remark).

Steps after updating notebooks:

1. Load python shell/env which has jupyter installed, e.g. `poetry install && poetry shell`
2. Run `bash scripts/update_cookbook_docs.sh`
3. Commit the changed markdown files

**Note**: All `.md` files in the `pages/` directory are automatically generated from Jupyter notebooks. Do not edit them manually as they will be overwritten. Always edit the Jupyter notebooks and run the conversion script.

## Media

### Images

We store all images in the `public/images/` directory. To use them in the markdown files, use the abslute path `/images/your-image.png`.

### Videos / Gifs

We use Cloudflare Video as a video hosting provider. Ping one of the maintainers to upload a video to Cloudflare Video and get the video id.

To embed a video, use the CloudflareVideo component and set a title and fixed aspect ratio.

To embed a "gif", actually embed a video via the CloudflareVideo component and use `gifMode` (`<CloudflareVideo videoId="" gifMode />`). This will look like a gif, but at a much smaller file size and higher quality.

## Stack

- [Nextra](https://nextra.site/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/)

Interested in stack of Q&A docs chatbot? Checkout the [blog post](https://langfuse.com/blog/qa-chatbot-for-langfuse-docs) for implementation details (all open source)

## Bundle analysis

Run `pnpm run analyze` to analyze the bundle size of the production build using `@next/bundle-analyzer`.
