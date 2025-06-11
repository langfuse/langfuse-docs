---
title: Observability for Agno with Langfuse
description: Learn how to integrate Langfuse with Agno via OpenTelemetry
category: Integrations
---

# Integrate Langfuse with Agno

This notebook demonstrates how to integrate **Langfuse** with **Agno** using OpenTelemetry via the **OpenLIT** instrumentation. By the end of this notebook, you will be able to trace your Agno applications with Langfuse for improved observability and debugging.

> **What is Agno?** [Agno](https://docs.agno.com/) is a platform for building and managing AI agents.

> **What is Langfuse?** [Langfuse](https://langfuse.com) is an open-source LLM engineering platform. It provides tracing and monitoring capabilities for LLM applications, helping developers debug, analyze, and optimize their AI systems. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry, and API/SDKs.

## Get Started

We'll walk through examples of using Agno and integrating it with Langfuse.

### Step 1: Install Dependencies



```python
%pip install agno openai langfuse yfinance openlit
```

### Step 2: Set Up Environment Variables

Get your Langfuse API keys by signing up for [Langfuse Cloud](https://cloud.langfuse.com) or [self-hosting Langfuse](https://langfuse.com/self-hosting).You'll also need your OpenAI API key.


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..." 
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

With the environment variables set, we can now initialize the Langfuse client. `get_client()` initializes the Langfuse client using the credentials provided in the environment variables.



```python
from langfuse import get_client
 
langfuse = get_client()
 
# Verify connection
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Please check your credentials and host.")
```

### Step 3: Sending Traces to Langfuse

This example demonstrates how to use the OpenLit instrumentation library to ingfe


```python
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools.duckduckgo import DuckDuckGoTools

# Initialize OpenLIT instrumentation
import openlit
openlit.init(tracer=langfuse._otel_tracer, disable_batch=True)

# Create and configure the agent
agent = Agent(
    model=OpenAIChat(id="gpt-4o-mini"),
    tools=[DuckDuckGoTools()],
    markdown=True,
    debug_mode=True,
)

# Use the agent
agent.print_response("What is currently trending on Twitter?")
```

    {
        "resource_metrics": [
            {
                "resource": {
                    "attributes": {
                        "telemetry.sdk.language": "python",
                        "telemetry.sdk.name": "openlit",
                        "telemetry.sdk.version": "1.33.1",
                        "service.name": "default",
                        "deployment.environment": "default"
                    },
                    "schema_url": ""
                },
                "scope_metrics": [
                    {
                        "scope": {
                            "name": "openlit.otel.metrics",
                            "version": "0.1.0",
                            "schema_url": "",
                            "attributes": null
                        },
                        "metrics": [
                            {
                                "name": "gen_ai.client.token.usage",
                                "description": "Measures number of input and output tokens used",
                                "unit": "{token}",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559112000,
                                            "time_unix_nano": 1749653425848669000,
                                            "count": 2,
                                            "sum": 1071,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                1,
                                                1,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                1,
                                                4,
                                                16,
                                                64,
                                                256,
                                                1024,
                                                4096,
                                                16384,
                                                65536,
                                                262144,
                                                1048576,
                                                4194304,
                                                16777216,
                                                67108864
                                            ],
                                            "min": 183,
                                            "max": 888,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            },
                            {
                                "name": "gen_ai.client.operation.duration",
                                "description": "GenAI operation duration",
                                "unit": "s",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559190000,
                                            "time_unix_nano": 1749653425848669000,
                                            "count": 2,
                                            "sum": 5.745627164840698,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                1,
                                                0,
                                                1,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                0.01,
                                                0.02,
                                                0.04,
                                                0.08,
                                                0.16,
                                                0.32,
                                                0.64,
                                                1.28,
                                                2.56,
                                                5.12,
                                                10.24,
                                                20.48,
                                                40.96,
                                                81.92
                                            ],
                                            "min": 0.9523701667785645,
                                            "max": 4.793256998062134,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            },
                            {
                                "name": "gen_ai.server.time_to_first_token",
                                "description": "Time to generate first token for successful responses",
                                "unit": "s",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559238000,
                                            "time_unix_nano": 1749653425848669000,
                                            "count": 2,
                                            "sum": 5.745627164840698,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                1,
                                                0,
                                                1,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                0.001,
                                                0.005,
                                                0.01,
                                                0.02,
                                                0.04,
                                                0.06,
                                                0.08,
                                                0.1,
                                                0.25,
                                                0.5,
                                                0.75,
                                                1.0,
                                                2.5,
                                                5.0,
                                                7.5,
                                                10.0
                                            ],
                                            "min": 0.9523701667785645,
                                            "max": 4.793256998062134,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            },
                            {
                                "name": "gen_ai.total.requests",
                                "description": "Number of requests to GenAI",
                                "unit": "1",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559759000,
                                            "time_unix_nano": 1749653425848669000,
                                            "value": 2,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2,
                                    "is_monotonic": true
                                }
                            },
                            {
                                "name": "gen_ai.usage.output_tokens",
                                "description": "Number of completion tokens processed.",
                                "unit": "1",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559799000,
                                            "time_unix_nano": 1749653425848669000,
                                            "value": 245,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2,
                                    "is_monotonic": true
                                }
                            },
                            {
                                "name": "gen_ai.usage.input_tokens",
                                "description": "Number of prompt tokens processed.",
                                "unit": "1",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559818000,
                                            "time_unix_nano": 1749653425848669000,
                                            "value": 826,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2,
                                    "is_monotonic": true
                                }
                            },
                            {
                                "name": "gen_ai.usage.cost",
                                "description": "The distribution of GenAI request costs.",
                                "unit": "USD",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559840000,
                                            "time_unix_nano": 1749653425848669000,
                                            "count": 2,
                                            "sum": 0.00027089999999999997,
                                            "bucket_counts": [
                                                0,
                                                2,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                0.0,
                                                5.0,
                                                10.0,
                                                25.0,
                                                50.0,
                                                75.0,
                                                100.0,
                                                250.0,
                                                500.0,
                                                750.0,
                                                1000.0,
                                                2500.0,
                                                5000.0,
                                                7500.0,
                                                10000.0
                                            ],
                                            "min": 3.645e-05,
                                            "max": 0.00023444999999999998,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            }
                        ],
                        "schema_url": ""
                    }
                ],
                "schema_url": ""
            }
        ]
    }
    {
        "resource_metrics": [
            {
                "resource": {
                    "attributes": {
                        "telemetry.sdk.language": "python",
                        "telemetry.sdk.name": "openlit",
                        "telemetry.sdk.version": "1.33.1",
                        "service.name": "default",
                        "deployment.environment": "default"
                    },
                    "schema_url": ""
                },
                "scope_metrics": [
                    {
                        "scope": {
                            "name": "openlit.otel.metrics",
                            "version": "0.1.0",
                            "schema_url": "",
                            "attributes": null
                        },
                        "metrics": [
                            {
                                "name": "gen_ai.client.token.usage",
                                "description": "Measures number of input and output tokens used",
                                "unit": "{token}",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559112000,
                                            "time_unix_nano": 1749653485854488000,
                                            "count": 2,
                                            "sum": 1071,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                1,
                                                1,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                1,
                                                4,
                                                16,
                                                64,
                                                256,
                                                1024,
                                                4096,
                                                16384,
                                                65536,
                                                262144,
                                                1048576,
                                                4194304,
                                                16777216,
                                                67108864
                                            ],
                                            "min": 183,
                                            "max": 888,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            },
                            {
                                "name": "gen_ai.client.operation.duration",
                                "description": "GenAI operation duration",
                                "unit": "s",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559190000,
                                            "time_unix_nano": 1749653485854488000,
                                            "count": 2,
                                            "sum": 5.745627164840698,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                1,
                                                0,
                                                1,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                0.01,
                                                0.02,
                                                0.04,
                                                0.08,
                                                0.16,
                                                0.32,
                                                0.64,
                                                1.28,
                                                2.56,
                                                5.12,
                                                10.24,
                                                20.48,
                                                40.96,
                                                81.92
                                            ],
                                            "min": 0.9523701667785645,
                                            "max": 4.793256998062134,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            },
                            {
                                "name": "gen_ai.server.time_to_first_token",
                                "description": "Time to generate first token for successful responses",
                                "unit": "s",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559238000,
                                            "time_unix_nano": 1749653485854488000,
                                            "count": 2,
                                            "sum": 5.745627164840698,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                1,
                                                0,
                                                1,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                0.001,
                                                0.005,
                                                0.01,
                                                0.02,
                                                0.04,
                                                0.06,
                                                0.08,
                                                0.1,
                                                0.25,
                                                0.5,
                                                0.75,
                                                1.0,
                                                2.5,
                                                5.0,
                                                7.5,
                                                10.0
                                            ],
                                            "min": 0.9523701667785645,
                                            "max": 4.793256998062134,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            },
                            {
                                "name": "gen_ai.total.requests",
                                "description": "Number of requests to GenAI",
                                "unit": "1",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559759000,
                                            "time_unix_nano": 1749653485854488000,
                                            "value": 2,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2,
                                    "is_monotonic": true
                                }
                            },
                            {
                                "name": "gen_ai.usage.output_tokens",
                                "description": "Number of completion tokens processed.",
                                "unit": "1",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559799000,
                                            "time_unix_nano": 1749653485854488000,
                                            "value": 245,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2,
                                    "is_monotonic": true
                                }
                            },
                            {
                                "name": "gen_ai.usage.input_tokens",
                                "description": "Number of prompt tokens processed.",
                                "unit": "1",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559818000,
                                            "time_unix_nano": 1749653485854488000,
                                            "value": 826,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2,
                                    "is_monotonic": true
                                }
                            },
                            {
                                "name": "gen_ai.usage.cost",
                                "description": "The distribution of GenAI request costs.",
                                "unit": "USD",
                                "data": {
                                    "data_points": [
                                        {
                                            "attributes": {
                                                "telemetry.sdk.name": "openlit",
                                                "service.name": "default",
                                                "deployment.environment": "default",
                                                "gen_ai.operation.name": "chat",
                                                "gen_ai.system": "openai",
                                                "gen_ai.request.model": "gpt-4o-mini",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-mini-2024-07-18"
                                            },
                                            "start_time_unix_nano": 1749650493559840000,
                                            "time_unix_nano": 1749653485854488000,
                                            "count": 2,
                                            "sum": 0.00027089999999999997,
                                            "bucket_counts": [
                                                0,
                                                2,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
                                                0
                                            ],
                                            "explicit_bounds": [
                                                0.0,
                                                5.0,
                                                10.0,
                                                25.0,
                                                50.0,
                                                75.0,
                                                100.0,
                                                250.0,
                                                500.0,
                                                750.0,
                                                1000.0,
                                                2500.0,
                                                5000.0,
                                                7500.0,
                                                10000.0
                                            ],
                                            "min": 3.645e-05,
                                            "max": 0.00023444999999999998,
                                            "exemplars": []
                                        }
                                    ],
                                    "aggregation_temporality": 2
                                }
                            }
                        ],
                        "schema_url": ""
                    }
                ],
                "schema_url": ""
            }
        ]
    }


### Step 4: See Traces in Langfuse

After running the agent examples above, you can view the traces generated by your Agno agent in Langfuse. 

![Agno Agents OpenLit Instrumentation](https://langfuse.com/images/cookbook/integration-agno-agents/agno-agents-openlit.png)

[Example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/080130871f53145aecf7c29d5dfb6e4c?timestamp=2025-06-11T14:01:32.598Z&display=details)

## References

- [Agno Langfuse Integration Docs](https://docs.agno.com/observability/langfuse)
- [Langfuse OpenTelemetry Docs](https://langfuse.com/docs/opentelemetry/get-started)
