---
title: Query Data in Langfuse via the SDK
description: All data in Langfuse is available via API. This Python notebook includes a number of examples of how to use the Langfuse SDK to query data.
category: Examples
---

# Example: Query Data in Langfuse via the SDK

This notebook demonstrates how to programmatically access your LLM observability data from Langfuse using the Python SDK. As outlined in our [documentation](https://langfuse.com/docs/query-traces), Langfuse provides several methods to fetch traces, observations, and sessions for various use cases like collecting few-shot examples, creating datasets, or preparing training data for fine-tuning.

We'll explore the main query functions and show practical examples of filtering and processing the returned data.

**This notebook is work-in-progress, feel free to contribute additional examples that you find useful.**

## Setup


```python
!pip install langfuse --upgrade
```


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""
```


```python
from langfuse import get_client

langfuse = get_client()
```


```python
import pandas as pd
# helper function
def pydantic_list_to_dataframe(pydantic_list):
    """
    Convert a list of pydantic objects to a pandas dataframe.
    """
    data = []
    for item in pydantic_list:
        data.append(item.dict())
    return pd.DataFrame(data)
```

## `fetch_traces`

SDK reference: https://python.reference.langfuse.com/langfuse/client#Langfuse.fetch_traces

Default: get the last 50 traces


```python
traces = langfuse.fetch_traces(limit=50)
# pydantic_list_to_dataframe(traces.data).head(1)
```

Get traces created by a specific user


```python
traces = langfuse.fetch_traces(user_id="u-svQKrql")
# pydantic_list_to_dataframe(traces.data).head(4)
```

Fetch many traces via pagination:


```python
all_traces = []
limit = 50  # Adjust as needed to balance performance and data retrieval.
page = 1
while True:
    traces = langfuse.fetch_traces(limit=limit, page=page)
    all_traces.extend(traces.data)
    if len(traces.data) < limit or len(all_traces) >= 1000:
        break
    page += 1

print(f"Retrieved {len(all_traces)} traces.")
```

## `fetch_trace`

SDK reference: https://python.reference.langfuse.com/langfuse/client#Langfuse.fetch_trace

Simple example: fetch and render as json -> get the full traces including evals, observation inputs/outputs, timings and costs


```python
trace = langfuse.fetch_trace("4e915ff9-2a60-4035-a744-859a9db7ec1b")
# print(trace.data.json(indent=1))
```

Summarize cost by model


```python
trace = langfuse.fetch_trace("4e915ff9-2a60-4035-a744-859a9db7ec1b")
observations = trace.data.observations
```


```python
import pandas as pd

def summarize_usage(observations):
    """Summarizes usage data grouped by model."""

    usage_data = []
    for obs in observations:
        usage = obs.usage
        if usage:
            usage_data.append({
                'model': obs.model,
                'input': usage.input,
                'output': usage.output,
                'total': usage.total,
            })

    df = pd.DataFrame(usage_data)
    if df.empty:
      return pd.DataFrame()

    summary = df.groupby('model').sum()
    return summary

# Example usage (assuming 'observations' is defined as in the provided code):
summary_df = summarize_usage(observations)
summary_df
```

## `fetch_observations`

SDK reference: https://python.reference.langfuse.com/langfuse/client#Langfuse.fetch_observations

Simple example:


```python
observations = langfuse.fetch_observations(limit=50)
# pydantic_list_to_dataframe(observations.data).head(1)
```

## `fetch_observation`

SDK reference: https://python.reference.langfuse.com/langfuse/client#Langfuse.fetch_observation


```python
observation = langfuse.fetch_observation("e2dc8fcf-1cf7-47d6-b7b0-a3b727332f17")
# print(observation.data.json(indent=1))
```

## `fetch_sessions`

SDK reference: https://python.reference.langfuse.com/langfuse/client#Langfuse.fetch_sessions

Simple example


```python
sessions = langfuse.fetch_sessions(limit=50)
# pydantic_list_to_dataframe(sessions.data).head(1)
```
