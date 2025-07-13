---
title: OpenLIT Integration via OpenTelemetry
description: Example cookbook for the OpenLIT Langfuse integration using OpenTelemetry.
category: Integrations
---

# OpenLIT Integration via OpenTelemetry

Langfuse is an [OpenTelemetry backend](https://langfuse.com/docs/opentelemetry/get-started), allowing trace ingestion from various OpenTelemetry instrumentation libraries. This guide demonstrates how to use the [OpenLit](https://docs.openlit.io/latest/features/tracing) instrumentation library to instrument a compatible framework or LLM provider.

## Step 1: Install Dependencies

Install the necessary Python packages: `openai`, `langfuse`, and `openlit`. These will allow you to interact with OpenAI as well as setup the instrumentation for tracing.

```python
%pip install openai langfuse openlit --upgrade
```

## Step 2: Configure Environment Variables

Before sending any requests, you need to configure your credentials and endpoints. First, set up the Langfuse authentication by providing your public and secret keys. Then, configure the OpenTelemetry exporter endpoint and headers to point to Langfuse's backend. You should also specify your OpenAI API key.

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

    Langfuse client is authenticated and ready!

## Step 3: Initialize Instrumentation

With the environment set up, import the needed libraries and initialize OpenLIT instrumentation. We set `tracer=tracer` to use the tracer we created in the previous step.

```python
import openlit

# Initialize OpenLIT instrumentation. The disable_batch flag is set to true to process traces immediately.
openlit.init(disable_batch=True)
```

    Overriding of current TracerProvider is not allowed
    /Users/jannik/Documents/GitHub/langfuse-docs/.venv/lib/python3.13/site-packages/pydantic/_internal/_config.py:345: UserWarning: Valid config keys have changed in V2:
    * 'fields' has been removed
      warnings.warn(message, UserWarning)


    {
        "resource_metrics": [
            {
                "resource": {
                    "attributes": {
                        "telemetry.sdk.language": "python",
                        "telemetry.sdk.name": "openlit",
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170103458290000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 370,
                                                    "time_unix_nano": 1750170052815487000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170103458290000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 6.08782696723938,
                                                    "time_unix_nano": 1750170052815772000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170103458290000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 6.08782696723938,
                                                    "time_unix_nano": 1750170052815795000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170103458290000,
                                            "value": 1,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 1,
                                                    "time_unix_nano": 1750170052815808000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170103458290000,
                                            "value": 356,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 356,
                                                    "time_unix_nano": 1750170052815854000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170103458290000,
                                            "value": 14,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 14,
                                                    "time_unix_nano": 1750170052815865000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170103458290000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
                                            "exemplars": [
                                                {
                                                    "filtered_attributes": {},
                                                    "value": 0.0005409999999999999,
                                                    "time_unix_nano": 1750170052815876000,
                                                    "span_id": 16196589366933882483,
                                                    "trace_id": 60747386605375572337608415382303199835
                                                }
                                            ]
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170163463164000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170163463164000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170163463164000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170163463164000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170163463164000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170163463164000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170163463164000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170223471008000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170223471008000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170223471008000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170223471008000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170223471008000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170223471008000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170223471008000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170283485878000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170283485878000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170283485878000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170283485878000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170283485878000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170283485878000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170283485878000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170343507759000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170343507759000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170343507759000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170343507759000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170343507759000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170343507759000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170343507759000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170403523327000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170403523327000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170403523327000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170403523327000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170403523327000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170403523327000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170403523327000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170463532154000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170463532154000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170463532154000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170463532154000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170463532154000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170463532154000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170463532154000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170523543109000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170523543109000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170523543109000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170523543109000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170523543109000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170523543109000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170523543109000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170583567364000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170583567364000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170583567364000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170583567364000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170583567364000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170583567364000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170583567364000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170643572617000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170643572617000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170643572617000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170643572617000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170643572617000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170643572617000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170643572617000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170703611152000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170703611152000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170703611152000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170703611152000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170703611152000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170703611152000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170703611152000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170763618434000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170763618434000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170763618434000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170763618434000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170763618434000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170763618434000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170763618434000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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
                        "telemetry.sdk.version": "1.34.1",
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815727000,
                                            "time_unix_nano": 1750170823628772000,
                                            "count": 1,
                                            "sum": 370,
                                            "bucket_counts": [
                                                0,
                                                0,
                                                0,
                                                0,
                                                0,
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
                                            "min": 370,
                                            "max": 370,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815787000,
                                            "time_unix_nano": 1750170823628772000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815801000,
                                            "time_unix_nano": 1750170823628772000,
                                            "count": 1,
                                            "sum": 6.08782696723938,
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
                                                0,
                                                0,
                                                0,
                                                1,
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
                                            "min": 6.08782696723938,
                                            "max": 6.08782696723938,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815823000,
                                            "time_unix_nano": 1750170823628772000,
                                            "value": 1,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815861000,
                                            "time_unix_nano": 1750170823628772000,
                                            "value": 356,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815871000,
                                            "time_unix_nano": 1750170823628772000,
                                            "value": 14,
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
                                                "gen_ai.request.model": "gpt-4o",
                                                "server.address": "api.openai.com",
                                                "server.port": 443,
                                                "gen_ai.response.model": "gpt-4o-2024-08-06"
                                            },
                                            "start_time_unix_nano": 1750170052815881000,
                                            "time_unix_nano": 1750170823628772000,
                                            "count": 1,
                                            "sum": 0.0005409999999999999,
                                            "bucket_counts": [
                                                0,
                                                1,
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
                                            "min": 0.0005409999999999999,
                                            "max": 0.0005409999999999999,
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

## Step 4: Make a Chat Completion Request

For this example, we will make a simple chat completion request to the OpenAI Chat API. This will generate trace data that you can later view in the Langfuse dashboard.

```python
from openai import OpenAI

# Create an instance of the OpenAI client.
openai_client = OpenAI()

# Make a sample chat completion request. This request will be traced by OpenLIT and sent to Langfuse.
chat_completion = openai_client.chat.completions.create(
    messages=[
        {
          "role": "user",
          "content": "What is LLM Observability?",
        }
    ],
    model="gpt-4o",
)

print(chat_completion)
```

    {
        "name": "chat gpt-4o",
        "context": {
            "trace_id": "0x2db38566327e2785c5cc38577934d25b",
            "span_id": "0xe0c5d8374cf68673",
            "trace_state": "[]"
        },
        "kind": "SpanKind.CLIENT",
        "parent_id": null,
        "start_time": "2025-06-17T14:20:46.725103Z",
        "end_time": "2025-06-17T14:20:52.815914Z",
        "status": {
            "status_code": "OK"
        },
        "attributes": {
            "telemetry.sdk.name": "openlit",
            "gen_ai.operation.name": "chat",
            "gen_ai.system": "openai",
            "gen_ai.request.model": "gpt-4o",
            "gen_ai.request.seed": "",
            "server.port": 443,
            "gen_ai.request.frequency_penalty": 0.0,
            "gen_ai.request.max_tokens": -1,
            "gen_ai.request.presence_penalty": 0.0,
            "gen_ai.request.stop_sequences": [],
            "gen_ai.request.temperature": 1.0,
            "gen_ai.request.top_p": 1.0,
            "gen_ai.response.id": "chatcmpl-BjRT54iJi0Xc59gTjyZNycAOtkE56",
            "gen_ai.response.model": "gpt-4o-2024-08-06",
            "gen_ai.usage.input_tokens": 14,
            "gen_ai.usage.output_tokens": 356,
            "server.address": "api.openai.com",
            "gen_ai.request.service_tier": "auto",
            "gen_ai.response.service_tier": "default",
            "gen_ai.response.system_fingerprint": "fp_07871e2ad8",
            "deployment.environment": "default",
            "service.name": "default",
            "gen_ai.request.user": "",
            "gen_ai.request.is_stream": false,
            "gen_ai.usage.total_tokens": 370,
            "gen_ai.usage.cost": 0.0005409999999999999,
            "gen_ai.server.time_to_first_token": 6.08782696723938,
            "gen_ai.sdk.version": "1.88.0",
            "gen_ai.response.finish_reasons": [
                "stop"
            ],
            "gen_ai.output.type": "text"
        },
        "events": [
            {
                "name": "gen_ai.content.prompt",
                "timestamp": "2025-06-17T14:20:52.815372Z",
                "attributes": {
                    "gen_ai.prompt": "user: What is LLM Observability?"
                }
            },
            {
                "name": "gen_ai.content.completion",
                "timestamp": "2025-06-17T14:20:52.815397Z",
                "attributes": {
                    "gen_ai.completion": "LLM Observability refers to the monitoring, understanding, and optimizing of large language models (LLMs) and their behavior in real-world applications. As LLMs are deployed in various contexts, it becomes crucial to ensure they perform as expected, remain reliable, and provide transparency in their operation. Observability in this context involves several key aspects:\n\n1. **Monitoring Performance**: Continuously tracking the performance of LLMs through metrics like response time, accuracy, relevance, and user satisfaction. This helps in identifying any degradation in performance or emerging issues.\n\n2. **Behavior Analysis**: Understanding how the model makes decisions and produces outputs. This involves interpreting the patterns of interactions, examining decision pathways, and ensuring the model behaves as intended.\n\n3. **Bias and Fairness Checking**: Observability includes assessing the model for any biases or unfair behavior, ensuring that outputs are equitable and do not inadvertently disadvantage any group or individual.\n\n4. **Anomaly Detection**: Identifying unusual or unexpected behaviors in LLM outputs that could indicate problems, such as out-of-distribution responses or errors in reasoning.\n\n5. **Transparency and Explainability**: Providing insights into the inner workings of LLMs, which can help build trust by allowing users and stakeholders to understand how decisions are being made.\n\n6. **Compliance and Safety Monitoring**: Ensuring that LLMs are used in a manner compliant with data protection laws, ethical guidelines, and safety standards.\n\n7. **Feedback and Iteration**: Implementing mechanisms for collecting user feedback to continuously improve the model and adapt to changing requirements or environments.\n\nOverall, LLM Observability is about creating a framework to ensure that large language models remain effective, trustworthy, and aligned with human values and goals through systematic monitoring and evaluation."
                }
            }
        ],
        "links": [],
        "resource": {
            "attributes": {
                "telemetry.sdk.language": "python",
                "telemetry.sdk.name": "opentelemetry",
                "telemetry.sdk.version": "1.34.1",
                "service.name": "unknown_service"
            },
            "schema_url": ""
        }
    }
    ChatCompletion(id='chatcmpl-BjRT54iJi0Xc59gTjyZNycAOtkE56', choices=[Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content='LLM Observability refers to the monitoring, understanding, and optimizing of large language models (LLMs) and their behavior in real-world applications. As LLMs are deployed in various contexts, it becomes crucial to ensure they perform as expected, remain reliable, and provide transparency in their operation. Observability in this context involves several key aspects:\n\n1. **Monitoring Performance**: Continuously tracking the performance of LLMs through metrics like response time, accuracy, relevance, and user satisfaction. This helps in identifying any degradation in performance or emerging issues.\n\n2. **Behavior Analysis**: Understanding how the model makes decisions and produces outputs. This involves interpreting the patterns of interactions, examining decision pathways, and ensuring the model behaves as intended.\n\n3. **Bias and Fairness Checking**: Observability includes assessing the model for any biases or unfair behavior, ensuring that outputs are equitable and do not inadvertently disadvantage any group or individual.\n\n4. **Anomaly Detection**: Identifying unusual or unexpected behaviors in LLM outputs that could indicate problems, such as out-of-distribution responses or errors in reasoning.\n\n5. **Transparency and Explainability**: Providing insights into the inner workings of LLMs, which can help build trust by allowing users and stakeholders to understand how decisions are being made.\n\n6. **Compliance and Safety Monitoring**: Ensuring that LLMs are used in a manner compliant with data protection laws, ethical guidelines, and safety standards.\n\n7. **Feedback and Iteration**: Implementing mechanisms for collecting user feedback to continuously improve the model and adapt to changing requirements or environments.\n\nOverall, LLM Observability is about creating a framework to ensure that large language models remain effective, trustworthy, and aligned with human values and goals through systematic monitoring and evaluation.', refusal=None, role='assistant', annotations=[], audio=None, function_call=None, tool_calls=None))], created=1750170047, model='gpt-4o-2024-08-06', object='chat.completion', service_tier='default', system_fingerprint='fp_07871e2ad8', usage=CompletionUsage(completion_tokens=356, prompt_tokens=14, total_tokens=370, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=0, reasoning_tokens=0, rejected_prediction_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cached_tokens=0)))

## Step 5: See Traces in Langfuse

You can view the generated trace data in Langfuse. You can view this [example trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/64902f6a5b4f27738be939b7ad38eab3?timestamp=2025-02-02T22%3A09%3A53.053Z) in the Langfuse UI.

![OpenLIT OpenAI Trace](https://langfuse.com/images/cookbook/otel-integration-openlit/openlit-openai-trace.png)

## Using Dataset Experiments with the OpenLit Instrumentation

With [Dataset Experiments](https://langfuse.com/docs/datasets/overview), you can test your application on a dataset before deploying it to production.

First, set up the helper function (`otel_helper_function`) that will be used to run the application. This function returns the application output as well as the Langfuse trace to link to dataset run with the trace.

```python
from opentelemetry.trace import format_trace_id

def otel_helper_function(input):
    with tracer.start_as_current_span("Otel-Trace") as span:

        # Your gen ai application logic here: (make sure this function is sending traces to Langfuse)
        response = openai.OpenAI().chat.completions.create(
            messages=[{"role": "user", "content": input}],
            model="gpt-4o-mini",
        )
        print(response.choices[0].message.content)

        # Fetch the current span and trace id
        current_span = trace.get_current_span()
        span_context = current_span.get_span_context()
        trace_id = span_context.trace_id
        formatted_trace_id = format_trace_id(trace_id)

        langfuse_trace = langfuse.trace(
            id=formatted_trace_id,
            input=input,
            output=response.choices[0].message.content
        )
    return langfuse_trace, response.choices[0].message.content
```

Then loop over the dataset items and run the application.

```python
from langfuse import Langfuse
langfuse = Langfuse()

dataset = langfuse.get_dataset("<langfuse_dataset_name>")

# Run our application against each dataset item
for item in dataset.items:
    langfuse_trace, output = otel_helper_function(item.input["text"])

    # Link the trace to the dataset item for analysis
    item.link(
        langfuse_trace,
        run_name="run-01",
        run_metadata={ "model": "gpt-4o-mini" }
    )

    # Optionally, store a quick evaluation score for demonstration
    langfuse_trace.score(
        name="<example_eval>",
        value= your_evaluation_function(output),
        comment="This is a comment"
    )

# Flush data to ensure all telemetry is sent
langfuse.flush()
```

You can repeat this process with different:

- Models (OpenAI GPT, local LLM, etc.)
- Prompts (different system messages)

Then compare them side-by-side in Langfuse:

![Dataset run overview](https://langfuse.com/images/cookbook/huggingface-agent-course/dataset_runs.png)
![Dataset run comparison](https://langfuse.com/images/cookbook/huggingface-agent-course/dataset-run-comparison.png)
