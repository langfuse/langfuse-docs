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

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

# Your openai key
os.environ["OPENAI_API_KEY"] = ""
```


```python
from langfuse.openai import openai
import base64

client = openai.OpenAI()

def encode_file(image_path):
    with open(image_path, "rb") as file:
        return base64.b64encode(file.read()).decode("utf-8")
```

## OpenAI SDK: Images


```python
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

openai.flush_langfuse()
```

    {'id': 'chatcmpl-AVgfcbLDSfqWKWTZoFHyjnZuEgXcF', 'choices': [Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content='The image shows a dog with a curly coat, interacting with a person by placing its front paws on their lap. In the background, there are some people standing, and the setting appears to be a cozy interior with wooden flooring and a patterned rug. The dog looks happy and friendly.', refusal=None, role='assistant', audio=None, function_call=None, tool_calls=None))], 'created': 1732115556, 'model': 'gpt-4o-mini-2024-07-18', 'object': 'chat.completion', 'service_tier': None, 'system_fingerprint': 'fp_3de1288069', 'usage': CompletionUsage(completion_tokens=57, prompt_tokens=25514, total_tokens=25571, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=0, reasoning_tokens=0, rejected_prediction_tokens=0), prompt_tokens_details=PromptTokensDetails(audio_tokens=0, cached_tokens=0)), '_request_id': 'req_701836bd3ee49571c4aeb9600273cbda'}


## OpenAI SDK: Audio input and output


```python
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

openai.flush_langfuse()
```

    {'id': 'chatcmpl-AVgfgHKaVpqPK3HzJwV7kvhDC2CuY', 'choices': [Choice(finish_reason='stop', index=0, logprobs=None, message=ChatCompletionMessage(content=None, refusal=None, role='assistant', audio=ChatCompletionAudio(id='audio_673dfc6a54048190976c16d98c11dcd7', data=<langfuse.media.LangfuseMedia object at 0x78c13b074ac0>, expires_at=1732119162, transcript='Why do Berliners always carry a pencil? \n\nIn case they need to draw the line at a German comedy show!'), function_call=None, tool_calls=None))], 'created': 1732115560, 'model': 'gpt-4o-audio-preview-2024-10-01', 'object': 'chat.completion', 'service_tier': None, 'system_fingerprint': 'fp_6e2d124157', 'usage': CompletionUsage(completion_tokens=151, prompt_tokens=66, total_tokens=217, completion_tokens_details=CompletionTokensDetails(accepted_prediction_tokens=0, audio_tokens=115, reasoning_tokens=0, rejected_prediction_tokens=0, text_tokens=36), prompt_tokens_details=PromptTokensDetails(audio_tokens=49, cached_tokens=0, text_tokens=17, image_tokens=0)), '_request_id': 'req_59902b4718abb9dbc82b83b40a8eda72'}


## Python Decorator: Attachments via `LangfuseMedia`


```python
from langfuse import observe, langfuse
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

langfuse.flush()
```

## Langchain: Image input


```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langfuse.langchain import CallbackHandler
 
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

handler.flush()
```

    The image shows a dog with a curly coat, sitting in a living room environment. The dog appears to be resting its front paws on someone's knee and has a happy expression. There are also a few people in the background, but they are not the focus of the image. The setting has wooden flooring and a colorful area rug.


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




    {'traceId': 'dd10d875-2fc2-4c40-a392-7e90bcf73165',
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
     'url': 'https://langfuse-prod-eu-media.s3.eu-west-1.amazonaws.com/cloramnkj0002jz088vzn1ja4/a78bf29d-e1ac-496e-8bb3-94cda265a2d5.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAXEFUNOYRFMODTEQN%2F20241120%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Date=20241120T151614Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEPf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCWV1LXdlc3QtMSJGMEQCIBmbvq%2B9T4Mk5nsglfiNGOQHslPUA1p%2BKMvMDlurLatzAiAstT7tldVey%2Flc3T%2B7fFtmZ78MjlOLWdG6jnN4wCCpAyr%2BAwiQ%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F8BEAAaDDQ5MDAwNDY0MTMxNCIM4ULT67%2BGIK%2FH9CHXKtIDiEd2vWk8EYhtkYBTW%2FHx9jjiJEQlg%2F6F0GQcu7FfdegnUz132ie10Yspb1HUD3JEljFtwRNmkKkTn1u10r7FRA2HYoVjUNJBmXFuwEBDM6ag2pbqGWDdYYCy7v8%2F7W8i%2FipQNed%2BSWqqMl0Op646tt2oyaUcN7ee4r4i6xm3xcOXMtoNBacgvV%2F3TCMMnIB81mwrwxxBsLT1i5a4PD6%2FqOoglAho7G4s0DDyF0hL9xr%2BQDlg2ls6h3biOu6TUvl%2FOQL%2FiZsxZwL1YMhTlR1u2ib5%2BM7jF0AVNI9wz6b619xeIWiAhrHTLZruVj9WvIIor25Si592FqcIyP7kVdAnp6tVIIy6lJkguZlrkUPPrSor6qz5IvMF3jg0m0Ka5LlB8yvhWe3gGEQXLJ6%2BggbnQSiyOp47JhQI8qtdIkIW2wVv6yESRkOQHspTRKk4TCJQwKxu3MO6SChG2ZSXb%2FCk1g%2BtXQA6t%2B%2B7oHQC9bBjjg5lmAt4KByGulT7iksgV%2FNrYNMGPrJ7aNQOyU8Tg2NdHAArBWjjl4vFG5JDO%2FYuGVgD%2BT9apomLkUs7msHMmTvuGUXOYVc14g%2BdBGYgg3MkhcNTguxbn28WwQ5H3k4zvVxZwjD77fe5BjqmASX2LkNpRhuO6oDFgPiP3AC9BCgZ71yAIqfohGYo9K6DWGTO4i78mtRexHYfsQeCNC3bfGLscrFRdGn%2BZtPeFOifowUhHUpMkAZms%2Fja5h27whM0dd0Kmg%2B9sk%2FmAtY2yHgRpdx1IL8HWGHnAmuLK9BcRGbI%2F6y%2BfuGbgVx6d1qskisFjB9HtCtfDeMe4KxSJKawvMqKV3hJ8On0udsRkMkNiIGItmk%3D&X-Amz-Signature=dce937c9165dd0395517c1176c6dfbc99d42fa57d6f9c426a55114161aecbc7b&X-Amz-SignedHeaders=host&x-id=GetObject',
     'urlExpiry': '2024-11-20T16:16:14.110Z',
     'uploadedAt': '2024-11-14T10:44:32.535Z'}


