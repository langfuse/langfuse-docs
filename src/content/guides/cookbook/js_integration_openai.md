---
description: Learn how to use Langfuse for open source observability/tracing of the OpenAI JS SDK by adding `observeOpenAI`.
category: Integrations
---

# Cookbook: OpenAI Integration (JS/TS)

This cookbook provides examples of the Langfuse Integration for OpenAI (JS/TS). Follow the [integration guide](https://langfuse.com/integrations/model-providers/openai-js) to add this integration to your OpenAI project.

## Setup

The integration is compatible with OpenAI SDK versions >=4.0.0.

*Note: This cookbook uses Deno.js, which requires different syntax for importing packages and setting environment variables.*


```typescript
import OpenAI from "npm:openai@^4.0.0";
import { observeOpenAI } from "npm:langfuse@^3.6.0";
```

You can set the secrets either via (1) environment variables or (2) initParams:

### 1. Environment Variables


```typescript
// Set env variables, Deno-specific syntax
Deno.env.set("OPENAI_API_KEY", "");
Deno.env.set("LANGFUSE_PUBLIC_KEY", "");
Deno.env.set("LANGFUSE_SECRET_KEY", "");
Deno.env.set("LANGFUSE_HOST", "https://cloud.langfuse.com") // For US data region, set this to "https://us.cloud.langfuse.com"
```


```typescript
// Initialize OpenAI client with observerOpenAI wrapper
const openai = observeOpenAI(new OpenAI());
```

### 2. InitParams


```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

const openai = observeOpenAI(new OpenAI({apiKey: ""}), 
     {clientInitParams: {
        publicKey: "",
        secretKey: "",
        baseUrl: "https://cloud.langfuse.com", // Your host, defaults to https://cloud.langfuse.com
        // For US data region, set this to "https://us.cloud.langfuse.com"
      }});
```

## Examples

### Chat completion


```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

// Configured via environment variables, see above
const openai = observeOpenAI(new OpenAI());

const completion = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: "system", content: "Tell me a joke." }],
  max_tokens: 100,
});

// notebook only: await events being flushed to Langfuse
await openai.flushAsync();

console.log(completion.choices[0]?.message.content);
```

Public trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/c4d32379-749f-460e-ad88-a95f0820c855

![Langfuse Trace](https://langfuse.com/images/cookbook/js_integration_openai_simple.png)

### Chat completion (streaming)

Simple example using OpenAI streaming, passing custom parameters to rename the generation and add a tag to the trace.


```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

// Initialize OpenAI SDK with Langfuse
const openaiWithLangfuse = observeOpenAI(new OpenAI(), { generationName: "OpenAI Stream Trace", tags: ["stream"]} )

// Call OpenAI
const stream = await openaiWithLangfuse.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: "system", content: "Tell me a joke." }],
  stream: true,
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    console.log(content);
  }

// notebook only: await events being flushed to Langfuse
await openaiWithLangfuse.flushAsync();
```

Public trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/7c7acc02-6129-448b-84d3-5973e0256175

### Add additional metadata and parameters

The trace is a core object in Langfuse, and you can add rich metadata to it. Refer to the JS/TS SDK documentation and the [reference](https://js.reference.langfuse.com/functions/langfuse.observeOpenAI.html) for comprehensive details.

Example usage:

- Assigning a custom name to identify a specific trace type
- Enabling user-level tracking
- Tracking experiments through versions and releases
- Adding custom metadata


```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

// Initialize OpenAI SDK with Langfuse and custom parameters
const openaiWithLangfuse = observeOpenAI(new OpenAI(), {
    generationName: "OpenAI Custom Trace",
    metadata: {env: "dev"},
    sessionId: "session-id",
    userId: "user-id",
    tags: ["custom"],
    version: "0.0.1",
    release: "beta",
})

// Call OpenAI
const completion = await openaiWithLangfuse.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: "system", content: "Tell me a joke." }],
  max_tokens: 100,
});

// notebook only: await events being flushed to Langfuse
await openaiWithLangfuse.flushAsync();
```

Public trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/8c7ac9d0-ae3d-43cd-a69b-ef8ce888fd4a

### Function Calling


```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

// Initialize OpenAI SDK with Langfuse
const openaiWithLangfuse = observeOpenAI(new OpenAI(), { generationName: "OpenAI FunctionCall Trace", tags: ["function"]} )

// Define custom function
async function getWeather(location: string) {
  if (location === "Berlin")
    {return "20degC"}
  else 
    {return "unknown"}
}

// Create function specification required for OpenAI API
const functions = [{
    type: "function",
    function: {
        name: "getWeather",
        description: "Get the current weather in a given location",
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The city, e.g. San Francisco",
                },
            },
            required: ["location"],
        },
    },
}]

// Call OpenAI
const res = await openaiWithLangfuse.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: "What's the weather like in Berlin today"}],
    tool_choice: "auto",
    tools: functions,
})

const tool_call = res.choices[0].message.tool_calls;
if (tool_call[0].function.name === "getWeather") {
    const argsStr = tool_call[0].function.arguments;
    const args = JSON.parse(argsStr); 
    const answer = await getWeather(args["location"]);
    console.log(answer);
}

// notebook only: await events being flushed to Langfuse
await openaiWithLangfuse.flushAsync();
```

Public trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/ef0a2a2c-e9b5-44cf-b984-4b184dc711a7

### Group multiple generations into a single trace

Use the Langfuse JS/TS SDK to create traces or spans and add OpenAI calls to it by passing the trace/span as a `parent` to the `observeOpenAI` wrapper.


```typescript
import Langfuse from "npm:langfuse";
import { observeOpenAI } from "npm:langfuse";
import OpenAI from "npm:openai";


// Init Langfuse SDK
const langfuse = new Langfuse();
 
// Create trace and add params
const trace = langfuse.trace({ name: "capital-poem-generator", tags: ["grouped"]});
 
// Create span
const country = "Germany";
const span = trace.span({ name: country });

// Call OpenAI
const capital = (
  await observeOpenAI(new OpenAI(), {
    parent: span,
    generationName: "get-capital",
  }).chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "What is the capital of the country?" },
      { role: "user", content: country },
    ],
  })
).choices[0].message.content;

const poem = (
  await observeOpenAI(new OpenAI(), {
    parent: span,
    generationName: "generate-poem",
  }).chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a poet. Create a poem about this city.",
      },
      { role: "user", content: capital },
    ],
  })
).choices[0].message.content;

// End span to get span-level latencies
span.end();
 
// notebook only: await events being flushed to Langfuse
await langfuse.flushAsync();
```

Public trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/02e76ecc-b233-4617-bc29-67538ea1a41c

![Langfuse Trace](https://langfuse.com/images/cookbook/js_integration_openai_grouped.png)

### Update trace


```typescript
import Langfuse from "npm:langfuse";
import { observeOpenAI } from "npm:langfuse";
import OpenAI from "npm:openai";

// Init Langfuse SDK
const langfuse = new Langfuse();

// Create trace and add params
const trace = langfuse.trace({ name: "capital-poem-generator" });

// Create span
const span = trace.span({ name: "France" });

const capital = (
  await observeOpenAI(new OpenAI(), {
    parent: span,
    generationName: "get-capital",
  }).chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "What is the capital of the country?" },
      { role: "user", content: "France" },
    ],
  })
).choices[0].message.content;

const poem = (
  await observeOpenAI(new OpenAI(), {
    parent: span,
    generationName: "generate-poem",
  }).chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are a poet. Create a poem about this city.",
      },
      { role: "user", content: capital },
    ],
  })
).choices[0].message.content;

// Update span to get IO on span-level
span.update({input: capital, output: poem});

// End span to get span-level latencies
span.end();

// Update trace
trace.update({
    name:"City poem generator",
    tags: ["updated"],
    metadata: {"env": "development"},
    release: "v0.0.2",
    output: poem,
});

// notebook only: await events being flushed to Langfuse
await langfuse.flushAsync();
```

Public trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/4a40e120-348f-4c22-bf16-453d5486f47a

## Get started

Follow the [integration guide](https://langfuse.com/integrations/model-providers/openai-js) to add this integration to your OpenAI project.
