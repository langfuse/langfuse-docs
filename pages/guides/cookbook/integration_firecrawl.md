---
title: Monitor Firecrawl Scraper with Langfuse
description: Learn how to trace Firecrawl operations using Langfuse to capture detailed observability data for your web scraping tasks.
category: Integrations
---

# Firecrawl Integration 🔥🤝🪢

In this guide, we'll show you how to integrate [Langfuse](https://langfuse.com) with [Firecrawl](https://www.firecrawl.dev/) to trace your web scraping operations. By leveraging Langfuse’s tracing capabilities, you can automatically capture details such as inputs, outputs, and execution times of your Firecrawl functions.

> **What is Firecrawl?** [Firecrawl](https://www.firecrawl.dev/) is an API service that crawls websites—automatically processing the target URL and its accessible subpages—and converts the retrieved content into clean, LLM-ready markdown. It offers robust scraping, crawling, and extraction capabilities that transform web content (including HTML, metadata, and more) into structured data for various applications.

## Get Started

First, install the necessary Python packages:


```python
%pip install langfuse firecrawl-py
```

Next, configure your environment with your Langfuse API keys. You can obtain your keys from your Langfuse dashboard.


```python
import os
# Get keys for your project from the project settings page https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```

Initialize the Firecrawl application with your Firecrawl API key.


```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-...")
```

To monitor your Firecrawl scraper, we use the L[angfuse `@observe()` decorator](https://langfuse.com/docs/sdk/python/decorators). In this example, the `@observe()` decorator captures the inputs, outputs, and execution time of the `scrape_website()` function. All trace data is automatically sent to Langfuse, allowing you to monitor your Firecrawl operations in real time.


```python
from langfuse import observe

@observe()
def scrape_website(url):
  scrape_status = app.scrape_url(
    url,
    params={'formats': ['markdown', 'html']}
  )
  return scrape_status

scrape_website("https://langfuse.com")
```

## See Traces in Langfuse

After executing the traced function, log in to your [Langfuse Dashboard](https://cloud.langfuse.com) to view detailed trace logs. 

![Example trace in Langfuse](https://langfuse.com/images/cookbook/integration-firecrawl/firecrawl-example-trace.png)

_[Public link to example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/49206b8e-5366-4458-9357-bd38b740ec4e?timestamp=2025-02-18T16%3A42%3A51.446Z)_

## Learn More

- **Firecrawl Documentation**: [https://docs.firecrawl.dev/introduction](https://docs.firecrawl.dev/introduction)
- **Langfuse `@observe()` Decorator**: [https://langfuse.com/docs/sdk/python/decorators](/docs/sdk/python/decorators)


