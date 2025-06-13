---
title: Migrating Data from One Langfuse Project to Another
description: Script to migrate data (prompts, traces, datasets) from a source Langfuse project to a destination Langfuse project
---

# Migrating Data from One Langfuse Project to Another

This guide provides Python code  to migrate data (prompts, traces, datasets) from a source Langfuse project to a destination Langfuse project using the Langfuse Public API.

This is useful for scenarios such as:
*   Moving data from Langfuse Cloud to a self-hosted instance (or vice-versa).
*   Migrating between different Langfuse Cloud regions or compliance environments (e.g., non-HIPAA to HIPAA).
*   Syncing production data to a development/staging environment for testing.
*   Creating custom scripts to synchronize specific data types (like prompts) across instances.

## Prerequisites

*   **Langfuse Projects:** Access to both the source and destination Langfuse projects.
*   **Rate Limits:** Be mindful of API rate limits on your Langfuse instances (Cloud or self-hosted). Large migrations might require implementing back-off logic or running the script in batches.



```python
!pip install "langfuse<3.0.0" -q
```


```python
import os

# SOURCE LANGFUSE PROJECT
os.environ["LANGFUSE_SOURCE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_SOURCE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SOURCE_HOST"] = "https://cloud.langfuse.com"

# DESTINATION LANGFUSE PROJECT
os.environ["LANGFUSE_DEST_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_DEST_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_DEST_HOST"] = "https://cloud.langfuse.com"

# Optional Time Filters (ISO 8601 Format, e.g., 2023-10-26T10:00:00Z)
os.environ["LANGFUSE_MIGRATE_FROM_TIMESTAMP"] = "2025-03-01T10:00:00Z"
os.environ["LANGFUSE_MIGRATE_TO_TIMESTAMP"] = "2025-03-30T10:00:00Z"
```

## Section I – Migrating Prompts

This section covers migrating prompts, including their version history.


