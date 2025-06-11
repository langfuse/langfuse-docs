---
description: Open-source observability for Haystack, a popular library to build RAG applications.
category: Integrations
---

# Cookbook: Haystack Integration

We're excited to highlight a Langfuse integration with Haystack ([docs](https://langfuse.com/docs/integrations/haystack/get-started))! This integration allows you to easily trace your Haystack pipelines in the Langfuse UI.

## What is Haystack?

[Haystack](https://haystack.deepset.ai/) is the open-source Python framework developed by deepset. Its modular design allows users to implement custom pipelines to build production-ready LLM applications, like retrieval-augmented generative pipelines and state-of-the-art search systems. It integrates with Hugging Face Transformers, Elasticsearch, OpenSearch, OpenAI, Cohere, Anthropic and others, making it an extremely popular framework for teams of all sizes.

Big thanks to the team at deepset for developing the integration. You can read their write up [here](https://haystack.deepset.ai/blog/langfuse-integration).

## How Can Langfuse Help?

The `langfuse-haystack` package integrates tracing capabilities into Haystack (2.x) pipelines using Langfuse.

[Langfuse](https://langfuse.com) is helpful in the following ways:

- Capture comprehensive details of the execution trace in a beautiful UI dashboard
  - Latency
  - Token usage
  - Cost
  - Scores
- Capture the full context of the execution
- Building fine-tuning and testing datasets

Langfuse integration with a tool like Haystack can help monitor model performance, can assist with pinpointing areas for improvement, or creating datasets for fine-tuning and testing from your pipeline executions.

This cookbook walks through building a simple RAG pipeline using Haystack and how to observe the trace in Langfuse.

## Installation and Setup


```python
# install haystack, langfuse, and the langfuse-haystack integration package
%pip install haystack-ai langfuse-haystack langfuse

# additional requirements for this cookbook
%pip install sentence-transformers datasets mwparserfromhell
```

Then set the environment variables. You can find your Langfuse public and private API keys in the dashboard. Make sure to set `HAYSTACK_CONTENT_TRACING_ENABLED` to `true`. In this cookbook we are using OpenAI GPT 3.5-turbo so you will also need an OpenAI API key.


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
os.environ["HAYSTACK_CONTENT_TRACING_ENABLED"] = "True"

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."

# Enable Haystack content tracing
os.environ["HAYSTACK_CONTENT_TRACING_ENABLED"] = "True"
```

## Basic RAG Pipeline

The following code snippet (based off of the Haystack [documentation](https://docs.haystack.deepset.ai/docs/get_started)) walks through building a basic retrieval-augmented generative (RAG) pipeline. First you'll load your data to the Document Store, then connect components together into a RAG pipeline, and finally ask a question.

First we build the pipeline. Add `LangfuseConnector` to the pipeline as a tracer. There's no need to connect it to any other component. The `LangfuseConnector` will automatically trace the operations and data flow within the pipeline. Then add the other components, like the text embedder, retriever, prompt builder and the model, and connect them together in the order they will be used in the pipeline.

**Note**: Make sure to set the `HAYSTACK_CONTENT_TRACING_ENABLED` environment variable before importing `LangfuseConnector`.


```python
from datasets import load_dataset
from haystack import Document, Pipeline
from haystack.components.builders import PromptBuilder
from haystack.components.embedders import SentenceTransformersDocumentEmbedder, SentenceTransformersTextEmbedder
from haystack.components.generators import OpenAIGenerator
from haystack.components.retrievers import InMemoryEmbeddingRetriever
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack_integrations.components.connectors.langfuse import LangfuseConnector
```


```python
def get_pipeline(document_store: InMemoryDocumentStore):
    retriever = InMemoryEmbeddingRetriever(document_store=document_store, top_k=2)

    # A prompt corresponds to an NLP task and contains instructions for the model. Here, the pipeline will go through each Document to figure out the answer.
    template = """
    Given the following information, answer the question.
    Context:
    {% for document in documents %}
        {{ document.content }}
    {% endfor %}
    Question: {{question}}
    Answer:
    """

    prompt_builder = PromptBuilder(template=template)

    basic_rag_pipeline = Pipeline()
    # Add components to your pipeline
    basic_rag_pipeline.add_component("tracer", LangfuseConnector("Basic RAG Pipeline"))
    basic_rag_pipeline.add_component(
        "text_embedder", SentenceTransformersTextEmbedder(model="sentence-transformers/all-MiniLM-L6-v2")
    )
    basic_rag_pipeline.add_component("retriever", retriever)
    basic_rag_pipeline.add_component("prompt_builder", prompt_builder)
    basic_rag_pipeline.add_component("llm", OpenAIGenerator(model="gpt-4o", generation_kwargs={"n": 2}))

    # Now, connect the components to each other
    # NOTE: the tracer component doesn't need to be connected to anything in order to work
    basic_rag_pipeline.connect("text_embedder.embedding", "retriever.query_embedding")
    basic_rag_pipeline.connect("retriever", "prompt_builder.documents")
    basic_rag_pipeline.connect("prompt_builder", "llm")

    return basic_rag_pipeline
```

Then we load data into DocumentStore. In this example, we use the `trivia_qa_tiny` [dataset](https://huggingface.co/datasets/SpeedOfMagic/trivia_qa_tiny?row=26).


```python
document_store = InMemoryDocumentStore()
dataset = load_dataset("SpeedOfMagic/trivia_qa_tiny", split="train")
embedder = SentenceTransformersDocumentEmbedder("sentence-transformers/all-MiniLM-L6-v2")
embedder.warm_up()

docs_with_embeddings = []
for entry in dataset:
    # Create a Document object for each entry, handling the question (str) and answer (str) data correctly
    content = f"Question: {entry['question']} Answer: {entry['answer']}"
    doc = Document(content=content)

    # Embed the document using the embedder
    # Only takes in list of Documents
    embedder.run([doc])

    # Collect the embedded documents
    docs_with_embeddings.append(doc)

# Write the embedded documents to the document store
document_store.write_documents(docs_with_embeddings)
```

Then ask a question based on the data we loaded in.


```python
pipeline = get_pipeline(document_store)
question = "What can you tell me about Truman Capote?"
response = pipeline.run({"text_embedder": {"text": question}, "prompt_builder": {"question": question}})
```


```python
print("Trace url:", response["tracer"]["trace_url"])
print("Response:", response["llm"]["replies"][0])
```

The output should look like similar to this:

> Truman Capote was an American author known for his literary works such as "Breakfast at Tiffany's" and "In Cold Blood." He was born Truman Persons but was later adopted by his stepfather, changing his last name to Capote. He was a prominent figure in the literary world and is considered one of the pioneers of the "non-fiction novel" genre. Capote was known for his distinctive writing style and his flamboyant personality.

You will notice that the response contains trivia information Truman Capote, such as his birth name, that would not have been included in a standard model call without RAG.

[Example trace in the Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/27c354cd-3d16-4dae-9b87-7740dd440cc7?observation=140dd6e9-750b-40ab-a6c3-5070ba34e7d4)

For each trace, you can see:
- Latency for each component of the pipeline
- Input and output for each step
- For generations, token usage and costs are automatically calculated.

Learn more about tracing in the [docs](https://langfuse.com/docs/tracing).

## RAG Pipeline with Chat

Here is another example connecting a RAG pipeline to a chat generator. Using a component like Haystack's `ChatPromptBuilder` is a great way to add a chat component to your application, which can add a level of personalization and interactivity to your program.

**Note**: Make sure to set the `HAYSTACK_CONTENT_TRACING_ENABLED` environment variable before importing `LangfuseConnector`.


```python
from haystack import Pipeline
from haystack.components.builders import ChatPromptBuilder
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.dataclasses import ChatMessage
from haystack_integrations.components.connectors.langfuse import LangfuseConnector

pipe = Pipeline()
pipe.add_component("tracer", LangfuseConnector("Chat generation"))
pipe.add_component("prompt_builder", ChatPromptBuilder())
pipe.add_component("llm", OpenAIChatGenerator(model="gpt-4o"))

pipe.connect("prompt_builder.prompt", "llm.messages")
messages = [
    ChatMessage.from_system("Always address me cordially, like a concierge at a 5-star hotel. Be very polite and hospitable."),
    ChatMessage.from_user("Tell me about {{location}}"),
]

response = pipe.run(
    data={"prompt_builder": {"template_variables": {"location": "Berlin"}, "template": messages}}
)

trace_url = response["tracer"]["trace_url"]

print("Trace url:", trace_url)
print("Response:", response["llm"]["replies"][0])
```

Sample response

> Of course, esteemed guest! Berlin is a vibrant and culturally rich city, known for its dynamic art scene, fascinating history, and diverse culinary offerings. With its iconic landmarks such as the Brandenburg Gate, Berlin Wall, and bustling Alexanderplatz, there is always something captivating to discover. The city's energy and creativity make it a popular destination for travelers seeking both historical insights and modern experiences. Whether you wish to explore museums and galleries, savor delectable cuisine, or simply stroll along the charming streets, Berlin is sure to leave a lasting impression. If there is anything more specific you would like to know about this remarkable city, please do not hesitate to ask!

[Example trace in the Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/959f0cdf-0fba-42ce-b09f-04fa7f20d0e7?observation=b03ba56b-dab0-4318-a036-dde54d696bd4)

## Add score to the trace

Evaluation is essential to understand whether your RAG application provides meaningful outputs. You can add [scores](https://langfuse.com/docs/scores/overview) to the traces created by this integration to keep track of evaluation results in Langfuse.

You can score traces using a number of methods:

- Through user feedback
- Model-based evaluation
- Through SDK/API
- Using annotation in the Langfuse UI

The example below walks through a simple way to score the chat generator's response via the Python SDK. It adds a score of 1 to the trace above with the comment "Cordial and relevant" because the model's response was very polite and factually correct. You can then sort these scores to identify low-quality output or to monitor the quality of responses.


```python
from langfuse import get_client

langfuse = get_client()

trace_id = trace_url.split('/')[-1] # extract id from trace url, to be exposed directly in a future release

langfuse.score(
    trace_id=trace_id,
    name="quality",
    value=1,
    comment="Cordial and relevant", # optional
);
```

The previously created trace now includes this score:

## Next steps

We're thrilled to collaborate with the Haystack team to give the best possible experience to devs when building complex RAG applications. Thanks to them for developing this intgeration.

Learn more:

- [Haystack integration docs](https://langfuse.com/docs/integrations/haystack/get-started)
- [Introduction to tracing in Langfuse](https://langfuse.com/docs/tracing)
- [Langfuse platform overview](https://langfuse.com/docs)

