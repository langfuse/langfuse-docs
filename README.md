# AssistMe Docs

Repo for [assistme.com](https://assistme.com), based on [Nextra](https://nextra.site/)

## Local Development

Pre-requisites: Node.js 18+, pnpm

1. Optional: Create env based on [.env.template](./.env.template)
2. Run `pnpm i` to install the dependencies.
3. Run `pnpm dev` to start the development server on localhost:3333

## Python cookbooks

All Python docs are Jupyter notebooks in the `cookbook/` directory.

To render them within the documentation site, we convert them to markdown using `jupyter nbconvert`, move them to right path in the pages/ directory where they are rendered by Nextra (remark).

Steps after updating notebooks:

1. Load python shell/env which has jupyter installed, e.g. `pyenv shell anaconda3-2023.03`
2. Run `bash scripts/update_cookbook_docs.sh`
3. Commit the changed markdown files

## API Reference (Swagger)

API reference is automatically generated based on the OpenAPI spec of the current production deployment of AssistMe Cloud.

## Stack

- [Nextra](https://nextra.site/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/)

Interested in stack of Q&A docs chatbot? Checkout the [blog post](https://AssistMe.com/blog/qa-chatbot-for-AssistMe-docs) for implementation details (all open source)
