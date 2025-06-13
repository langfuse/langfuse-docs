---
description: Drop-in replacement of OpenAI SDK to get full observability in Langfuse by changing only the import
category: Integrations
---

# Cookbook: OpenAI Integration (Python)

This is a cookbook with examples of the Langfuse Integration for OpenAI (Python).

Follow the [integration guide](https://langfuse.com/docs/integrations/openai/python/get-started) to add this integration to your OpenAI project.

## Setup

The integration is compatible with OpenAI SDK versions `>=0.27.8`. It supports async functions and streaming for OpenAI SDK versions `>=1.0.0`.


```python
%pip install langfuse openai --upgrade
```


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```


```python
# instead of: import openai
from langfuse.openai import openai
```

## Examples

### Chat completion (text)


```python
completion = openai.chat.completions.create(
  name="test-chat",
  model="gpt-4o",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 1 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

    Exception while exporting Span batch.
    Traceback (most recent call last):
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 534, in _make_request
        response = conn.getresponse()
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connection.py", line 516, in getresponse
        httplib_response = super().getresponse()
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/http/client.py", line 1430, in getresponse
        response.begin()
        ~~~~~~~~~~~~~~^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/http/client.py", line 331, in begin
        version, status, reason = self._read_status()
                                  ~~~~~~~~~~~~~~~~~^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/http/client.py", line 292, in _read_status
        line = str(self.fp.readline(_MAXLINE + 1), "iso-8859-1")
                   ~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/socket.py", line 719, in readinto
        return self._sock.recv_into(b)
               ~~~~~~~~~~~~~~~~~~~~^^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/ssl.py", line 1304, in recv_into
        return self.read(nbytes, buffer)
               ~~~~~~~~~^^^^^^^^^^^^^^^^
      File "/opt/homebrew/Cellar/python@3.13/3.13.2/Frameworks/Python.framework/Versions/3.13/lib/python3.13/ssl.py", line 1138, in read
        return self._sslobj.read(len, buffer)
               ~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^
    TimeoutError: The read operation timed out
    
    The above exception was the direct cause of the following exception:
    
    Traceback (most recent call last):
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/adapters.py", line 667, in send
        resp = conn.urlopen(
            method=request.method,
        ...<9 lines>...
            chunked=chunked,
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 841, in urlopen
        retries = retries.increment(
            method, url, error=new_e, _pool=self, _stacktrace=sys.exc_info()[2]
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/util/retry.py", line 474, in increment
        raise reraise(type(error), error, _stacktrace)
              ~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/util/util.py", line 39, in reraise
        raise value
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 787, in urlopen
        response = self._make_request(
            conn,
        ...<10 lines>...
            **response_kw,
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 536, in _make_request
        self._raise_timeout(err=e, url=url, timeout_value=read_timeout)
        ~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/urllib3/connectionpool.py", line 367, in _raise_timeout
        raise ReadTimeoutError(
            self, url, f"Read timed out. (read timeout={timeout_value})"
        ) from err
    urllib3.exceptions.ReadTimeoutError: HTTPSConnectionPool(host='cloud.langfuse.com', port=443): Read timed out. (read timeout=10)
    
    During handling of the above exception, another exception occurred:
    
    Traceback (most recent call last):
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/sdk/trace/export/__init__.py", line 362, in _export_batch
        self.span_exporter.export(self.spans_list[:idx])  # type: ignore
        ~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/exporter/otlp/proto/http/trace_exporter/__init__.py", line 204, in export
        return self._export_serialized_spans(serialized_data)
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/exporter/otlp/proto/http/trace_exporter/__init__.py", line 174, in _export_serialized_spans
        resp = self._export(serialized_data)
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/opentelemetry/exporter/otlp/proto/http/trace_exporter/__init__.py", line 139, in _export
        resp = self._session.post(
            url=self._endpoint,
        ...<3 lines>...
            cert=self._client_cert,
        )
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/sessions.py", line 637, in post
        return self.request("POST", url, data=data, json=json, **kwargs)
               ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/sessions.py", line 589, in request
        resp = self.send(prep, **send_kwargs)
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/sessions.py", line 703, in send
        r = adapter.send(request, **kwargs)
      File "/Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/requests/adapters.py", line 713, in send
        raise ReadTimeout(e, request=request)
    requests.exceptions.ReadTimeout: HTTPSConnectionPool(host='cloud.langfuse.com', port=443): Read timed out. (read timeout=10)


### Chat completion (image)

Simple example using the OpenAI vision's functionality. Images may be passed in the `user` messages. 


```python
completion = openai.chat.completions.create(
  name="test-url-image",
  model="gpt-4o-mini", # GPT-4o, GPT-4o mini, and GPT-4 Turbo have vision capabilities
  messages=[
      {"role": "system", "content": "You are an AI trained to describe and interpret images. Describe the main objects and actions in the image."},
      {"role": "user", "content": [
        {"type": "text", "text": "What’s depicted in this image?"},
        {
          "type": "image_url",
          "image_url": {
            "url": "https://static.langfuse.com/langfuse-dev/langfuse-example-image.jpeg",
          },
        },
      ],
    }
  ],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

Go to https://cloud.langfuse.com or your own instance to see your generation.

![Chat completion](https://langfuse.com/images/docs/multi-modal-trace.png)

### Chat completion (streaming)

Simple example using the OpenAI streaming functionality.


```python
completion = openai.chat.completions.create(
  name="test-chat",
  model="gpt-4o",
  messages=[
      {"role": "system", "content": "You are a professional comedian."},
      {"role": "user", "content": "Tell me a joke."}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
  stream=True
)

for chunk in completion:
  print(chunk.choices[0].delta.content, end="")
```

    Why don't scientists trust atoms?
    
    Because they make up everything!None

### Chat completion (async)

Simple example using the OpenAI async client. It takes the Langfuse configurations either from the environment variables or from the attributes on the `openai` module.


```python
from langfuse.openai import AsyncOpenAI

async_client = AsyncOpenAI()
```


```python
completion = await async_client.chat.completions.create(
  name="test-chat",
  model="gpt-4o",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 100 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

Go to https://cloud.langfuse.com or your own instance to see your generation.

![Chat completion](https://langfuse.com/images/docs/openai-chat.png)

### Functions

Simple example using Pydantic to generate the function schema.


```python
%pip install pydantic --upgrade
```


```python
from typing import List
from pydantic import BaseModel

class StepByStepAIResponse(BaseModel):
    title: str
    steps: List[str]
schema = StepByStepAIResponse.schema() # returns a dict like JSON schema
```


```python
import json
response = openai.chat.completions.create(
    name="test-function",
    model="gpt-4o-0613",
    messages=[
       {"role": "user", "content": "Explain how to assemble a PC"}
    ],
    functions=[
        {
          "name": "get_answer_for_user_query",
          "description": "Get user answer in series of steps",
          "parameters": StepByStepAIResponse.schema()
        }
    ],
    function_call={"name": "get_answer_for_user_query"}
)

output = json.loads(response.choices[0].message.function_call.arguments)
```

Go to https://cloud.langfuse.com or your own instance to see your generation.

![Function](https://langfuse.com/images/docs/openai-function.png)


## Langfuse Features (User, Tags, Metadata, Session)

You can access additional Langfuse features by adding the relevant attributes to the OpenAI request. The Langfuse integration will parse these attributes. See [docs](https://langfuse.com/docs/integrations/openai/python/get-started#custom-trace-properties) for details on all available features.


```python
completion_with_attributes = openai.chat.completions.create(
  name="test-chat-with-attributes", # trace name
  model="gpt-4o",
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 1 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"}, # trace metadata
  tags=["tag1", "tag2"], # trace tags
  user_id="user1234", # trace user id
  session_id="session1234", # trace session id
)
```

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/286c5c70-b077-4826-a493-36c510362a5a

## AzureOpenAI

The integration also works with the `AzureOpenAI` and `AsyncAzureOpenAI` classes.


```python
AZURE_OPENAI_KEY=""
AZURE_ENDPOINT=""
AZURE_DEPLOYMENT_NAME="cookbook-gpt-4o-mini" # example deployment name
```


```python
# instead of: from openai import AzureOpenAI
from langfuse.openai import AzureOpenAI
```


```python
client = AzureOpenAI(
    api_key=AZURE_OPENAI_KEY,  
    api_version="2023-03-15-preview",
    azure_endpoint=AZURE_ENDPOINT
)
```


```python
client.chat.completions.create(
  name="test-chat-azure-openai",
  model=AZURE_DEPLOYMENT_NAME, # deployment name
  messages=[
      {"role": "system", "content": "You are a very accurate calculator. You output only the result of the calculation."},
      {"role": "user", "content": "1 + 1 = "}],
  temperature=0,
  metadata={"someMetadataKey": "someValue"},
)
```

Example trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/7ceb3ee3-0f2a-4f36-ad11-87ff636efd1e

## Group multiple generations into a single trace

Many applications require more than one OpenAI call. The `@observe()` decorator allows to nest all LLM calls of a single API invocation into the same `trace` in Langfuse.


```python
from langfuse.openai import openai
from langfuse import observe

@observe() # decorator to automatically create trace and nest generations
def main(country: str, user_id: str, **kwargs) -> str:
    # nested generation 1: use openai to get capital of country
    capital = openai.chat.completions.create(
      name="geography-teacher",
      model="gpt-4o",
      messages=[
          {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
          {"role": "user", "content": country}],
      temperature=0,
    ).choices[0].message.content

    # nested generation 2: use openai to write poem on capital
    poem = openai.chat.completions.create(
      name="poet",
      model="gpt-4o",
      messages=[
          {"role": "system", "content": "You are a poet. Create a poem about a city."},
          {"role": "user", "content": capital}],
      temperature=1,
      max_tokens=200,
    ).choices[0].message.content

    return poem

# run main function and let Langfuse decorator do the rest
print(main("Bulgaria", "admin"))
```

    In Sofia's embrace of time's gentle hand,  
    Where ancient whispers in the cobblestones stand,  
    The Vitosha's shadow kisses the town,  
    As golden sunsets tie the day down.  
    
    Streets sing with echoes of footsteps past,  
    Where stories linger, and memories cast,  
    Beneath the banyan sky so wide,  
    Cultures and histories peacefully collide.  
    
    The Alexander Nevsky, majestic and bold,  
    A guardian of faith with domes of gold,  
    Its silence speaks in volumes profound,  
    In the heart of a city where old truths are found.  
    
    The rose-laden gardens in Boris' park,  
    Perfume the air as day turns dark,  
    While laughter and life dance at night,  
    Under Sofia's tapestry of starlit light.  
    
    Markets bustle with the color of trade,  
    Where lively exchanges and histories fade,  
    A mosaic of tales in woven rhyme,  
    Sofia stands timeless through passage of time.  
    
    


Go to https://cloud.langfuse.com or your own instance to see your trace.

![Trace with multiple OpenAI calls](https://langfuse.com/images/docs/openai-trace-grouped.png)

## Fully featured: Interoperability with Langfuse SDK

The `trace` is a core object in Langfuse and you can add rich metadata to it. See [Python SDK docs](https://langfuse.com/docs/sdk/python#traces-1) for full documentation on this.

Some of the functionality enabled by custom traces:
- custom name to identify a specific trace-type
- user-level tracking
- experiment tracking via versions and releases
- custom metadata


```python
from langfuse.openai import openai
from langfuse import observe, get_client
langfuse = get_client()

@observe() # decorator to automatically create trace and nest generations
def main(country: str, user_id: str, **kwargs) -> str:
    # nested generation 1: use openai to get capital of country
    capital = openai.chat.completions.create(
      name="geography-teacher",
      model="gpt-4o",
      messages=[
          {"role": "system", "content": "You are a Geography teacher helping students learn the capitals of countries. Output only the capital when being asked."},
          {"role": "user", "content": country}],
      temperature=0,
    ).choices[0].message.content

    # nested generation 2: use openai to write poem on capital
    poem = openai.chat.completions.create(
      name="poet",
      model="gpt-4o",
      messages=[
          {"role": "system", "content": "You are a poet. Create a poem about a city."},
          {"role": "user", "content": capital}],
      temperature=1,
      max_tokens=200,
    ).choices[0].message.content

    # rename trace and set attributes (e.g., medatata) as needed
    langfuse.update_current_trace(
        name="City poem generator",
        session_id="1234",
        user_id=user_id,
        tags=["tag1", "tag2"],
        public=True,
        metadata = {"env": "development"}
    )

    return poem

# create random trace_id, could also use existing id from your application, e.g. conversation id
trace_id = langfuse.create_trace_id()

# run main function, set your own id, and let Langfuse decorator do the rest
print(main("Bulgaria", "admin", langfuse_observation_id=trace_id))
```

    In the cradle of Balkan hills, she lies,  
    A gem under cerulean skies,  
    Sofia, where the ancient whispers blend,  
    With modern souls, as time extends.
    
    Her heart beats with the rhythm of the past,  
    Where cobblestones and new dreams cast,  
    A tapestry of age and youth, entwined,  
    In every corner, stories unsigned.
    
    The Vitosha stands like a guardian old,  
    Whose peaks in winter snow enfold,  
    The city below, glowing warm and bright,  
    Under the embrace of evening light.
    
    St. Alexander’s domes in sunlight gleam,  
    Golden crowns of a Byzantine dream,  
    While beneath, a bustling world unfurls,  
    In markets vast, where culture swirls.
    
    Winding streets where whispers linger,  
    Liberty echoes from corner to finger,  
    In the shadow of Soviet grandiosity,  
    Bulgaria’s spirit claims its clarity.
    
    Cafés breathe tales in the aroma of brew,


## Programmatically add scores

You can add [scores](https://langfuse.com/docs/scores) to the trace, to e.g. record user feedback or some programmatic evaluation. Scores are used throughout Langfuse to filter traces and on the dashboard. See the docs on scores for more details.

The score is associated to the trace using the `trace_id`.


```python
from langfuse import observe, get_client
langfuse = get_client()

@observe() # decorator to automatically create trace and nest generations
def main():
    # get trace_id of current trace
    trace_id = langfuse.get_current_trace_id()

    # rest of your application ...

    return "res", trace_id

# execute the main function to generate a trace
_, trace_id = main()

# Score the trace from outside the trace context
langfuse.create_score(
    trace_id=trace_id,
    name="my-score-name",
    value=1
)
```
