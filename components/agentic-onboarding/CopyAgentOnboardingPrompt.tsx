import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export const agenticOnboardingPrompt = `# Langfuse Agentic Onboarding

## Goals

Your goal is to help me integrate Langfuse tracing into my codebase.

## Rules

Before you begin, you must understand these three fundamental rules:

1.  Do Not Change Business Logic: You are strictly forbidden from changing, refactoring, or altering any of my existing code's logic. Your only task is to add the necessary code for Langfuse integration, such as decorators, imports, handlers, and environment variable initializations.
2.  Adhere to the Workflow: You must follow the step-by-step workflow outlined below in the exact sequence.
3.  If available, use the langfuse-docs MCP server and the \`searchLangfuseDocs\` tool to retrieve information from the Langfuse docs. If it is not available, please use your websearch capabilities to find the information.

## Integration Workflow

### Step 1: Language and Compatibility Check

First, analyze the codebase to identify the primary programming language.

- If the language is Python or JavaScript/TypeScript, proceed to Step 2.
- If the language is not Python or JavaScript/TypeScript, you must stop immediately. Inform me that the codebase is currently unsupported for this AI-based setup, and do not proceed further.

### Step 2: Codebase Discovery & Entrypoint Confirmation

Once you have confirmed the language is compatible, explore the entire codebase to understand its purpose.

- Identify all files and functions that contain LLM calls or are likely candidates for tracing.
- Present this list of files and function names to me.
- If you are unclear about the main entry point of the application (e.g., the primary API route or the main script to execute), you must ask me for confirmation on which parts are most critical to trace before proceeding to the next step.

### Step 3: Discover Available Integrations

After I confirm the files and entry points, get a list of available integrations from the Langfuse docs. Please include the language that is used in every request to the docs.

### Step 4: Analyze Confirmed Files for Technologies

Based on the files we confirmed in Step 2, perform a deeper analysis to identify the specific LLM frameworks or SDKs being used (e.g., OpenAI SDK, LangChain, LlamaIndex, Anthropic SDK, etc.). Search the Langfuse docs for the integration instructions for these frameworks.

If you are unsure, repeatedly visit the langfuse docs.

### Step 5: Propose a Development Plan

Before you write or modify a single line of code, you must present me with a clear, step-by-step development plan. This plan must include:

- The Langfuse package(s) you will install.
- The files you intend to modify.
- The specific code changes you will make, showing the exact additions.
- Instructions on where I will need to add my Langfuse API keys after your work is done.

I will review this plan and give you my approval before you proceed.

### Step 6: Implement the Integration

Once I approve your plan, execute it. First, you must use your terminal access to run the necessary package installation command (e.g., pip install langfuse, npm install langfuse) yourself. After the installation is successful, modify the code exactly as described in the plan.

When done, please review the code changes. The goal here is to keep the integration as simple as possible.

### Step 7: Request User Review and Wait

After you have made all the changes, notify me that your work is complete. Explicitly ask me to run the application and confirm that everything is working correctly and that you can make changes/improvements if needed.

### Step 8: Debug and Fix if Necessary

If I report that something is not working correctly, analyze my feedback. Use the knowledge you have to debug the issue. If required, re-crawl the relevant Langfuse documentation to find a solution, propose a fix to me, and then implement it.
`;

export const CopyAgentOnboardingPrompt = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(agenticOnboardingPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="space-y-2 mt-3">
      <Button
        onClick={handleCopy}
        className="flex items-center gap-2"
        variant={copied ? "secondary" : "default"}
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copied!" : "Copy Agent Prompt to Clipboard"}
      </Button>
      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer hover:text-foreground">
          View raw prompt
        </summary>
        <pre className="mt-2 whitespace-pre-wrap break-words bg-muted p-2 rounded text-xs">
          {agenticOnboardingPrompt}
        </pre>
      </details>
    </div>
  );
};
