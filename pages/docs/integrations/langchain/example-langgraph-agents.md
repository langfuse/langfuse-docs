---
title: Example - Trace and Evaluate LangGraph Agents
description: This guide shows how to evaluate LangGraph Agents with Langfuse using online and offline evaluation methods.
category: Integrations
---

# Evaluate LangGraph Agents

In this tutorial, we will learn how to **monitor the internal steps (traces) of [LangGraph agents](https://github.com/langchain-ai/langgraph)** and **evaluate its performance** using [Langfuse](https://langfuse.com) and [Hugging Face Datasets](https://huggingface.co/datasets).

This guide covers **online** and **offline** evaluation metrics used by teams to bring agents to production fast and reliably. To learn more about evaluation strategies, check out our [blog post](https://langfuse.com/blog/2025-03-04-llm-evaluation-101-best-practices-and-challenges).

**Why AI agent Evaluation is important:**
- Debugging issues when tasks fail or produce suboptimal results
- Monitoring costs and performance in real-time
- Improving reliability and safety through continuous feedback

<br>

<div style="position: relative; padding-top: 69.85769728331177%;">
  <iframe
    src="https://customer-xnej9vqjtgxpafyk.cloudflarestream.com/3fae2f3517ce426d0f02b090d4258dc6/iframe?muted=true&loop=true&autoplay=true&poster=https%3A%2F%2Fcustomer-xnej9vqjtgxpafyk.cloudflarestream.com%2F3fae2f3517ce426d0f02b090d4258dc6%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600&controls=false"
    loading="lazy"
    style="border: white; position: absolute; top: 0; left: 0; height: 100%; width: 100%; border-radius: 10px;"
    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
    allowfullscreen="true"
  ></iframe>
</div>

## Step 0: Install the Required Libraries

Below we install the `langgraph` library, `langfuse` and the Hugging Face `datasets` library


```python
%pip install langfuse
%pip install langchain langgraph langchain_openai langchain_community langchain_huggingface
```

## Step 1: Set Environment Variables

Get your Langfuse API keys by signing up for Langfuse cloud or self-hosting Langfuse. 


```python
import os

# Get keys for your project from the project settings page: https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = "pk-lf-..."
os.environ["LANGFUSE_SECRET_KEY"] = "sk-lf-..."
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region


# Set your OpenAI API Key
os.environ["OPENAI_API_KEY"] = "sk-proj-..."
```

## Step 2: Test Your Instrumentation

Here is a simple Q&A agent. We run it to confirm that the instrumentation is working correctly. If everything is set up correctly, you will see logs/spans in your observability dashboard.


```python
from typing import Annotated
 
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from typing_extensions import TypedDict
 
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
 
class State(TypedDict):
    # Messages have the type "list". The `add_messages` function in the annotation defines how this state key should be updated
    # (in this case, it appends messages to the list, rather than overwriting them)
    messages: Annotated[list, add_messages]
 
graph_builder = StateGraph(State)
 
llm = ChatOpenAI(model = "gpt-4o", temperature = 0.2)
 
# The chatbot node function takes the current State as input and returns an updated messages list. This is the basic pattern for all LangGraph node functions.
def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}
 
# Add a "chatbot" node. Nodes represent units of work. They are typically regular python functions.
graph_builder.add_node("chatbot", chatbot)
 
# Add an entry point. This tells our graph where to start its work each time we run it.
graph_builder.set_entry_point("chatbot")
 
# Set a finish point. This instructs the graph "any time this node is run, you can exit."
graph_builder.set_finish_point("chatbot")
 
# To be able to run our graph, call "compile()" on the graph builder. This creates a "CompiledGraph" we can use invoke on our state.
graph = graph_builder.compile()
```


```python
from langfuse.callback import CallbackHandler
 
# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()
 
for s in graph.stream(
    {"messages": [HumanMessage(content = "What is Langfuse?")]},
    config={"callbacks": [langfuse_handler]}):
    print(s)
```

    {'chatbot': {'messages': [AIMessage(content='Langfuse is a tool designed to help developers and businesses monitor and debug applications that use large language models (LLMs). It provides observability features specifically tailored for AI-driven applications, allowing users to track, analyze, and optimize the performance of their language model integrations. Langfuse offers capabilities such as logging interactions, visualizing data flows, and identifying issues in real-time, which can be crucial for maintaining the reliability and efficiency of applications that rely on complex AI models.', additional_kwargs={'refusal': None}, response_metadata={'token_usage': {'completion_tokens': 96, 'prompt_tokens': 13, 'total_tokens': 109, 'completion_tokens_details': {'accepted_prediction_tokens': 0, 'audio_tokens': 0, 'reasoning_tokens': 0, 'rejected_prediction_tokens': 0}, 'prompt_tokens_details': {'audio_tokens': 0, 'cached_tokens': 0}}, 'model_name': 'gpt-4o-2024-08-06', 'system_fingerprint': 'fp_90d33c15d4', 'id': 'chatcmpl-BEbNebiL1dVZmqIm2G2mgnLHO8Wfw', 'finish_reason': 'stop', 'logprobs': None}, id='run-16477a3d-365a-4551-8ea2-e86516d49041-0', usage_metadata={'input_tokens': 13, 'output_tokens': 96, 'total_tokens': 109, 'input_token_details': {'audio': 0, 'cache_read': 0}, 'output_token_details': {'audio': 0, 'reasoning': 0}})]}}


Check your [Langfuse Traces Dashboard](https://cloud.langfuse.com/traces) to confirm that the spans and logs have been recorded.

Example trace in Langfuse:

![Example trace in Langfuse](https://langfuse.com/images/cookbook/example-langgraph-evaluation/first-example-trace.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/ed0970b5-b251-4b85-9023-c0ed81462510?timestamp=2025-03-20T13%3A44%3A44.381Z&display=details&observation=0731595f-06e4-4f5a-b535-6e09677a752d)_

## Step 3: Observe and Evaluate a More Complex Agent

Now that you have confirmed your instrumentation works, let's try a more complex query so we can see how advanced metrics (token usage, latency, costs, etc.) are tracked.


```python
import os
from typing import TypedDict, List, Dict, Any, Optional
from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
```


```python
class EmailState(TypedDict):
    email: Dict[str, Any]           
    is_spam: Optional[bool]         
    spam_reason: Optional[str]      
    email_category: Optional[str]   
    draft_response: Optional[str]   
    messages: List[Dict[str, Any]] 
```


```python
# Initialize LLM
model = ChatOpenAI( model="gpt-4o",temperature=0)

class EmailState(TypedDict):
    email: Dict[str, Any]
    is_spam: Optional[bool]
    draft_response: Optional[str]
    messages: List[Dict[str, Any]]

# Define nodes
def read_email(state: EmailState):
    email = state["email"]
    print(f"Alfred is processing an email from {email['sender']} with subject: {email['subject']}")
    return {}

def classify_email(state: EmailState):
    email = state["email"]
    
    prompt = f"""
As Alfred the butler of Mr wayne and it's SECRET identity Batman, analyze this email and determine if it is spam or legitimate and should be brought to Mr wayne's attention.

Email:
From: {email['sender']}
Subject: {email['subject']}
Body: {email['body']}

First, determine if this email is spam.
answer with SPAM or HAM if it's legitimate. Only return the answer
Answer :
    """
    messages = [HumanMessage(content=prompt)]
    response = model.invoke(messages)
    
    response_text = response.content.lower()
    print(response_text)
    is_spam = "spam" in response_text and "ham" not in response_text
    
    if not is_spam:
        new_messages = state.get("messages", []) + [
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": response.content}
        ]
    else :
        new_messages = state.get("messages", [])
    
    return {
        "is_spam": is_spam,
        "messages": new_messages
    }

def handle_spam(state: EmailState):
    print(f"Alfred has marked the email as spam.")
    print("The email has been moved to the spam folder.")
    return {}

def drafting_response(state: EmailState):
    email = state["email"]
    
    prompt = f"""
As Alfred the butler, draft a polite preliminary response to this email.

Email:
From: {email['sender']}
Subject: {email['subject']}
Body: {email['body']}

Draft a brief, professional response that Mr. Wayne can review and personalize before sending.
    """
    
    messages = [HumanMessage(content=prompt)]
    response = model.invoke(messages)
    
    new_messages = state.get("messages", []) + [
        {"role": "user", "content": prompt},
        {"role": "assistant", "content": response.content}
    ]
    
    return {
        "draft_response": response.content,
        "messages": new_messages
    }

def notify_mr_wayne(state: EmailState):
    email = state["email"]
    
    print("\n" + "="*50)
    print(f"Sir, you've received an email from {email['sender']}.")
    print(f"Subject: {email['subject']}")
    print("\nI've prepared a draft response for your review:")
    print("-"*50)
    print(state["draft_response"])
    print("="*50 + "\n")
    
    return {}

# Define routing logic
def route_email(state: EmailState) -> str:
    if state["is_spam"]:
        return "spam"
    else:
        return "legitimate"

# Create the graph
email_graph = StateGraph(EmailState)

# Add nodes
email_graph.add_node("read_email", read_email) # the read_email node executes the read_mail function
email_graph.add_node("classify_email", classify_email) # the classify_email node will execute the classify_email function
email_graph.add_node("handle_spam", handle_spam) #same logic 
email_graph.add_node("drafting_response", drafting_response) #same logic
email_graph.add_node("notify_mr_wayne", notify_mr_wayne) # same logic

```




    <langgraph.graph.state.StateGraph at 0x112007890>




```python
# Add edges
email_graph.add_edge(START, "read_email") # After starting we go to the "read_email" node

email_graph.add_edge("read_email", "classify_email") # after_reading we classify

# Add conditional edges
email_graph.add_conditional_edges(
    "classify_email", # after classify, we run the "route_email" function"
    route_email,
    {
        "spam": "handle_spam", # if it return "Spam", we go the "handle_span" node
        "legitimate": "drafting_response" # and if it's legitimate, we go to the "drafting response" node
    }
)

# Add final edges
email_graph.add_edge("handle_spam", END) # after handling spam we always end
email_graph.add_edge("drafting_response", "notify_mr_wayne")
email_graph.add_edge("notify_mr_wayne", END) # after notifyinf Me wayne, we can end  too

```




    <langgraph.graph.state.StateGraph at 0x112007890>




```python
# Compile the graph
compiled_graph = email_graph.compile()
```


```python
 # Example emails for testing
legitimate_email = {
    "sender": "Joker",
    "subject": "Found you Batman ! ",
    "body": "Mr. Wayne,I found your secret identity ! I know you're batman ! Ther's no denying it, I have proof of that and I'm coming to find you soon. I'll get my revenge. JOKER"
}

spam_email = {
    "sender": "Crypto bro",
    "subject": "The best investment of 2025",
    "body": "Mr Wayne, I just launched an ALT coin and want you to buy some !"
}

```


```python
from langfuse.callback import CallbackHandler
 
# Initialize Langfuse CallbackHandler for Langchain (tracing)
langfuse_handler = CallbackHandler()

# Process legitimate email
print("\nProcessing legitimate email...")
legitimate_result = compiled_graph.invoke(
    input = {
        "email": legitimate_email,
        "is_spam": None,
        "draft_response": None,
        "messages": []
        },
    config={"callbacks": [langfuse_handler]}
)

# Process spam email
print("\nProcessing spam email...")
spam_result = compiled_graph.invoke(
    input = {
        "email": spam_email,
        "is_spam": None,
        "draft_response": None,
        "messages": []
        },
    config={"callbacks": [langfuse_handler]}
) 
```

    
    Processing legitimate email...
    Alfred is processing an email from Joker with subject: Found you Batman ! 
    ham
    
    ==================================================
    Sir, you've received an email from Joker.
    Subject: Found you Batman ! 
    
    I've prepared a draft response for your review:
    --------------------------------------------------
    Subject: Re: Found you Batman!
    
    Dear Mr. Joker,
    
    Thank you for reaching out. Your message has been received and noted. Mr. Wayne is currently unavailable, but rest assured, your concerns will be addressed in due course.
    
    Kind regards,
    
    Alfred Pennyworth  
    Wayne Manor Estate
    ==================================================
    
    
    Processing spam email...
    Alfred is processing an email from Crypto bro with subject: The best investment of 2025
    spam
    Alfred has marked the email as spam.
    The email has been moved to the spam folder.


### Trace Structure

Langfuse records a **trace** that contains **spans**, which represent each step of your agent’s logic. Here, the trace contains the overall agent run and sub-spans for:
- The tool call (get_weather)
- The LLM calls (Responses API with 'gpt-4o')

You can inspect these to see precisely where time is spent, how many tokens are used, and so on:

![Trace tree in Langfuse](https://langfuse.com/images/cookbook/example-langgraph-evaluation/trace-tree.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/3dd76e4b-980c-40eb-ae6d-ba9db5f6a349?timestamp=2025-03-20T14%3A56%3A16.665Z&display=details&observation=22b11054-93a8-4ff9-b862-babfcee906ec)_

## Online Evaluation

Online Evaluation refers to evaluating the agent in a live, real-world environment, i.e. during actual usage in production. This involves monitoring the agent’s performance on real user interactions and analyzing outcomes continuously.

We have written down a guide on different evaluation techniques [here](https://langfuse.com/blog/2025-03-04-llm-evaluation-101-best-practices-and-challenges).

### Common Metrics to Track in Production

1. **Costs** — The instrumentation captures token usage, which you can transform into approximate costs by assigning a price per token.
2. **Latency** — Observe the time it takes to complete each step, or the entire run.
3. **User Feedback** — Users can provide direct feedback (thumbs up/down) to help refine or correct the agent.
4. **LLM-as-a-Judge** — Use a separate LLM to evaluate your agent’s output in near real-time (e.g., checking for toxicity or correctness).

Below, we show examples of these metrics.

#### 1. Costs

Below is a screenshot showing usage for `gpt-4o` calls. This is useful to see costly steps and optimize your agent.

![Costs](https://langfuse.com/images/cookbook/example-langgraph-evaluation/gpt-4o-costs.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/3dd76e4b-980c-40eb-ae6d-ba9db5f6a349?timestamp=2025-03-20T14%3A56%3A16.665Z&display=details&observation=22b11054-93a8-4ff9-b862-babfcee906ec)_

#### 2. Latency

We can also see how long it took to complete each step. In the example below, the entire run took about 3 seconds, which you can break down by step. This helps you identify bottlenecks and optimize your agent.

![Latency](https://langfuse.com/images/cookbook/example-langgraph-evaluation/agent-latency.png)

_[Link to the trace](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/3dd76e4b-980c-40eb-ae6d-ba9db5f6a349?timestamp=2025-03-20T14%3A56%3A16.665Z&display=timeline)_

#### 3. User Feedback

If your agent is embedded into a user interface, you can record direct user feedback (like a thumbs-up/down in a chat UI). Below is an example using `IPython.display` for simple feedback mechanism.

In the code snippet below, when a user sends a chat message, we capture the OpenTelemetry trace ID. If the user likes/dislikes the last answer, we attach a score to the trace.


```python
import ipywidgets as widgets
from IPython.display import display
from langfuse import Langfuse

langfuse = Langfuse()

def on_feedback(button,trace):
    if button.icon == "thumbs-up":
      trace.score(
            value=1,
            name="user-feedback",
            comment="This was a good answer"
        )
    elif button.icon == "thumbs-down":
      trace.score(
            value=0,
            name="user-feedback",
            comment="This was a bad answer"
        )
    print("Scored the trace in Langfuse")

# Run agent
def qa_agent(question):
    
    trace = langfuse.trace()
    langfuse_handler_trace = trace.get_langchain_handler(
    update_parent=True # add i/o to trace itself as well
    )

    response = graph.invoke(
        input={"messages": [HumanMessage(content = question)]},
        config={"callbacks": [langfuse_handler_trace]}
    )
 
    return trace,response

user_input = input("Enter your question: ")
trace,response = qa_agent(user_input)

# Get feedback
print("How did you like the agent response?")

thumbs_up = widgets.Button(description="👍", icon="thumbs-up")
thumbs_down = widgets.Button(description="👎", icon="thumbs-down")

thumbs_up.on_click(on_feedback(trace))
thumbs_down.on_click(on_feedback(trace))

display(widgets.HBox([thumbs_up, thumbs_down]))
```

User feedback is then captured in Langfuse:

![User feedback is being captured in Langfuse](https://langfuse.com/images/cookbook/example-langgraph-evaluation/user-feedback.png)

#### 4. Automated LLM-as-a-Judge Scoring

LLM-as-a-Judge is another way to automatically evaluate your agent's output. You can set up a separate LLM call to gauge the output’s correctness, toxicity, style, or any other criteria you care about.

**Workflow**:
1. You define an **Evaluation Template**, e.g., "Check if the text is toxic."
2. You set a model that is used as judge-model; in this case `gpt-4o-mini`.
2. Each time your agent generates output, you pass that output to your "judge" LLM with the template.
3. The judge LLM responds with a rating or label that you log to your observability tool.

Example from Langfuse:

![LLM-as-a-Judge Evaluation Template](https://langfuse.com/images/cookbook/integration_openai-agents/evaluator-template.png)
![LLM-as-a-Judge Evaluator](https://langfuse.com/images/cookbook/integration_openai-agents/evaluator.png)


```python
# Process spam email
print("\nProcessing spam email...")
spam_result = compiled_graph.invoke(
    input = {
        "email": spam_email,
        "is_spam": None,
        "draft_response": None,
        "messages": []
        },
    config={"callbacks": [langfuse_handler]}
) 
```

    
    Processing spam email...
    Alfred is processing an email from Crypto bro with subject: The best investment of 2025
    spam
    Alfred has marked the email as spam.
    The email has been moved to the spam folder.


You can see that the answer of this example is judged as "not toxic".

![LLM-as-a-Judge Evaluation Score](https://langfuse.com/images/cookbook/example-langgraph-evaluation/llm-as-a-judge-score.png)

#### 5. Observability Metrics Overview

All of these metrics can be visualized together in dashboards. This enables you to quickly see how your agent performs across many sessions and helps you to track quality metrics over time.

![Observability metrics overview](https://langfuse.com/images/cookbook/integration_openai-agents/dashboard-dark.png)

## Offline Evaluation

Online evaluation is essential for live feedback, but you also need **offline evaluation**—systematic checks before or during development. This helps maintain quality and reliability before rolling changes into production.

### Dataset Evaluation

In offline evaluation, you typically:
1. Have a benchmark dataset (with prompt and expected output pairs)
2. Run your agent on that dataset
3. Compare outputs to the expected results or use an additional scoring mechanism

Below, we demonstrate this approach with the [q&a-dataset](https://huggingface.co/datasets/junzhang1207/search-dataset), which contains questions and expected answers.


```python
import pandas as pd
from datasets import load_dataset
 
# Fetch search-dataset from Hugging Face
dataset = load_dataset("junzhang1207/search-dataset", split = "train")
df = pd.DataFrame(dataset)
print("First few rows of search-dataset:")
print(df.head())
```

    First few rows of search-dataset:
                                         id  \
    0  20caf138-0c81-4ef9-be60-fe919e0d68d4   
    1  1f37d9fd-1bcc-4f79-b004-bc0e1e944033   
    2  76173a7f-d645-4e3e-8e0d-cca139e00ebe   
    3  5f5ef4ca-91fe-4610-a8a9-e15b12e3c803   
    4  64dbed0d-d91b-4acd-9a9c-0a7aa83115ec   
    
                                                question  \
    0                 steve jobs statue location budapst   
    1  Why is the Battle of Stalingrad considered a t...   
    2  In what year did 'The Birth of a Nation' surpa...   
    3  How many Russian soldiers surrendered to AFU i...   
    4   What event led to the creation of Google Images?   
    
                                         expected_answer       category       area  
    0  The Steve Jobs statue is located in Budapest, ...           Arts  Knowledge  
    1  The Battle of Stalingrad is considered a turni...   General News       News  
    2  This question is based on a false premise. 'Th...  Entertainment       News  
    3  About 300 Russian soldiers surrendered to the ...   General News       News  
    4  Jennifer Lopez's appearance in a green Versace...     Technology       News  


Next, we create a dataset entity in Langfuse to track the runs. Then, we add each item from the dataset to the system.


```python
from langfuse import Langfuse
langfuse = Langfuse()
 
langfuse_dataset_name = "qa-dataset_langgraph-agent"
 
# Create a dataset in Langfuse
langfuse.create_dataset(
    name=langfuse_dataset_name,
    description="q&a dataset uploaded from Hugging Face",
    metadata={
        "date": "2025-03-21",
        "type": "benchmark"
    }
)
```




    Dataset(id='cm8n3xati009sad07js1umaa1', name='qa-dataset_langgraph-agent', description='q&a dataset uploaded from Hugging Face', metadata={'date': '2025-03-21', 'type': 'benchmark'}, project_id='cloramnkj0002jz088vzn1ja4', created_at=datetime.datetime(2025, 3, 24, 13, 33, 3, 366000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2025, 3, 24, 13, 33, 3, 366000, tzinfo=datetime.timezone.utc))




```python
df_30 = df.sample(30) # For this example, we upload only 30 dataset questions

for idx, row in df_30.iterrows():
    langfuse.create_dataset_item(
        dataset_name=langfuse_dataset_name,
        input={"text": row["question"]},
        expected_output={"text": row["expected_answer"]}
    )
```

![Dataset items in Langfuse](https://langfuse.com/images/cookbook/example-langgraph-evaluation/example-dataset.png)

#### Running the Agent on the Dataset

First, we assemble a simple LangGraph agent that answers questions using OpenAI models. 


```python
from typing import Annotated
 
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from typing_extensions import TypedDict
 
from langgraph.graph import StateGraph
from langgraph.graph.message import add_messages
 
class State(TypedDict):
    messages: Annotated[list, add_messages]
 
graph_builder = StateGraph(State)
 
llm = ChatOpenAI(model = "gpt-4.5-preview")

def chatbot(state: State):
    return {"messages": [llm.invoke(state["messages"])]}
 
graph_builder.add_node("chatbot", chatbot)
graph_builder.set_entry_point("chatbot")
graph_builder.set_finish_point("chatbot")

graph = graph_builder.compile()
```

Then, we define a helper function `my_agent()` that:
1. Creates a Langfuse trace 
2. Fetches the `langfuse_handler_trace` to instrument the LangGraph execution. 
3. Runs our agent and passing `langfuse_handler_trace` to the invocation. 


```python
def my_agent(question):

    trace = langfuse.trace()
    langfuse_handler_trace = trace.get_langchain_handler(
    update_parent=True # add i/o to trace itself as well
    )

    response = graph.invoke(
        input={"messages": [HumanMessage(content = question)]},
        config={"callbacks": [langfuse_handler_trace]}
    )
    
    return trace, response["messages"][-1].content
```

Finally, we loop over each dataset item, run the agent, and link the trace to the dataset item. We can also attach a quick evaluation score if desired.


```python
from langfuse import Langfuse
langfuse = Langfuse()

dataset = langfuse.get_dataset('qa-dataset_langgraph-agent')
for item in dataset.items:

    trace, output = my_agent(item.input["text"])

    # link the execution trace to the dataset item and give it a run_name
    item.link(
        trace,
        run_name = "run_gpt-4.5-preview",
        run_description="my dataset run", # optional
        run_metadata={ "model": "gpt-4.5-preview" } # optional
    )

    # optional: score the trace
    trace.score(
        name="user-feedback",
        value=1,
        comment="This was a good answer"
        )

langfuse.flush()
```

You can repeat this process with different agent configurations such as:
- Models (gpt-4o-mini, o1, etc.)
- Prompts
- Tools (search vs. no search)
- Complexity of agent (multi agent vs single agent)

Then compare them side-by-side in Langfuse. In this example, I did run the agent 3 times on the 30 dataset questions. For each run, I used a different OpenAI model. You can see that amount of correctly answered questions improves when using a larger model (as expected). The `correct_answer` score is created by an [LLM-as-a-Judge Evaluator](https://langfuse.com/docs/scores/model-based-evals) that is set up to judge the correctness of the question based on the sample answer given in the dataset.

![Dataset run overview](https://langfuse.com/images/cookbook/example-langgraph-evaluation/dataset_runs.png)
![Dataset run comparison](https://langfuse.com/images/cookbook/example-langgraph-evaluation/dataset-run-comparison.png)

