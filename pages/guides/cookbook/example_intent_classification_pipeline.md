---
title: Guide - Building an intent classification pipeline
description: Build an intent classification pipeline to understand how users are using your LLM application and how performance differs by intent.
category: Classification
---

# LLM Application Intent Classification

This guide demonstrates how to build an intent classification pipeline using Langfuse trace data. With both supervised and unsupervised approaches, you can automate the labeling and analysis of traces from your Langfuse projects.

Why is this useful?

- LLM applications often contain a number of mixed intents
- Breaking down evaluations by intent helps to identify which groups of traces perform badly in production
- Measuring the volume/intent is necessary to make sure that datasets used for offline/development evaluation are representative of production usage

You can approach intent classification in two ways:
- **Supervised approach**: You provide a model with labeled training data, and the model will output one of the pre-defined labels when making predictions.
- **Unsupervised approach**: The model attempts to find clusters within the data, which you can then label appropriately.

---

By the end of this notebook, you'll have two basic pipelines that will:

1. Extract trace data from one of your Langfuse projects.
2. Train an intent classification model.
3. Predict the intent of traces using both supervised and unsupervised approaches.
4. Upload predicted intent results back to Langfuse as [tags](https://langfuse.com/docs/tracing-features/tags).

---

Thank you [@thompsgj](https://github.com/thompsgj) for the contribution ([pr](https://github.com/langfuse/langfuse-docs/pull/840)) of this notebook to the Langfuse docs!

## Setup

Begin by setting up your environment. First, disable unwanted warnings:


```python
import warnings
warnings.filterwarnings("ignore")
```

Install the necessary packages:


```python
# Install Langfuse
%pip install --quiet langfuse
# Install dependencies for supervised intent classification
%pip install --quiet pandas scikit-learn sentence-transformers torch transformers
# Install dependencies for unsupervised intent recognition
%pip install --quiet chromadb hdbscan openai
```

Configure your Langfuse project credentials (retrieve these from your [Langfuse Project Settings](https://cloud.langfuse.com)):


```python
import os

# Get keys for your project from the project settings page
# https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```

Select an embedding model from the Sentence Transformers library:


```python
# Select embedding model
from sentence_transformers import SentenceTransformer
embedding_model = SentenceTransformer("all-mpnet-base-v2")
```

## Supervised intent classification pipeline (dummy data)

This section outlines the process of creating a supervised intent classification model with Langfuse trace data. The steps include retrieving trace data, using scikit-learn and sentence transformers to build and train the model, predicting intents, and tagging traces with labels in Langfuse. This method requires labeled data but ensures consistent predictions for predefined intents, ideal for clearly defined intent identification.

### 1. Retrieve Langfuse traces

Initialize the Langfuse client:


```python
from langfuse import get_client
langfuse = get_client()
```

#### Optional: Create dummy trace data
If your project is empty, you can run the next two cells to create some simple dummy trace data to use for this notebook.  The remainder of this section expects a trace with a "message" key in the input.  You may need to adjust the notebook to your trace data's structure if you use data with another structure.


```python
sample_utterances = [
    "Hello again",
    "Can you do anything else?",
    "Could you recommend a good book?",
    "I'd like to watch a drama",
    "Please revert to the beginning"
]

# Create dummy traces
for utterance in sample_utterances:
    langfuse.trace(input={"message": utterance})
```

Fetch data from your project


```python
traces = langfuse.fetch_traces()
traces.data[0].dict()
```




    {'id': '7e687860-55eb-47f0-b632-e568d5dfb57b',
     'timestamp': datetime.datetime(2024, 10, 8, 7, 7, 51, 549000, tzinfo=datetime.timezone.utc),
     'input': {'message': 'Please revert to the beginning'},
     'tags': [],
     'public': False,
     'htmlPath': '/project/cm200q5d4003v6upt2pnmihyj/traces/7e687860-55eb-47f0-b632-e568d5dfb57b',
     'latency': 0.0,
     'totalCost': 0.0,
     'observations': [],
     'scores': [],
     'bookmarked': False,
     'projectId': 'cm200q5d4003v6upt2pnmihyj',
     'createdAt': '2024-10-08T07:07:52.917Z',
     'updatedAt': '2024-10-08T07:07:52.917Z',
     'name': None,
     'output': None,
     'sessionId': None,
     'release': None,
     'version': None,
     'userId': None,
     'metadata': None,
     'externalId': None}



Construct a DataFrame for analysis:


```python
traces_list = []
for trace in traces.data:
    trace_info = [trace.id, trace.input["message"]]
    traces_list.append(trace_info)

import pandas as pd
traces_df = pd.DataFrame(traces_list, columns=["trace_id", "message"])
traces_df.head()
```

### 2. Build and train an intent classification model

Prepare a small labeled dataset:


```python
import numpy as np
from sklearn.base import TransformerMixin, BaseEstimator
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from tqdm.notebook import tqdm
```

Split the data and define an embedding transformer:


```python
# Note: This is a very small dataset.
# More data will help make the model  more accurate and avoid overfitting.
sample_data = {
    "text": [
        # Greeting utterances
        "hi",
        "hello",
        "howdy",
        "hey there",
        "greetings",
        "Nice to see you",
        "Let's start",
        "begin",
        "good morning",
        "Good afternoon",
        # Menu utterances
        "I want to talk about something else",
        "options",
        "menu, please",
        "Could we chat about another subject",
        "I want to see the menu",
        "switch topics",
        "What else can you do",
        "discuss about something else",
        "Show me the menu",
        "Can we do something else",
        # Restart utterances
        "restart",
        "I'd like to do this again",
        "let me try again",
        "one more time",
        "Can I review that?",
        "check again",
        "redo",
        "again please",
        "that was great, let's start from teh beginning",
        "go back to start",
    ],
    "intent": [
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "greeting",
        "menu",
        "menu",
        "menu",
        "menu",
        "menu",
        "menu",
        "menu",
        "menu",
        "menu",
        "menu",
        "restart",
        "restart",
        "restart",
        "restart",
        "restart",
        "restart",
        "restart",
        "restart",
        "restart",
        "restart",
    ]
}
```


```python
df = pd.DataFrame(sample_data)
df.head()
```


```python
X_train, X_test, y_train, y_test = train_test_split(
    df["text"],
    df["intent"],
    test_size=0.5,
    random_state=14
)
```


```python
class Encoder(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.embedding_model = embedding_model

    def transform(self, X):
        return self.embedding_model.encode(list(X))

    def fit(self, X, y=None):
        return self
```


```python
pipeline = Pipeline([
    ('encoder', Encoder()),
    ('clf', LogisticRegression()),
])
```


```python
pipeline.fit(X_train, y_train)
```


```python
y_pred = pipeline.predict(X_test)
y_pred
```




    array(['greeting', 'menu', 'menu', 'greeting', 'restart', 'greeting',
           'restart', 'menu', 'greeting', 'greeting', 'restart', 'greeting',
           'menu', 'menu', 'menu'], dtype=object)




```python
single_pred = pipeline.predict(["Please let's move on"])
single_pred
```




    array(['menu'], dtype=object)




```python
probas = pipeline.predict_proba(["Please let's move on"])
probas
```




    array([[0.30275492, 0.39219684, 0.30504823]])




```python
confidence_score = float(np.max(probas, axis=1)[0])
confidence_score
```




    0.3921968431842116




```python
print("\nClassification Report:\n", classification_report(y_test, y_pred))
```

    
    Classification Report:
                   precision    recall  f1-score   support
    
        greeting       0.83      1.00      0.91         5
            menu       0.67      1.00      0.80         4
         restart       1.00      0.50      0.67         6
    
        accuracy                           0.80        15
       macro avg       0.83      0.83      0.79        15
    weighted avg       0.86      0.80      0.78        15
    


### 3. Run predictions on traces


```python
for index, row in traces_df.iterrows():
    result = pipeline.predict([row["message"]])
    probas = pipeline.predict_proba([row["message"]])
    confidence_score = float(np.max(probas, axis=1)[0])

    traces_df.at[index, "label"] = "".join(result)
    traces_df.at[index, "confidence_score"] = confidence_score

traces_df
```

### 4. Tag traces with labels


```python
# Note: This will add to existing tags, not add duplicate tags.
for index, row in traces_df.iterrows():
    if row["confidence_score"] > 0.30:
        trace_id = row["trace_id"]
        label = row["label"]
        langfuse.trace(id=trace_id, tags = [label])
```

_Tags in Langfuse_

![Tags in Langfuse](https://langfuse.com/images/cookbook/example_intent_classification_pipeline/supervised-tags-in-langfuse.png)

## Unsupervised intent classification pipeline (production data)

The unsupervised intent classification pipeline demonstrates how to cluster and label Langfuse trace data without predefined categories. It uses embedding techniques, clustering algorithms, and LLM-generated labels to automatically identify and tag intents, offering flexibility for unlabeled data but potentially less consistency than supervised methods.

We will use sample data from the [public demo](https://langfuse.com/demo) project (RAG on Langfuse Documentation) to understand what people are most interested in when interacting with the demo application.


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
langfuse = get_client()
```

### 1. Fetch traces from Langfuse

We will fetch 15,000 messages sent to the demo application in order to create meaningful clusters.


```python
PAGES_TO_FETCH = 300

traces = []
for i in range(PAGES_TO_FETCH):
    traces_page = langfuse.fetch_traces(page=i+1)
    traces.extend(traces_page.data)
```


```python
traces_list = []
for trace in traces:
    trace_info = [trace.id, trace.input]
    traces_list.append(trace_info)
```


```python
import pandas as pd

cluster_traces_df = pd.DataFrame(traces_list, columns=["trace_id", "message"])
cluster_traces_df.dropna(inplace=True) # drop traces with message = None
```

### 2. Embed messages


```python
# naive implementation (batch=1)
# cluster_traces_df["embeddings"] = cluster_traces_df["message"].map(embedding_model.encode)

# use batches to speed up embedding
from tqdm import tqdm

batch_size = 512  # Choose an appropriate batch size based on your model and hardware capabilities
messages = cluster_traces_df["message"].tolist()
embeddings = []

# Use tqdm to wrap your range function for the progress bar
for i in tqdm(range(0, len(messages), batch_size), desc="Encoding batches"):
    batch = messages[i:i + batch_size]
    batch_embeddings = embedding_model.encode(batch)
    embeddings.extend(batch_embeddings)

cluster_traces_df["embeddings"] = embeddings
```

    Encoding batches: 100%|██████████| 30/30 [00:32<00:00,  1.09s/it]


### 3. Create clusters based on embeddings


```python
import hdbscan
clusterer = hdbscan.HDBSCAN(min_cluster_size=10)
cluster_traces_df["cluster"] = clusterer.fit_predict(cluster_traces_df["embeddings"].to_list())
```


```python
cluster_traces_df["cluster"].value_counts().head(10).to_dict()
```




    {-1: 9005,
     0: 544,
     83: 438,
     92: 396,
     3: 298,
     86: 215,
     1: 155,
     94: 147,
     58: 146,
     77: 133}



### 4. Derive cluster labels


```python
import openai

# Note: Depending on the volume of data you are running,
# you may want to limit the number of utterances representing each group (ex. utterances_group[:5])

def generate_label(message_group):
    prompt = f"""
        # Task
        Your goal is to assign an intent label that most accurately fits the given group of utterances.
        You will only provide a single label, no explanation.  The label should be snake cased.

        ## Example utterances
        so long
        bye

        ## Example labels
        goodbye
        end_conversation

        Utterances: {message_group}
        Label:
    """
    response = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        max_tokens=50
    )
    return response.choices[0].message.content.strip()

for cluster in cluster_traces_df["cluster"].unique():
    if cluster == -1:
        continue
    messages_in_cluster = cluster_traces_df[cluster_traces_df["cluster"] == cluster]["message"]

    # sample if too many messages
    if len(messages_in_cluster) > 50:
        messages_in_cluster = messages_in_cluster.sample(50)

    label = generate_label(messages_in_cluster)
    cluster_traces_df.loc[cluster_traces_df["cluster"] == cluster, "cluster_label"] = label
```

### 5. Inspect the clusters


```python
cluster_traces_df["cluster_label"].value_counts().head(20).to_dict()
```




    {'greeting': 2199,
     'number_identifier': 544,
     'end_conversation': 489,
     'what_is_langfuse': 358,
     'test': 299,
     'unknown': 177,
     'who_are_you': 101,
     'what_can_you_do': 86,
     'define_langfuse': 71,
     'langfuse_usage': 66,
     'ask_name': 51,
     'how_it_works': 50,
     'weather_inquiry': 46,
     'summarize': 44,
     'greetings': 43,
     'open_source_query': 42,
     'affirmation': 41,
     'compare_langfuse_langsmith': 37,
     'affirmative': 35,
     'trace_in_langfuse': 34}




```python
# explore the messages sent within a specific cluster
cluster_traces_df[cluster_traces_df["cluster_label"]=="trace_in_langfuse"].message.head(20).to_dict()
```




    {21: 'how can i use the langfuse.trace function ?',
     828: 'What exactly is a trace in langfuse?',
     1455: 'how does a trace look like in langfuse?',
     1563: 'What langfuse uses to represent the traces/',
     1744: 'i want to know about trace in langfuse',
     1953: 'How does langfuse tracing work?',
     2349: 'What is a trace in langfuse?',
     2439: 'Hello! How exactly are traces created in langfuse',
     3001: 'What is tracing in the context of Langfuse?',
     3761: 'How does tracing work in Langfuse?',
     4759: 'what is traces in simple language in langfuse',
     4877: 'Hello, can you explain how does the tracing work in Langfuse?',
     5547: 'What is a trace in Langfuse?',
     5751: 'what is called traces in langfuse. explain clearly with eaxmple',
     6508: 'how to trace using langfuse?',
     6914: "what dose 'trace' means in langfuse",
     6919: 'how do i look at traces in langfuse',
     7275: 'what is tracing in Langfuse? what purpose does it serve?',
     7585: 'what is a trace in langfuse and how to create it?',
     7774: 'what is a trace in langfuse?'}



### 6. Add clusters as tags back to Langfuse


```python
# add as labels back to langfuse
for index, row in cluster_traces_df.iterrows():
    if row["cluster"] != -1:
        trace_id = row["trace_id"]
        label = row["cluster_label"]
        langfuse.trace(id=trace_id, tags=[label])
```

## Conclusion

Each approach has its pros and cons.  

The supervised approach requires a lot of effort upfront to prepare a labelled dataset of an appropriate size.  During inference, it will only be able to assign labels that it was trained on, so it will not handle new cases well.  However, the inference will be consistent.

The unsupervised approach offers more flexibility in working with unlabeled data.  It can output a variety of new labels you didn't define beforehand.  However, the labels may not be consistent between runs (ex., 'hello', 'greeting', or 'start_conversation').  Additionally, the clusters may be more or less permissive than if you had labelled the data.

Combining both approaches may be ideal.  Unsupervised intent classification can help you quickly get an overview of a large volume of data, helping you with initial exploratory analysis.  As you understand your trace data better and get more samples, you may benefit from running the supervised model on your data using the intent labels you most care about.  Or, you may want to use the embedded data stored in the vector database to run similarity searches and reuse the labels from previous runs on new instances!
