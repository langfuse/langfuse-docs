# Langfuse JS/TS SDK v5 — Breaking Changes

This document lists every breaking change in the v5 major release of the Langfuse JS/TS SDK. It is intended as the source-of-truth for writing the public migration guide and documentation.

---

## 1. Trace-level attribute setting: `updateActiveTrace()` → `propagateAttributes()` + `setActiveTraceIO()`

**Packages:** `@langfuse/tracing`

The single `updateActiveTrace()` function has been **removed** and replaced by two separate functions with distinct responsibilities:

| Responsibility                                                                         | v4                                              | v5                                                          |
| -------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| Setting correlating attributes (userId, sessionId, tags, metadata, version, traceName) | `updateActiveTrace({ userId, sessionId, ... })` | `propagateAttributes({ userId, sessionId, ... }, callback)` |
| Setting trace-level input/output                                                       | `updateActiveTrace({ input, output })`          | `setActiveTraceIO({ input, output })` (deprecated)          |
| Making a trace public                                                                  | `updateActiveTrace({ public: true })`           | `setActiveTraceAsPublic()`                                  |

### v4

```typescript
import { updateActiveTrace, startActiveObservation } from "@langfuse/tracing";

await startActiveObservation("my-operation", async (span) => {
  updateActiveTrace({
    name: "user-workflow",
    userId: "user-123",
    sessionId: "session-456",
    tags: ["production", "critical"],
    public: true,
    metadata: { testRun: "server-export", version: "1.0.0" },
    version: "1.0",
    release: "v1.0.0",
    environment: "production",
    input: { query: "hello" },
    output: { response: "world" },
  });
});
```

### v5

```typescript
import {
  propagateAttributes,
  startActiveObservation,
  setActiveTraceIO,
  setActiveTraceAsPublic,
} from "@langfuse/tracing";

await propagateAttributes(
  {
    traceName: "user-workflow", // was "name"
    userId: "user-123",
    sessionId: "session-456",
    tags: ["production", "critical"],
    metadata: { testRun: "server-export", version: "1.0.0" }, // must be Record<string, string>
    version: "1.0",
  },
  async () => {
    await startActiveObservation("my-operation", async (span) => {
      setActiveTraceIO({
        input: { query: "hello" },
        output: { response: "world" },
      });
      setActiveTraceAsPublic();
    });
  },
);
```

### Key differences

- **`name` → `traceName`**: The attribute to set the trace name has been renamed.
- **`metadata` type changed**: Was `unknown`, now `Record<string, string>`. All values must be strings of ≤200 characters. Non-string values are dropped with a warning.
- **`userId` and `sessionId` validated**: Must be strings of ≤200 characters. Invalid values are dropped with a warning.
- **`release` removed**: No replacement available in `propagateAttributes`.
- **`environment` removed**: No replacement available in `propagateAttributes`.
- **`public` removed**: Use the dedicated `setActiveTraceAsPublic()` function instead.
- **`input` / `output` removed**: Use the dedicated `setActiveTraceIO()` function instead (deprecated, for legacy platform features only).
- **Context-based propagation**: `propagateAttributes` wraps a callback. All spans created inside the callback automatically inherit the attributes. Spans created _before_ the callback are **not** retroactively updated.

---

## 2. `.updateTrace()` method on observation wrappers → `.setTraceIO()` + `.setTraceAsPublic()`

**Package:** `@langfuse/tracing`

On all observation wrapper classes (`LangfuseSpan`, `LangfuseGeneration`, `LangfuseEvent`, `LangfuseAgent`, `LangfuseTool`, `LangfuseChain`, `LangfuseRetriever`, `LangfuseEvaluator`, `LangfuseGuardrail`, `LangfuseEmbedding`):

- `.updateTrace()` has been **renamed** to `.setTraceIO()` and now only accepts `{ input?, output? }`.
- A new `.setTraceAsPublic()` method has been added for making traces public.
- Both `.setTraceIO()` and its type are marked `@deprecated`.

### v4

```typescript
const span = startObservation("my-op");
span.updateTrace({
  name: "my-trace",
  userId: "user-123",
  sessionId: "session-456",
  tags: ["prod"],
  public: true,
  input: { query: "hello" },
  output: { response: "world" },
});
```

### v5

```typescript
// Use propagateAttributes for correlating attributes (userId, sessionId, etc.)
propagateAttributes(
  {
    traceName: "my-trace",
    userId: "user-123",
    sessionId: "session-456",
    tags: ["prod"],
  },
  () => {
    const span = startObservation("my-op");
    span.setTraceIO({
      input: { query: "hello" },
      output: { response: "world" },
    });
    span.setTraceAsPublic();
    span.end();
  },
);
```

## 7. `@langfuse/langchain` internal changes

**Package:** `@langfuse/langchain`

The `CallbackHandler` now uses `propagateAttributes()` for trace-level attributes and `startActiveObservation()` (instead of `startObservation()`) for creating spans internally. This affects users who:

- Subclass `CallbackHandler`
- Depend on the internal span-creation behavior
- Rely on `traceMetadata` accepting non-string values — non-string values are now serialized via `JSON.stringify` before being passed to `propagateAttributes`, which requires `Record<string, string>`.

---

## 8. `@langfuse/openai` internal changes

**Package:** `@langfuse/openai`

The `traceMethod` wrapper now wraps the traced call in `propagateAttributes()` to set `userId`, `sessionId`, `tags`, and `traceName` (from `config.traceName`), instead of calling `.updateTrace()` on the observation. The old `.updateTrace({ name: config.traceName })` pattern is removed. This affects users who rely on the internal span creation behavior of the traced OpenAI wrapper.

---

## Summary: renamed and removed exports

| v4 Export               | v5 Replacement                                                                           | Package             |
| ----------------------- | ---------------------------------------------------------------------------------------- | ------------------- |
| `updateActiveTrace()`   | `setActiveTraceIO()` (deprecated) + `propagateAttributes()` + `setActiveTraceAsPublic()` | `@langfuse/tracing` |
| `.updateTrace()` method | `.setTraceIO()` (deprecated) + `.setTraceAsPublic()`                                     | `@langfuse/tracing` |

## Removed trace attributes with no direct replacement

| Removed attribute | Notes                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `release`         | Was on `LangfuseTraceAttributes`. Not available in `propagateAttributes` or `LangfuseTraceIOAttributes`. |
| `environment`     | Was on `LangfuseTraceAttributes`. Not available in `propagateAttributes` or `LangfuseTraceIOAttributes`. |
| `public`          | Replaced by dedicated `setActiveTraceAsPublic()` function and `.setTraceAsPublic()` method.              |
