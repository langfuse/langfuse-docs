---
title: "Langfuse Integration with Cleanlab"
description: "Automatically evaluate LLMs in real time with Cleanlab's trustworthy Language Model (TLM)"
---

# Automated Evaluations with Cleanlab

Cleanlab’s [Trustworthy Language Model](https://cleanlab.ai/tlm/) (TLM) enables Langfuse users to quickly identify low quality and hallucinated responses from any LLM trace.

## What is TLM?

TLM is an automated evaluation tool that add reliability and explainability to every LLM output. TLM automatically finds the poor quality and incorrect LLM responses lurking within your production logs and traces. This helps you perform better Evals, with significantly less manual review and annotation work to find these bad responses yourself. TLM also enables smart-routing for LLM-automated responses and decision-making using trustworthiness scores for every LLM output.

**TLM provides users with:**
- Trustworthiness scores and explanation for every LLM response
- Higher accuracy: rigorous [benchmarks](https://cleanlab.ai/blog/trustworthy-language-model/) show TLM consistently produces more accurate results than other LLMs like GPT 4/4o and Claude.
- Scalable API: designed to handle large datasets, TLM is suitable for most enterprise applications, including data extraction, tagging/labeling, Q&A (RAG), and more.

## Getting Started

This guide will walk you through the process of evaluating LLM responses captured in Langfuse with Cleanlab's Trustworthy Language Models (TLM).

### Install dependencies & Set environment variables

_**Note:** New Python SDK available (v3) - We have a new, improved SDK available based on OpenTelemetry. Please check out the [SDK v3](https://langfuse.com/docs/sdk/python/sdk-v3) for a more powerful and simpler to use SDK._


```python
%pip install "langfuse<3.0.0" openai cleanlab-tlm
```


```python
import os
import pandas as pd
from getpass import getpass
import dotenv
dotenv.load_dotenv()
```

### API Keys

This guide requires a Cleanlab TLM API key. If you don't have one, you can sign up for a free trial [here](https://tlm.cleanlab.ai/).

This guide requires four API keys:
- [Langfuse Public Key](https://us.cloud.langfuse.com/)
- [Langfuse Secret Key](https://us.cloud.langfuse.com/)
- [OpenAI API Key](https://platform.openai.com/api-keys)
- [Cleanlab TLM API Key](https://tlm.cleanlab.ai/)



```python
# Get keys for your project from the project settings page: https://cloud.langfuse.com

os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..." 
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region

os.environ["OPENAI_API_KEY"] = "<openai_api_key>"

os.environ["CLEANLAB_TLM_API_KEY"] = "<cleanlab_tlm_api_key>"
```

### Prepare trace dataset and load into Langfuse

For the sake of demonstration purposes, we'll briefly generate some traces and track them in Langfuse. Typically, you would have already captured traces in Langfuse and would skip to "Download trace dataset from Langfuse"

NOTE: TLM requires the entire input to the LLM to be provided. This includes any system prompts, context, or other information that was originally provided to the LLM to generate the response. Notice below that we include the system prompt in the trace metadata since by default the trace does not include the system prompt within the input.


```python
from langfuse.decorators import langfuse_context, observe
from openai import OpenAI

openai = OpenAI()
```


```python
# Let's use some tricky trivia questions to generate some traces
trivia_questions = [    
    "What is the 3rd month of the year in alphabetical order?",
    "What is the capital of France?",
    "How many seconds are in 100 years?",
    "Alice, Bob, and Charlie went to a café. Alice paid twice as much as Bob, and Bob paid three times as much as Charlie. If the total bill was $72, how much did each person pay?",
    "When was the Declaration of Independence signed?"
]

@observe()
def generate_answers(trivia_question):
    system_prompt = "You are a trivia master."

    # Update the trace with the question    
    langfuse_context.update_current_trace(
        name=f"Answering question: '{trivia_question}'",
        tags=["TLM_eval_pipeline"],
        metadata={"system_prompt": system_prompt}
    )

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": trivia_question},
        ],
    )
    
    answer = response.choices[0].message.content
    return answer


# Generate answers
answers = []
for i in range(len(trivia_questions)):
    answer = generate_answers(trivia_questions[i])
    answers.append(answer)  
    print(f"Question {i+1}: {trivia_questions[i]}")
    print(f"Answer {i+1}:\n{answer}\n")

print(f"Generated {len(answers)} answers and tracked them in Langfuse.")
```

    Question 1: What is the 3rd month of the year in alphabetical order?
    Answer 1:
    March
    
    Question 2: What is the capital of France?
    Answer 2:
    The capital of France is Paris.
    
    Question 3: How many seconds are in 100 years?
    Answer 3:
    There are 31,536,000 seconds in a year (60 seconds x 60 minutes x 24 hours x 365 days). Therefore, in 100 years, there would be 3,153,600,000 seconds.
    
    Question 4: Alice, Bob, and Charlie went to a café. Alice paid twice as much as Bob, and Bob paid three times as much as Charlie. If the total bill was $72, how much did each person pay?
    Answer 4:
    Let's call the amount Charlie paid x. 
    Alice paid twice as much as Bob, so she paid 2*(3x) = 6x.
    Bob paid three times as much as Charlie, so he paid 3x.
    
    We know the total bill was $72:
    x + 6x + 3x = 72
    10x = 72
    x = 7.2 
    
    Therefore, Charlie paid $7.20, Bob paid $21.60, and Alice paid $43.20.
    
    Question 5: When was the Declaration of Independence signed?
    Answer 5:
    The Declaration of Independence was signed on July 4, 1776.
    
    Generated 5 answers and tracked them in Langfuse.


Remember, the goal of this tutorial is to show you how to build an external evaluation pipeline. These pipelines will run in your CI/CD environment, or be run in a different orchestrated container service. No matter the environment you choose, three key steps always apply:


1.   **Fetch Your Traces**: Get your application traces to your evaluation environment
2.   **Run Your Evaluations**: Apply any evaluation logic you prefer
3.   **Save Your Results**: Attach your evaluations back to the Langfuse trace used for calculating them.

For the rest of the notebook, we'll have one goal:

---

🎯 Goal: ***Evaluate all traces run in the past 24 hours***

---

### Download trace dataset from Langfuse

Fetching traces from Langfuse is straightforward. Just set up the Langfuse client and use one of its functions to fetch the data. We'll fetch the traces and evaluate them. After that, we'll add our scores back into Langfuse.

The `fetch_traces()` function has arguments to filter the traces by tags, timestamps, and beyond. You can find more about other methods to [query traces](https://langfuse.com/docs/query-traces) in our docs.


```python
from langfuse import Langfuse
from datetime import datetime, timedelta

langfuse = Langfuse()
now = datetime.now()
one_day_ago = now - timedelta(hours=24)

traces = langfuse.fetch_traces(
    tags="TLM_eval_pipeline",
    from_timestamp=one_day_ago,
    to_timestamp=now,
).data

```

### Generate evaluations with TLM

Langfuse can handle numerical, boolean and categorical (`string`) scores.  Wrapping your custom evaluation logic in a function is often a good practice.

Instead of running TLM individually on each trace, we'll provide all of the prompt, response pairs in a list to TLM in a single call. This is more efficient and allows us to get scores and explanations for all of the traces at once. Then, using the `trace.id`, we can attach the scores and explanations back to the correct trace in Langfuse.


```python
from cleanlab_tlm import TLM

tlm = TLM(options={"log": ["explanation"]})
```


```python
# This helper method will extract the prompt and response from each trace and return three lists: trace ID's, prompts, and responses.
def get_prompt_response_pairs(traces):
    prompts = []
    responses = []
    for trace in traces:
        prompts.append(trace.metadata["system_prompt"] + "\n" + trace.input["args"][0])
        responses.append(trace.output)
    return prompts, responses

trace_ids = [trace.id for trace in traces]
prompts, responses = get_prompt_response_pairs(traces)
```

Now, let's use TLM to generate a `trustworthiness score` and `explanation` for each trace.

**IMPORTANT:** It is essential to always include any system prompts, context, or other information that was originally provided to the LLM to generate the response. You should construct the prompt input to `get_trustworthiness_score()` in a way that is as similar as possible to the original prompt. This is why we included the system prompt in the trace metadata.


```python
# Evaluate each of the prompt, response pairs using TLM
evaluations = tlm.get_trustworthiness_score(prompts, responses)

# Extract the trustworthiness scores and explanations from the evaluations
trust_scores = [entry["trustworthiness_score"] for entry in evaluations]
explanations = [entry["log"]["explanation"] for entry in evaluations]

# Create a DataFrame with the evaluation results
trace_evaluations = pd.DataFrame({
    'trace_id': trace_ids,
    'prompt': prompts,
    'response': responses, 
    'trust_score': trust_scores,
    'explanation': explanations
})
trace_evaluations
```

    Querying TLM... 100%|██████████|





<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>trace_id</th>
      <th>prompt</th>
      <th>response</th>
      <th>trust_score</th>
      <th>explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>2f0d41b2-9b89-4ba6-8b3f-7dadac8a8fae</td>
      <td>You are a trivia master.\nWhen was the Declara...</td>
      <td>The Declaration of Independence was signed on ...</td>
      <td>0.389889</td>
      <td>The proposed response states that the Declarat...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>f8e91744-3fcb-4ef5-b6c6-7cbcf0773144</td>
      <td>You are a trivia master.\nAlice, Bob, and Char...</td>
      <td>Let's denote the amount Charlie paid as C. \n\...</td>
      <td>0.669774</td>
      <td>This response is untrustworthy due to lack of ...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>f9b42125-4e5e-4533-bfbb-36c30490bd1d</td>
      <td>You are a trivia master.\nHow many seconds are...</td>
      <td>There are 3,153,600,000 seconds in 100 years.</td>
      <td>0.499818</td>
      <td>To calculate the number of seconds in 100 year...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>71b131b9-e706-41c7-9bfd-b77719783f29</td>
      <td>You are a trivia master.\nWhat is the capital ...</td>
      <td>The capital of France is Paris.</td>
      <td>0.987433</td>
      <td>Did not find a reason to doubt trustworthiness.</td>
    </tr>
    <tr>
      <th>4</th>
      <td>da0ee9fa-01cf-42ce-9e3e-e8d127ca105b</td>
      <td>You are a trivia master.\nWhat is the 3rd mont...</td>
      <td>March.</td>
      <td>0.114874</td>
      <td>To determine the 3rd month of the year in alph...</td>
    </tr>
  </tbody>
</table>
</div>



Awesome! Now we have a DataFrame mapping trace IDs to their scores and explanations. We've also included the prompt and response for each trace for demonstration purposes to find the **least trustworthy trace!**


```python
sorted_df = trace_evaluations.sort_values(by="trust_score", ascending=True).head()
sorted_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>trace_id</th>
      <th>prompt</th>
      <th>response</th>
      <th>trust_score</th>
      <th>explanation</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4</th>
      <td>da0ee9fa-01cf-42ce-9e3e-e8d127ca105b</td>
      <td>You are a trivia master.\nWhat is the 3rd mont...</td>
      <td>March.</td>
      <td>0.114874</td>
      <td>To determine the 3rd month of the year in alph...</td>
    </tr>
    <tr>
      <th>0</th>
      <td>2f0d41b2-9b89-4ba6-8b3f-7dadac8a8fae</td>
      <td>You are a trivia master.\nWhen was the Declara...</td>
      <td>The Declaration of Independence was signed on ...</td>
      <td>0.389889</td>
      <td>The proposed response states that the Declarat...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>f9b42125-4e5e-4533-bfbb-36c30490bd1d</td>
      <td>You are a trivia master.\nHow many seconds are...</td>
      <td>There are 3,153,600,000 seconds in 100 years.</td>
      <td>0.499818</td>
      <td>To calculate the number of seconds in 100 year...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>f8e91744-3fcb-4ef5-b6c6-7cbcf0773144</td>
      <td>You are a trivia master.\nAlice, Bob, and Char...</td>
      <td>Let's denote the amount Charlie paid as C. \n\...</td>
      <td>0.669774</td>
      <td>This response is untrustworthy due to lack of ...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>71b131b9-e706-41c7-9bfd-b77719783f29</td>
      <td>You are a trivia master.\nWhat is the capital ...</td>
      <td>The capital of France is Paris.</td>
      <td>0.987433</td>
      <td>Did not find a reason to doubt trustworthiness.</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Let's look at the least trustworthy trace.
print("Prompt: ", sorted_df.iloc[0]["prompt"], "\n")
print("OpenAI Response: ", sorted_df.iloc[0]["response"], "\n")
print("TLM Trust Score: ", sorted_df.iloc[0]["trust_score"], "\n")
print("TLM Explanation: ", sorted_df.iloc[0]["explanation"])
```

    Prompt:  You are a trivia master.
    What is the 3rd month of the year in alphabetical order? 
    
    OpenAI Response:  March. 
    
    TLM Trust Score:  0.11487442493072615 
    
    TLM Explanation:  To determine the 3rd month of the year in alphabetical order, we first list the months: January, February, March, April, May, June, July, August, September, October, November, December. When we arrange these months alphabetically, we get: April, August, December, February, January, July, June, March, May, November, October, September. In this alphabetical list, March is the 8th month, not the 3rd. The 3rd month in alphabetical order is actually December. Therefore, the proposed response is incorrect. 
    This response is untrustworthy due to lack of consistency in possible responses from the model. Here's one inconsistent alternate response that the model considered (which may not be accurate either): 
    December.


#### Awesome! TLM was able to identify multiple traces that contained incorrect answers from OpenAI.

Let's upload the `trust_score` and `explanation` columns to Langfuse.

### Upload evaluations to Langfuse


```python
for idx, row in trace_evaluations.iterrows():
    trace_id = row["trace_id"]
    trust_score = row["trust_score"]
    explanation = row["explanation"]
    
    # Add the trustworthiness score to the trace with the explanation as a comment
    langfuse.score(
            trace_id=trace_id,
            name="trust_score",
            value=trust_score,
            comment=explanation
        )
```

You should now see the TLM trustworthiness score and explanation in the Langfuse UI!

![Image of Langfuse platform showing Cleanlab's TLM trust score](https://langfuse.com/images/cookbook/integration-cleanlab/tlm_trust_scores.png)

If you click on a trace, you can also see the trust score and provided explanation.

![Image of Langfuse platform showing Cleanlab's TLM trust score and explanation](https://langfuse.com/images/cookbook/integration-cleanlab/tlm_trust_scores_explanation.png)
