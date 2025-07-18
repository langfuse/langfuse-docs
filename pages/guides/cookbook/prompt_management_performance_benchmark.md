# Langfuse Prompt Management Performance Test

This notebook conducts a performance benchmark on Langfuse Prompt Management by measuring the latency of retrieving and compiling a prompt without caching (cache_ttl_seconds=0) over 1,000 sequential executions.

In practice, this latency does not matter as the prompt is cached client-side in the SDKs. Learn more about caching in the [Langfuse Prompt Management documentation](https://langfuse.com/docs/prompt-management/features/caching).

The test accounts for network latency, so absolute values may vary based on geography and load. Use the histogram and summary statistics to compare relative improvements, such as between SDK versions or caching settings.

The test requires a prompt named `perf-test` to be set up in the authenticated project.


```python
%pip install langfuse
```


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```


```python
import time
import pandas as pd
import matplotlib.pyplot as plt
from tqdm.auto import tqdm

from langfuse import Langfuse

# Initialize Langfuse client from environment variables
langfuse = Langfuse()

assert langfuse.auth_check(), "Langfuse client not initialized – check your environment variables."
```


```python
N_RUNS = 1_000
prompt_name = "perf-test"

durations = []
for _ in tqdm(range(N_RUNS), desc="Benchmarking"):
    start = time.perf_counter()
    prompt = langfuse.get_prompt(prompt_name, cache_ttl_seconds=0)
    prompt.compile(input="test")  # minimal compile to include server‑side processing
    durations.append(time.perf_counter() - start)
    time.sleep(0.05)

durations_series = pd.Series(durations, name="seconds")
```


```python
stats = durations_series.describe(percentiles=[0.25, 0.5, 0.75, 0.99])
stats
```

Our last performance test

```
count    1000.000000
mean        0.039335 sec
std         0.014172 sec
min         0.032702 sec
25%         0.035387 sec
50%         0.037030 sec
75%         0.041111 sec
99%         0.068914 sec
max         0.409609 sec
```


```python
plt.figure(figsize=(8,4))
plt.hist(durations_series, bins=30)
plt.xlabel("Execution time (sec)")
plt.ylabel("Frequency")
plt.show()
```

Our last performance test

![Chart](https://langfuse.com/images/docs/prompt-performance-chart.png)
