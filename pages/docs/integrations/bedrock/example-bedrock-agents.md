---
description: This cookbook demonstrate how to trace Amazon Bedrock Agents with Langfuse.
category: Integrations
---

# Trace Bedrock Agents with Langfuse

> **What are Amazon Bedrock Agents?**
> [Amazon Bedrock Agents](https://aws.amazon.com/bedrock/agents/) are managed services that simplify the creation and deployment of AI-powered conversational agents capable of executing tasks and retrieving information by integrating foundation models with external data sources and APIs.

> **What is Langfuse?**
> [Langfuse](https://langfuse.com/) is an open-source platform for LLM engineering. It provides tracing and monitoring capabilities for AI agents, helping developers debug, analyze, and optimize their products. Langfuse integrates with various tools and frameworks via native integrations, OpenTelemetry, and SDKs.


This cookbook implements an OpenTelemetry-based tracing and monitoring system for [Amazon Bedrock Agents](https://aws.amazon.com/bedrock/agents/) through [Langfuse](https://langfuse.com/) integration. 

It creates hierarchical trace structures to track agent performance metrics including token usage, latency measurements, and execution durations across preprocessing, orchestration, and postprocessing phases. It processes both streaming and non-streaming responses, generating spans with operation attributes such as timing data, error states, and response content. 

## Get Started
AWS account with appropriate IAM permissions for Amazon Bedrock Agents and Model Access as well as appropriate permission to deploy containers if using the Langfuse self-hosted option.

### Python Dependencies

To run this notebook, you'll need to install some libraries in your environment:



```python
%pip install -r requirements.txt
```

### AWS Credentials
Before using Amazon Bedrock, ensure that your AWS credentials are configured correctly. You can set them up using the AWS CLI or by setting environment variables. For this notebook assumes that the credentials are already configured.



```python
import boto3

# Create the client to invoke Agents in Amazon Bedrock:
br_agents_runtime = boto3.client("bedrock-agent-runtime")
```

### Amazon Bedrock Agent


We assume you've already created an [Amazon Bedrock Agent](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html). If you don't have one already you can follow the **[instructions here]()** to set up an example agent.

Configure your agent's **ID** and (optionally) alias ID in the cell below. You can find these by looking up your agent in the ["Agents" page on the AWS Console for Amazon Bedrock](https://console.aws.amazon.com/bedrock/home?#/agents) or CLI.

The Agent ID should be ten characters, uppercase, and alphanumeric. If you haven't created an Alias for your agent yet, you can use `TSTALIASID` to reference the latest saved development version.


```python
agent_id = ""  # <- Configure your Bedrock Agent ID
agent_alias_id = "TSTALIASID"  # <- Optionally set a different Alias ID if you have one
```

Before moving on lets validate invoke agent is working correctly. The response is not important we are simply testing the API call. 


```python
print(f"Trying to invoke alias {agent_alias_id} of agent {agent_id}...")
agent_resp = br_agents_runtime.invoke_agent(
    agentAliasId=agent_alias_id,
    agentId=agent_id,
    inputText="Hello!",
    sessionId="dummy-session",
)
if "completion" in agent_resp:
    print("✅ Got response")
else:
    raise ValueError(f"No 'completion' in agent response:\n{agent_resp}")
```

### Langfuse API keys

Get your Langfuse API keys by signing of for [Langfuse Cloud](https://cloud.langfuse.com/) or [self-hosting Langfuse](https://langfuse.com/self-hosting). To self-host Langfuse on AWS, you can use the [quick-start CloudFormation template](https://console.aws.amazon.com/cloudformation/home?#/stacks/create/review?templateURL=https://aws-blogs-artifacts-public.s3.us-east-1.amazonaws.com/artifacts/ML-18524/langfuse-bootstrap.yml&stackName=LangfuseBootstrap).



Once your Langfuse environment is set up and you've signed in to the UI, you'll need to set up an **API key pair** for your particular Organization and Project (create a new project if you don't have one already).

For more information, see the [FAQ: Where are my Langfuse API keys](https://langfuse.com/faq/all/where-are-langfuse-api-keys) and Langfuse's [getting started documentation](https://langfuse.com/docs/get-started).


```python
langfuse_api_url = "https://us.cloud.langfuse.com/"  # <- Replace as described above
```


```python
langfuse_public_key = "xxx"  # <- Configure your own key here
langfuse_secret_key = "xxx"  # <- Configure your own key here
```

### Setting up agent tracing

With all the pre-requisites in place, we're ready to recording traces from your Bedrock Agent into Langfuse.

First, let's load the libraries:


```python
import time
import boto3
import uuid
import json
from core.timer_lib import timer
from core import instrument_agent_invocation, flush_telemetry
```

Now lets define a wrapper function. Here we create a wrapper function that is used to Invoke the Amazon Bedrock Agent with instrumentation for Langfuse on the Amazon Bedrock Agents runtime API.

1. Instrumentation for monitoring
2. Configurable streaming support
3. Trace enabling for debugging
4. Flexible parameter handling through kwargs
5. Proper logging of configuration states



```python
@instrument_agent_invocation
def invoke_bedrock_agent(
    inputText: str, agentId: str, agentAliasId: str, sessionId: str, **kwargs
):
    """Invoke a Bedrock Agent with instrumentation for Langfuse."""
    # Create Bedrock client
    bedrock_rt_client = boto3.client("bedrock-agent-runtime")
    use_streaming = kwargs.get("streaming", False)
    invoke_params = {
        "inputText": inputText,
        "agentId": agentId,
        "agentAliasId": agentAliasId,
        "sessionId": sessionId,
        "enableTrace": True,  # Required for instrumentation
    }

    # Add streaming configurations if needed
    if use_streaming:
        invoke_params["streamingConfigurations"] = {
            "applyGuardrailInterval": 10,
            "streamFinalResponse": True,
        }
    response = bedrock_rt_client.invoke_agent(**invoke_params)
    return response
```

Next, we create a wrapper function to handle the responses.

1. Instrumentation for monitoring
2. Configurable streaming support
3. Trace enabling for debugging
4. Flexible parameter handling through kwargs
5. Proper logging of configuration states

It's particularly useful for:

1. Real-time processing of large responses
2. Interactive applications requiring immediate feedback
3. Debugging and monitoring streaming responses
4. Ensuring proper text encoding/decoding


```python
def process_streaming_response(stream):
    """Process a streaming response from Bedrock Agent."""
    full_response = ""
    try:
        for event in stream:
            # Convert event to dictionary if it's a botocore Event object
            event_dict = (
                event.to_response_dict()
                if hasattr(event, "to_response_dict")
                else event
            )
            if "chunk" in event_dict:
                chunk_data = event_dict["chunk"]
                if "bytes" in chunk_data:
                    output_bytes = chunk_data["bytes"]
                    # Convert bytes to string if needed
                    if isinstance(output_bytes, bytes):
                        output_text = output_bytes.decode("utf-8")
                    else:
                        output_text = str(output_bytes)
                    full_response += output_text
    except Exception as e:
        print(f"\nError processing stream: {e}")
    return full_response
```

### Langfuse Configuration


```python
import os
import base64
start = time.time()
with open('config.json', 'r') as config_file:
    config = json.load(config_file)
    
 # For Langfuse specifically but you can add any other observability provider:
os.environ["OTEL_SERVICE_NAME"] = 'Langfuse'
os.environ["DEPLOYMENT_ENVIRONMENT"] = config["langfuse"]["environment"]
project_name = config["langfuse"]["project_name"]
environment = config["langfuse"]["environment"]
langfuse_public_key = config["langfuse"]["langfuse_public_key"]
langfuse_secret_key = config["langfuse"]["langfuse_secret_key"]
langfuse_api_url = config["langfuse"]["langfuse_api_url"]

# Create auth header
auth_token = base64.b64encode(
    f"{langfuse_public_key}:{langfuse_secret_key}".encode()
).decode()

# Set OpenTelemetry environment variables for Langfuse
os.environ["OTEL_EXPORTER_OTLP_ENDPOINT"] = f"{langfuse_api_url}/api/public/otel/v1/traces"
os.environ["OTEL_EXPORTER_OTLP_HEADERS"] = f"Authorization=Basic {auth_token}"
```

The next code block will require some editing before running. Here we will set parameters used by Langfuse to track traces.




```python

# Langfuse configuration
project_name = "xxx" #Enter your Langfuse Project name that you created 
environment = "default"  #Enter the env name

# User information
user_id = "xxx" #This will be used in the Langfuse UI to filter traces

# Foundation Model used by the agent (used to estimate costs)
agent_model_id = "xxx"  #eg "claude-3-5-sonnet-20241022-v2:0"
    
```


```python
# Agent configuration
agentId = config["agent"]["agentId"]
agentAliasId = config["agent"]["agentAliasId"]
sessionId = f"session-{int(time.time())}"

# User information
userId = config["user"]["userId"]  
agent_model_id = config["user"]["agent_model_id"]

# Tags for filtering in Langfuse
tags = ["bedrock-agent", "example", "development"]

# Generate a custom trace ID
trace_id = str(uuid.uuid4())

```

### Prompt


```python
# Your prompt and streaming mode
question = "xxx" # your prompt to the agent
streaming = False

```

### Invoke Agent Function
There we pass all the parameters Invoking the agent along with the observability integration with Langfuse.


```python
# Single invocation that works for both streaming and non-streaming
response = invoke_bedrock_agent(
    inputText=question,
    agentId=agentId,
    agentAliasId=agentAliasId,
    sessionId=sessionId,
    show_traces=True,
    SAVE_TRACE_LOGS=True,
    userId=userId,
    tags=tags,
    trace_id=trace_id,
    project_name=project_name,
    environment=environment,
    langfuse_public_key=langfuse_public_key,
    langfuse_secret_key=langfuse_secret_key,
    langfuse_api_url=langfuse_api_url,
    streaming=streaming,
    model_id=agent_model_id,
)
```

### Response Handling
Here we accept the different types of responses from the Agent or API and print the response.


```python
# Handle the response appropriately based on streaming mode
if isinstance(response, dict) and "error" in response:
    print(f"\nError: {response['error']}")
elif streaming and isinstance(response, dict) and "completion" in response:
    print("\n🤖 Agent response (streaming):")
    if "extracted_completion" in response:
        print(response["extracted_completion"])
    else:
        process_streaming_response(response["completion"])
else:
    # Non-streaming response
    print("\n🤖 Agent response:")
    if isinstance(response, dict) and "extracted_completion" in response:
        print(response["extracted_completion"])
    elif (
        isinstance(response, dict) 
        and "completion" in response
        and hasattr(response["completion"], "__iter__")
    ):
        print("Processing completion:")
        full_response = process_streaming_response(response["completion"])
        print(f"\nFull response: {full_response}")
    else:
        print("Raw response:")
        print(f"{response}")
```

## Next Step

Once you instrumented your agent and successfully ingested traces to Langfuse, you can evaluate and improve your agent with Langfuse. [Here is a guide](https://huggingface.co/learn/agents-course/bonus-unit2/what-is-agent-observability-and-evaluation) authored by the Langfuse team that shows this process end to end. 
