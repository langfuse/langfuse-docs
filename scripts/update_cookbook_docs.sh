jupyter nbconvert --to markdown cookbook/*.ipynb

mv cookbook/datasets.md pages/docs/datasets/python-cookbook.md
mv cookbook/integration_langchain.md pages/docs/integrations/langchain/python.md
mv cookbook/integration_openai_sdk.md pages/docs/integrations/openai.md
mv cookbook/model_based_evals.md pages/docs/scores/model-based-evals.md
mv cookbook/python_sdk.md pages/docs/integrations/sdk/python.md
