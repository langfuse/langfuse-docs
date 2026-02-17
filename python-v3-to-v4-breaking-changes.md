# Breaking Changes for SDK v4 Major Release

## 1. Removed Methods on `Langfuse` Client

### 1a. `Langfuse.start_span()` — Removed

**Old:**

```python
span = langfuse.start_span(name="my-span", input=..., metadata=...)
```

**New:**

```python
span = langfuse.start_observation(name="my-span", input=..., metadata=...)
# as_type defaults to "span", so it can be omitted
```

### 1b. `Langfuse.start_as_current_span()` — Removed

**Old:**

```python
with langfuse.start_as_current_span(name="my-span") as span:
    ...
```

**New:**

```python
with langfuse.start_as_current_observation(name="my-span") as span:
    ...
# as_type defaults to "span", so it can be omitted
```

### 1c. `Langfuse.start_generation()` — Removed

**Old:**

```python
gen = langfuse.start_generation(name="gen", model="gpt-4", input=...)
```

**New:**

```python
gen = langfuse.start_observation(name="gen", as_type="generation", model="gpt-4", input=...)
```

### 1d. `Langfuse.start_as_current_generation()` — Removed

**Old:**

```python
with langfuse.start_as_current_generation(name="gen", model="gpt-4") as gen:
    ...
```

**New:**

```python
with langfuse.start_as_current_observation(name="gen", as_type="generation", model="gpt-4") as gen:
    ...
```

### 1e. `Langfuse.update_current_trace()` — Removed and Decomposed into 3 Methods

**Old:**

```python
langfuse.update_current_trace(
    name="trace-name",
    user_id="user-123",
    session_id="session-abc",
    version="1.0",
    input={"query": "hello"},
    output={"result": "world"},
    metadata={"key": "value"},
    tags=["tag1"],
    public=True,
)
```

**New (decomposed into up to 3 calls):**

```python
# (a) Trace attributes -> propagate_attributes() context manager
with propagate_attributes(
    trace_name="trace-name",    # note: 'name' is now 'trace_name'
    user_id="user-123",
    session_id="session-abc",
    version="1.0",
    metadata={"key": "value"},
    tags=["tag1"],
):
    ...

# (b) Trace input/output -> set_current_trace_io() (deprecated, will be removed later)
langfuse.set_current_trace_io(input={"query": "hello"}, output={"result": "world"})

# (c) Trace public flag -> set_current_trace_as_public()
langfuse.set_current_trace_as_public()
```

---

## 2. Removed Methods on Span/Observation Objects

### 2a. `span.update_trace()` — Removed and Decomposed into 3 Methods

**Old:**

```python
span.update_trace(
    name="trace-name",
    user_id="user-123",
    session_id="session-abc",
    version="1.0",
    input={"query": "hello"},
    output={"result": "world"},
    metadata={"key": "val"},
    tags=["tag1"],
    public=True,
)
```

**New (same decomposition as `update_current_trace()`):**

```python
# (a) Trace attributes -> propagate_attributes() context manager
with propagate_attributes(
    trace_name="trace-name",
    user_id="user-123",
    session_id="session-abc",
    version="1.0",
    metadata={"key": "val"},
    tags=["tag1"],
):
    ...

# (b) Trace input/output -> span.set_trace_io() (deprecated, will be removed later)
span.set_trace_io(input={"query": "hello"}, output={"result": "world"})

# (c) Trace public flag -> span.set_trace_as_public()
span.set_trace_as_public()
```

**Key behavioral change:** `propagate_attributes()` is a **context manager** — all child spans created within its scope inherit the attributes. This replaces the imperative `update_trace()` call. The `name` parameter is renamed to `trace_name` in `propagate_attributes()`.

### 2b. `span.start_span()` — Removed

**Old:**

```python
child = parent_span.start_span(name="child")
# Note: 'name' was positional in old API
```

**New:**

```python
child = parent_span.start_observation(name="child")
# as_type defaults to "span" on span objects; name is keyword-only
```

### 2c. `span.start_as_current_span()` — Removed

**Old:**

```python
with span.start_as_current_span(name="child") as child:
    ...
```

**New:**

```python
with span.start_as_current_observation(name="child") as child:
    ...
```

### 2d. `span.start_generation()` — Removed

**Old:**

```python
gen = span.start_generation(name="gen", model="gpt-4")
```

**New:**

```python
gen = span.start_observation(name="gen", as_type="generation", model="gpt-4")
```

### 2e. `span.start_as_current_generation()` — Removed

**Old:**

```python
with span.start_as_current_generation(name="gen", model="gpt-4") as gen:
    ...
```

**New:**

```python
with span.start_as_current_observation(name="gen", as_type="generation", model="gpt-4") as gen:
    ...
```

---

## 3. `DatasetItemClient` Class Removed

**Old:**

```python
dataset = langfuse.get_dataset("my-dataset")
for item in dataset.items:  # items were DatasetItemClient instances
    with item.run(run_name="my-run", run_metadata={...}, run_description="...") as span:
        result = my_llm(item.input)
        span.update(output=result)
```

**New:** `DatasetItemClient` no longer exists. `dataset.items` is now `List[DatasetItem]` (raw API type from `langfuse.api`). The `item.run()` context manager method is removed. Users should use `dataset.run_experiment()` instead:

```python
dataset = langfuse.get_dataset("my-dataset")

def my_task(*, item, **kwargs):
    return my_llm(item.input)

dataset.run_experiment(name="my-run", task=my_task)
```

The `DatasetItem` objects from `langfuse.api` still have the same data attributes (`id`, `input`, `expected_output`, `metadata`, etc.) but lack the `run()` method and `langfuse` client reference.

---

## 4. LangChain `CallbackHandler` Changes

### 4a. `update_trace` Parameter Removed

**Old:**

```python
handler = CallbackHandler(update_trace=True, trace_context={...})
```

**New:**

```python
handler = CallbackHandler(trace_context={...})
# update_trace parameter no longer exists — passing it raises TypeError
```

The behavior previously controlled by `update_trace=True` (updating the root trace with chain input/output/name) is removed. The handler now uses `propagate_attributes()` internally to propagate trace-level metadata (`user_id`, `session_id`, `tags`, `metadata`).

## 5. Removed Types from `langfuse.types`

The following public types were removed from `langfuse/types.py` (and from `__all__`):

| Removed Type        | Description                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| `TraceMetadata`     | TypedDict with `name`, `user_id`, `session_id`, `version`, `release`, `metadata`, `tags`, `public`      |
| `ObservationParams` | TypedDict extending `TraceMetadata` with observation fields (`input`, `output`, `model`, `usage`, etc.) |

Additionally, `MapValue`, `ModelUsage`, and `PromptClient` are no longer importable from `langfuse.types` (they were transitive re-exports via `langfuse.model`).

## 6. Pydantic v1 support dropped

Pydantic v1 support has been dropped. The SDK now relies on Pydantic v2. If users still require Pydantic v1 in their application, they must use the pydantic.v1 compatibility shim.
