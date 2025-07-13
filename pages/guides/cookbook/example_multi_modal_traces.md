---
category: Examples
description: Examples of how to use multi-modality and attachments with the Langfuse Python SDK.
---

# Example: Multi-modality and attachments

These are examples of how to use multi-modality and attachments with the Langfuse Python SDK.

See the [multi-modality documentation](https://langfuse.com/docs/tracing-features/multi-modality) for more details.

## Setup

```python
%pip install langfuse langchain langchain_openai
```

```python
import os
from urllib.request import urlretrieve
from urllib.error import URLError

REPO_URL = "https://github.com/langfuse/langfuse-python"
download_path = "static"
os.makedirs(download_path, exist_ok=True)

test_files = ["puton.jpg", "joke_prompt.wav", "bitcoin.pdf"]
raw_url = f"{REPO_URL}/raw/main/{download_path}"

for file in test_files:
   try:
       urlretrieve(f"{raw_url}/{file}", f"{download_path}/{file}")
       print(f"Successfully downloaded: {file}")
   except URLError as e:
       print(f"Failed to download {file}: {e}")
   except OSError as e:
       print(f"Failed to save {file}: {e}")
```

    Successfully downloaded: puton.jpg
    Successfully downloaded: joke_prompt.wav
    Successfully downloaded: bitcoin.pdf

```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

```python
from langfuse.openai import openai
from langfuse import get_client
import base64

client = openai.OpenAI()

def encode_file(image_path):
    with open(image_path, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")
```

## OpenAI SDK: Images

```python
from langfuse import get_client

content_path = "static/puton.jpg"
content_type = "image/jpeg"

base64_image = encode_file(content_path)

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What’s in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:{content_type};base64,{base64_image}"
                    },
                },
            ],
        }
    ],
    max_tokens=300,
)

print(response.__dict__)

# Flush the trace
langfuse = get_client()
langfuse.flush()
```

    {'id': 'chatcmpl-Bhf794La4LhadJktsGaroFwbg2BIL', 'choices': [Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content="The image features a dog sitting on a person's lap with its front paws resting on their knee. The dog has a curly coat with black and white fur and appears to be happy, with its tongue out. In the background, there are people standing, likely engaged in conversation. The setting seems to be a cozy indoor space with wooden flooring and a colorful rug.", refusal=None, role='assistant', annotations=[], audio=None, function_call=None, tool_calls=None))], 'created': 1749745847, 'model': 'gpt-4o-mini-2024-07-18', 'object': 'chat.completion', 'service_tier': 'default', 'system_fingerprint': 'fp_62a23a81ef', 'usage': CompletionUsage(completion_tokens=72, prompt_tokens=25514, total_tokens=25586, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=0, reasoning_tokens=0, rejected_prediction_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cached_tokens=0)), '_request_id': 'req_da2df5cf5f1964746a107af72fb2daee'}

## OpenAI SDK: Audio input and output

```python
from langfuse import get_client

content_path = "static/joke_prompt.wav"

base64_string = encode_file(content_path)

response = client.chat.completions.create(
    model="gpt-4o-audio-preview",
    modalities=["text", "audio"],
    audio={"voice": "alloy", "format": "wav"},
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Do what this recording says."},
                {
                    "type": "input_audio",
                    "input_audio": {"data": base64_string, "format": "wav"},
                },
            ],
        },
    ],
)

print(response.__dict__)

# Flush the trace
langfuse = get_client()
langfuse.flush()
```

    {'id': 'chatcmpl-Bhf92tYBL9Swp2MwBkA7bCQPVe9Vh', 'choices': [Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content=None, refusal=None, role='assistant', annotations=[], audio=ChatCompletionAudio(id='audio_684b01341fd081918a825276eb36472b', data=<langfuse.media.LangfuseMedia object at 0x10d82a9c0>, expires_at=1749749572, transcript='Why did the Berlin Bear get lost in the city? Because he couldn\'t decide whether to take the U-Bahn, the S-Bahn, or just "bear"ly walk anywhere!'), function_call=None, tool_calls=None))], 'created': 1749745964, 'model': 'gpt-4o-audio-preview-2024-12-17', 'object': 'chat.completion', 'service_tier': 'default', 'system_fingerprint': 'fp_bf8dbd2ceb', 'usage': CompletionUsage(completion_tokens=245, prompt_tokens=66, total_tokens=311, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=194, reasoning_tokens=0, rejected_prediction_tokens=0, text_tokens=51), prompt_tokens_details=PromptTokensDetails(audio_tokens=49, cached_tokens=0, text_tokens=17, image_tokens=0)), '_request_id': 'req_ead21d343638b42eefb42e80e1621c63'}

## Python Decorator: Attachments via `LangfuseMedia`

```python
from langfuse import observe, get_client
from langfuse.media import LangfuseMedia

