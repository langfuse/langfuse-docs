---
description: Open-source observability for DSPy, a framework that systematically optimizes language model prompts and weights.
category: Integrations
---

# DSPy - Observability & Tracing

This cookbook demonstrates how to use [DSPy](https://github.com/stanfordnlp/dspy) with Langfuse. DSPy is a framework that systematically optimizes language model prompts and weights, making it easier to build and refine complex systems with LMs by automating the tuning process and improving reliability. For further information on DSPy, please visit the [documentation](https://dspy-docs.vercel.app/docs/intro).

Langfuse can help with running DSPy projects by providing a centralized observability platform for debugging and monitoring.

**Note**: This is a community contributed integration ([initial PR](https://github.com/stanfordnlp/dspy/pull/1186) by [@xucailiang](https://github.com/xucailiang)). DSPy documentation can be found [here](https://dspy-docs.vercel.app/intro/). If you encounter issues or want to contribute to the integration, please open an issue or PR.

---

In this Example Notebook, we will:

- Use OpenAI models as they are automatically instrumented by Langfuse when used within DSPy.
- Use Mistral models as an example for how to trace any model via a custom tracker.
- Run a RAG Example.

## Setup


```python
!pip install mistralai langfuse
```

Install latest dspy from main to get the latest features.


```python
!pip install git+https://github.com/stanfordnlp/dspy.git
```

---

If you run this in a Jupyter Notebook, you may need to restart the session at this point; otherwise, the imports might not work correctly.

---


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

# Your mistral key
os.environ["MISTRAL_API_KEY"] = ""
```

Note: When executing the same prompt multiple times, DSPy utilizes a caching mechanism that returns the cached response for identical prompts. As a result, no new trace will be logged to Langfuse for repeated prompts.

## Examples

### Simple Chat with OpenAI (automated tracing)

This example demonstrates how to use DSPy with the Langfuse to query a language model. We set up the `LangfuseTracker` to monitor interactions, configure the GPT-4 model with specific parameters, and then use it to generate an answer based on the questions.


```python
import dspy
from dsp.trackers.langfuse_tracker import LangfuseTracker

langfuse = LangfuseTracker()
openai = dspy.OpenAI(model='gpt-4o-mini', temperature=0.1, max_tokens=1500)

openai("Explain DSPy and Langfuse to me")
```




    ["As of my last knowledge update in October 2023, DSPy and Langfuse are two distinct tools that cater to different aspects of data science and machine learning.\n\n### DSPy\n\n**DSPy** is a framework designed to simplify the development of machine learning models, particularly for data scientists and analysts who may not have extensive programming backgrounds. It focuses on making the process of building, deploying, and maintaining machine learning models more accessible and efficient. Key features of DSPy include:\n\n- **Declarative Syntax**: DSPy allows users to define models using a more intuitive, high-level syntax, which can make it easier to understand and modify models without deep programming knowledge.\n- **Integration with Data Pipelines**: It often integrates well with existing data pipelines, allowing users to leverage their data more effectively.\n- **Focus on Interpretability**: DSPy emphasizes the interpretability of models, making it easier for users to understand how models make decisions and to communicate those decisions to stakeholders.\n- **Rapid Prototyping**: The framework is designed to facilitate quick iterations and prototyping, enabling data scientists to test and refine their models more efficiently.\n\n### Langfuse\n\n**Langfuse** is a tool that focuses on enhancing the development and deployment of language models, particularly in the context of applications that utilize natural language processing (NLP). It aims to provide features that help developers manage and optimize their language models. Key aspects of Langfuse include:\n\n- **Model Management**: Langfuse provides capabilities for managing different versions of language models, making it easier to track changes and improvements over time.\n- **Performance Monitoring**: It often includes tools for monitoring the performance of language models in real-time, allowing developers to identify issues and optimize their models based on user interactions.\n- **Integration with Applications**: Langfuse is designed to integrate seamlessly with various applications that utilize language models, providing a smoother workflow for developers.\n- **User Feedback Loop**: The platform may facilitate the collection of user feedback, which can be invaluable for improving language models and ensuring they meet user needs.\n\n### Summary\n\nIn summary, DSPy is geared towards simplifying the machine learning model development process, while Langfuse focuses on managing and optimizing language models in applications. Both tools aim to enhance the efficiency and effectiveness of data science and machine learning workflows, albeit in different domains. If you're looking to work with machine learning models or language models, these tools can provide valuable support in their respective areas."]



Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/5abece99-91bf-414e-a952-407ba8401c98

## Simple Chat with Mistral (custom dspy tracker)

For non-OpenAI models, we can add a custom tracker to add traces in Langfuse.


```python
mistral = dspy.Mistral(
    model='mistral-medium-latest',
    api_key=os.getenv("MISTRAL_API_KEY")
)

completions = mistral("Hi, what do you like about DSPy?")

mistral.tracker_call(tracker=langfuse)

class CustomTracker(LangfuseTracker):

    def call(self, *args, **kwargs):
        # Call the super class method if needed
        super().call(**kwargs)

        # Unpack args if they are being used to pass i, o, etc.
        i = kwargs.get('i')
        o = kwargs.get('o')
        name = kwargs.get('name')
        o_content = o.choices[0].message.content if o else None

        # Log trace to Langfuse via low-level SDK
        trace = self.langfuse.trace(
            name="dspy-mistral",
            input=i,
            output=o_content
        )
        trace.generation(
            input=i,
            output=o_content,
            name=name,
            metadata=kwargs,
            usage_details=o.usage,
            model=o.model
        )

custom_langfuse_tracker = CustomTracker()

mistral.tracker_call(tracker=custom_langfuse_tracker)
```

Example trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/fb25d5d5-65c0-4188-8546-7cf7803d272f?observation=2c71a84f-d687-4766-9f50-cd9a94767bf8

## RAG Example

We'll configure DSPy to use GPT-4o-mini from the previous example as the language model (LM) and ColBERTv2 as the retrieval model (RM). This setup allows DSPy to dynamically call these models during the generation and retrieval processes.


```python
from pydantic import BaseModel, Field

from dspy.functional import TypedPredictor
from dspy.teleprompt import LabeledFewShot

colbertv2_wiki17_abstracts = dspy.ColBERTv2(url='http://20.102.90.50:2017/wiki17_abstracts')
dspy.settings.configure(lm=openai, rm=colbertv2_wiki17_abstracts)
```

We'll use the HotPotQA dataset, which features complex question-answer pairs ideal for multi-hop reasoning.


```python
from dspy.datasets import HotPotQA

# Load the dataset.
dataset = HotPotQA(train_seed=1, train_size=10, eval_seed=2023, dev_size=25, test_size=0)

# Tell DSPy that the 'question' field is the input. Any other fields are labels and/or metadata.
trainset = [x.with_inputs('question') for x in dataset.train]
devset = [x.with_inputs('question') for x in dataset.dev]

len(trainset), len(devset)
```


Define the input-output signatures, specifying how the model should use the retrieved context to generate answers.


```python
class GenerateAnswer(dspy.Signature):
    """Answer questions with short factoid answers."""

    context = dspy.InputField(desc="may contain relevant facts")
    question = dspy.InputField()
    answer = dspy.OutputField(desc="often between 1 and 5 words")

```

Create the RAG pipeline, utilizing DSPy modules for retrieval and answer generation.


```python
class RAG(dspy.Module):
    def __init__(self, num_passages=3):
        super().__init__()

        self.retrieve = dspy.Retrieve(k=num_passages)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)

    def forward(self, question):
        context = self.retrieve(question).passages
        prediction = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=prediction.answer)
```

Compile the RAG program, leveraging DSPy's teleprompters to optimize prompt selection based on validation metrics.


```python
from dspy.teleprompt import BootstrapFewShot

# Validation logic: check that the predicted answer is correct.
# Also check that the retrieved context does actually contain that answer.
def validate_context_and_answer(example, pred, trace=None):
    answer_EM = dspy.evaluate.answer_exact_match(example, pred)
    answer_PM = dspy.evaluate.answer_passage_match(example, pred)
    return answer_EM and answer_PM

# Set up a basic teleprompter, which will compile our RAG program.
teleprompter = BootstrapFewShot(metric=validate_context_and_answer)

# Compile!
compiled_rag = teleprompter.compile(RAG(), trainset=trainset)
```

Example compilation trace: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/25d21f68-4908-4b81-8616-710b16cd8e84



Run the compiled RAG pipeline to retrieve answers based on your queries.


```python
# Ask any question you like to this simple RAG program.
my_question = "Who conducts the draft in which Marc-Andre Fleury was drafted to the Vegas Golden Knights for the 2017-18 season????????"

# Get the prediction. This contains `pred.context` and `pred.answer`.
pred = compiled_rag(my_question)

# Print the contexts and the answer.
print(f"Question: {my_question}")
print(f"Predicted Answer: {pred.answer}")
print(f"Retrieved Contexts (truncated): {[c[:200] + '...' for c in pred.context]}")
```

    Question: Who conducts the draft in which Marc-Andre Fleury was drafted to the Vegas Golden Knights for the 2017-18 season????????
    Predicted Answer: National Hockey League
    Retrieved Contexts (truncated): ['2017–18 Pittsburgh Penguins season | The 2017–18 Pittsburgh Penguins season will be the 51st season for the National Hockey League ice hockey team that was established on June 5, 1967. They will enter...', 'Marc-André Fleury | Marc-André Fleury (born November 28, 1984) is a French-Canadian professional ice hockey goaltender playing for the Vegas Golden Knights of the National Hockey League (NHL). Drafted...', "2017 NHL Expansion Draft | The 2017 NHL Expansion Draft was an expansion draft conducted by the National Hockey League on June 18–20, 2017 to fill the roster of the league's expansion team for the 201..."]


Example query trace in Langfuse: https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/baf30bf5-0741-493c-aba3-2a66290d4d1d
