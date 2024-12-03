---
description: Learn how to use the Langfuse JS/TS SDK to log any LLM.
category: Integrations
---

# Cookbook: Use the Langfuse JS/TS SDK to log any LLM.

JS/TS applications can either be traces via the [Langfuse SDK](https://langfuse.com/docs/sdk/typescript/guide) by wrapping any LLM model, or by using one of our native integrations such as [OpenAI](https://langfuse.com/docs/integrations/openai/js/get-started), [LangChain](https://langfuse.com/docs/integrations/langchain/example-javascript) or [Vercel AI SDK](https://langfuse.com/docs/integrations/vercel-ai-sdk). In this cookbook, we show you both methods to get you started.

## Step 1: Environment Variables

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
// Creation of a unique trace id.
import { v4 as uuidv4 } from "npm:uuid";

const traceId = uuidv4();
```


```typescript
// Creation of the trace and assignment of metadata
const trace = langfuse.trace({
  id: traceId,
  name: "anthropic-trace",
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

We first create a observation of the type `Generation` which will be assigned to the trace we created earlier. In the second step, we use the Anthropic SDK to call the Clause 3.5 Sonnet model. This step can be replaced with any other LLM SDK.

Lastly, we pass the model output, the mode name and usage metrics to the generation. We can now see this trace in the Langfuse UI.


```typescript
const msg = "Hello, Claude";

// Example generation creation
const generation = trace.generation({
  name: "anthropic-generation01",
  input: msg,
});
 
// Application code
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const chatCompletion = await anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1024,
  messages: [{ role: "user", content: msg }],
});
 

// Example end - sets endTime, optionally pass a body
generation.end({
  output: chatCompletion.content[0].text,
  usage: {
    promptTokens: chatCompletion.usage.input_tokens,
    completionTokens: chatCompletion.usage.output_tokens,
  },
  model: chatCompletion.model,

});

console.log(chatCompletion);

```

    {
      id: "msg_01JaTqrfP1V93nxUKrCRgJo1",
      type: "message",
      role: "assistant",
      model: "claude-3-5-sonnet-20241022",
      content: [
        { type: "text", text: "Hi! I'm Claude. How can I help you today?" }
      ],
      stop_reason: "end_turn",
      stop_sequence: null,
      usage: { input_tokens: 10, output_tokens: 16 }
    }


![Example Trace](/images/docs/js-any-llm-cookbook.png)

Example trace in the Langfuse UI.

## Option 2: Using LangChain

This step shows how to trace Langchain applications using the [Langchain integration](https://langfuse.com/docs/integrations/langchain/example-javascript). Since this is a native integration, the model parameters and outputs are automatically captured.


```typescript
import { CallbackHandler } from "npm:langfuse-langchain"
const langfuseLangchainHandler = new CallbackHandler({
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
 
console.log(res.content)
```

    Why don't bears wear shoes?
    
    Because they have bear feet!


## Option 3: Using OpenAI

This step shows how to trace OpenAI applications using the [OpenAI integration](https://langfuse.com/docs/integrations/openai/js/get-started). Since this is a native integration, the model parameters and outputs are automatically captured.



```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";
 
// Configured via environment variables, see above
const openai = observeOpenAI(new OpenAI());
 
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: "system", content: "Tell me a joke." }],
  max_tokens: 100,
});
 
// notebook only: await events being flushed to Langfuse
await openai.flushAsync();
 
console.log(completion.choices[0]?.message.content);
```

    Why couldn't the bicycle stand up by itself? Because it was two tired!


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