with open("static/bitcoin.pdf", "rb") as pdf_file:
        pdf_bytes = pdf_file.read()

wrapped_obj = LangfuseMedia(
    obj=pdf_bytes, content_bytes=pdf_bytes, content_type="application/pdf"
)

@observe()
def main():
    langfuse.update_current_trace(
        metadata={
            "context": wrapped_obj
        },
    )

    return # Limitation: LangfuseMedia object does not work in decorated function IO

main()

# Flush the trace
langfuse = get_client()
langfuse.flush()
```

## Langchain: Image input

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langfuse.langchain import CallbackHandler
from langfuse import get_client

# Initialize Langfuse CallbackHandler for Langchain (tracing)
handler = CallbackHandler()

model = ChatOpenAI(model="gpt-4o-mini")
image_data = encode_file("static/puton.jpg")

message = HumanMessage(
    content=[
        {"type": "text", "text": "What's in this image?"},
        {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_data}"},
        },
    ],
)

response = model.invoke([message], config={"callbacks": [handler]})

print(response.content)

# Flush the trace
langfuse = get_client()
langfuse.flush()
```

    The image features a dog with curly fur, sitting with its front paws resting on a person's knee. The dog appears to be friendly and is sticking out its tongue. In the background, there are a few people and some indoor furniture, suggesting a home environment. The floor has a colorful rug, and there are items like a basket and a leash visible.

## Custom via API

