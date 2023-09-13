# Model based evals with Langfuse

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_evals.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_evals.ipynb)


Evaluating the quality of LLM features is very time consuming and error prone as it is very tiering and difficult to analyse large bodies of texts. This cookbook shows, how evals can be used to automate this. For this, we use the data we captured in [Langfuse](http://langfuse.com/) already.

While this cookbook contains a Langchain example, it can easily be adjusted to use any other eval library.

This cookbook follows three steps:
1. Fetch `Generations` stored in Langfuse
2. Evaluate these `Generations` using Langchain
3. Submit results back to Langfuse as `Scores`


----
Not using Langfuse yet? Get started by capturing LLM events: [Python](https://langfuse.com/docs/integrations/sdk/python), [TS/JS](https://langfuse.com/docs/integrations/sdk/typescript)

## Setup

First you need to install Langfuse and Langchain via pip and then set the environment variables. The following table explains each of these:


| Variable | Description |
| --- | --- |
| LF_PK | Public API Key found in the Langfuse UI
| LF_SK | Secret API Key found in the Langfuse UI
| LF_HOST | Langfuse Host, defaults to `https://cloud.langfuse.com`
| EVAL_MODEL | OpenAI model used to evaluate each prompt/completion pair
| OPENAI_API_KEY | OpenAI API Key found in the OpenAI UI. Beware that executing evals results in API calls and costs.
| EVAL_TYPES | Dict of Langchain evals to be executed per `Generation` if set to `True`.



Afterwards, we initialise the SDK, more information can be found [here](https://langfuse.com/docs/integrations/sdk/python#1-installation).


```python
%pip install langfuse langchain openai
```


```python
import os
os.environ['LF_PK'] = "pk-lf-..."
os.environ['LF_SK'] = "sk-lf-..."
os.environ['LF_HOST'] = "https://cloud.langfuse.com"

os.environ['EVAL_MODEL'] = "text-davinci-003"

os.environ["OPENAI_API_KEY"]='sk-...'

EVAL_TYPES={
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


```python
from langfuse import Langfuse

langfuse = Langfuse(os.environ.get("LF_PK"), os.environ.get("LF_SK"), os.environ.get("LF_HOST"))
```

## Fetching data

Below, we load all `Generations` from Langfuse filtered by name, in this case `OpenAI`. The name can be submitted via our SDKs when capturing LLM calls. See [docs](https://langfuse.com/docs/integrations/sdk/python#generation) on how to do that.


```python
def fetch_all_pages(name, limit=50):
    page = 1
    all_data = []

    while True:
        response = langfuse.get_generations(name=name, limit=limit, page=page)
        if not response.data:
            break

        all_data.extend(response.data)
        page += 1

    return all_data
```


```python
generations = fetch_all_pages(name="OpenAI")
print(len(generations))
```

    283


## Evaluation

In this section, we define a function to set up the Langchain eval based on the entries in `EVAL_TYPES`. More on the Langchain evals can be found [here](https://python.langchain.com/docs/guides/evaluation/).


```python
from langchain.evaluation import load_evaluator, EvaluatorType
from langchain import PromptTemplate, OpenAI, LLMChain
from langchain.evaluation.criteria import LabeledCriteriaEvalChain

def get_evaluator_for_key(key: str):
  llm = OpenAI(temperature=0, model=os.environ.get('EVAL_MODEL'))
  if key == 'hallucination':
    criteria = {
        "hallucination": (
            "Does this submission contain information"
            " not present in the input or reference?"
        ),
    }
    return LabeledCriteriaEvalChain.from_llm(
        llm=llm,
        criteria=criteria,
    )
  elif key == "correctness":
    evaluator = LabeledCriteriaEvalChain.from_llm(
      llm=llm,
      criteria='correctness',
   )
  else:
      return load_evaluator("criteria", criteria=key, llm=llm)

```

# Scoring

Below, we execute the evaluation for each `Generation` loaded above. Each score is provided to Langchain via the [scoring API](https://langfuse.com/docs/scores). In the Langfuse UI, you can filter Traces by `Scores` and look into the details for each.

![Image of Trace](https://langfuse.com/images/docs/trace.jpg)



```python
from langfuse.model import InitialScore


def execute_eval_and_score():

  for generation in generations:
    criteria = [key for key, value in EVAL_TYPES.items() if value]

    for criterion in criteria:
      print(criterion)
      eval_result = get_evaluator_for_key(criterion).evaluate_strings(
          prediction=generation.completion,
          input=generation.prompt,
      )
      print(eval_result)

      langfuse.score(InitialScore(name='conciseness', traceId=generation.trace_id, observationId=generation.id, value=eval_result["score"], comment=eval_result['reasoning']))

execute_eval_and_score()
langfuse.flush()

```

# Get in touch

Looking for a specific way to score your executions in Langfuse? Join the [Discord](https://langfuse.com/discord) and discuss your use case!
