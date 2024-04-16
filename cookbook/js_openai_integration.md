```typescript
import OpenAI from "npm:openai";
import { observeOpenAI } from "npm:langfuse";

Deno.env.set("OPENAI_API_KEY", "");
Deno.env.set("LANGFUSE_PUBLIC_KEY", "");
Deno.env.set("LANGFUSE_SECRET_KEY", "");


const openai = observeOpenAI(new OpenAI(), { generationName: "OpenAI.Chat.Trace", tags: ["simple"]} );

// simple

const res = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: "system", content: "Tell me a bad joke." }],
  max_tokens: 100,
});

console.log(res.choices[0]?.message.content);

// grouping into single trace

// update trace

```

    Why couldn't the bicycle stand up by itself? Because it was two-tired!



```typescript
// streaming

const openaiWithLangfuse = observeOpenAI(new OpenAI(), { generationName: "OpenAI.Stream.Trace", tags: ["stream"]} )
const stream = await openaiWithLangfuse.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [{ role: "system", content: "Tell me a funny joke." }],
  stream: true,
});

for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    console.log(content);
  }

await openaiWithLangfuse.flushAsync();
```

    
    Why
     did
     the
     scare
    crow
     win
     an
     award
    ?
    
    
    Because
     he
     was
     outstanding
     in
     his
     field
    !
    





    [
      {
        id: [32m"da606dbe-e421-444c-882d-bf60346bc388"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:38:43.543Z"[39m,
        body: {
          id: [32m"73d17fbd-b4f5-4a14-84c0-8fd34ca7d6ad"[39m,
          release: [90mundefined[39m,
          generationName: [32m"OpenAI.Chat.Trace"[39m,
          tags: [ [32m"simple"[39m ],
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [33m100[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"OpenAI.Chat.Trace"[39m,
          startTime: [35m2024-04-16T16:38:43.543Z[39m,
          timestamp: [35m2024-04-16T16:38:43.543Z[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"598ed629-6a84-4c76-8b32-95863706b342"[39m,
        type: [32m"generation-create"[39m,
        timestamp: [32m"2024-04-16T16:38:44.284Z"[39m,
        body: {
          id: [32m"0474f6e7-86db-426e-906f-0ece8933f4a3"[39m,
          startTime: [35m2024-04-16T16:38:43.543Z[39m,
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [33m100[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"OpenAI.Chat.Trace"[39m,
          output: {
            role: [32m"assistant"[39m,
            content: [32m"Why couldn't the bicycle stand up by itself? Because it was two-tired!"[39m
          },
          endTime: [35m2024-04-16T16:38:44.283Z[39m,
          usage: { promptTokens: [33m13[39m, completionTokens: [33m17[39m, totalTokens: [33m30[39m },
          traceId: [32m"73d17fbd-b4f5-4a14-84c0-8fd34ca7d6ad"[39m,
          parentObservationId: [1mnull[22m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"913c54ad-7159-41bb-8c8e-100db05f0bf2"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:38:44.284Z"[39m,
        body: {
          id: [32m"73d17fbd-b4f5-4a14-84c0-8fd34ca7d6ad"[39m,
          release: [90mundefined[39m,
          output: {
            role: [32m"assistant"[39m,
            content: [32m"Why couldn't the bicycle stand up by itself? Because it was two-tired!"[39m
          }
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"e2abffd0-84be-4657-bb40-3dff6d359645"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:38:44.297Z"[39m,
        body: {
          id: [32m"adbc3808-cd87-45a3-a8f4-f8df3e043ec7"[39m,
          release: [90mundefined[39m,
          generationName: [32m"OpenAI.Stream.Trace"[39m,
          tags: [ [32m"stream"[39m ],
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [33mtrue[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"OpenAI.Stream.Trace"[39m,
          startTime: [35m2024-04-16T16:38:44.297Z[39m,
          timestamp: [35m2024-04-16T16:38:44.297Z[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"c6efa1aa-550e-40ad-bc20-3fe847e726fe"[39m,
        type: [32m"generation-create"[39m,
        timestamp: [32m"2024-04-16T16:38:44.808Z"[39m,
        body: {
          id: [32m"54b076cd-d4a9-4954-b547-42cd2d0cf3e0"[39m,
          startTime: [35m2024-04-16T16:38:44.297Z[39m,
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [33mtrue[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"OpenAI.Stream.Trace"[39m,
          output: [32m"Why did the scarecrow win an award?\n"[39m +
            [32m"\n"[39m +
            [32m"Because he was outstanding in his field!"[39m,
          endTime: [35m2024-04-16T16:38:44.808Z[39m,
          completionStartTime: [35m2024-04-16T16:38:44.609Z[39m,
          traceId: [32m"adbc3808-cd87-45a3-a8f4-f8df3e043ec7"[39m,
          parentObservationId: [1mnull[22m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"662b9b85-46cd-48c6-9dfe-40b4000b6938"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:38:44.809Z"[39m,
        body: {
          id: [32m"adbc3808-cd87-45a3-a8f4-f8df3e043ec7"[39m,
          release: [90mundefined[39m,
          output: [32m"Why did the scarecrow win an award?\n"[39m +
            [32m"\n"[39m +
            [32m"Because he was outstanding in his field!"[39m
        },
        metadata: [90mundefined[39m
      }
    ]




```typescript
// function calling

const openaiWithLangfuse = observeOpenAI(new OpenAI(), { generationName: "OpenAI.Function.Trace", tags: ["function"]} )

async function getWeather(location: string) {
  if (location === "Berlin") {return "20degC"} else {return "unknown"}
}

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

// Main function to execute the OpenAI chat completions and auxiliary functions
async function main() {
      const messages =  [{
              role: 'user',
              content:
                "What's the weather like in Berlin today",
            },
          ]
      const res = await openaiWithLangfuse.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: messages,
          tool_choice: "auto",
          tools: functions,
        })
        const content = res.choices[0].message.content;
        const tool_call = res.choices[0].message.tool_calls;
        if (tool_call[0].function.name === "getWeather") {
            const argsStr = tool_call[0].function.arguments;
            const args = JSON.parse(argsStr); 
            const answer = await getWeather(args["location"]);
        }
}

main();
await openaiWithLangfuse.flushAsync();
```




    [
      {
        id: [32m"c36ae10d-1bea-4a13-9d02-a07b644a42bb"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:38:45.282Z"[39m,
        body: {
          id: [32m"88ecc5ea-43c9-48c6-8fc5-11273596d652"[39m,
          release: [90mundefined[39m,
          generationName: [32m"OpenAI.Function.Trace"[39m,
          tags: [ [32m"function"[39m ],
          model: [32m"gpt-3.5-turbo"[39m,
          input: {
            messages: [ [36m[Object][39m ],
            tools: [ [36m[Object][39m ],
            tool_choice: [32m"auto"[39m
          },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"OpenAI.Function.Trace"[39m,
          startTime: [35m2024-04-16T16:38:45.282Z[39m,
          timestamp: [35m2024-04-16T16:38:45.282Z[39m
        },
        metadata: [90mundefined[39m
      }
    ]




```typescript
// grouped
import Langfuse from "npm:langfuse";


const langfuse = new Langfuse();
const openai = new OpenAI();
 
// Create trace and add params
const trace = langfuse.trace({ name: "capital-poem-generator" });
 
// Create span
const country = "Germany";
const span = trace.span({ name: country });

const capital = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "get-capital",
    tag: ["grouped"],
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

span.end();
 
// Flush the Langfuse client belonging to the parent span
await langfuse.flushAsync();
```




    [
      {
        id: [32m"09de8052-6fe2-4ad8-afea-bc49a968fe6e"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:38:45.464Z"[39m,
        body: {
          id: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
          release: [90mundefined[39m,
          name: [32m"capital-poem-generator"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"b4deb7e1-92ac-4f98-bc84-26b5e4ab2058"[39m,
        type: [32m"span-create"[39m,
        timestamp: [32m"2024-04-16T16:38:45.465Z"[39m,
        body: {
          id: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m,
          startTime: [35m2024-04-16T16:38:45.465Z[39m,
          name: [32m"Germany"[39m,
          traceId: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
          parentObservationId: [1mnull[22m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"0e5bd7fb-e794-428b-9a30-87f96e340caa"[39m,
        type: [32m"generation-create"[39m,
        timestamp: [32m"2024-04-16T16:38:45.937Z"[39m,
        body: {
          id: [32m"5656aeb5-9a1b-4c9f-bc56-ee2115abc855"[39m,
          startTime: [35m2024-04-16T16:38:45.465Z[39m,
          parent: LangfuseSpanClient {
            client: Langfuse {
              debugMode: [33mfalse[39m,
              pendingPromises: {},
              _events: [36m[SimpleEventEmitter][39m,
              publicKey: [32m"pk-lf-bbac702c-5fab-4660-b0eb-d326045051da"[39m,
              secretKey: [32m"sk-lf-b115b6b1-d0c6-49f7-ad0a-28b545a53c91"[39m,
              baseUrl: [32m"https://cloud.langfuse.com"[39m,
              flushAt: [33m15[39m,
              flushInterval: [33m10000[39m,
              release: [90mundefined[39m,
              _retryOptions: [36m[Object][39m,
              requestTimeout: [33m10000[39m,
              sdkIntegration: [32m"DEFAULT"[39m,
              _promptCache: [36m[LangfusePromptCache][39m,
              _storageKey: [32m"lf_pk-lf-bbac702c-5fab-4660-b0eb-d326045051da_langfuse"[39m,
              _storage: [36m[Object][39m,
              _storageCache: [36m[Object][39m,
              _flushTimer: [1mnull[22m
            },
            id: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m,
            traceId: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
            observationId: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m
          },
          generationName: [32m"get-capital"[39m,
          tag: [ [32m"grouped"[39m ],
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m, [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"get-capital"[39m,
          output: {
            role: [32m"assistant"[39m,
            content: [32m"The capital of Germany is Berlin."[39m
          },
          endTime: [35m2024-04-16T16:38:45.937Z[39m,
          usage: { promptTokens: [33m20[39m, completionTokens: [33m7[39m, totalTokens: [33m27[39m },
          traceId: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
          parentObservationId: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"b6a5228f-d281-4d1d-af8f-edcee0ae3da2"[39m,
        type: [32m"generation-create"[39m,
        timestamp: [32m"2024-04-16T16:38:48.380Z"[39m,
        body: {
          id: [32m"648d3210-9bc8-4036-90b9-e965940f24bc"[39m,
          startTime: [35m2024-04-16T16:38:45.938Z[39m,
          parent: LangfuseSpanClient {
            client: Langfuse {
              debugMode: [33mfalse[39m,
              pendingPromises: {},
              _events: [36m[SimpleEventEmitter][39m,
              publicKey: [32m"pk-lf-bbac702c-5fab-4660-b0eb-d326045051da"[39m,
              secretKey: [32m"sk-lf-b115b6b1-d0c6-49f7-ad0a-28b545a53c91"[39m,
              baseUrl: [32m"https://cloud.langfuse.com"[39m,
              flushAt: [33m15[39m,
              flushInterval: [33m10000[39m,
              release: [90mundefined[39m,
              _retryOptions: [36m[Object][39m,
              requestTimeout: [33m10000[39m,
              sdkIntegration: [32m"DEFAULT"[39m,
              _promptCache: [36m[LangfusePromptCache][39m,
              _storageKey: [32m"lf_pk-lf-bbac702c-5fab-4660-b0eb-d326045051da_langfuse"[39m,
              _storage: [36m[Object][39m,
              _storageCache: [36m[Object][39m,
              _flushTimer: [1mnull[22m
            },
            id: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m,
            traceId: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
            observationId: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m
          },
          generationName: [32m"generate-poem"[39m,
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m, [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"generate-poem"[39m,
          output: {
            role: [32m"assistant"[39m,
            content: [32m"In Berlin's heart beats history untold,\n"[39m +
              [32m"Where tales of power and struggle unfold.\n"[39m +
              [32m"A city scarred by "[39m... 541 more characters
          },
          endTime: [35m2024-04-16T16:38:48.380Z[39m,
          usage: { promptTokens: [33m30[39m, completionTokens: [33m143[39m, totalTokens: [33m173[39m },
          traceId: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
          parentObservationId: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"b0364b02-fa1e-48a9-b5db-9b9d5718803f"[39m,
        type: [32m"span-update"[39m,
        timestamp: [32m"2024-04-16T16:38:48.380Z"[39m,
        body: {
          id: [32m"581aa84d-0ee3-47b4-b78d-6fecabd7206c"[39m,
          traceId: [32m"df08c671-d694-4345-ad5c-1b74316127e6"[39m,
          endTime: [35m2024-04-16T16:38:48.380Z[39m
        },
        metadata: [90mundefined[39m
      }
    ]




```typescript
// Update trace example

const trace = langfuse.trace({ name: "capital-poem-generator" });

const span = trace.span({ name: "France" });

const capital = (
  await observeOpenAI(openai, {
    parent: span,
    generationName: "get-capital",
    tag: ["update"],
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
    tag: ["update"],
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

span.update({input: capital, output: poem});
span.end();

trace.update({name:"City poem generator", tags: ["updated"], metadata: {"env": "development"}, release: "v0.0.21"});

await langfuse.flushAsync();
```




    [
      {
        id: [32m"780f3812-5595-4508-b667-653a2bb70dbe"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:42:25.612Z"[39m,
        body: {
          id: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
          release: [90mundefined[39m,
          name: [32m"capital-poem-generator"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"eb715898-fe3e-4813-868d-ff14a0844bc1"[39m,
        type: [32m"span-create"[39m,
        timestamp: [32m"2024-04-16T16:42:25.613Z"[39m,
        body: {
          id: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m,
          startTime: [35m2024-04-16T16:42:25.613Z[39m,
          name: [32m"France"[39m,
          traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
          parentObservationId: [1mnull[22m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"f2b7d771-c218-46e4-809d-a26c5787d346"[39m,
        type: [32m"generation-create"[39m,
        timestamp: [32m"2024-04-16T16:42:26.267Z"[39m,
        body: {
          id: [32m"68e2bf2a-4126-4cf4-bd80-1fbe05944137"[39m,
          startTime: [35m2024-04-16T16:42:25.613Z[39m,
          parent: LangfuseSpanClient {
            client: Langfuse {
              debugMode: [33mfalse[39m,
              pendingPromises: {},
              _events: [36m[SimpleEventEmitter][39m,
              publicKey: [32m"pk-lf-bbac702c-5fab-4660-b0eb-d326045051da"[39m,
              secretKey: [32m"sk-lf-b115b6b1-d0c6-49f7-ad0a-28b545a53c91"[39m,
              baseUrl: [32m"https://cloud.langfuse.com"[39m,
              flushAt: [33m15[39m,
              flushInterval: [33m10000[39m,
              release: [90mundefined[39m,
              _retryOptions: [36m[Object][39m,
              requestTimeout: [33m10000[39m,
              sdkIntegration: [32m"DEFAULT"[39m,
              _promptCache: [36m[LangfusePromptCache][39m,
              _storageKey: [32m"lf_pk-lf-bbac702c-5fab-4660-b0eb-d326045051da_langfuse"[39m,
              _storage: [36m[Object][39m,
              _storageCache: [36m[Object][39m,
              _flushTimer: [1mnull[22m
            },
            id: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m,
            traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
            observationId: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m
          },
          generationName: [32m"get-capital"[39m,
          tag: [ [32m"update"[39m ],
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m, [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"get-capital"[39m,
          output: { role: [32m"assistant"[39m, content: [32m"The capital of France is Paris."[39m },
          endTime: [35m2024-04-16T16:42:26.266Z[39m,
          usage: { promptTokens: [33m20[39m, completionTokens: [33m7[39m, totalTokens: [33m27[39m },
          traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
          parentObservationId: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"b7f640a9-e356-4932-8b4b-80f17034fc94"[39m,
        type: [32m"generation-create"[39m,
        timestamp: [32m"2024-04-16T16:42:29.130Z"[39m,
        body: {
          id: [32m"fa21f0bf-d4b7-4390-9442-4340a2171ee8"[39m,
          startTime: [35m2024-04-16T16:42:26.267Z[39m,
          parent: LangfuseSpanClient {
            client: Langfuse {
              debugMode: [33mfalse[39m,
              pendingPromises: {},
              _events: [36m[SimpleEventEmitter][39m,
              publicKey: [32m"pk-lf-bbac702c-5fab-4660-b0eb-d326045051da"[39m,
              secretKey: [32m"sk-lf-b115b6b1-d0c6-49f7-ad0a-28b545a53c91"[39m,
              baseUrl: [32m"https://cloud.langfuse.com"[39m,
              flushAt: [33m15[39m,
              flushInterval: [33m10000[39m,
              release: [90mundefined[39m,
              _retryOptions: [36m[Object][39m,
              requestTimeout: [33m10000[39m,
              sdkIntegration: [32m"DEFAULT"[39m,
              _promptCache: [36m[LangfusePromptCache][39m,
              _storageKey: [32m"lf_pk-lf-bbac702c-5fab-4660-b0eb-d326045051da_langfuse"[39m,
              _storage: [36m[Object][39m,
              _storageCache: [36m[Object][39m,
              _flushTimer: [1mnull[22m
            },
            id: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m,
            traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
            observationId: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m
          },
          generationName: [32m"generate-poem"[39m,
          tag: [ [32m"update"[39m ],
          model: [32m"gpt-3.5-turbo"[39m,
          input: { messages: [ [36m[Object][39m, [36m[Object][39m ] },
          modelParameters: {
            frequency_penalty: [90mundefined[39m,
            logit_bias: [90mundefined[39m,
            logprobs: [90mundefined[39m,
            max_tokens: [90mundefined[39m,
            n: [90mundefined[39m,
            presence_penalty: [90mundefined[39m,
            seed: [90mundefined[39m,
            stop: [90mundefined[39m,
            stream: [90mundefined[39m,
            temperature: [90mundefined[39m,
            top_p: [90mundefined[39m,
            user: [90mundefined[39m,
            response_format: [90mundefined[39m,
            top_logprobs: [90mundefined[39m
          },
          name: [32m"generate-poem"[39m,
          output: {
            role: [32m"assistant"[39m,
            content: [32m"In the heart of France, a city so grand,\n"[39m +
              [32m"Stands lovely Paris, a sight so grand.\n"[39m +
              [32m"Bustling streets and"[39m... 476 more characters
          },
          endTime: [35m2024-04-16T16:42:29.130Z[39m,
          usage: { promptTokens: [33m30[39m, completionTokens: [33m136[39m, totalTokens: [33m166[39m },
          traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
          parentObservationId: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"e9652784-adb0-460d-a967-5060d96bf5ee"[39m,
        type: [32m"span-update"[39m,
        timestamp: [32m"2024-04-16T16:42:29.131Z"[39m,
        body: {
          input: [32m"The capital of France is Paris."[39m,
          output: [32m"In the heart of France, a city so grand,\n"[39m +
            [32m"Stands lovely Paris, a sight so grand.\n"[39m +
            [32m"Bustling streets and"[39m... 476 more characters,
          id: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m,
          traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"45a42d8c-bb9d-4831-b446-a900ec48b433"[39m,
        type: [32m"span-update"[39m,
        timestamp: [32m"2024-04-16T16:42:29.131Z"[39m,
        body: {
          id: [32m"7c885f0b-76f1-45c8-9c53-38d09751c9ae"[39m,
          traceId: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
          endTime: [35m2024-04-16T16:42:29.131Z[39m
        },
        metadata: [90mundefined[39m
      },
      {
        id: [32m"b7334fcf-6e77-4bb8-9d94-f4723094604d"[39m,
        type: [32m"trace-create"[39m,
        timestamp: [32m"2024-04-16T16:42:29.131Z"[39m,
        body: {
          id: [32m"97e90fab-94d5-4f50-b8ca-f4b63018d4eb"[39m,
          release: [32m"v0.0.21"[39m,
          name: [32m"City poem generator"[39m,
          tags: [ [32m"updated"[39m ],
          metadata: { env: [32m"development"[39m }
        },
        metadata: [90mundefined[39m
      }
    ]




```typescript

```
