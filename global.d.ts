interface Window {
  _hsq?: any[];
}

// Temporary compatibility layer for legacy ai/react imports used by older components
declare module "ai/react" {
  export * from "@ai-sdk/react";
}
