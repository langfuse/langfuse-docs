export function getAgentPromptText(topic: string | undefined): string {
  switch (topic) {
    case "observability":
      return `Please follow the instructions on this page to set up tracing for my project:
https://langfuse.com/docs/observability/get-started.md

Leveraging the Langfuse skill https://github.com/langfuse/skills`.trim();
    case "prompt-management":
      return `Please follow the instructions on this page to set up prompt management for my project:
https://langfuse.com/docs/prompt-management/get-started.md

Leveraging the Langfuse skill https://github.com/langfuse/skills`.trim();
    case "evals":
      return "";
    default:
      return "";
  }
}
