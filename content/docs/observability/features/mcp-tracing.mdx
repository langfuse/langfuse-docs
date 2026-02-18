---
title: MCP Tracing
description: End-to-end tracing of MCP clients and servers with Langfuse.
sidebarTitle: MCP Tracing
---

# MCP Tracing

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) enables AI agents to interact with external tools and data sources. When tracing MCP applications, client and server operations produce separate traces by default, which can be useful for establishing service boundaries.

However, you can link these traces together by propagating trace metadata from client to server, creating a unified view of the entire request flow.

## Separate vs. Linked Traces

**Separate traces**: MCP client and server generate independent traces. Useful when you need clear service boundaries or when client and server are managed by different teams.

**Linked traces**: Propagate trace context from client to server using MCP's `_meta` field. This creates a single, connected trace showing the complete request flow from client through server to external APIs.

## Propagating Trace Context

MCP supports context propagation through its `_meta` field convention. By injecting OpenTelemetry context (W3C Trace Context format) into tool calls, you can link client and server traces:

1. Extract the current trace context on the client side
2. Inject it into the MCP tool call's `_meta` field
3. Extract and restore the context on the server side
4. All server operations inherit the client's trace context

<Frame>
  ![MCP Tracing Screenshot](/images/docs/mcp-server-trace.png)
</Frame>

[Link to example trace in Langfuse](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/a7706e389c0f8d7f2f71d8d187bdf22c?timestamp=2025-10-15T12%3A32%3A49.362Z&observation=a4a1419ad946722c)

## Implementation

See a complete implementation in the [langfuse-examples repository](https://github.com/langfuse/langfuse-examples/tree/main/applications/mcp-tracing) demonstrating end-to-end MCP tracing with OpenAI, Exa API, and Langfuse.
