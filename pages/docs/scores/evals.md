# Model based evals with Langfuse

- [View as notebook on GitHub](https://github.com/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_evals.ipynb)
- [Open as notebook in Google Colab](http://colab.research.google.com/github/langfuse/langfuse-docs/blob/main/src/ipynb/langfuse_docs_evals.ipynb)

Evaluating the quality of LLM outputs is most of the time manual and hence very time consuming, as reading large amounts of text takes a lot of time. This Cookbook shows, how this can be automated using data which was captured in [Langfuse](http://langfuse.com/) already.

This cookbook can be easily adjusted to use any eval library.

In this example we will:
1. Fetch `Generations` stored in Langfuse
2. Evaluate these `Generations` using Langchain
3. Submit results back to Langfuse


----
Not using Langfuse yet? Get started by capturing LLM events: [Python](https://langfuse.com/docs/integrations/sdk/python), [TS/JS](https://langfuse.com/docs/integrations/sdk/typescript)

## Setup

First we need to install `langfuse` and `langchain` set the environment variables. Afterwards, we initialise the SDK, more information can be found [here](https://langfuse.com/docs/integrations/sdk/python#1-installation).


```python
%pip install langfuse langchain openai
```


```python
import os
os.environ['LF_PK'] = "pk-lf-..."
os.environ['LF_SK'] = "sk-lf-..."
os.environ['EVAL_MODEL'] = "text-davinci-003"
os.environ['HOST'] = "https://cloud.langfuse.com"
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

langfuse = Langfuse(os.environ.get("LF_PK"), os.environ.get("LF_SK"), os.environ.get("HOST"))
```

## Fetching data

Below, we load all `Generations` from Langfuse by name. The name can be submitted via our SDKs when capturing LLM calls. See [docs](https://langfuse.com/docs/integrations/sdk/python#generation)


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

## Evaluation + submission to Langfuse

In this case we use the `conciseness` evaluation by Langchain to evaluate all the `Generations`. See the [docs](https://python.langchain.com/docs/guides/evaluation/) for Langfuse evaluations.
Each score is provided to Langchain via the [scoring API](https://langfuse.com/docs/scores).

After submitting all scores, they can be viewed in Langfuse.

![Image of Trace](https://langfuse.com/images/docs/trace.jpg)



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


```python
from langfuse.model import InitialScore



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

langfuse.flush()

```
