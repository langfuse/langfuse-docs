interface Window {
  _hsq?: any[];
}

// ---------------------------------------------------------------------------
// fumadocs-mdx collection module declarations
// TypeScript cannot resolve the `?collection=<name>` query-parameter suffix as
// a file path, so dynamic imports like
//   import("@/content/docs/foo.mdx?collection=docs")
// fail type-checking even though the Turbopack/webpack loader handles them at
// build time.  Declaring a wildcard ambient module for each collection tells
// TypeScript the shape of the default export without suppressing all type-
// checking in the consuming files.
// ---------------------------------------------------------------------------
type _MDXCollectionModule = {
  default: import("react").ComponentType<{
    components?: Record<string, import("react").ComponentType>;
  }>;
};

declare module "*.mdx?collection=docs" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=blog" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=changelog" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=customers" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=faq" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=guides" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=handbook" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=integrations" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=library" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=marketing" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=security" {
  const mod: _MDXCollectionModule;
  export = mod;
}
declare module "*.mdx?collection=selfHosting" {
  const mod: _MDXCollectionModule;
  export = mod;
}

// ---------------------------------------------------------------------------
// fumadocs-mdx .md collection modules (same pattern as .mdx above)
// Some guides/integrations use plain .md extension instead of .mdx
// ---------------------------------------------------------------------------
declare module "*.md?collection=docs" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=blog" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=changelog" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=customers" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=faq" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=guides" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=handbook" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=integrations" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=library" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=marketing" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=security" { const mod: _MDXCollectionModule; export = mod; }
declare module "*.md?collection=selfHosting" { const mod: _MDXCollectionModule; export = mod; }

// ---------------------------------------------------------------------------
// @modelcontextprotocol/sdk subpath that TypeScript can't resolve via wildcard
// exports (the package uses "./*" → "./dist/esm/*" but no "types" condition).
// We re-declare only the exports that the project actually uses.
// ---------------------------------------------------------------------------
declare module "@modelcontextprotocol/sdk/client/streamableHttp" {
  export class StreamableHTTPError extends Error {
    readonly code: number | undefined;
    constructor(code: number | undefined, message: string | undefined);
  }
  export type StreamableHTTPClientTransportOptions = {
    authProvider?: unknown;
    requestInit?: RequestInit;
    sessionId?: string;
  };
  export class StreamableHTTPClientTransport {
    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: (message: unknown) => void;
    constructor(url: URL, opts?: StreamableHTTPClientTransportOptions);
    start(): Promise<void>;
    close(): Promise<void>;
    send(message: unknown, options?: unknown): Promise<void>;
    terminateSession(): Promise<void>;
    setProtocolVersion(version: string): void;
    get sessionId(): string | undefined;
    get protocolVersion(): string | undefined;
  }
}