```python
import os
import sys
from langfuse import Langfuse
# Import the specific union member types that include the 'type' literal
from langfuse.api.resources.prompts.types.create_prompt_request import (
    CreatePromptRequest_Chat,
    CreatePromptRequest_Text
)
# Import Prompt_Chat and Prompt_Text for isinstance checks on the source prompt
from langfuse.api.resources.prompts.types import Prompt_Chat, Prompt_Text

def migrate_prompts(source_config, dest_config):
    """
    Migrates all prompts (including all versions) from a source Langfuse project
    to a destination Langfuse project.
    The destination Langfuse instance will automatically assign new version numbers.
    The original source version is recorded in the commit_message.
    """
    try:
        langfuse_source = Langfuse(
            public_key=source_config["public_key"],
            secret_key=source_config["secret_key"],
            host=source_config.get("host", "https://cloud.langfuse.com")
        )
        print(f"Source client initialized for host: {langfuse_source.base_url}")
        langfuse_source.auth_check()
        print("Source credentials verified.")
    except Exception as e:
        print(f"Error initializing or verifying source Langfuse client: {e}")
        sys.exit(1)

    try:
        langfuse_destination = Langfuse(
            public_key=dest_config["public_key"],
            secret_key=dest_config["secret_key"],
            host=dest_config.get("host", "https://cloud.langfuse.com")
        )
        print(f"Destination client initialized for host: {langfuse_destination.base_url}")
        langfuse_destination.auth_check()
        print("Destination credentials verified.")
    except Exception as e:
        print(f"Error initializing or verifying destination Langfuse client: {e}")
        sys.exit(1)

    print("\nFetching prompts from source project...")
    all_source_prompts_details = []
    page = 1
    limit = 100

    while True:
        try:
            overview = langfuse_source.api.prompts.list(page=page, limit=limit)

            if not overview.data and page == 1:
                print("No prompts found in the source project.")
                return
            if not overview.data:
                break

            print(f"  Fetched page {overview.meta.page}/{overview.meta.total_pages} of prompt metadata...")

            for meta in overview.data:
                prompt_name = meta.name
                for v_num in meta.versions:
                    try:
                        source_prompt_version_detail = langfuse_source.api.prompts.get(prompt_name, version=v_num)
                        all_source_prompts_details.append(source_prompt_version_detail)
                    except Exception as e:
                        print(f"      Error fetching details for {prompt_name} v{v_num} from source: {e}")

            if overview.meta.page >= overview.meta.total_pages:
                break
            page += 1
        except Exception as e:
            print(f"  Error fetching prompt list (page {page}) from source: {e}")
            break

    if not all_source_prompts_details:
        print("No prompt versions could be fetched from the source project.")
        return

    print(f"\nFetched a total of {len(all_source_prompts_details)} prompt versions from source.")
    print("Starting migration to destination project...\n")

    migrated_count = 0
    failed_count = 0

    for source_prompt_detail in all_source_prompts_details:
        prompt_name_val = source_prompt_detail.name
        prompt_version_val = source_prompt_detail.version
        prompt_labels_val = source_prompt_detail.labels
        prompt_content_val = source_prompt_detail.prompt
        prompt_config_val = source_prompt_detail.config
        prompt_tags_val = source_prompt_detail.tags

        # source_prompt_detail.type is "chat" or "text" (lowercase)
        print(f"  Attempting to migrate source prompt: '{prompt_name_val}', original version: {prompt_version_val}, type: {source_prompt_detail.type}")

        commit_msg = (
            f"Migrated from source. Original prompt name: '{prompt_name_val}', "
            f"original source version: {prompt_version_val}."
        )

        create_request = None
        try:
            # Use isinstance to check the actual type of the fetched prompt object
            if isinstance(source_prompt_detail, Prompt_Chat):
                create_request = CreatePromptRequest_Chat( # Use the type from the Union definition
                    name=prompt_name_val,
                    prompt=prompt_content_val,
                    labels=prompt_labels_val if prompt_labels_val is not None else [],
                    config=prompt_config_val,
                    tags=prompt_tags_val if prompt_tags_val is not None else [],
                    commit_message=commit_msg,
                    # 'type="chat"' is a default literal in CreatePromptRequest_Chat
                )
            elif isinstance(source_prompt_detail, Prompt_Text):
                create_request = CreatePromptRequest_Text( # Use the type from the Union definition
                    name=prompt_name_val,
                    prompt=prompt_content_val,
                    labels=prompt_labels_val if prompt_labels_val is not None else [],
                    config=prompt_config_val,
                    tags=prompt_tags_val if prompt_tags_val is not None else [],
                    commit_message=commit_msg,
                    # 'type="text"' is a default literal in CreatePromptRequest_Text
                )
            else:
                print(f"    Unsupported prompt object type '{type(source_prompt_detail).__name__}' for {prompt_name_val} (source v{prompt_version_val}). Skipping.")
                failed_count += 1
                continue

            # The 'request' object passed to create() is now an instance of CreatePromptRequest_Chat or _Text
            # which Pydantic will serialize including its 'type' literal.
            created_dest_prompt = langfuse_destination.api.prompts.create(request=create_request)

            print(f"    Successfully created prompt '{created_dest_prompt.name}' in destination.")
            print(f"      Source version was: {prompt_version_val}, Type: {source_prompt_detail.type}")
            # created_dest_prompt is also a Prompt_Chat or Prompt_Text object
            print(f"      Destination assigned version: {created_dest_prompt.version}, Type: {created_dest_prompt.type}")
            print(f"      Labels applied: {created_dest_prompt.labels}")
            migrated_count += 1

        except Exception as e:
            print(f"    Error migrating prompt {prompt_name_val} (source v{prompt_version_val}): {e}")
            failed_count += 1

    print(f"\nMigration complete. Successfully migrated: {migrated_count}, Failed: {failed_count}")

if __name__ == "__main__":
    print("Langfuse Prompts Migration Script")
    print("---------------------------------")
    print("This script migrates all prompt versions. The destination project will")
    print("assign new version numbers automatically. Original source version numbers")
    print("are stored in the commit_message of the created prompts in the destination.")
    print("---------------------------------\n")

    source_pk = os.getenv("LANGFUSE_SOURCE_PUBLIC_KEY")
    source_sk = os.getenv("LANGFUSE_SOURCE_SECRET_KEY")
    source_host = os.getenv("LANGFUSE_SOURCE_HOST", "https://cloud.langfuse.com")

    dest_pk = os.getenv("LANGFUSE_DEST_PUBLIC_KEY")
    dest_sk = os.getenv("LANGFUSE_DEST_SECRET_KEY")
    dest_host = os.getenv("LANGFUSE_DEST_HOST", "https://cloud.langfuse.com")

    if not source_pk or not source_sk:
        print("Error: LANGFUSE_SOURCE_PUBLIC_KEY and LANGFUSE_SOURCE_SECRET_KEY environment variables are required for the source project.")
        sys.exit(1)

    if not dest_pk or not dest_sk:
        print("Error: LANGFUSE_DEST_PUBLIC_KEY and LANGFUSE_DEST_SECRET_KEY environment variables are required for the destination project.")
        sys.exit(1)

    source_credentials = {
        "public_key": source_pk,
        "secret_key": source_sk,
        "host": source_host,
    }
    destination_credentials = {
        "public_key": dest_pk,
        "secret_key": dest_sk,
        "host": dest_host,
    }

    print(f"Source Host: {source_host}")
    print(f"Destination Host: {dest_host}")

    confirmation = input("\nProceed with migration? (yes/no): ").lower()
    if confirmation == 'yes':
        migrate_prompts(source_credentials, destination_credentials)
    else:
        print("Migration cancelled by user.")
```

## Section II – Migrating Traces, Observations & Scores

This section handles the core tracing data: traces, their nested observations (spans, generations, events), and associated scores.


