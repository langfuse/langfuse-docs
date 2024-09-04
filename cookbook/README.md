# Cookbook JS

## Setup

We use poetry to create a venv and install the required packages.

```bash
poetry install
```

The JS cookbooks are written in TypeScript and run using Deno. To install Deno and the Deno Jupyter Kernel, run the following commands:

```bash
brew install deno
poetry shell
deno jupyter --unstable
```

Start the notebook server with the following command:

```bash
poetry run jupyter notebook
```
