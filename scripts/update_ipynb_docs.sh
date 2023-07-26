jupyter nbconvert --to markdown src/ipynb/*.ipynb

mv src/ipynb/langfuse_docs_sdk_python.md pages/docs/sdk/python.md
mv src/ipynb/langfuse_docs_langchain_integration_python.md pages/docs/langchain.md