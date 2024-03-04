# Cookbook: Vercel AI (JS/TS)

This is a cookbook with an end-to-end example on how to use Langfuse within the Vercel AI framework (JS/TS).

## Setup

Initialize Langfuse with your API keys from the project settings in the Langfuse UI and add them to your environment. As we will use OpenAI LLMs for this example, we also want to configure an OpenAI client.


```typescript
import { Langfuse } from "npm:langfuse"
import { Configuration, OpenAIApi } from "npm:openai-edge";

const langfuse = new Langfuse({
  publicKey: "",
  secretKey: "",
  baseUrl: "https://cloud.langfuse.com",
});

const openAIconfig = new Configuration({
  apiKey: "",
});
const openai = new OpenAIApi(openAIconfig);
```

## Vercel AI

**Vercel AI:**
Vercel is a cloud platform for frontend development that offers global deployment, streamlined scaling, and enhanced security for building and delivering fast, personalized web experiences.

**Our Example:**
In our example, we will use `OpenAIStream` to efficiently process and stream responses from OpenAI's models, and `StreamingTextResponse` to seamlessly deliver these AI-generated responses as HTTP streams to users, simulating the real-time interaction capabilities of a Vercel-hosted application.


```typescript
import { OpenAIStream, StreamingTextResponse } from "npm:ai";

// edge rutime to use caching and execute in closest data center
export const runtime = 'edge';
```


```typescript
/**
 * Example application simulating a QA chat bot using Langfuse and Vercel AI framework. 
 * 
 * Creates trace, retrieves a pre-saved prompt template, generates answer, and scores generation.
 * Utilizes OpenAI API for chat completion.
 *
 * @param {Request} req - The request object, containing session information, user ID, and messages.
 * @param {Response} res - The response object used to send back the processed data.
 * @returns {StreamingTextResponse} - A streamed response containing the output of the OpenAI model.
 */
export default async function handler(req: Request, res: Response) {
    // initialize Langfuse 
    const trace = langfuse.trace({
        name: "QA",
        sessionId: req.sessionId,
        userId: req.userId,
    });
    
    // Format incoming messages for OpenAI API
    const messages = req.messages
    const openAiMessages = messages.map(({ content, role }) => ({
        content,
        role: role,
    }));
    
    // get last message
    const sanitizedQuery = messages[messages.length - 1].content.trim();

    trace.update({
        input: sanitizedQuery,
    });
    
    const promptName = req.promptName
    
    const promptSpan = trace.span({
        name: "fetch-prompt-from-langfuse",
        input: {
            promptName,
        },
    });
    
    // retrieve Langfuse prompt template with promptName
    const prompt = await langfuse.getPrompt(promptName);
    
    const promptTemplate = prompt.prompt
  
    promptSpan.end({
        output: { 
            promptTemplate,
        },
    });
    
    // merge prompt template and user input
    const assembledMessages = [
        {
            role: "system",
            content: promptTemplate,
        },
        ...openAiMessages,
    ];
      
    const generation = trace.generation({
        name: "generation",
        input: assembledMessages as any,
        model: "gpt-3.5-turbo",
        prompt,
    });

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: assembledMessages,
    });
    
    // Stream the response from OpenAI
    const stream = OpenAIStream(response, {
        onStart: () => {
            generation.update({
                completionStartTime: new Date(),
            });
        },
        onCompletion: async (completion) => {
            generation.end({
                output: completion,
                level: completion.includes("I don't know how to help with that")
                    ? "WARNING"
                    : "DEFAULT",
                statusMessage: completion.includes("I don't know how to help with that")
                    ? "Refused to answer"
                    : undefined,
            });
            if (!completion.includes("I don't know how to help with that")) {
                generation.score({
                    name: "quality",
                    value: 1,
                    comment: "Factually correct",
                });
            }
        trace.update({
            output: completion,
        });
        await langfuse.shutdownAsync(); // flush Langfuse
        },
    });

    return new StreamingTextResponse(stream, {
        headers: {
            "X-Trace-Id": trace.id,
        },
    });
}
```


```typescript
// sample request to test handler function
const mockRequest = {
    "sessionId": "testSession",
    "userId": "testUser",
    "promptName": "qa-prompt",
    "messages": [
        {
            "role": "user",
            "content": "What is love?"
        },
    ]
}
```


```typescript
const response = await handler(mockRequest);
const data = await response.text();
console.log(data);
```


    Stack trace:

    Error: Response error: {

        "error": {

            "message": "Incorrect API key provided: sk-LL0Cz***************************************gKDj. You can find your API key at https://platform.openai.com/account/api-keys.",

            "type": "invalid_request_error",

            "param": null,

            "code": "invalid_api_key"

        }

    }

    

        at Object.start (file:///Users/Christophe/Library/Caches/deno/npm/registry.npmjs.org/ai/3.0.4/dist/index.mjs:291:30)

        at eventLoopTick (ext:core/01_core.js:166:7)


## Explore the trace in the UI

https://cloud.langfuse.com/project/clr4qu8qv0000yu4ja339x02u/traces/e5602889-1a77-462e-a5f5-7f7678177207