[Link to API docs](https://api.reference.langfuse.com/#tag--Media)

### Setup

```python
import os
import requests
import base64
import hashlib
import uuid

base_URL = os.getenv("LANGFUSE_HOST")
public_key = os.getenv("LANGFUSE_PUBLIC_KEY")
secret_key = os.getenv("LANGFUSE_SECRET_KEY")

file_path = "static/puton.jpg"

with open(file_path, "rb") as f:
    content_bytes = f.read()

content_type = "image/jpeg"
content_sha256 = base64.b64encode(hashlib.sha256(content_bytes).digest()).decode()
trace_id = str(uuid.uuid4())
content_length = len(content_bytes)
field = "input"  # or "output" or "metadata"

create_upload_url_body = {
    "traceId": trace_id,
    "contentType": content_type,
    "contentLength": content_length,
    "sha256Hash": content_sha256,
    "field": field,
}

create_upload_url_body
```

    {'traceId': '6f330ea4-0d96-4dfe-b4b4-d63daef4b240',
     'contentType': 'image/jpeg',
     'contentLength': 650780,
     'sha256Hash': 'i5BuV2qX9nPaAAPf7c0gCYPLPU2GS3VUFKctrbzTKu4=',
     'field': 'input'}

### Get upload URL and media ID

```python
upload_url_request = requests.post(
    f"{base_URL}/api/public/media",
    auth=(public_key or "", secret_key or ""),
    headers={"Content-Type": "application/json"},
    json=create_upload_url_body,
)

upload_url_response = upload_url_request.json()
upload_url_response
```

    {'mediaId': 'a78bf29d-e1ac-496e-8bb3-94cda265a2d5', 'uploadUrl': None}

Note: `uploadUrl` is `None` if the file is stored in Langfuse already as then there is no need to upload it again.

### Upload file

```python
# If there is no uploadUrl, file was already uploaded
if (
    upload_url_response["mediaId"] is not None
    and upload_url_response["uploadUrl"] is not None
):
    upload_response = requests.put(
        upload_url_response["uploadUrl"],
        headers={
            "Content-Type": content_type,
            "x-amz-checksum-sha256": content_sha256,
        },
        data=content_bytes,
    )

    print("File uploaded")
```

### Update upload status

```python
from datetime import datetime, timezone

if upload_response is not None:
    requests.patch(
        f"{base_URL}/api/public/media/{upload_url_response['mediaId']}",
        auth=(public_key or "", secret_key or ""),
        headers={"Content-Type": "application/json"},
        json={
            "uploadedAt": datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.%fZ'), # ISO 8601
            "uploadHttpStatus": upload_response.status_code,
            "uploadHttpError": upload_response.text if upload_response.status_code != 200 else None,
        },
    )

    print("Upload status updated")
```

### Fetch media link

```python
media_request = requests.get(
    f"{base_URL}/api/public/media/{upload_url_response['mediaId']}",
    auth=(public_key or "", secret_key or "")
)

media_response = media_request.json()
media_response

```

    {'mediaId': 'a78bf29d-e1ac-496e-8bb3-94cda265a2d5',
     'contentType': 'image/jpeg',
     'contentLength': 650780,
     'url': 'https://langfuse-prod-eu-media.s3.eu-west-1.amazonaws.com/cloramnkj0002jz088vzn1ja4/a78bf29d-e1ac-496e-8bb3-94cda265a2d5.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAXEFUNOYRIGEVFBHC%2F20250612%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20250612T163759Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBgaCWV1LXdlc3QtMSJIMEYCIQD7Bye8IP4T7lt9UOH1a8wi8U3aQQPBulSl0Crh2LJW8AIhALyDgSbqWFUYR5RDB7B4rzcNipoGo%2BnZYftAjBnKmJyxKv4DCPH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQABoMNDkwMDA0NjQxMzE0IgxjkSsssdQEnoxRrsQq0gMxV0ZdTUay4A1eOUes90KuMGQSn69pLzvcJYrlSGpXkQ53xt0bxYPq9Gnq1KMuAHIev9EZNaypWRfnGiPq%2BDaD11K0f8U%2BybkSidYIpUczc1jpexwGXCQtT9XrIVn%2BsnN3spstFPaBsLavfQcXZMHq3yWjbolV8fEDBfhTYuBcFHtA4ELvGGSCmgWJY0UXY3078NTGzRXu3xzDMQrlClkbjuxOC75hGEIG9vmnUI%2BcG1L5Azl%2Bg47x5RpV5Nq8v0ilvYp%2B%2FkAC25OFVnMPMfaP6a2afY8UNdJGEqtFTlJVKmWT0nVsgAz6zAKw8aX4%2FGF8%2FjhSRRqPs%2BpdWwvtbM68deHXbNNudhg2joyUwgg1lZ90T%2BWHIRgH2KniyuOCwxhVuIanxrb1CA7cgptP%2BLHbYlszFBOF96DiRewJPreimyCaOX04A14puVfneD73cD16HKG3SQUPksujL9ySw4M3d54hLiSEqYhOQEC0ZDbfe121cR6yaGpqBtiE0bduKWfr33gBdzuBJQAA8MfPQw00J90CCvowu0B103mD9HVVrBL%2B%2BNby%2FYEikMBBUgbSmrLJNUdWQuxewinHy7qgdKvnB3MM0b%2FoqVgaJ0fw%2Fyd9NsZRMPDyq8IGOqQBH7QoPjK0NHpgkP7RKAFwoUzsYnjM1LRWzZDRxUy7YYGPyeesdc%2F8jy9cdErvfe%2BNiaGnixd707uXxfbRnYWEPuwV2PvimO%2FnlKxsIRmW27mmYeo2FTo4QC%2BBa%2F1zNfCf6G%2FgDKkw8hF2YsNoACWHTBNeUcc2PZ%2FHYTq6eyQkBAj9FHCnmEmSiDk6NVKanuE2EOGpoxEAWuDxHqRB73LatwU9OOQ%3D&X-Amz-Signature=8c1d8c4a721f2eb882405cdd47e2514b55eac1efd634791b8ea963a07a1bca01&X-Amz-SignedHeaders=host&x-id=GetObject',
     'urlExpiry': '2025-06-12T17:37:59.356Z',
     'uploadedAt': '2024-11-14T10:44:32.535Z'}
