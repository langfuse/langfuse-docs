import { Button } from "../ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

export const moveToPromptManagementPrompt = `# Langfuse Prompt Management Migration

## Goal

Your goal is to identify hardcoded prompts in this codebase and migrate them to Langfuse Prompt Management, then update the code to fetch prompts from Langfuse at runtime.

## Rules

Before you begin, understand these fundamental rules:

1.  **Preserve Business Logic**: Do not change application behavior. The only changes should be moving prompts to Langfuse and updating how prompts are retrieved.
2.  **Follow the Workflow**: Execute the steps below in sequence.
3.  **Use Available Tools**: Use the Langfuse MCP server tools (\`listPrompts\`, \`getPrompt\`, \`createTextPrompt\`, \`createChatPrompt\`, \`updatePromptLabels\`) to interact with Langfuse Prompt Management.

## Migration Workflow

### Step 1: Discover Hardcoded Prompts

Analyze the codebase to find all hardcoded prompts. Look for:

- System prompts or instructions passed to LLM calls
- Template strings used for prompt construction
- Multi-line strings containing AI instructions
- Variables named \`prompt\`, \`system_prompt\`, \`instructions\`, \`template\`, etc.
- Files in directories like \`prompts/\`, \`templates/\`, or similar

Present a list of all discovered prompts with:
- File path and line numbers
- The prompt content (truncated if very long)
- Suggested prompt name for Langfuse (e.g., \`customer-support-agent\`, \`code-review-assistant\`)
- Prompt type: text or chat (OpenAI message format)

Ask me to confirm which prompts to migrate before proceeding.

### Step 2: Check Existing Prompts in Langfuse

Use the \`listPrompts\` tool to check what prompts already exist in the Langfuse project. Compare with the prompts identified in Step 1 to avoid duplicates.

### Step 3: Create Prompts in Langfuse

For each confirmed prompt, create it in Langfuse:

**For simple text prompts** (single string templates):
- Use \`createTextPrompt\` tool
- Extract template variables and use \`{{variable}}\` syntax
- Add appropriate tags (e.g., \`migrated\`, \`v1\`)
- Set the \`production\` label for immediate use

**For chat prompts** (system/user/assistant message format):
- Use \`createChatPrompt\` tool
- Structure as OpenAI-style messages with roles
- Include all message types (system, user examples, etc.)
- Add appropriate tags and labels

Include a commit message describing the migration (e.g., "Migrated from codebase: path/to/file.py")

### Step 4: Propose Code Changes

Present a plan to update the codebase to fetch prompts from Langfuse at runtime. The plan should include:

1.  **SDK Installation**: The Langfuse SDK package to install
2.  **Environment Variables**: Required configuration (LANGFUSE_PUBLIC_KEY, LANGFUSE_SECRET_KEY, LANGFUSE_HOST if self-hosted)
3.  **Code Changes**: For each migrated prompt, show the before/after code

Wait for my approval before implementing changes.

### Step 5: Implement Code Changes

After approval, make the following changes:

1.  Install the Langfuse SDK using the package manager
2.  Add prompt fetching code that:
    - Initializes the Langfuse client
    - Fetches prompts by name (optionally with label for staging/production)
    - Compiles prompts with any required variables
    - Handles caching appropriately for your use case

**Python example pattern:**
\`\`\`python
from langfuse import Langfuse

langfuse = Langfuse()

# Fetch and compile prompt
prompt = langfuse.get_prompt("prompt-name")
compiled = prompt.compile(variable="value")
\`\`\`

**JavaScript/TypeScript example pattern:**
\`\`\`typescript
import { Langfuse } from "langfuse";

const langfuse = new Langfuse();

// Fetch and compile prompt  
const prompt = await langfuse.getPrompt("prompt-name");
const compiled = prompt.compile({ variable: "value" });
\`\`\`

3.  Remove or comment out the old hardcoded prompts
4.  Add documentation comments explaining the Langfuse prompt source

### Step 6: Verify Migration

After implementing changes:

1.  Confirm all prompts are created in Langfuse using \`listPrompts\`
2.  Verify prompt content is correct using \`getPrompt\`
3.  Ask me to test the application and confirm prompts are being fetched correctly

### Step 7: Optional Enhancements

Suggest additional improvements:

- **Labels**: Set up staging/production labels for A/B testing
- **Versioning**: Explain how to iterate on prompts via Langfuse UI
- **Caching**: Configure appropriate cache TTL for your use case
- **Fallbacks**: Add fallback behavior if Langfuse is unreachable
`;

export const CopyMoveToPromptManagementPrompt = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(moveToPromptManagementPrompt);
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
          View prompt
        </summary>
        <pre className="mt-2 whitespace-pre-wrap break-words bg-muted p-2 rounded text-xs">
          {moveToPromptManagementPrompt}
        </pre>
      </details>
    </div>
  );
};
