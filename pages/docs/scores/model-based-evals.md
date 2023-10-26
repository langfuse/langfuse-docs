# Model-based Evals in Langfuse

Model-based evaluations are a powerful tool to automate the evaluation of production completions in Langfuse.

Currently, model-based evals can be applied to production data in Langfuse via the Python SDK. This gives you full flexibility to run various eval libraries on your production data and discover which work well for your use case.

**Coming soon**: support for running model-based evals directly from the Langfuse UI/Server.

## Example using Python SDK

> _This is a Jupyter Notebook_
> - [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/cookbook/evaluation_get_started.ipynb)
> - [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/cookbook/evaluation_get_started.ipynb)

This cookbook shows how model-based evaluations can be used to automate the evaluation of production completions in Langfuse. This example uses Langchain but any other eval library can be used as well. Which library is the best to use depends heavily on the use case.

This cookbook follows three steps:
1. Fetch production `generations` stored in Langfuse
2. Evaluate these `generations` using Langchain
3. Ingest results back into Langfuse as `scores`


----
Not using Langfuse yet? [Get started](/docs/get-started) by capturing LLM events.

### Setup

First you need to install Langfuse and Langchain via pip and then set the environment variables. The following table explains each of these:


| Variable | Description |
| --- | --- |
| LF_PK | Public API Key found in the Langfuse UI
| LF_SK | Secret API Key found in the Langfuse UI
| LF_HOST | Langfuse Host, defaults to `https://cloud.langfuse.com`
| EVAL_MODEL | OpenAI model used to evaluate each prompt/completion pair
| OPENAI_API_KEY | OpenAI API Key found in the OpenAI UI. Beware that executing evals results in API calls and costs.
| EVAL_TYPES | Dict of Langchain evals. Set to `True` to execute on each `Generation`.


```python
%pip install langfuse==1.0.23 langchain openai
```


```python
import os
os.environ['LF_PK'] = "pk-lf-..."
os.environ['LF_SK'] = "sk-lf-..."
os.environ['LF_HOST'] = "https://cloud.langfuse.com"

os.environ['EVAL_MODEL'] = "text-davinci-003"

os.environ["OPENAI_API_KEY"]='sk-...'

EVAL_TYPES={
    "hallucination": True,
    "conciseness": True,
    "relevance": True,
    "coherence": True,
    "harmfulness": True,
    "maliciousness": True,
    "helpfulness": True,
    "controversiality": True,
    "misogyny": True,
    "criminality": True,
    "insensitivity": True
}

```

Initialize the Langfuse Python SDK, more information [here](https://langfuse.com/docs/integrations/sdk/python#1-installation).


```python
from langfuse import Langfuse

langfuse = Langfuse(
    os.environ.get("LF_PK"),
    os.environ.get("LF_SK"),
    os.environ.get("LF_HOST"))
```

### Fetching data

Load all `generations` from Langfuse filtered by `name`, in this case `OpenAI`. Names are used in Langfuse to identify different types of generations within an application. Change it to the name you want to evaluate.

Checkout [docs](https://langfuse.com/docs/integrations/sdk/python#generation) on how to set the name when ingesting an LLM Generation.


```python
def fetch_all_pages(name=None, user_id = None, limit=50):
    page = 1
    all_data = []

    while True:
        response = langfuse.get_generations(name=name, limit=limit, user_id=user_id, page=page)
        if not response.data:
            break

        all_data.extend(response.data)
        page += 1

    return all_data
```


```python
generations = fetch_all_pages(user_id='user:abc')
print(len(generations))
```

### Set up evaluation functions

In this section, we define functions to set up the Langchain eval based on the entries in `EVAL_TYPES`. Hallucinations require their own function. More on the Langchain evals can be found [here](https://python.langchain.com/docs/guides/evaluation/string/criteria_eval_chain).


```python
from langchain.evaluation import load_evaluator, EvaluatorType
from langchain import PromptTemplate, OpenAI, LLMChain
from langchain.evaluation.criteria import LabeledCriteriaEvalChain

def get_evaluator_for_key(key: str):
  llm = OpenAI(temperature=0, model=os.environ.get('EVAL_MODEL'))
  return load_evaluator("criteria", criteria=key, llm=llm)

def get_hallucination_eval():
  criteria = {
    "hallucination": (
      "Does this submission contain information"
      " not present in the input or reference?"
    ),
  }
  llm = OpenAI(temperature=0, model=os.environ.get('EVAL_MODEL'))

  return LabeledCriteriaEvalChain.from_llm(
      llm=llm,
      criteria=criteria,
  )
```

### Execute evaluation

Below, we execute the evaluation for each `Generation` loaded above. Each score is ingested into Langfuse via [`langfuse.score()`](https://langfuse.com/docs/scores).



```python
from langfuse.model import InitialScore


def execute_eval_and_score():

  for generation in generations:
    criteria = [key for key, value in EVAL_TYPES.items() if value and key != "hallucination"]

    for criterion in criteria:
      eval_result = get_evaluator_for_key(criterion).evaluate_strings(
          prediction=generation.completion,
          input=generation.prompt,
      )
      print(eval_result)

      langfuse.score(InitialScore(name=criterion, traceId=generation.trace_id, observationId=generation.id, value=eval_result["score"], comment=eval_result['reasoning']))

execute_eval_and_score()

```


```python
# hallucination


def eval_hallucination():

  chain = get_hallucination_eval()

  for generation in generations:
    eval_result = chain.evaluate_strings(
      prediction=generation.completion,
      input=generation.prompt,
      reference=generation.prompt
    )
    print(eval_result)
    if eval_result is not None and eval_result["score"] is not None and eval_result["reasoning"] is not None:
      langfuse.score(InitialScore(name='hallucination', traceId=generation.trace_id, observationId=generation.id, value=eval_result["score"], comment=eval_result['reasoning']))

```


```python
if EVAL_TYPES.get("hallucination") == True:
  eval_hallucination()
```


```python
# SDK is async, make sure to await all requests
langfuse.flush()
```

### See Scores in Langfuse

 In the Langfuse UI, you can filter Traces by `Scores` and look into the details for each. Check out Langfuse Analytics to understand the impact of new prompt versions or application releases on these scores.

![Image of Trace](https://langfuse.com/images/docs/trace-conciseness-score.jpg)
_Example trace with conciseness score_


## Get in touch

Looking for a specific way to score your production data in Langfuse? Join the [Discord](https://langfuse.com/discord) and discuss your use case!
