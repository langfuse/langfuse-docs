# Cookbook: OpenAI Integration (JS/TS)

This is a cookbook with examples of the Langfuse Integration for OpenAI (JS/TS).

Follow the [integration guide](https://langfuse.com/docs/integrations/openai/js/get-started) to add this integration to your OpenAI project.

*Note: We are using Deno.js in this cookbook requiring different synthax for importing packages and setting env variables.*

## Setup

The integration is compatible with OpenAI SDK versions >=4.0.0.

### Environment Variables


```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

// Set env variables
Deno.env.set("OPENAI_API_KEY", "");
Deno.env.set("LANGFUSE_PUBLIC_KEY", "");
Deno.env.set("LANGFUSE_SECRET_KEY", "");
Deno.env.set("LANGFUSE_HOST", "https://cloud.langfuse.com") // Your host, defaults to https://cloud.langfuse.com
// For US data region, set this to "https://us.cloud.langfuse.com"

// Initialize OpenAI client with observerOpenAI wrapper
const openai = observeOpenAI(new OpenAI());
```

### Directly passed variables


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
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: "system", content: "Tell me a joke." }],
  max_tokens: 100,
});

console.log(completion.choices[0]?.message.content);

await openai.flushAsync();
```

### Chat completion (streaming)

Simple example using the OpenAI streaming functionality.


```typescript
// Initialize OpenAI SDK with Langfuse
const openaiWithLangfuse = observeOpenAI(new OpenAI(), { generationName: "OpenAI Stream Trace", tags: ["stream"]} )

// Call OpenAI
const stream = await openaiWithLangfuse.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: "system", content: "Tell me a joke." }],
  stream: true,
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    console.log(content);
  }
// Flush the client
await openaiWithLangfuse.flushAsync();
```

### Fully featured: Interoperability with Langfuse SDK

The trace is a core object in Langfuse and you can add rich metadata to it. See JS/TS SDK docs for full documentation on this.

Some of the functionality enabled by custom traces:

- custom name to identify a specific trace-type
- user-level tracking
- experiment tracking via versions and releases
- custom metadata


```typescript
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
  model: 'gpt-3.5-turbo',
  messages: [{ role: "system", content: "Tell me a joke." }],
  max_tokens: 100,
});

// Flush the client
await openaiWithLangfuse.flushAsync();
```

### Function Calling


```typescript
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
    model: 'gpt-3.5-turbo',
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

await openaiWithLangfuse.flushAsync();
```

### Group multiple generations into a single trace
Use the Langfuse JS/TS SDK to create traces or spans manually and add OpenAI calls to it.


```typescript
import Langfuse from "npm:langfuse";

// Init Langfuse SDK
const langfuse = new Langfuse();
 
// Create trace and add params
const trace = langfuse.trace({ name: "capital-poem-generator", tags: ["grouped"]});
 
// Create span
const country = "Germany";
const span = trace.span({ name: country });

// Call OpenAI
const capital = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "get-capital",
  }).chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "What is the capital of the country?" },
      { role: "user", content: country },
    ],
  })
).choices[0].message.content;

const poem = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "generate-poem",
  }).chat.completions.create({
    model: "gpt-3.5-turbo",
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
 
// Flush the Langfuse client belonging to the parent span
await langfuse.flushAsync();
```

### Update trace


```typescript
// Create trace and add params
const trace = langfuse.trace({ name: "capital-poem-generator" });

// Create span
const span = trace.span({ name: "France" });

const capital = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "get-capital",
  }).chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "What is the capital of the country?" },
      { role: "user", content: "France" },
    ],
  })
).choices[0].message.content;

const poem = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "generate-poem",
  }).chat.completions.create({
    model: "gpt-3.5-turbo",
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
    release: "v0.0.2"
});

// Flush the Langfuse client belonging to the parent span
await langfuse.flushAsync();
```
