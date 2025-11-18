import { LangfuseClient } from "@langfuse/client";
// @ts-ignore - Types are available in 4.4.2 but IDE cache needs refresh
import type { ExperimentItem } from "@langfuse/client";
import {
  experimental_createMCPClient as createMCPClient,
  MCPTransport,
} from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp";
import { observe, startActiveObservation } from "@langfuse/tracing";
import { LangfuseSpanProcessor } from "@langfuse/otel";
import { NodeSDK } from "@opentelemetry/sdk-node";
import OpenAI from "openai";
import 'dotenv/config';
import { chatbotStep } from "@/components/qaChatbot/chatbotCore";

// ============================================================================
// CONFIGURATION - Adjust these settings as needed
// ============================================================================

const CONFIG = {
  // Prompt configuration
  prompt: {
    name: "langfuse-docs-assistant-chat",
    type: "chat" as const,
    label: "latest", // Can also use version: number or cacheTtlSeconds: number
  },
  
  // Experiment run name
  // Default uses timestamp. Change to a custom name like "my-experiment-v1" if desired
  experimentRunName: `run-${new Date().toISOString()}`,
};



// ============================================================================
// INITIALIZATION 
// ============================================================================

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  spanProcessors: [new LangfuseSpanProcessor({
    publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
    secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
    baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  })],
});

sdk.start();

// Initialize Langfuse client
const langfuse = new LangfuseClient({
  baseUrl: process.env.NEXT_PUBLIC_EU_LANGFUSE_BASE_URL,
  publicKey: process.env.NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.EU_LANGFUSE_SECRET_KEY,
});


// Initialize OpenAI client for evaluations
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// ============================================================================
// HELPER FUNCTIONS 
// ============================================================================
/**
 * Get the chatbot prompt from Langfuse
 */
async function getChatbotPrompt() {
  const prompt = await langfuse.prompt.get(CONFIG.prompt.name, {
    type: CONFIG.prompt.type,
    label: CONFIG.prompt.label,
  });
  return prompt;
}

/**
 * Initialize MCP client for tool access
 */
async function initializeMCPClient() {
  // Initialize MCP client using Streamable HTTP transport (works with our MCP server)
  const mcpClient = await startActiveObservation(
    "create-mcp-client",
    async () => {
      const mcpUrl = new URL("https://langfuse.com/api/mcp");

      return createMCPClient({
        transport: new StreamableHTTPClientTransport(mcpUrl, {
          sessionId: `qa-chatbot-${crypto.randomUUID()}`,
        }) as MCPTransport,
      });
    },
  );
  
  return mcpClient;
}

/**
 * Return type for chatbot task - includes both text output and tool call information
 */
type ChatbotTaskResult = {
  text: string;
  toolCalls: any[];
};

/**
 * Helper function to evaluate using OpenAI
 * Returns true/false based on the LLM's evaluation
 */
async function evaluateWithOpenAI(prompt: string): Promise<boolean> {
  try {
    const response = await openaiClient.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ]
    });

    const result = response.choices[0]?.message?.content?.trim().toLowerCase();
    return result === "true";
  } catch (error) {
    console.error("Error evaluating with OpenAI:", error);
    return false;
  }
}



// ============================================================================
// EVALUATORS
// ============================================================================