```python
import os
import sys
import uuid
import datetime as dt
import time
from langfuse import Langfuse
# Corrected location for MapValue:
from langfuse.api.resources.commons.types import MapValue
# Ingestion types:
from langfuse.api.resources.ingestion.types import (
    TraceBody,
    CreateSpanBody,
    CreateGenerationBody,
    CreateEventBody,
    ScoreBody,
    IngestionEvent_TraceCreate,
    IngestionEvent_SpanCreate,
    IngestionEvent_GenerationCreate,
    IngestionEvent_EventCreate,
    IngestionEvent_ScoreCreate,
    IngestionUsage,
)
# Other common types:
from langfuse.api.resources.commons.types import ObservationLevel, ScoreSource, Usage
from langfuse.api.resources.commons.types.score import Score_Numeric, Score_Categorical, Score_Boolean

# --- Helper Function for Robust Datetime Formatting ---
def safe_isoformat(dt_obj):
    """Safely formats datetime object to ISO 8601 string, handling None."""
    if dt_obj is None:
        return None
    if not isinstance(dt_obj, dt.datetime):
        if isinstance(dt_obj, str): # Allow pre-formatted strings
             try:
                 dt.datetime.fromisoformat(dt_obj.replace('Z', '+00:00'))
                 return dt_obj
             except ValueError:
                 print(f"Warning: String '{dt_obj}' is not a valid ISO datetime. Returning None.")
                 return None
        print(f"Warning: Expected datetime object or ISO string, got {type(dt_obj)}. Returning None.")
        return None
    try:
        if dt_obj.tzinfo is None:
            dt_obj = dt_obj.replace(tzinfo=dt.timezone.utc)
        iso_str = dt_obj.isoformat(timespec='milliseconds')
        if iso_str.endswith('+00:00'):
            iso_str = iso_str[:-6] + 'Z'
        return iso_str
    except Exception as e:
        print(f"Warning: Could not format datetime {dt_obj}: {e}. Returning None.")
        return None

def transform_trace_to_ingestion_batch(source_trace):
    """
    Transforms a fetched TraceWithFullDetails object into a list of
    IngestionEvent objects suitable for the batch ingestion endpoint.
    Uses the ORIGINAL source trace ID for the new trace.
    Generates new IDs for observations/scores within the trace.
    Maps parent/child relationships using new observation IDs.
    """
    ingestion_events = []
    preserved_trace_id = source_trace.id
    obs_id_map = {}

    # 1. Create Trace Event
    trace_metadata = source_trace.metadata if isinstance(source_trace.metadata, dict) else {}
    trace_body = TraceBody(
        id=preserved_trace_id,
        timestamp=source_trace.timestamp,
        name=source_trace.name,
        user_id=source_trace.user_id,
        input=source_trace.input,
        output=source_trace.output,
        session_id=source_trace.session_id,
        release=source_trace.release,
        version=source_trace.version,
        metadata=trace_metadata or None,
        tags=source_trace.tags if source_trace.tags is not None else [],
        public=source_trace.public,
        environment=source_trace.environment,
    )
    event_timestamp_str = safe_isoformat(dt.datetime.now(dt.timezone.utc))
    if not event_timestamp_str:
         print("Error: Could not format timestamp for trace event. Skipping trace.")
         return []
    trace_event_id = str(uuid.uuid4())
    ingestion_events.append(
        IngestionEvent_TraceCreate(id=trace_event_id, timestamp=event_timestamp_str, body=trace_body)
    )

    # 2. Create Observation Events
    sorted_observations = sorted(source_trace.observations, key=lambda o: o.start_time)
    for source_obs in sorted_observations:
        new_obs_id = str(uuid.uuid4())
        obs_id_map[source_obs.id] = new_obs_id
        new_parent_observation_id = obs_id_map.get(source_obs.parent_observation_id) if source_obs.parent_observation_id else None
        obs_metadata = source_obs.metadata if isinstance(source_obs.metadata, dict) else {}

        model_params_mapped = None
        if isinstance(source_obs.model_parameters, dict): model_params_mapped = source_obs.model_parameters
        elif source_obs.model_parameters is not None: print(f"Warning: Obs {source_obs.id} model_parameters type {type(source_obs.model_parameters)}, skipping.")

        common_body_args = {
            "id": new_obs_id, "trace_id": preserved_trace_id, "name": source_obs.name,
            "start_time": source_obs.start_time, "metadata": obs_metadata or None,
            "input": source_obs.input, "output": source_obs.output, "level": source_obs.level,
            "status_message": source_obs.status_message, "parent_observation_id": new_parent_observation_id,
            "version": source_obs.version, "environment": source_obs.environment,
        }

        event_body = None; ingestion_event_type = None
        event_specific_timestamp = safe_isoformat(dt.datetime.now(dt.timezone.utc))
        if not event_specific_timestamp: print(f"Error: Could not format timestamp for obs {new_obs_id}. Skipping."); continue

        try:
            if source_obs.type == "SPAN":
                event_body = CreateSpanBody(**common_body_args, end_time=source_obs.end_time)
                ingestion_event_type = IngestionEvent_SpanCreate
            elif source_obs.type == "EVENT":
                event_body = CreateEventBody(**common_body_args)
                ingestion_event_type = IngestionEvent_EventCreate
            elif source_obs.type == "GENERATION":
                usage_to_pass = None
                if isinstance(source_obs.usage, Usage):
                    usage_data = {k: getattr(source_obs.usage, k, None) for k in ['input', 'output', 'total', 'unit', 'input_cost', 'output_cost', 'total_cost']}
                    filtered_usage_data = {k: v for k, v in usage_data.items() if v is not None}
                    if filtered_usage_data: usage_to_pass = Usage(**filtered_usage_data)
                elif source_obs.usage is not None: print(f"Warning: Obs {source_obs.id} has usage type {type(source_obs.usage)}. Skipping.")

                event_body = CreateGenerationBody(
                    **common_body_args, end_time=source_obs.end_time,
                    completion_start_time=source_obs.completion_start_time,
                    model=source_obs.model, model_parameters=model_params_mapped,
                    usage=usage_to_pass, cost_details=source_obs.cost_details,
                    usage_details=source_obs.usage_details,
                    prompt_name=getattr(source_obs, 'prompt_name', None),
                    prompt_version=getattr(source_obs, 'prompt_version', None),
                )
                ingestion_event_type = IngestionEvent_GenerationCreate
            else: print(f"Warning: Unknown obs type '{source_obs.type}' for ID {source_obs.id}. Skipping."); continue

            if event_body and ingestion_event_type:
                event_envelope_id = str(uuid.uuid4())
                ingestion_events.append(
                    ingestion_event_type(id=event_envelope_id, timestamp=event_specific_timestamp, body=event_body)
                )
        except Exception as e: print(f"Error creating obs body for {source_obs.id} (type: {source_obs.type}): {e}"); continue

    # 3. Create Score Events
    for source_score in source_trace.scores:
        new_score_id = str(uuid.uuid4())
        new_observation_id = obs_id_map.get(source_score.observation_id) if source_score.observation_id else None
        score_metadata = source_score.metadata if isinstance(source_score.metadata, dict) else {}

        score_body_value = None
        if source_score.data_type == "CATEGORICAL":
            # For categorical, use the string_value field from the source
             if hasattr(source_score, 'string_value') and isinstance(getattr(source_score, 'string_value', None), str):
                 score_body_value = source_score.string_value
             else:
                 # Fallback or warning if string_value is missing for categorical
                 print(f"      Warning: Categorical score {source_score.id} is missing string_value. Attempting to use numeric value '{source_score.value}' as string.")
                 score_body_value = str(source_score.value) if source_score.value is not None else None

        elif source_score.data_type in ["NUMERIC", "BOOLEAN"]:
            # For numeric/boolean, use the numeric value field
            score_body_value = source_score.value # Already float or None
        else:
            print(f"      Warning: Unknown score dataType '{source_score.data_type}' for score {source_score.id}. Attempting numeric value.")
            score_body_value = source_score.value

        # If after all checks, value is still None, skip score
        if score_body_value is None:
             print(f"      Warning: Could not determine valid value for score {source_score.id} (dataType: {source_score.data_type}). Skipping score.")
             continue

        try:
            score_body = ScoreBody(
                id=new_score_id,
                trace_id=preserved_trace_id,
                name=source_score.name,
                # Pass the correctly typed value
                value=score_body_value,
                # string_value field might not be needed if value holds the category string
                # string_value=string_value if source_score.data_type == "CATEGORICAL" else None, # Optional: maybe pass string_value only for categorical?
                source=source_score.source,
                comment=source_score.comment,
                observation_id=new_observation_id,
                timestamp=source_score.timestamp,
                config_id=source_score.config_id,
                metadata=score_metadata or None,
                data_type=source_score.data_type,
                environment=source_score.environment,
            )
            event_timestamp_str = safe_isoformat(dt.datetime.now(dt.timezone.utc))
            if not event_timestamp_str: print(f"Error: Could not format timestamp for score {new_score_id}. Skipping."); continue
            event_envelope_id = str(uuid.uuid4())
            ingestion_events.append(
                IngestionEvent_ScoreCreate(id=event_envelope_id, timestamp=event_timestamp_str, body=score_body)
            )
        except Exception as e: print(f"Error creating score body for {source_score.id}: {e}"); continue

    return ingestion_events

def parse_datetime(datetime_str):
    """Parses an ISO 8601 datetime string into a timezone-aware datetime object."""
    if not datetime_str:
        return None
    try:
        # Handle Z explicitly for robust parsing across Python versions
        if isinstance(datetime_str, str) and datetime_str.endswith('Z'):
            datetime_str = datetime_str[:-1] + '+00:00'
        # Try parsing
        dt_obj = dt.datetime.fromisoformat(datetime_str)
        # Add timezone if naive (assume UTC)
        if dt_obj.tzinfo is None:
            dt_obj = dt_obj.replace(tzinfo=dt.timezone.utc)
        return dt_obj
    except ValueError:
        print(f"Error: Could not parse datetime string '{datetime_str}'. Ensure ISO 8601 format.")
        return None
    except TypeError:
         print(f"Error: Expected string for datetime parsing, got {type(datetime_str)}.")
         return None

def migrate_traces(source_config, dest_config, from_timestamp_str=None, to_timestamp_str=None, sleep_between_gets=0.7, sleep_between_batches=0.5, max_retries=4):
    """
    Migrates traces from a source Langfuse project to a destination project.
    Includes delays and retries for rate limiting. Preserves original Trace IDs.
    """
    try:
        langfuse_source = Langfuse(
            public_key=source_config["public_key"],
            secret_key=source_config["secret_key"],
            host=source_config.get("host", "https://cloud.langfuse.com")
        )
        print(f"Source client initialized for host: {langfuse_source.base_url}")
        langfuse_source.auth_check()
        print("Source credentials verified.")
    except Exception as e:
        print(f"Error initializing or verifying source Langfuse client: {e}")
        sys.exit(1)

    try:
        langfuse_destination = Langfuse(
            public_key=dest_config["public_key"],
            secret_key=dest_config["secret_key"],
            host=dest_config.get("host", "https://cloud.langfuse.com")
        )
        print(f"Destination client initialized for host: {langfuse_destination.base_url}")
        langfuse_destination.auth_check()
        print("Destination credentials verified.")
    except Exception as e:
        print(f"Error initializing or verifying destination Langfuse client: {e}")
        sys.exit(1)

    from_timestamp = parse_datetime(from_timestamp_str)
    to_timestamp = parse_datetime(to_timestamp_str)

    if from_timestamp_str and not from_timestamp: sys.exit(1)
    if to_timestamp_str and not to_timestamp: sys.exit(1)

    print("\nFetching and migrating traces...")
    page = 1
    limit = 50
    total_migrated = 0
    total_failed_fetch = 0
    total_failed_transform = 0
    total_failed_push = 0

    while True:
        print(f"\n--- Processing page {page} ---")
        fetch_list_success = False
        list_retries = 0
        trace_list = None
        while not fetch_list_success and list_retries < max_retries:
            try:
                trace_list = langfuse_source.api.trace.list(
                    page=page, limit=limit, order_by="timestamp.asc",
                    from_timestamp=from_timestamp, to_timestamp=to_timestamp
                )
                fetch_list_success = True

            except Exception as e:
                list_retries += 1
                print(f"  Error fetching trace list page {page} (Attempt {list_retries}/{max_retries}): {e}")
                if "429" in str(e):
                    sleep_time = 2 ** list_retries
                    print(f"    Rate limit hit on list(). Sleeping for {sleep_time}s...")
                    time.sleep(sleep_time)
                elif list_retries >= max_retries:
                    print("    Max retries reached for fetching list. Stopping migration.")
                    sys.exit(1)
                else:
                    if list_retries == 1: time.sleep(2)
                    else:
                        print("    Non-rate-limit error fetching list. Stopping migration.")
                        sys.exit(1)

        if not fetch_list_success or trace_list is None or not trace_list.data:
            if trace_list is None or not trace_list.data: print("No more traces found on this page or in total.")
            break

        print(f"  Fetched {len(trace_list.data)} trace summaries on page {trace_list.meta.page}/{getattr(trace_list.meta, 'total_pages', 'N/A')}.")

        # Store event details for better error reporting if batch fails
        current_batch_event_map = {}

        for trace_info in trace_list.data:
            source_trace_id = trace_info.id
            print(f"    Processing source trace ID: {source_trace_id}")
            source_trace_full = None
            ingestion_batch = None

            # Fetch full trace details with retry
            fetch_detail_success = False
            detail_retries = 0
            while not fetch_detail_success and detail_retries < max_retries:
                 current_sleep_get = sleep_between_gets * (2 ** detail_retries)
                 time.sleep(current_sleep_get)
                 try:
                     source_trace_full = langfuse_source.api.trace.get(source_trace_id)
                     fetch_detail_success = True
                 except Exception as e:
                     detail_retries += 1
                     print(f"      Error fetching details for trace {source_trace_id} (Attempt {detail_retries}/{max_retries}): {e}")
                     if "429" in str(e):
                          sleep_time = 2 ** detail_retries
                          print(f"        Rate limit hit on get(). Sleeping for {sleep_time}s...")
                          time.sleep(sleep_time)
                     elif detail_retries >= max_retries:
                          print(f"        Max retries reached fetching details for trace {source_trace_id}.")
                          total_failed_fetch += 1
                     else: # Non-429 error
                          print(f"        Non-rate-limit error fetching details for trace {source_trace_id}. Failing this trace.")
                          total_failed_fetch += 1
                          break # Stop retrying this trace's fetch

            if not fetch_detail_success: continue # Skip to next trace

            # Transform trace
            try:
                ingestion_batch = transform_trace_to_ingestion_batch(source_trace_full)
                if not ingestion_batch:
                    print(f"      Skipping trace {source_trace_id} due to transformation error (returned empty batch).")
                    total_failed_transform += 1
                    continue
                # Store event details for potential error logging
                current_batch_event_map = {event.id: event for event in ingestion_batch}
            except Exception as e:
                print(f"      Critical Error transforming trace {source_trace_id}: {e}")
                total_failed_transform += 1
                continue # Skip to next trace

            # Push the batch with retry
            push_success = False
            push_retries = 0
            while not push_success and push_retries < max_retries:
                current_sleep_batch = sleep_between_batches * (2 ** push_retries)
                time.sleep(current_sleep_batch)
                try:
                    ingestion_response = langfuse_destination.api.ingestion.batch(batch=ingestion_batch)
                    push_success = True # Mark as attempted

                    if ingestion_response.errors:
                        print(f"      Ingestion completed with errors for trace {source_trace_id}:")
                        total_failed_push += 1 # Count trace as failed if any event fails
                        for i, error_detail in enumerate(ingestion_response.errors):
                            status = getattr(error_detail, 'status', 'N/A')
                            message = getattr(error_detail, 'message', 'No message')
                            failed_event_id = getattr(error_detail, 'id', None) # Use the ID from the error
                            failed_event = current_batch_event_map.get(failed_event_id) if failed_event_id else None

                            print(f"        Error {i+1}: Status={status}, Message={message}")
                            if failed_event:
                                print(f"          Failed Event Type: {getattr(failed_event, 'type', 'Unknown')}")
                                try:
                                    body_str = json.dumps(failed_event.body.dict(), indent=2, default=str, ensure_ascii=False)
                                    print(f"          Failed Event Body (truncated): {body_str[:1000]}{'...' if len(body_str) > 1000 else ''}")
                                except Exception as dump_err: print(f"          Failed Event Body: <Could not serialize: {dump_err}>")
                            else: print(f"          Failed Event ID: {failed_event_id} (Could not find matching event in batch)")
                        break # Break retry loop even if errors occurred, as batch was processed partially
                    else:
                        print(f"      Successfully ingested trace {source_trace_id}")
                        total_migrated += 1

                except Exception as e:
                    push_retries += 1
                    print(f"      Error pushing batch for trace {source_trace_id} (Attempt {push_retries}/{max_retries}): {e}")
                    if "429" in str(e):
                        sleep_time = 2 ** push_retries
                        print(f"        Rate limit hit on batch(). Sleeping for {sleep_time}s...")
                        time.sleep(sleep_time)
                    elif push_retries >= max_retries:
                         print(f"        Max retries reached pushing batch for trace {source_trace_id}.")
                         total_failed_push += 1
                    else: # Non-429 error during push attempt
                         print(f"        Non-rate-limit error pushing batch for trace {source_trace_id}. Failing this trace.")
                         total_failed_push += 1
                         break # Stop retrying push for this trace

            # Ensure loop eventually terminates if push fails after retries
            if not push_success and push_retries >= max_retries: continue


        current_page_meta = getattr(trace_list.meta, 'page', page)
        total_pages_meta = getattr(trace_list.meta, 'total_pages', page)
        if current_page_meta >= total_pages_meta:
             print("Processed the last page according to metadata.")
             break
        page += 1


    print("\n--- Migration Summary ---")
    print(f"Successfully migrated traces (all events ingested without reported errors): {total_migrated}")
    print(f"Failed fetching details (after retries): {total_failed_fetch}")
    print(f"Failed transforming data (incl. skipping): {total_failed_transform}")
    print(f"Failed pushing batch or ingested with errors (after retries): {total_failed_push}")
    print("-------------------------\n")


if __name__ == "__main__":
    print("Langfuse Traces Migration Script")
    print("--------------------------------")
    print("WARNING: Migrates full trace data. PRESERVES ORIGINAL TRACE IDS.")
    print("Ensure no ID collisions in the destination project!")
    print("Includes retries with exponential backoff for rate limiting.")
    print("--------------------------------\n")

    source_pk = os.getenv("LANGFUSE_SOURCE_PUBLIC_KEY")
    source_sk = os.getenv("LANGFUSE_SOURCE_SECRET_KEY")
    source_host = os.getenv("LANGFUSE_SOURCE_HOST", "https://cloud.langfuse.com")

    dest_pk = os.getenv("LANGFUSE_DEST_PUBLIC_KEY")
    dest_sk = os.getenv("LANGFUSE_DEST_SECRET_KEY")
    dest_host = os.getenv("LANGFUSE_DEST_HOST", "https://cloud.langfuse.com")

    from_ts = os.getenv("LANGFUSE_MIGRATE_FROM_TIMESTAMP")
    to_ts = os.getenv("LANGFUSE_MIGRATE_TO_TIMESTAMP")

    sleep_get = float(os.getenv("LANGFUSE_MIGRATE_SLEEP_GET", 0.7))
    sleep_batch = float(os.getenv("LANGFUSE_MIGRATE_SLEEP_BATCH", 0.5))
    max_retries_config = int(os.getenv("LANGFUSE_MIGRATE_MAX_RETRIES", 4))


    if not source_pk or not source_sk: print("Error: Source credentials env vars required."); sys.exit(1)
    if not dest_pk or not dest_sk: print("Error: Destination credentials env vars required."); sys.exit(1)

    source_credentials = {"public_key": source_pk, "secret_key": source_sk, "host": source_host}
    destination_credentials = {"public_key": dest_pk, "secret_key": dest_sk, "host": dest_host}

    print(f"Source Host: {source_host}"); print(f"Destination Host: {dest_host}")
    if from_ts: print(f"Filtering FROM timestamp: {from_ts}")
    if to_ts: print(f"Filtering TO timestamp: {to_ts}")
    print(f"Base sleep between trace detail fetches: {sleep_get}s")
    print(f"Base sleep between ingestion batches: {sleep_batch}s")
    print(f"Max retries on rate limit: {max_retries_config}")

    confirmation = input("\nProceed with trace migration? (yes/no): ").lower()
    if confirmation == 'yes':
        migrate_traces(source_credentials, destination_credentials, from_ts, to_ts, sleep_get, sleep_batch, max_retries_config)
    else: print("Migration cancelled by user.")
```

