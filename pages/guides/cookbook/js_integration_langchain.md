---
description: Cookbook with examples of the Langfuse Integration for Langchain (JS/TS).
category: Integrations
---

# Cookbook: Langchain Integration (JS/TS)

This is a cookbook with examples of the Langfuse Integration for Langchain (JS/TS).

Follow the [integration guide](https://langfuse.com/docs/integrations/langchain) to add this integration to your Langchain project. The integration also supports Langchain Python.

## Setup

Initialize the Langfuse client with your API keys from the project settings in the Langfuse UI and add them to your environment.


```typescript
import { CallbackHandler } from "npm:langfuse-langchain"
const langfuseLangchainHandler = new CallbackHandler({
    publicKey: "",
    secretKey: "",
    baseUrl: "https://cloud.langfuse.com",
    flushAt: 1 // cookbook-only: do not batch events, send them immediately
})
```

## Langchain interfaces

Langfuse supports the following Langchain JS interfaces

- invoke
- stream

For this section we will use a very simple example prompt (from Langchain JS [docs](https://js.langchain.com/docs/expression_language/interface)) and ChatOpenAI. Langfuse works with any model.


```typescript
import { ChatOpenAI } from "npm:@langchain/openai"
import { PromptTemplate } from "npm:@langchain/core/prompts"

const model = new ChatOpenAI({});
const promptTemplate = PromptTemplate.fromTemplate(
  "Tell me a joke about {topic}"
);
```

### `invoke`


```typescript
import { RunnableSequence } from "npm:@langchain/core/runnables";

const chain = RunnableSequence.from([promptTemplate, model]);

const res = await chain.invoke(
    { topic: "bears" },
    { callbacks: [langfuseLangchainHandler] }
);

console.log(res.content)
```

    Why did the bear wear a fur coat to the BBQ?
    Because it was grizzly cold outside!


### `stream`


```typescript
const chain = promptTemplate.pipe(model);
const stream = await chain.stream(
    { topic: "bears" },
    { callbacks: [langfuseLangchainHandler] }
);
for await (const chunk of stream) {
  console.log(chunk?.content);
}
```

    
    Why
     did
     the
     bear
     bring
     a
     flashlight
     to
     the
     party
    ?
     
    
    
    Because
     he
     wanted
     to
     be
     the
     "
    bear
    "
     of
     the
     light
    !
    


## Explore the trace in Langfuse

In the Langfuse interface, you can see a detailed trace of all steps in the Langchain application.

![Langfuse Trace](https://langfuse.com/images/cookbook/js_integration_langchain_trace.png)
