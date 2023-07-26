# Langfuse Docs

Repo for [langfuse.com](https://langfuse.com), based on [Nextra](https://nextra.site/)

## Local Development

First, run `pnpm i` to install the dependencies.

Then, run `pnpm dev` to start the development server and visit localhost:3000.

## SDK docs

- Python: generate docs from [python_sdk_docs.ipynb](/src/python_sdk_docs.ipynb):

  `jupyter nbconvert --to markdown src/ipynb/*.ipynb`

## API reference

Docs automatically generated based on openAPI spec in /src
