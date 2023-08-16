# Langfuse Docs

Repo for [langfuse.com](https://langfuse.com), based on [Nextra](https://nextra.site/)

## Local Development

1. Create env based on .ev.template
2. Run `pnpm i` to install the dependencies.
3. Run `pnpm dev` to start the development server on localhost:3333

## SDK docs

- Python docs are in jupyter notebooks src/ipynb/\*.ipynb; we use `jupyter nbconvert` to convert them to markdown after making changes to the notebooks
  1. Load python shell/env which has jupyter installed, e.g. `pyenv shell anaconda3-2023.03`
  2. In project root, execute `bash scripts/update_ipynb_docs.sh`

## API reference

Docs automatically generated based on openAPI spec in /src
