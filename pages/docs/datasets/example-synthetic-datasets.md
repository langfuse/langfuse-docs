---
description: Notebook on generating synthetic datasets for LLM application and AI agents evaluation. 
category: Evaluation
---

# Synthetic Dataset Generation for LLM Evaluation

In this notebook, we will explore how to **generate synthetic datasets** using language models and uploading them to [Langfuse](https://langfuse.com) for evaluation. 

## What Langfuse Datasets?

In Langfuse, a *dataset* is a collection of *dataset items*, each typically containing an `input` (e.g., user prompt/question), `expected_output` (the ground truth or ideal answer) and optional metadata.

Datasets are used for **evaluation**. You can run your LLM or application on each item in a dataset and compare the application's responses to the expected outputs. This way, you can track performance over time and across different application configs (e.g. model versions or prompt changes).

## Cases your Dataset Should Cover

**Happy path** – straightforward or common queries:
- "What is the capital of France?"
- "Convert 5 USD to EUR."

**Edge cases** – unusual or complex:
- Very long prompts.
- Ambiguous queries.
- Very technical or niche.

**Adversarial cases** – malicious or tricky:
- Prompt injection attempts ("Ignore all instructions and ...").
- Content policy violations (harassment, hate speech).
- Logic traps (trick questions).

## Examples

### Example 1: Looping Over OpenAI API

We'll use OpenAI's API in a simple loop to create synthetic questions for an airline chatbot. You could similarly prompt the model to generate *both* questions and answers.
%pip install openai langfuse

```python
import os
from langfuse import Langfuse

# Get keys for your project from the project settings page: # https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

os.environ["OPENAI_API_KEY"] = "sk-proj-..." 
```


```python
from openai import OpenAI
import pandas as pd

client = OpenAI()

# Function to generate airline questions
def generate_airline_questions(num_questions=20):

    questions = []

    for i in range(num_questions):
        completion = client.chat.completions.create(
            model="gpt-4o", 
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a helpful customer service chatbot for an airline. "
                        "Please generate a short, realistic question from a customer."
                    )
                }
            ],
            temperature=1
        )
        question_text = completion.choices[0].message.content.strip()
        questions.append(question_text)

    return questions

# Generate 20 airline-related questions
airline_questions = generate_airline_questions(num_questions=20)

# Convert to a Pandas DataFrame
df = pd.DataFrame({"Question": airline_questions})
```


```python
langfuse = Langfuse()

# Create a new dataset in Langfuse
dataset_name = "openai_synthetic_dataset"
langfuse.create_dataset(
    name=dataset_name,
    description="Synthetic Q&A dataset generated via OpenAI in a loop",
    metadata={"approach": "openai_loop", "category": "mixed"}
)

# Upload each Q&A as a dataset item
for _, row in df.iterrows():
    langfuse.create_dataset_item(
        dataset_name="openai_loop_dataset",
        input = row["Question"]
    )
```

![OpenAI Dataset](https://langfuse.com/images/cookbook/example-synthetic-datasets/openai-dataset.png)

### Example 2: RAGAS Library

For **RAG**, we often want questions that are *grounded in specific documents*. This ensures the question can be answered by the context, allowing us to evaluate how well a RAG pipeline retrieves and uses the context.

[RAGAS](https://docs.ragas.io/en/stable/getstarted/rag_testset_generation/#testset-generation) is a library that can automate test set generation for RAG. It can take a corpus and produce relevant queries and answers. We'll do a quick example:

_**Note**: This example is taken from the [RAGAS documentation](https://docs.ragas.io/en/stable/getstarted/rag_testset_generation/)_


```python
%pip install ragas langchain-community langchain-openai unstructured
```


```python
%git clone https://huggingface.co/datasets/explodinggradients/Sample_Docs_Markdown
```


```python
from langchain_community.document_loaders import DirectoryLoader

path = "Sample_Docs_Markdown"
loader = DirectoryLoader(path, glob="**/*.md")
docs = loader.load()
```


```python
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
generator_llm = LangchainLLMWrapper(ChatOpenAI(model="gpt-4o"))
generator_embeddings = LangchainEmbeddingsWrapper(OpenAIEmbeddings())
```


```python
from ragas.testset import TestsetGenerator

generator = TestsetGenerator(llm=generator_llm, embedding_model=generator_embeddings)
dataset = generator.generate_with_langchain_docs(docs, testset_size=10)

# 4. The result `testset` can be converted to a pandas DataFrame for inspection
df = dataset.to_pandas()
```


```python
# 5. Push the RAGAS-generated testset to Langfuse
langfuse = Langfuse()
langfuse.create_dataset(
    name="ragas_generated_testset",
    description="Synthetic RAG test set (RAGAS)",
    metadata={"source": "RAGAS", "docs_used": len(docs)}
)

for _, row in df.iterrows():
    langfuse.create_dataset_item(
        dataset_name="ragas_generated_testset",
        input = row["user_input"],
        metadata = row["reference_contexts"]
    )
```

![RAGAS Dataset](https://langfuse.com/images/cookbook/example-synthetic-datasets/ragas-dataset.png)

### Example 3: DeepEval Library

[DeepEval](https://docs.confident-ai.com/docs/synthesizer-introduction) is a library that helps generate synthetic data systematically using the *Synthesizer* class.


```python
%pip install deepeval
```


```python
import os
from langfuse import Langfuse
from deepeval.synthesizer import Synthesizer
from deepeval.synthesizer.config import StylingConfig
```


```python
# 1. Define the style we want for our synthetic data.
# For instance, we want user questions and correct SQL queries.
styling_config = StylingConfig(
  input_format="Questions in English that asks for data in database.",
  expected_output_format="SQL query based on the given input",
  task="Answering text-to-SQL-related queries by querying a database and returning the results to users",
  scenario="Non-technical users trying to query a database using plain English.",
)

# 2. Initialize the Synthesizer
synthesizer = Synthesizer(styling_config=styling_config)

# 3. Generate synthetic items from scratch, e.g. 20 items for a short demo
synthesizer.generate_goldens_from_scratch(num_goldens=20)

# 4. Access the generated examples
synthetic_goldens = synthesizer.synthetic_goldens
```


```python
langfuse = Langfuse()

# 5. Create a Langfuse dataset
deepeval_dataset_name = "deepeval_synthetic_data"
langfuse.create_dataset(
    name=deepeval_dataset_name,
    description="Synthetic text-to-SQL data (DeepEval)",
    metadata={"approach": "deepeval", "task": "text-to-sql"}
)

# 6. Upload the items
for golden in synthetic_goldens:
    langfuse.create_dataset_item(
        dataset_name=deepeval_dataset_name,
        input={"query": golden.input},
    )
```

![Dataset in Langfuse](https://langfuse.com/images/cookbook/example-synthetic-datasets/deepeval-dataset.png)

### Example 4: No-Code via Hugging Face Dataset Generator

If you prefer a more UI-based approach, check out [Hugging Face's Synthetic Data Generator](https://huggingface.co/blog/synthetic-data-generator). You can generate examples in the Hugging Face UI. Then you can download them as CSV and upload it in the Langfuse UI.

![Hugging Face Dataset Generator](https://langfuse.com/images/cookbook/example-synthetic-datasets/hf-generator.png)

![Hugging Face Synthetic Dataset](https://langfuse.com/images/cookbook/example-synthetic-datasets/hf-dataset.png)

## Next Steps

1. **Explore your dataset in Langfuse**. You can see each dataset in the UI.
2. **Run experiments** You can now evaluate your application using this dataset.
3. **Compare runs** over time or across models, prompts, or chain logic.

For more details on how to run experiments on a dataset, see the [Langfuse docs](https://langfuse.com/docs/datasets/get-started#run-experiment-on-a-dataset).
