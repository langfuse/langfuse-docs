---
description: Learn how to use the Langfuse JS/TS SDK to log any LLM.
category: Integrations
---

# Cookbook: Langfuse JS/TS SDK

JS/TS applications can either be traces via the [Langfuse SDK](https://langfuse.com/docs/sdk/typescript/guide) by wrapping any LLM model, or by using one of our native integrations such as [OpenAI](https://langfuse.com/docs/integrations/openai/js/get-started), [LangChain](https://langfuse.com/docs/integrations/langchain/example-javascript) or [Vercel AI SDK](https://langfuse.com/docs/integrations/vercel-ai-sdk). In this cookbook, we show you both methods to get you started.

For this guide, we assume, that you are already familiar with the Langfuse data model (traces, spans, generations, etc.). If not, have a look [here](https://langfuse.com/docs/tracing#introduction-to-observability--traces-in-langfuse). 

## Step 1: Setup

*Note: This cookbook uses Deno.js, which requires different syntax for importing packages and setting environment variables.*

Set your Langfuse API keys, the Langfuse host name and keys for the used LLM providers.


```typescript
// Set env variables, Deno-specific syntax
Deno.env.set("OPENAI_API_KEY", "sk-...");

Deno.env.set("ANTHROPIC_API_KEY", "sk-...");

Deno.env.set("LANGFUSE_SECRET_KEY", "sk-...");
Deno.env.set("LANGFUSE_PUBLIC_KEY", "pk-...");
Deno.env.set("LANGFUSE_HOST", "https://cloud.langfuse.com") // For US data region, set this to "https://us.cloud.langfuse.com"
```

Initialize the Langfuse client.


```typescript
import Langfuse from "npm:langfuse";

// Init Langfuse SDK
const langfuse = new Langfuse();
```

## Step 2: Create a Trace

Langfuse observability is structured around [traces](https://langfuse.com/docs/tracing#introduction-to-observability--traces-in-langfuse). Each trace can contain multiple observations to log the individual steps of the execution. Observation can be `Events`, the basic building blocks which are used to track discrete events in a trace, `Spans`, representing durations of units of work in a trace,  or `Generations`, used to log model calls. 

To log an LLM call, we will first create a trace. In this step, we can also assign the trace metadata such as the a user id or tags.



```typescript
// Creation of a unique trace id. It is optional, but this makes it easier for us to score the trace (add user feedback, etc.) afterwards. 
import { v4 as uuidv4 } from "npm:uuid";

const traceId = uuidv4();
```


```typescript
// Creation of the trace and assignment of metadata
const trace = langfuse.trace({
  id: traceId,
  name: "JS-SDK-Trace",
  userId: "user_123456789",
  metadata: { user: "user@langfuse.com" },
  tags: ["production"],
});
 
// Example update, same params as create, cannot change id
trace.update({
  metadata: {
    tag: "long-running",
  },
});
```

## Option 1: Log Any LLM

This part shows how to log an LLM call by passing the model in and outputs via the [Langfuse SDK](https://langfuse.com/docs/sdk/typescript/guide).

We first create an observation of the type `Span` to which we assign the `Generation` observation. This setp is optional but lets us structure the trace.

We then create a observation of the type `Generation` which will be assigned to the `Span` we created earlier. In the second step, we use the Anthropic SDK to call the Clause 3.5 Sonnet model. This step can be replaced with any other LLM SDK.

Lastly, we pass the model output, the mode name and usage metrics to the `Generation`. We can now see this trace in the Langfuse UI.


```typescript
const msg = "Hello, Claude";

// Create span
const span_name = "Anthropic-Span";
const span = trace.span({ name: span_name });

// Example generation creation
const generation = span.generation({
  name: "anthropic-generation01",
  model: "claude-3-5-sonnet-20241022",
  input: msg,
});
 
// Application code
import Anthropic from "npm:@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

const chatCompletion = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: msg }],
});
 

// Example end - sets endTime, optionally pass a body
generation.end({
  output: chatCompletion.content[0].text,
  usage: {
    input: chatCompletion.usage.input_tokens,
    output: chatCompletion.usage.output_tokens,
  },
});

// End span to get span-level latencies
span.end();

console.log(chatCompletion.content[0].text);

```

    Hello! How can I help you today?


## Option 2: Using LangChain

This step shows how to trace Langchain applications using the [Langchain integration](https://langfuse.com/docs/integrations/langchain/example-javascript). Since this is a native integration, the model parameters and outputs are automatically captured. We create a new span in our trace and assign the Langchain generation to it by passing `root: span` in the `CallbackHandler`.


```typescript
// Create span
const span_name = "Langchain-Span";
const span = trace.span({ name: span_name });

import { CallbackHandler } from "npm:langfuse-langchain"
const langfuseLangchainHandler = new CallbackHandler({
    root: span,
    publicKey: Deno.env.get("LANGFUSE_PUBLIC_KEY"),
    secretKey: Deno.env.get("LANGFUSE_SECRET_KEY"),
    baseUrl: Deno.env.get("LANGFUSE_HOST"),
    flushAt: 1 // cookbook-only: do not batch events, send them immediately
})

import { ChatOpenAI } from "npm:@langchain/openai"
import { PromptTemplate } from "npm:@langchain/core/prompts"
 
const model = new ChatOpenAI({});
const promptTemplate = PromptTemplate.fromTemplate(
  "Tell me a joke about {topic}"
);

import { RunnableSequence } from "npm:@langchain/core/runnables";
 
const chain = RunnableSequence.from([promptTemplate, model]);
 
const res = await chain.invoke(
    { topic: "bears" },
    { callbacks: [langfuseLangchainHandler] }
);

// End span to get span-level latencies
span.end();
 
console.log(res.content)
```

    Why did the bear break up with his girlfriend?
    
    Because she was too grizzly for him!


## Option 3: Using OpenAI

This step shows how to trace OpenAI applications using the [OpenAI integration](https://langfuse.com/docs/integrations/openai/js/get-started). Since this is a native integration, the model parameters and outputs are automatically captured. To add the OpenAI generation to our trace as well, we first create a span and then pass `parent: span` in the `observeOpenAI` function.



```typescript
// Initialize SDKs
const openai = new OpenAI();
 
// Create span
const span_name = "OpenAI-Span";
const span = trace.span({ name: span_name });
 
// Call OpenAI
const joke = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "OpenAI-Generation",
  }).chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "Tell me a joke." },
    ],
  })
).choices[0].message.content;
 
// End span to get span-level latencies
span.end();
 
// Flush the Langfuse client belonging to the parent span
await langfuse.flushAsync();
```

## Step 3: Score the Trace (Optional)

After logging the trace, we can add [scores](https://langfuse.com/docs/scores/custom) to it. This can help in evaluating the quality of the interaction. Scores can be any metric that is important to your application. In this example, we are scoring the trace based on user feedback.

Since the scoring usually happens after the generation is complete, we use our unique trace id to score the trace.


```typescript
langfuse.score({
  id: traceId,
  name: "user-feedback",
  value: 3,
  comment: "This was a good interaction",
});
```

## Step 4: View the Trace in Langfuse

![Example trace with the three generations](https://static.langfuse.com/cookbooks/js-sdk-example/js-sdk-example.gif)

[Example trace in the Langfuse UI](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/8d580443-519e-4713-9859-eff4a7193f87?timestamp=2024-12-03T17%3A45%3A16.787Z&observation=26ff69ed-8ba8-4bfe-9029-14a179828044&display=details).
