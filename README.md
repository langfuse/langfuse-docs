# Langfuse Docs

Repo for [langfuse.com](https://langfuse.com), based on [Nextra](https://nextra.site/)

## Local Development

Pre-requisites: Node.js 18+, pnpm

1. Optional: Create env based on [.env.template](./.env.template)
2. Run `pnpm i` to install the dependencies.
3. Run `pnpm dev` to start the development server on localhost:3333

## Details

### Python docs

The Python docs are written in jupyter notebooks `src/ipynb/\*.ipynb`; we use `jupyter nbconvert` to convert them to markdown after making changes to the notebooks

1. Load python shell/env which has jupyter installed, e.g. `pyenv shell anaconda3-2023.03`
2. Run `bash scripts/update_ipynb_docs.sh`

### API Reference (Swagger)

API reference is automatically generated based on the OpenAPI spec of the current production deployment of Langfuse Cloud.

## Stack

- [Nextra](https://nextra.site/)
- [Next.js](https://nextjs.org/)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/)

Interested in stack of Q&A docs chatbot? Checkout the [blog post](https://langfuse.com/blog/qa-chatbot-for-langfuse-docs) for implementation details (all open source)
