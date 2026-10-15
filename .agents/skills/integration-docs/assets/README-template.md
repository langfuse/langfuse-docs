# Langfuse Observability Plugin for <Host>

<One sentence: what the plugin traces, and into what.>

> Community/Official status, and the Langfuse version it targets.

## What can this integration trace?

<!-- Must match the docs page's list verbatim. Both are the same promise. -->

- **User prompts**: ...
- **Model generations**: ... with inputs, outputs, token usage and cost
- **Tool calls**: ... with inputs, outputs and error status
- **Subagents**: ... nested under the spawning turn
- **Sessions**: ...

## What this does not trace

<!-- Evidence: claude #52 (images silently excluded), claude #39 (thinking blocks
     absent until requested). An undisclosed gap becomes a bug report. -->

- ...

## Supported versions

<!-- Evidence: codex #47 (CLI 0.147.0 moved the user prompt), opencode #39 (v2),
     claude #59 ("when will this match Langfuse v4?"). State BOTH host range and
     Langfuse SDK range, and keep it in step with the CI matrix. -->

|               | Supported |
| ------------- | --------- |
| <Host>        | ...       |
| Langfuse      | ...       |
| Node / Python | ...       |

## Prerequisites

## Install

## Add your Langfuse credentials

<!-- Name every variable exactly as Langfuse documents it. Evidence: opencode #11
     read LANGFUSE_BASEURL while every doc said LANGFUSE_BASE_URL. -->

## Configuration

| Variable | Default | Effect |
| -------- | ------- | ------ |

## Enable and disable tracing

<!-- Evidence: claude #35 asked for an off switch. Ship one. -->

## Data and privacy

<!-- What leaves the machine, what is redacted, which defaults are opt-in.
     No repo had this section; no user asked, which means the defaults were
     never pressure-tested. -->

## Troubleshooting

<!-- Mirror the docs page's entries. At minimum the two that every integration
     gets asked: no traces appearing, authentication errors. -->

### No traces appearing in Langfuse

### Authentication errors

## Development

## Release

## License