## Section III – Migrating Datasets

This section covers migrating datasets, dataset items, and dataset runs (used for evaluations and experiments).


```python
import os
import sys
import time
import uuid
import datetime as dt
from langfuse import Langfuse
from langfuse.api.resources.datasets.types import CreateDatasetRequest
from langfuse.api.resources.dataset_items.types import CreateDatasetItemRequest
from langfuse.api.resources.dataset_run_items.types import CreateDatasetRunItemRequest
# Import DatasetStatus if you need to explicitly check/set it (not needed for the fix)
# from langfuse.api.resources.commons.types import DatasetStatus

# --- Helper Function for Datetime Parsing ---
def parse_datetime(datetime_str):
    if not datetime_str: return None
    try:
        if isinstance(datetime_str, str) and datetime_str.endswith('Z'):
            datetime_str = datetime_str[:-1] + '+00:00'
        dt_obj = dt.datetime.fromisoformat(datetime_str)
        if dt_obj.tzinfo is None: dt_obj = dt_obj.replace(tzinfo=dt.timezone.utc)
        return dt_obj
    except ValueError:
        print(f"Error: Could not parse datetime string '{datetime_str}'. Ensure ISO 8601 format.")
        return None
    except TypeError:
         print(f"Error: Expected string for datetime parsing, got {type(datetime_str)}.")
         return None

# --- Main Migration Function ---
def migrate_datasets(source_config, dest_config, sleep_between_calls=0.4):
    """
    Migrates Datasets, Dataset Items, and Dataset Run Items from source to destination.
    ASSUMES Traces/Observations were previously migrated PRESERVING ORIGINAL IDs.
    Generates new IDs for Datasets and Dataset Items in the destination.
    Copies original item metadata exactly. Forces migrated Items to be ACTIVE.
    """
    try:
        langfuse_source = Langfuse(
            public_key=source_config["public_key"], secret_key=source_config["secret_key"],
            host=source_config.get("host", "https://cloud.langfuse.com")
        )
        print(f"Source client initialized for host: {langfuse_source.base_url}")
        langfuse_source.auth_check(); print("Source credentials verified.")
    except Exception as e: print(f"Error source client: {e}"); sys.exit(1)

    try:
        langfuse_destination = Langfuse(
            public_key=dest_config["public_key"], secret_key=dest_config["secret_key"],
            host=dest_config.get("host", "https://cloud.langfuse.com")
        )
        print(f"Destination client initialized for host: {langfuse_destination.base_url}")
        langfuse_destination.auth_check(); print("Destination credentials verified.")
    except Exception as e: print(f"Error destination client: {e}"); sys.exit(1)

    print("\n--- Starting Dataset Migration ---")
    datasets_migrated = 0; datasets_skipped = 0; datasets_failed = 0
    items_migrated = 0; items_failed = 0
    run_links_created = 0; run_links_failed = 0

    page_ds = 1; limit_ds = 100

    while True:
        print(f"\nFetching page {page_ds} of datasets...")
        time.sleep(sleep_between_calls)
        try:
            datasets_list = langfuse_source.api.datasets.list(page=page_ds, limit=limit_ds)
            if not datasets_list.data: print("No more datasets found."); break
            print(f"  Fetched {len(datasets_list.data)} datasets.")
        except Exception as e:
            print(f"  Error fetching datasets list page {page_ds}: {e}"); datasets_failed += 1; break

        for source_dataset in datasets_list.data:
            print(f"\n  Processing Dataset: '{source_dataset.name}' (ID: {source_dataset.id})")
            dest_dataset_exists = False
            item_id_map = {} # Reset map for each dataset

            # 1. Create/Check Dataset in Destination
            try:
                time.sleep(sleep_between_calls)
                try:
                     langfuse_destination.api.datasets.get(dataset_name=source_dataset.name)
                     print(f"    Dataset '{source_dataset.name}' already exists in destination. Skipping creation.")
                     dest_dataset_exists = True; datasets_skipped += 1
                except Exception as get_err:
                     if "404" in str(get_err):
                         print(f"    Dataset '{source_dataset.name}' not found in destination. Creating...")
                         create_ds_req = CreateDatasetRequest(
                             name=source_dataset.name, description=source_dataset.description, metadata=source_dataset.metadata
                         )
                         time.sleep(sleep_between_calls)
                         created_dataset = langfuse_destination.api.datasets.create(request=create_ds_req)
                         print(f"    Successfully created dataset '{created_dataset.name}' in destination.")
                         datasets_migrated += 1; dest_dataset_exists = True
                     else: print(f"    Error checking destination dataset '{source_dataset.name}': {get_err}"); datasets_failed += 1; continue
            except Exception as e: print(f"    Error creating/checking dataset '{source_dataset.name}' in destination: {e}"); datasets_failed += 1; continue
            if not dest_dataset_exists: continue

            # 2. Migrate Dataset Items
            print(f"    Fetching items for dataset '{source_dataset.name}'...")
            page_item = 1; limit_item = 100
            while True:
                # print(f"      Fetching page {page_item} of items...") # Less verbose logging
                time.sleep(sleep_between_calls)
                try:
                    items_list = langfuse_source.api.dataset_items.list(
                        dataset_name=source_dataset.name, page=page_item, limit=limit_item
                    )
                    if not items_list.data: break # Done with items for this dataset
                    # print(f"        Fetched {len(items_list.data)} items.") # Less verbose logging
                except Exception as e: print(f"        Error fetching items list page {page_item} for dataset '{source_dataset.name}': {e}"); items_failed += 999; break

                for source_item in items_list.data:
                    # print(f"          Migrating item ID: {source_item.id}") # Less verbose logging

                    # FIXED: Pass original metadata directly without modification
                    create_item_req = CreateDatasetItemRequest(
                        dataset_name=source_dataset.name,
                        input=source_item.input,
                        expected_output=source_item.expected_output,
                        metadata=source_item.metadata, # Pass original metadata
                        # status=source_item.status, # Removed to default to ACTIVE
                    )
                    try:
                        time.sleep(sleep_between_calls)
                        created_item = langfuse_destination.api.dataset_items.create(request=create_item_req)
                        item_id_map[source_item.id] = created_item.id; items_migrated += 1
                    except Exception as e: print(f"          Error creating item (source ID {source_item.id}) in dest dataset '{source_dataset.name}': {e}"); items_failed += 1

                if items_list.meta.page >= getattr(items_list.meta, 'total_pages', page_item): break
                page_item += 1

            print(f"    Finished processing items for dataset '{source_dataset.name}'. Adding short delay before processing runs.")
            time.sleep(sleep_between_calls * 2)

            # 3. Migrate Dataset Run Items
            print(f"    Fetching runs for dataset '{source_dataset.name}'...")
            page_run = 1; limit_run = 100
            while True:
                # print(f"      Fetching page {page_run} of runs metadata...") # Less verbose logging
                time.sleep(sleep_between_calls)
                try:
                    runs_list = langfuse_source.api.datasets.get_runs(
                        dataset_name=source_dataset.name, page=page_run, limit=limit_run
                    )
                    if not runs_list.data: break # Done with runs for this dataset
                    # print(f"        Fetched {len(runs_list.data)} runs metadata.") # Less verbose logging
                except Exception as e: print(f"        Error fetching runs list page {page_run} for dataset '{source_dataset.name}': {e}"); run_links_failed += 999; break

                for source_run_summary in runs_list.data:
                     print(f"        Processing run: '{source_run_summary.name}'")
                     try:
                          time.sleep(sleep_between_calls)
                          source_run_full = langfuse_source.api.datasets.get_run(
                               dataset_name=source_dataset.name, run_name=source_run_summary.name
                          )
                     except Exception as e: print(f"          Error fetching full details for run '{source_run_summary.name}': {e}"); run_links_failed += 1; continue

                     for source_run_item in source_run_full.dataset_run_items:
                          new_dest_item_id = item_id_map.get(source_run_item.dataset_item_id)
                          if not new_dest_item_id: print(f"          Warning: Could not find dest mapping for source item ID {source_run_item.dataset_item_id} in run '{source_run_summary.name}'. Skipping link."); run_links_failed += 1; continue
                          if not source_run_item.trace_id and not source_run_item.observation_id: print(f"          Warning: Source run item for item {source_run_item.dataset_item_id} lacks trace/observation ID. Skipping link."); run_links_failed += 1; continue

                          run_metadata = source_run_summary.metadata # Pass original run metadata

                          create_run_item_req = CreateDatasetRunItemRequest(
                              run_name=source_run_summary.name,
                              dataset_item_id=new_dest_item_id,
                              trace_id=source_run_item.trace_id,
                              observation_id=source_run_item.observation_id,
                              run_description=source_run_summary.description,
                              metadata=run_metadata or None # Pass original run metadata here
                          )
                          try:
                              time.sleep(sleep_between_calls)
                              langfuse_destination.api.dataset_run_items.create(request=create_run_item_req)
                              run_links_created += 1
                          except Exception as e: print(f"          Error creating run item link for dest item {new_dest_item_id} in run '{source_run_summary.name}': {e}"); run_links_failed += 1

                if runs_list.meta.page >= getattr(runs_list.meta, 'total_pages', page_run): break
                page_run += 1

        if datasets_list.meta.page >= getattr(datasets_list.meta, 'total_pages', page_ds): print("Processed the last page of datasets."); break
        page_ds += 1

    print("\n--- Migration Summary ---")
    print(f"Datasets Migrated: {datasets_migrated}"); print(f"Datasets Skipped (Already Existed): {datasets_skipped}"); print(f"Datasets Failed: {datasets_failed}")
    print("---")
    print(f"Dataset Items Migrated: {items_migrated}"); print(f"Dataset Items Failed: {items_failed}")
    print("---")
    print(f"Dataset Run Item Links Created: {run_links_created}"); print(f"Dataset Run Item Links Failed/Skipped: {run_links_failed}")
    print("-------------------------\n")

# --- Main Execution Block ---
if __name__ == "__main__":
    print("Langfuse Datasets Migration Script")
    print("----------------------------------")
    print("WARNING: Migrates Datasets, Items, and Run Item links.")
    print("ASSUMES TRACES/OBSERVATIONS WERE MIGRATED PRESERVING ORIGINAL IDs.")
    print("Generates new IDs for Datasets and Items (forced ACTIVE) in the destination.")
    print("Copies original item metadata without modification.")
    print("----------------------------------\n")

    source_pk = os.getenv("LANGFUSE_SOURCE_PUBLIC_KEY"); source_sk = os.getenv("LANGFUSE_SOURCE_SECRET_KEY")
    source_host = os.getenv("LANGFUSE_SOURCE_HOST", "https://cloud.langfuse.com")
    dest_pk = os.getenv("LANGFUSE_DEST_PUBLIC_KEY"); dest_sk = os.getenv("LANGFUSE_DEST_SECRET_KEY")
    dest_host = os.getenv("LANGFUSE_DEST_HOST", "https://cloud.langfuse.com")
    sleep_calls = float(os.getenv("LANGFUSE_MIGRATE_SLEEP", 0.4))

    if not source_pk or not source_sk: print("Error: Source credentials env vars required."); sys.exit(1)
    if not dest_pk or not dest_sk: print("Error: Destination credentials env vars required."); sys.exit(1)

    source_credentials = {"public_key": source_pk, "secret_key": source_sk, "host": source_host}
    destination_credentials = {"public_key": dest_pk, "secret_key": dest_sk, "host": dest_host}

    print(f"Source Host: {source_host}"); print(f"Destination Host: {dest_host}")
    print(f"Sleep between API calls: {sleep_calls}s")

    confirmation = input("\nProceed with dataset migration (ASSUMING Trace IDs were preserved)? (yes/no): ").lower()
    if confirmation == 'yes':
        migrate_datasets(source_credentials, destination_credentials, sleep_calls)
    else: print("Migration cancelled by user.")

```

