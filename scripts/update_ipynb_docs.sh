jupyter nbconvert --to markdown src/ipynb/*.ipynb

mv src/ipynb/langfuse_docs_sdk_python.md pages/docs/integrations/sdk/python.md
mv src/ipynb/langfuse_docs_langchain_integration_python.md pages/docs/integrations/langchain.md