async function isConcise({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const evaluationPrompt = `Does the answer avoid unnecessary words or filler? Answer with only "true" or "false".
    Question: ${inputStr}
    Response: ${output.text}
     
    Answer (true/false):`;

  const result = await evaluateWithOpenAI(evaluationPrompt);
  return {
    name: "is-concise",
    value: result ? 1 : 0,
  };
}

async function whyExplanation({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const prompt = `Does the reply clearly explain why Langfuse is useful in the context of the question — not just what it does? Answer with only "true" or "false".
Question: ${inputStr}
Response: ${output.text}
Answer (true/false):`;

  const result = await evaluateWithOpenAI(prompt);
  return {
    name: "why-explanation",
    value: result ? 1 : 0,
  };
}

async function isUnderstandable({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const prompt = `Is the explanation easy to understand for the person asking the question? The answer should be on the same level of complexity as the question. For example, if the question is using complex jargon, the answer can contain that jargon as well. If the question is rather broad/simple, the answer should use simple to understand words or, if jargon is used, it should be explained in a way that a user new to this space can understand. The term Langfuse is the brand name and is not considered jargon. Answer with only "true" or "false".`;
  Question: ${inputStr}
  Response: ${output.text}
  Answer (true/false):`;

  const result = await evaluateWithOpenAI(prompt);
  return {
    name: "is-understandable",
    value: result ? 1 : 0,
  };
}

async function isEngaging({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const prompt = `Does the reply naturally invite the user to continue, e.g. by offering help, examples, or a next question? Answer with only "true" or "false".
  Question: ${inputStr}
  Response: ${output.text}
  Answer (true/false):`;

  const result = await evaluateWithOpenAI(prompt);
  return {
    name: "is-engaging",
    value: result ? 1 : 0,
  };
}

async function isActionable({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const prompt = `If the response knows enough to give an answer, does the answer offer a concrete next step the user can take (e.g., a command, a link to docs, a short instruction)? Answer with only "true" or "false". If the response does not know enough and asks a question instead, answer "true". 
  Question: ${inputStr}
  Response: ${output.text}
  Answer (true/false):`;

  const result = await evaluateWithOpenAI(prompt);
  return {
    name: "is-actionable",
    value: result ? 1 : 0,
  };
}

async function greeting({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const prompt = `If the user greets the bot, does the answer greet back in a friendly, concise way? Answer with only "true" or "false". If the user didn't greet the bot, answer "true"
  Question: ${inputStr}
  Response: ${output.text}
  Answer (true/false):`;

  const result = await evaluateWithOpenAI(prompt);
  return {
    name: "greeting",
    value: result ? 1 : 0,
  };
}

async function gracefulDeflection({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  const inputStr = typeof input === "string" ? input : JSON.stringify(input);
  
  const prompt = `Does the answer politely redirect them without being dismissive? Tone should be friendly, short, and helpful. Answer with only "true" or "false".
  Question: ${inputStr}
  Response: ${output.text}
  Answer (true/false):`;

  const result = await evaluateWithOpenAI(prompt);
  return {
    name: "graceful-deflection",
    value: result ? 1 : 0,
  };
}

async function noToolCalls({ input, output, expectedOutput }: { input: any; output: ChatbotTaskResult; expectedOutput?: any }) {
  // Check if any tool calls were made
  const hadToolCalls = output.toolCalls && output.toolCalls.length > 0;
  
  // Return 1 if NO tool calls were made, 0 otherwise
  return {
    name: "no-tool-calls",
    value: hadToolCalls ? 0 : 1,
  };
}


// ============================================================================
// EXPERIMENT FUNCTIONS 
// ============================================================================

/**
 * Task function for experiments - runs the chatbot on a dataset item
 * This function is called by dataset.runExperiment() for each dataset item
 * The parameter IS the item itself (ExperimentTaskParams = ExperimentItem)
 * Wrapped with observe() to ensure traces are created
 */
const chatbotTask = observe(
  async (item: ExperimentItem): Promise<ChatbotTaskResult> => {
  console.log("Running chatbot task for item:", item.input)

  
  // Get the prompt
  const prompt = await getChatbotPrompt();
  
  // Initialize MCP client
  const mcpClient = await initializeMCPClient();
  // Convert input string to UIMessage format
  const messages = [
    {
      id: crypto.randomUUID(),
      role: "user" as const,
      parts: [{ type: "text" as const, text: item.input }],
    },
  ];
  const result = await chatbotStep(prompt, messages, mcpClient);
  
  // Consume the stream to force execution (required for non-HTTP contexts)
  for await (const _ of result.fullStream) {
    // Just consume the stream, we don't need to do anything with each chunk
  }
  
  // Now extract the data after stream has completed
  const fullText = await result.text;
  const toolCalls = await result.toolCalls || [];
  return {
    text: fullText,
    toolCalls: toolCalls,
  };
}, { name: "chatbot-task" });


/**
 * Main function to run all experiments
 */
async function runAllExperiments() {
  const runName = CONFIG.experimentRunName;
  
  try {
    console.log(`Starting experiments: ${runName}\n`);

    
    // Run experiment on general questions dataset
    const generalQuestionsDataset = await langfuse.dataset.get("general-questions");
    // @ts-ignore - runExperiment is available in newer versions but types haven't been updated
    await generalQuestionsDataset.runExperiment({
      name: runName,
      description: `Experiment run on ${new Date().toISOString()}`,
      task: chatbotTask,
      evaluators: [
        isConcise, 
        whyExplanation,
        isUnderstandable,
        isEngaging,
        isActionable,
        greeting
      ], 
    });
    
    // Run experiment on irrelevant questions dataset
    const irrelevantQuestionsDataset = await langfuse.dataset.get("irrelevant-questions");
    // @ts-ignore - runExperiment is available in newer versions but types haven't been updated
    await irrelevantQuestionsDataset.runExperiment({
      name: runName,
      description: `Experiment run on ${new Date().toISOString()}`,
      task: chatbotTask,
      evaluators: [ 
        gracefulDeflection,
        noToolCalls
      ],
    });

    
    console.log(`\nAll experiments complete: ${runName}`);
  } catch (error) {
    console.error("Experiment failed:", error);
    throw error;
  } finally {
    // Flush Langfuse client
    await langfuse.flush();
    
    // Shutdown OpenTelemetry SDK to flush spans
    await sdk.shutdown();
  }
}

// Run all experiments
runAllExperiments().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

