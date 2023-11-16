# Evaluation of RAG pipelines with Ragas

Langfuse offers the feature to score your traces and spans. They can be used in multiple ways across Langfuse:
1. Displayed on trace to provide a quick overview
2. Segment all execution traces by scores to e.g. find all traces with a low-quality score
3. Analytics: Detailed score reporting with drill downs into use cases and user segments

Ragas is an open-source tool that can help you run [Model-Based Evaluation](https://langfuse.com/docs/scores/model-based-evals) on your traces/spans, especially for RAG pipelines. Ragas can perform reference-free evaluations of various aspects of your RAG pipeline. Because it is reference-free you don't need ground-truths when running the evaluations and can run it on production traces that you've collected with Langfuse.

## The Environment


```python
import os

# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""

# your openai key
os.environ["OPENAI_API_KEY"] = ""

# if you do not use Langfuse Cloud
# os.environ["LANGFUSE_HOST"] = "http://localhost:3000"
```


```python
%pip install langfuse datasets ragas llama_index python-dotenv openai --upgrade
```

## The Data

For this example, we are going to use a dataset that has already been prepared by querying a RAG system and gathering its outputs. See below for instruction on how to fetch your production data from Langfuse.

The dataset contains the following columns
- `question`: list[str] - These are the questions your RAG pipeline will be evaluated on.
- `answer`: list[str] - The answer generated from the RAG pipeline and given to the user.
- `contexts`: list[list[str]] - The contexts which were passed into the LLM to answer the question.
- `ground_truths`: list[list[str]] - The ground truth answer to the questions. However, this can be ignored for online evaluations since we will not have access to ground-truth data in our case.


```python
from datasets import load_dataset

fiqa_eval = load_dataset("explodinggradients/fiqa", "ragas_eval")['baseline']
fiqa_eval
```

## The Metrics
For going to measure the following aspects of a RAG system. These metric are from the Ragas library:

1. [faithfulness](https://docs.ragas.io/en/latest/concepts/metrics/faithfulness.html): This measures the factual consistency of the generated answer against the given context.
2. [answer_relevancy](https://docs.ragas.io/en/latest/concepts/metrics/answer_relevance.html): Answer Relevancy, focuses on assessing how pertinent the generated answer is to the given prompt.
3. [context precision](https://docs.ragas.io/en/latest/concepts/metrics/context_precision.html): Context Precision is a metric that evaluates whether all of the ground-truth relevant items present in the contexts are ranked high. Ideally all the relevant chunks must appear at the top ranks. This metric is computed using the question and the contexts, with values ranging between 0 and 1, where higher scores indicate better precision.
4. [aspect_critique](https://docs.ragas.io/en/latest/concepts/metrics/critique.html): This is designed to assess submissions based on predefined aspects such as harmlessness and correctness. Additionally, users have the flexibility to define their own aspects for evaluating submissions according to their specific criteria.

Checkout the [RAGAS documentation](https://docs.ragas.io/en/latest/concepts/metrics/index.html) to know more about these metrics and how they work.


```python
# import metrics
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from ragas.metrics.critique import SUPPORTED_ASPECTS, harmfulness

# metrics you chose
metrics = [faithfulness, answer_relevancy, context_precision, harmfulness]

for m in metrics:
    print(m.name)
    # also init the metrics
    m.init_model()
```

## The Setup
You can use model-based evaluation with Ragas in 2 ways
1. Score each Trace: This means you will run the evaluations for each trace item. This gives you much better idea since of how each call to your RAG pipelines is performing but can be expensive
2. Score as Batch: In this method we will take a random sample of traces on a periodic basis and score them. This brings down cost and gives you a rough estimate the performance of your app but can miss out on important samples.

In this cookbook, we'll show you how to setup both.

## Score with Trace

Lets take a small example of a single trace and see how you can score that with Ragas. First lets load the data


```python
row = fiqa_eval[0]
row['question'], row['answer']
```




    ('How to deposit a cheque issued to an associate in my business into my business account?',
     '\nThe best way to deposit a cheque issued to an associate in your business into your business account is to open a business account with the bank. You will need a state-issued "dba" certificate from the county clerk\'s office as well as an Employer ID Number (EIN) issued by the IRS. Once you have opened the business account, you can have the associate sign the back of the cheque and deposit it into the business account.')



Now lets init a Langfuse client SDK to instrument you app.


```python
from langfuse import Langfuse

langfuse = Langfuse()
```

Here we are defining a utility function to score your trace with the metrics you chose.


```python
def score_with_ragas(query, chunks, answer):
    scores = {}
    for m in metrics:
        print(f"calculating {m.name}")
        scores[m.name] = m.score_single(
            {'question': query, 'contexts': chunks, 'answer': answer}
        )
    return scores
```

You compute the score with each request. Below I've outlined a dummy application that does the following steps
1. gets a question from the user
2. fetch context from the database or vector store that can be used to answer the question from the user
3. pass the question and the contexts to the LLM to generate the answer

All these step are logged as spans in a single trace in langfuse. You can read more about traces and spans from the [langfuse documentation](https://langfuse.com/docs/tracing).


```python
from langfuse.model import CreateTrace, CreateSpan, CreateGeneration, CreateEvent, CreateScore

# start a new trace when you get a question
question = row['question']
trace = langfuse.trace(CreateTrace(name = "rag"))

# retrieve the relevant chunks
# chunks = get_similar_chunks(question)
contexts = row['contexts']
# pass it as span
trace.span(CreateSpan(
    name = "retrieval", input={'question': question}, output={'contexts': contexts}
))

# use llm to generate a answer with the chunks
# answer = get_response_from_llm(question, chunks)
answer = row['answer']
trace.span(CreateSpan(
    name = "generation", input={'question': question, 'contexts': contexts}, output={'answer': answer}
))

# compute scores for the question, context, answer tuple
ragas_scores = score_with_ragas(question, contexts, answer)
ragas_scores
```

Once the scores are computed you can add them to the trace in Langfuse:


```python
# send the scores
for m in metrics:
    trace.score(CreateScore(name=m.name, value=ragas_scores[m.name]))
```

![Trace with RAGAS scores](https://langfuse.com/images/docs/ragas-trace-score.png)

Note that the scoring is blocking so make sure that you sent the generated answer before waiting for the scores to get computed. Alternatively you can run `score_with_ragas()` in a separate thread and pass in the trace_id to log the scores.

Or you can consider

## Scoring as batch

Scoring each production trace can be time-consuming and costly depending on your application architecture and traffic. In that case, it's better to start off with a batch scoring method. Decide a timespan you want to run the batch process and the number of traces you want to _sample_ from that time slice. Create a dataset and call `ragas.evaluate` to analyze the result.

You can run this periodically to keep track of how the scores are changing across timeslices and figure out if there are any discrepancies.

To create demo data in Langfuse, lets first create ~10 traces with the fiqa dataset.


```python
from langfuse.model import CreateTrace, CreateSpan, CreateGeneration, CreateEvent, CreateScore
# fiqa traces
for interaction in fiqa_eval.select(range(10, 20)):
    trace = langfuse.trace(CreateTrace(name = "rag"))
    trace.span(CreateSpan(
        name = "retrieval",
        input={'question': question},
        output={'contexts': contexts}
    ))
    trace.span(CreateSpan(
        name = "generation",
        input={'question': question, 'contexts': contexts},
        output={'answer': answer}
    ))

# await that Langfuse SDK has processed all events before trying to retrieve it in the next step
langfuse.flush()
```

Now that the dataset is uploaded to langfuse you can retrieve it as needed with this handy function.


```python
def get_traces(name=None, limit=None, user_id=None):
    all_data = []
    page = 1

    while True:
        response = langfuse.client.trace.list(
            name=name, page=page, user_id=user_id
        )
        if not response.data:
            break
        page += 1
        all_data.extend(response.data)
        if len(all_data) > limit:
            break

    return all_data[:limit]
```


```python
from random import sample

NUM_TRACES_TO_SAMPLE = 3
traces = get_traces(name='rag', limit=5)
traces_sample = sample(traces, NUM_TRACES_TO_SAMPLE)

len(traces_sample)
```

Now lets make a batch and score it. Ragas uses huggingface dataset object to build the dataset and run the evaluation. If you run this on your own production data, use the right keys to extract the question, contexts and answer from the trace


```python
# score on a sample
from random import sample

evaluation_batch = {
    "question": [],
    "contexts": [],
    "answer": [],
    "trace_id": [],
}

for t in traces_sample:
    observations = [langfuse.client.observations.get(o) for o in t.observations]
    for o in observations:
        if o.name == 'retrieval':
            question = o.input['question']
            contexts = o.output['contexts']
        if o.name=='generation':
            answer = o.output['answer']
    evaluation_batch['question'].append(question)
    evaluation_batch['contexts'].append(contexts)
    evaluation_batch['answer'].append(answer)
    evaluation_batch['trace_id'].append(t.id)
```


```python
# run ragas evaluate
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy

ds = Dataset.from_dict(evaluation_batch)
r = evaluate(ds, metrics=[faithfulness, answer_relevancy])
```

And that is it! You can see the scores over a time period.


```python
r
```

You can also push the scores back into Langfuse or use the exported pandas dataframe to run further analysis.


```python
df = r.to_pandas()

# add the langfuse trace_id to the result dataframe
df["trace_id"] = ds["trace_id"]

df.head()
```





  <div id="df-9332998e-f294-4e8b-a26a-f402c10402c7" class="colab-df-container">
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
      <th>question</th>
      <th>contexts</th>
      <th>answer</th>
      <th>faithfulness</th>
      <th>answer_relevancy</th>
      <th>trace_id</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>How to deposit a cheque issued to an associate...</td>
      <td>[Just have the associate sign the back and the...</td>
      <td>\nThe best way to deposit a cheque issued to a...</td>
      <td>1.0</td>
      <td>0.97749</td>
      <td>9a1db1ee-9177-4764-a8f5-53ae09c3f009</td>
    </tr>
    <tr>
      <th>1</th>
      <td>How to deposit a cheque issued to an associate...</td>
      <td>[Just have the associate sign the back and the...</td>
      <td>\nThe best way to deposit a cheque issued to a...</td>
      <td>1.0</td>
      <td>0.97749</td>
      <td>c8f005f2-21a3-4141-9a7f-125302f30bde</td>
    </tr>
    <tr>
      <th>2</th>
      <td>How to deposit a cheque issued to an associate...</td>
      <td>[Just have the associate sign the back and the...</td>
      <td>\nThe best way to deposit a cheque issued to a...</td>
      <td>1.0</td>
      <td>0.97749</td>
      <td>ce94ab6c-11bb-46ce-ae7b-6728519d162f</td>
    </tr>
  </tbody>
</table>
</div>
    <div class="colab-df-buttons">

  <div class="colab-df-container">
    <button class="colab-df-convert" onclick="convertToInteractive('df-9332998e-f294-4e8b-a26a-f402c10402c7')"
            title="Convert this dataframe to an interactive table."
            style="display:none;">

  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960">
    <path d="M120-120v-720h720v720H120Zm60-500h600v-160H180v160Zm220 220h160v-160H400v160Zm0 220h160v-160H400v160ZM180-400h160v-160H180v160Zm440 0h160v-160H620v160ZM180-180h160v-160H180v160Zm440 0h160v-160H620v160Z"/>
  </svg>
    </button>

  <style>
    .colab-df-container {
      display:flex;
      gap: 12px;
    }

    .colab-df-convert {
      background-color: #E8F0FE;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: none;
      fill: #1967D2;
      height: 32px;
      padding: 0 0 0 0;
      width: 32px;
    }

    .colab-df-convert:hover {
      background-color: #E2EBFA;
      box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15);
      fill: #174EA6;
    }

    .colab-df-buttons div {
      margin-bottom: 4px;
    }

    [theme=dark] .colab-df-convert {
      background-color: #3B4455;
      fill: #D2E3FC;
    }

    [theme=dark] .colab-df-convert:hover {
      background-color: #434B5C;
      box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
      filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
      fill: #FFFFFF;
    }
  </style>

    <script>
      const buttonEl =
        document.querySelector('#df-9332998e-f294-4e8b-a26a-f402c10402c7 button.colab-df-convert');
      buttonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';

      async function convertToInteractive(key) {
        const element = document.querySelector('#df-9332998e-f294-4e8b-a26a-f402c10402c7');
        const dataTable =
          await google.colab.kernel.invokeFunction('convertToInteractive',
                                                    [key], {});
        if (!dataTable) return;

        const docLinkHtml = 'Like what you see? Visit the ' +
          '<a target="_blank" href=https://colab.research.google.com/notebooks/data_table.ipynb>data table notebook</a>'
          + ' to learn more about interactive tables.';
        element.innerHTML = '';
        dataTable['output_type'] = 'display_data';
        await google.colab.output.renderOutput(dataTable, element);
        const docLink = document.createElement('div');
        docLink.innerHTML = docLinkHtml;
        element.appendChild(docLink);
      }
    </script>
  </div>


<div id="df-34d408b3-f073-4407-938d-4eb1a3dee757">
  <button class="colab-df-quickchart" onclick="quickchart('df-34d408b3-f073-4407-938d-4eb1a3dee757')"
            title="Suggest charts"
            style="display:none;">

<svg xmlns="http://www.w3.org/2000/svg" height="24px"viewBox="0 0 24 24"
     width="24px">
    <g>
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
    </g>
</svg>
  </button>

<style>
  .colab-df-quickchart {
      --bg-color: #E8F0FE;
      --fill-color: #1967D2;
      --hover-bg-color: #E2EBFA;
      --hover-fill-color: #174EA6;
      --disabled-fill-color: #AAA;
      --disabled-bg-color: #DDD;
  }

  [theme=dark] .colab-df-quickchart {
      --bg-color: #3B4455;
      --fill-color: #D2E3FC;
      --hover-bg-color: #434B5C;
      --hover-fill-color: #FFFFFF;
      --disabled-bg-color: #3B4455;
      --disabled-fill-color: #666;
  }

  .colab-df-quickchart {
    background-color: var(--bg-color);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    fill: var(--fill-color);
    height: 32px;
    padding: 0;
    width: 32px;
  }

  .colab-df-quickchart:hover {
    background-color: var(--hover-bg-color);
    box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    fill: var(--button-hover-fill-color);
  }

  .colab-df-quickchart-complete:disabled,
  .colab-df-quickchart-complete:disabled:hover {
    background-color: var(--disabled-bg-color);
    fill: var(--disabled-fill-color);
    box-shadow: none;
  }

  .colab-df-spinner {
    border: 2px solid var(--fill-color);
    border-color: transparent;
    border-bottom-color: var(--fill-color);
    animation:
      spin 1s steps(1) infinite;
  }

  @keyframes spin {
    0% {
      border-color: transparent;
      border-bottom-color: var(--fill-color);
      border-left-color: var(--fill-color);
    }
    20% {
      border-color: transparent;
      border-left-color: var(--fill-color);
      border-top-color: var(--fill-color);
    }
    30% {
      border-color: transparent;
      border-left-color: var(--fill-color);
      border-top-color: var(--fill-color);
      border-right-color: var(--fill-color);
    }
    40% {
      border-color: transparent;
      border-right-color: var(--fill-color);
      border-top-color: var(--fill-color);
    }
    60% {
      border-color: transparent;
      border-right-color: var(--fill-color);
    }
    80% {
      border-color: transparent;
      border-right-color: var(--fill-color);
      border-bottom-color: var(--fill-color);
    }
    90% {
      border-color: transparent;
      border-bottom-color: var(--fill-color);
    }
  }
</style>

  <script>
    async function quickchart(key) {
      const quickchartButtonEl =
        document.querySelector('#' + key + ' button');
      quickchartButtonEl.disabled = true;  // To prevent multiple clicks.
      quickchartButtonEl.classList.add('colab-df-spinner');
      try {
        const charts = await google.colab.kernel.invokeFunction(
            'suggestCharts', [key], {});
      } catch (error) {
        console.error('Error during call to suggestCharts:', error);
      }
      quickchartButtonEl.classList.remove('colab-df-spinner');
      quickchartButtonEl.classList.add('colab-df-quickchart-complete');
    }
    (() => {
      let quickchartButtonEl =
        document.querySelector('#df-34d408b3-f073-4407-938d-4eb1a3dee757 button');
      quickchartButtonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';
    })();
  </script>
</div>
    </div>
  </div>





```python
from langfuse.model import InitialScore

for _, row in df.iterrows():
    for metric_name in ["faithfulness", "answer_relevancy"]:
        langfuse.score(InitialScore(
            name=metric_name,
            value=row[metric_name],
            trace_id=row["trace_id"]))
```

![List of traces with RAGAS scores](https://langfuse.com/images/docs/ragas-list-score-traces.png)
