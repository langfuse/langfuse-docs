---
title: "Integrate Databricks with Langfuse"
description: "Learn how to monitor and trace Databricks models with Langfuse to improve and debug your AI applications."
---

# Observability for Databricks Models with Langfuse

Databricks provides a powerful platform for hosting and serving large language models. By combining Databricks' serving endpoints with **Langfuse**, you can trace, monitor, and analyze your AI workloads in development and production.

This notebook demonstrates **three** different ways to use Databricks models with Langfuse:
1. **OpenAI SDK:** Use Databricks model endpoints via the OpenAI SDK.
2. **LangChain:** Integrate with the Databricks LLM interface in a LangChain pipeline.
3. **LlamaIndex:** Use Databricks endpoints within LlamaIndex.

> **What is Databricks Model Serving?**  
Databricks Model Serving allows you to serve large-scale models in a production environment, with automatic scaling and a robust infrastructure. It also enables you to fine-tune LLMs on your private data, ensuring your models can leverage proprietary information while maintaining data privacy.

> **What is Langfuse?**  
[Langfuse](https://langfuse.com) is an open source platform for LLM observability and monitoring. It helps you trace and monitor your AI applications by capturing metadata, prompt details, token usage, latency, and more.


## 1. Install Dependencies

Before you begin, install the necessary packages in your Python environment:

- **openai**: Needed to call Databricks endpoints via the OpenAI SDK.
- **databricks-langchain**: Needed to call Databricks endpoints via an "OpenAI-like" interface.
- **llama-index** and **llama-index-llms-databricks**: For using Databricks endpoints within LlamaIndex.
- **langfuse**: Required for sending trace data to the Langfuse platform.



```python
%pip install openai langfuse databricks-langchain llama-index llama-index-llms-databricks
```

## 2. Set Up Environment Variables

Configure your **Langfuse** credentials and **Databricks** credentials as environment variables. Replace the dummy keys below with the real ones from your respective accounts.

 - `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY`: From your Langfuse Project Settings.
 - `LANGFUSE_HOST`: `https://cloud.langfuse.com` (EU region) or `https://us.cloud.langfuse.com` (US region).
 - `DATABRICKS_TOKEN`: Your Databricks personal access token.
 - `DATABRICKS_HOST`: Your Databricks workspace URL (e.g., `https://dbc-xxxxxxx.cloud.databricks.com`).



```python
import os

# Example environment variables (replace with your actual keys/tokens)
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."  # your public key
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."  # your secret key
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"  # or https://us.cloud.langfuse.com

os.environ["DATABRICKS_TOKEN"] = "dapi-..."  # Databricks personal access token
os.environ["DATABRICKS_HOST"] = "https://dbc-XXXXX-XXXX.cloud.databricks.com"
```

## Approach 1: Using Databricks Models via the OpenAI SDK

Databricks endpoints can act as a drop-in replacement for the OpenAI API. This makes it easy to integrate with existing code that relies on the `openai` library. Under the hood, `langfuse.openai.OpenAI` automatically traces your requests to Langfuse.

### Steps
1. Import the `OpenAI` client from `langfuse.openai`.
2. Create a client, setting `api_key` to your Databricks token and `base_url` to your Databricks workspace endpoints.
3. Use the client’s `chat.completions.create()` method to send a prompt.
4. See the trace in your Langfuse dashboard.

**Note:** For more examples on tracing OpenAI with Langfuse see the [OpenAI integration docs](https://langfuse.com/docs/integrations/openai/python/get-started).


```python
# Langfuse OpenAI client
from langfuse.openai import OpenAI

# Retrieve the environment variables
databricks_token = os.environ.get("DATABRICKS_TOKEN")
databricks_host = os.environ.get("DATABRICKS_HOST")

# Create an OpenAI-like client pointing to Databricks
client = OpenAI(
    api_key=databricks_token,  # Databricks personal access token
    base_url=f"{databricks_host}/serving-endpoints",  # your Databricks workspace
)
```


```python
response = client.chat.completions.create(
    messages=[
        {"role": "system", "content": "You are an AI assistant."},
        {"role": "user", "content": "What is Databricks?"}
    ],
    model="mistral-7b", # Adjust based on your Databricks serving endpoint name
    max_tokens=256
)

# Print out the response from the model
print(response.choices[0].message.content)
```

    1. Databricks is a cloud-based data engineering and analytics platform that enables users to build, deploy, and run data science workloads at scale.
    2. It includes a streaming data processing engine called Spark Streaming that is often used in real-time analytics and big data processing applications, as well as a data warehousing platform called Delta Lake that allows users to store and query large amounts of data.
    3. Databricks is based on the open-source Apache Spark and LakeFormation libraries and was founded in 2013 by the original developers of Spark.
    4. It is often used in combination with other big data technologies, such as Hadoop, NoSQL databases, and data visualization tools, to help organizations manage and analyze large volumes of data.
    5. It also includes machine learning libraries, like "MLlib" and "MLflow" which enable to build, train, and deploy machine learning models directly on the cluster.


Once the request completes, **log in to your Langfuse dashboard** and look for the new trace. You will see details like the prompt, response, latency, token usage, etc.

![Databricks example trace in Langfuse](/images/docs/databricks/databricks-example-trace-openai-sdk.png)

_[Link to public trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/029b2344-e2a2-4c52-8d04-bd71f70c1120?timestamp=2025-03-06T14%3A45%3A04.141Z)_ 




## Approach 2: Using LangChain

Databricks models can also be used via LangChain. The [`ChatDatabricks`](https://python.langchain.com/docs/integrations/chat/databricks/) class wraps your Databricks Model Serving endpoint.

### Steps
1. Set `DATABRICKS_HOST` as an environment variable.
2. Initialize a Langfuse `CallbackHandler` that automatically collects trace data.
3. Use `ChatDatabricks` with your endpoint name, temperature, or other parameters.
4. Invoke the model with messages and pass in the Langfuse callback handler.
5. See the trace in your Langfuse dashboard.

**Note:** For more examples on tracing LangChain with Langfuse see the [LangChain integration docs](https://langfuse.com/docs/integrations/langchain/tracing).


```python
from langfuse.callback import CallbackHandler

# Initialize the Langfuse callback handler
langfuse_handler = CallbackHandler(
    secret_key=os.environ.get("LANGFUSE_SECRET_KEY"),
    public_key=os.environ.get("LANGFUSE_PUBLIC_KEY"),
    host=os.environ.get("LANGFUSE_HOST")
)
```


```python
from databricks_langchain import ChatDatabricks

chat_model = ChatDatabricks(
    endpoint="mistral-7b",   # Your Databricks Model Serving endpoint name
    temperature=0.1,
    max_tokens=256,
    # Other parameters can be added here
)

# Build a prompt as a list of system/user messages
messages = [
    ("system", "You are a chatbot that can answer questions about Databricks."),
    ("user", "What is Databricks Model Serving?")
]

# Invoke the model using LangChain's .invoke() method
chat_model.invoke(messages, config={"callbacks": [langfuse_handler]})
```




    AIMessage(content='1. Databricks Model Serving is a feature of the Databricks Runtime that allows you to deploy and manage machine learning models in a scalable and efficient manner.\n2. It provides a centralized platform for storing, deploying, and serving machine learning models, allowing you to easily manage and scale your models as needed.\n3. It supports a wide range of machine learning frameworks and libraries, including TensorFlow, PyTorch, and scikit-learn.\n4. It also provides features such as automatic model versioning, model monitoring, and model deployment to Kubernetes.\n5. It allows you to easily deploy models to production environments, making it easier to integrate machine learning into your existing workflows.', additional_kwargs={}, response_metadata={'prompt_tokens': 36, 'completion_tokens': 155, 'total_tokens': 191}, id='run-e3106e54-8a77-48bc-bf03-8983636ec3c1-0')



After running the code, open your Langfuse dashboard to see the recorded conversation.

![Databricks example trace in Langfuse](https://langfuse.com/images/docs/databricks/databricks-example-trace-langchain.png)

_[Link to public trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/a55411bb-4bb4-435c-b922-e446683888ff?timestamp=2025-03-06T14%3A57%3A59.273Z)_ 


## Approach 3: Using LlamaIndex

If you use [LlamaIndex](https://github.com/jerryjliu/llama_index) for data ingestion, indexing, or retrieval-augmented generation, you can replace the default LLM with a Databricks endpoint.

### Steps
1. Import `Databricks` from `llama_index.llms.databricks`.
2. Initialize a `Databricks` LLM with your endpoint name and Databricks credentials.
3. Use `LlamaIndexInstrumentor` from `langfuse.llama_index` to enable automatic tracing.
4. Invoke the LLM with a chat request.
5. See the trace in your Langfuse dashboard.

**Note:** For more examples on tracing LlamaIndex with Langfuse see the [LlamaIndex integration docs](https://langfuse.com/docs/integrations/llama-index/get-started).



```python
from llama_index.llms.databricks import Databricks

# Create a Databricks LLM instance
llm = Databricks(
    model="mistral-7b",  # Your Databricks serving endpoint name
    api_key=os.environ.get("DATABRICKS_TOKEN"),
    api_base=f"{os.environ.get('DATABRICKS_HOST')}/serving-endpoints/"
)
```


```python
from langfuse.llama_index import LlamaIndexInstrumentor
from llama_index.core.llms import ChatMessage

# Initialize the LlamaIndexInstrumentor to trace LlamaIndex operations
instrumentor = LlamaIndexInstrumentor(
    secret_key=os.environ.get("LANGFUSE_SECRET_KEY"),
    public_key=os.environ.get("LANGFUSE_PUBLIC_KEY"),
    host=os.environ.get("LANGFUSE_HOST")
)

# Start automatic tracing
instrumentor.start()
```


```python
messages = [
    ChatMessage(role="system", content="You are a helpful assistant."),
    ChatMessage(role="user", content="What is Databricks?")
]

response = llm.chat(messages)
print(response)

# Flush any pending events to Langfuse
instrumentor.flush()
```

    Trace ID is not set. Creating generation client with new trace id.


    assistant: 1. Databricks is a cloud-based data science platform that provides a suite of tools for data processing, machine learning, and analytics. It is designed to be scalable and flexible, allowing users to easily process large amounts of data and build complex data pipelines.
    2. Databricks is built on top of Apache Spark, an open-source data processing engine that is widely used in the industry. It also includes a number of other tools and libraries, such as Apache Hadoop, Apache Flink, and Apache Hive, that are commonly used in data science workflows.
    3. Databricks provides a number of features that make it easy to work with data, including data warehousing, data lakes, and data pipelines. It also includes a number of machine learning tools, such as TensorFlow and PyTorch, that can be used to build and train machine learning models.
    4. Databricks is used by a wide range of organizations, including financial institutions, healthcare providers, and retailers, to process and analyze large amounts of data. It is also used by data scientists and data engineers to build and deploy data-driven applications.


You can now log into Langfuse to view your LlamaIndex calls, with details on prompts, token usage, completion data, and more.

![Databricks example LlamaIndex trace in Langfuse](https://langfuse.com/images/docs/databricks/databricks-example-llamaindex-trace.png)

_[Link to public trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/589a858e-9678-4624-bcb6-2e0266ecb1b3?timestamp=2025-03-06T15%3A10%3A02.467Z&observation=dd7b6235-6c92-4c9b-a966-872bc281c060)_ 


## Enhancing Tracing (Optional)

Langfuse supports additional features for richer trace data:

- Add [metadata](https://langfuse.com/docs/tracing-features/metadata), [tags](https://langfuse.com/docs/tracing-features/tags), [log levels](https://langfuse.com/docs/tracing-features/log-levels) and [user IDs](https://langfuse.com/docs/tracing-features/users) to traces
- Group traces by [sessions](https://langfuse.com/docs/tracing-features/sessions)
- [`@observe()` decorator](https://langfuse.com/docs/sdk/python/decorators) to trace additional application logic
- Use [Langfuse Prompt Management](https://langfuse.com/docs/prompts/get-started) and link prompts to traces
- Add [score](https://langfuse.com/docs/scores/custom) to traces

Check out the [Langfuse docs](https://langfuse.com/docs) for more details.

## Next Steps
- See how to use Databricks models in the Langfuse Playground and for LLM-as-a-Judge evaluations [here](https://langfuse.com/docs/integrations/databricks/use-with-playground-and-evals).
- Explore the [Databricks documentation](https://docs.databricks.com/aws/en/machine-learning/model-serving/manage-serving-endpoints) for advanced model serving configurations.
- Learn more about [Langfuse tracing features](https://langfuse.com/docs) to track your entire application flow.
- Try out Langfuse [Prompt Management](https://langfuse.com/docs/prompts/get-started) or set up [LLM-as-a-Judge evaluations](https://langfuse.com/docs/scores/model-based-evals).