## Other Possible Migratable Objects

The Langfuse Public API allows migrating other configuration objects, although they are less commonly required than prompts, traces, and datasets. Implementing their migration follows a similar pattern (list from source, create in destination).

*   **Score Configs (`/api/public/score-configs`):** Define configurations for how scores are calculated or displayed (e.g., category mappings, numeric ranges). Useful if you rely heavily on predefined score structures. [API Ref](https://api.reference.langfuse.com/#tag/Score-Configs)
*   **Model Definitions (`/api/public/models`):** Define custom model pricing or metadata for models not built-in to Langfuse. [API Ref](https://api.reference.langfuse.com/#tag/Models)
*   **Annotation Queues:** (https://api.reference.langfuse.com/#tag/annotationqueues)

## UI / Manual Migration

Some Langfuse features are primarily managed through the UI and do not currently have direct Public API endpoints for creation or migration:

*   **Model-Based Evaluators:** Configurations for running evaluations using LLMs (e.g., "LLM-as-a-Judge"). These need to be recreated manually in the destination project's UI.
*   **Dashboards:** Custom analytics dashboards created in the UI. You can often export the dashboard configuration as JSON from the source UI and import it into the destination UI.
*   **RBAC / Team Members:** User roles and permissions are managed at the project or organization level, typically through the UI or specific SSO/SCIM integrations (for self-hosted enterprise). They are not part of a standard project data migration via this script.
