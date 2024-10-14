## description: This document focuses on retrieving evaluation results logged in Langfuse using the fetch_scores. category: Examples

---

# Fetching Scores from Langfuse

Example: Using UpTrain and Ragas for Model Evaluation and Retrieving Metrics from Langfuse
Langfuse makes it easy to log and retrieve model evaluation metrics, helping users analyze and compare various performance measures. In this example, we'll demonstrate how UpTrain and Ragas can be used to evaluate models and retrieve specific evaluation metrics logged into Langfuse using `fetch_scores()` function and verify these metrics extracted by creating comparisons using a correlation matrix.

**fetch_scores()** provides these arguments - 
 
- `page` (*Optional[int]*): The page number of the scores to return. Defaults to None.  
- `limit` (*Optional[int]*): The maximum number of scores to return. Defaults to None.  
- `user_id` (*Optional[str]*): A user identifier. Defaults to None.  
- `name` (*Optional[str]*): The name of the scores to return. Defaults to None.  
- `from_timestamp` (*Optional[dt.datetime]*): Retrieve only scores with a timestamp on or after this datetime. Defaults to None.  
- `to_timestamp` (*Optional[dt.datetime]*): Retrieve only scores with a timestamp before this datetime. Defaults to None.  
- `source` (*Optional[ScoreSource]*): The source of the scores. Defaults to None.  
- `operator` (*Optional[str]*): The operator of the scores. Defaults to None.  
- `value` (*Optional[float]*): The value of the scores. Defaults to None.  
- `score_ids` (*Optional[str]*): The score identifier. Defaults to None.  
- `config_id` (*Optional[str]*): The configuration identifier. Defaults to None.  
- `data_type` (*Optional[ScoreDataType]*): The data type of the scores. Defaults to None.  
- `request_options` (*Optional[RequestOptions]*): Additional request options. Defaults to None.  

The returned data contains a list of scores along with associated metadata, which can be useful for evaluating the performance of different models or experiments. If an error occurs during the request, it raises an exception, providing insight into what went wrong.

---

### 1. Setting up the environment

Importing necessary libraries and setting up enviornment variables


```python
!pip install ragas uptrain litellm datasets rouge_score langfuse
```


```python
import os
# get keys for your project from https://cloud.langfuse.com
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_SECRET_KEY"] = ""
# your openai key
os.environ["OPENAI_API_KEY"] = ""

# Your host, defaults to https://cloud.langfuse.com
# For US data region, set to "https://us.cloud.langfuse.com"
os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com"
```

### 2. Getting the data

This section demonstrates how to load and prepare a dataset for evaluation. The "amnesty_qa" dataset is loaded using the `datasets` library, and a subset of 5 evaluation examples is selected for analysis. The selected data is then converted into a pandas DataFrame for convenient handling and processing.


```python
from datasets import load_dataset

amnesty_qa = load_dataset("explodinggradients/amnesty_qa", "english_v2")
amnesty_qa_ragas = amnesty_qa["eval"].select(range(5))
amnesty_qa_ragas.to_pandas()
```


```python
import pandas as pd
amnesty_qa_df = pd.DataFrame(amnesty_qa["eval"].select(range(5)))
```





  <div id="df-04f1b7de-180c-4f53-9721-e57f962bdcc2" class="colab-df-container">
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
      <th>ground_truth</th>
      <th>answer</th>
      <th>contexts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>What are the global implications of the USA Su...</td>
      <td>The global implications of the USA Supreme Cou...</td>
      <td>The global implications of the USA Supreme Cou...</td>
      <td>[- In 2022, the USA Supreme Court handed down ...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Which companies are the main contributors to G...</td>
      <td>According to the Carbon Majors database, the m...</td>
      <td>According to the Carbon Majors database, the m...</td>
      <td>[In recent years, there has been increasing pr...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Which private companies in the Americas are th...</td>
      <td>The largest private companies in the Americas ...</td>
      <td>According to the Carbon Majors database, the l...</td>
      <td>[The issue of greenhouse gas emissions has bec...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>What action did Amnesty International urge its...</td>
      <td>Amnesty International urged its supporters to ...</td>
      <td>Amnesty International urged its supporters to ...</td>
      <td>[In the case of the Ogoni 9, Amnesty Internati...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>What are the recommendations made by Amnesty I...</td>
      <td>The recommendations made by Amnesty Internatio...</td>
      <td>Amnesty International made several recommendat...</td>
      <td>[In recent years, Amnesty International has fo...</td>
    </tr>
  </tbody>
</table>
</div>
    <div class="colab-df-buttons">

  <div class="colab-df-container">
    <button class="colab-df-convert" onclick="convertToInteractive('df-04f1b7de-180c-4f53-9721-e57f962bdcc2')"
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
        document.querySelector('#df-04f1b7de-180c-4f53-9721-e57f962bdcc2 button.colab-df-convert');
      buttonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';

      async function convertToInteractive(key) {
        const element = document.querySelector('#df-04f1b7de-180c-4f53-9721-e57f962bdcc2');
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


<div id="df-875fe28e-6b34-41fe-a422-d94cbb7715e1">
  <button class="colab-df-quickchart" onclick="quickchart('df-875fe28e-6b34-41fe-a422-d94cbb7715e1')"
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
        document.querySelector('#df-875fe28e-6b34-41fe-a422-d94cbb7715e1 button');
      quickchartButtonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';
    })();
  </script>
</div>

  <div id="id_fc8dc59d-44a7-417f-a98b-96cc0268f88a">
    <style>
      .colab-df-generate {
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

      .colab-df-generate:hover {
        background-color: #E2EBFA;
        box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15);
        fill: #174EA6;
      }

      [theme=dark] .colab-df-generate {
        background-color: #3B4455;
        fill: #D2E3FC;
      }

      [theme=dark] .colab-df-generate:hover {
        background-color: #434B5C;
        box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
        filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
        fill: #FFFFFF;
      }
    </style>
    <button class="colab-df-generate" onclick="generateWithVariable('amnesty_qa_df')"
            title="Generate code using this dataframe."
            style="display:none;">

  <svg xmlns="http://www.w3.org/2000/svg" height="24px"viewBox="0 0 24 24"
       width="24px">
    <path d="M7,19H8.4L18.45,9,17,7.55,7,17.6ZM5,21V16.75L18.45,3.32a2,2,0,0,1,2.83,0l1.4,1.43a1.91,1.91,0,0,1,.58,1.4,1.91,1.91,0,0,1-.58,1.4L9.25,21ZM18.45,9,17,7.55Zm-12,3A5.31,5.31,0,0,0,4.9,8.1,5.31,5.31,0,0,0,1,6.5,5.31,5.31,0,0,0,4.9,4.9,5.31,5.31,0,0,0,6.5,1,5.31,5.31,0,0,0,8.1,4.9,5.31,5.31,0,0,0,12,6.5,5.46,5.46,0,0,0,6.5,12Z"/>
  </svg>
    </button>
    <script>
      (() => {
      const buttonEl =
        document.querySelector('#id_fc8dc59d-44a7-417f-a98b-96cc0268f88a button.colab-df-generate');
      buttonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';

      buttonEl.onclick = () => {
        google.colab.notebook.generateWithVariable('amnesty_qa_df');
      }
      })();
    </script>
  </div>

    </div>
  </div>





```python
amnesty_qa_df['response'] = amnesty_qa_df['answer']
amnesty_qa_df.rename(columns={'contexts':'context'}, inplace=True)
```





  <div id="df-bfcf6794-3f12-4982-80a5-d145f24c16ac" class="colab-df-container">
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
      <th>ground_truth</th>
      <th>answer</th>
      <th>context</th>
      <th>response</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>What are the global implications of the USA Su...</td>
      <td>The global implications of the USA Supreme Cou...</td>
      <td>The global implications of the USA Supreme Cou...</td>
      <td>[- In 2022, the USA Supreme Court handed down ...</td>
      <td>The global implications of the USA Supreme Cou...</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Which companies are the main contributors to G...</td>
      <td>According to the Carbon Majors database, the m...</td>
      <td>According to the Carbon Majors database, the m...</td>
      <td>[In recent years, there has been increasing pr...</td>
      <td>According to the Carbon Majors database, the m...</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Which private companies in the Americas are th...</td>
      <td>The largest private companies in the Americas ...</td>
      <td>According to the Carbon Majors database, the l...</td>
      <td>[The issue of greenhouse gas emissions has bec...</td>
      <td>According to the Carbon Majors database, the l...</td>
    </tr>
    <tr>
      <th>3</th>
      <td>What action did Amnesty International urge its...</td>
      <td>Amnesty International urged its supporters to ...</td>
      <td>Amnesty International urged its supporters to ...</td>
      <td>[In the case of the Ogoni 9, Amnesty Internati...</td>
      <td>Amnesty International urged its supporters to ...</td>
    </tr>
    <tr>
      <th>4</th>
      <td>What are the recommendations made by Amnesty I...</td>
      <td>The recommendations made by Amnesty Internatio...</td>
      <td>Amnesty International made several recommendat...</td>
      <td>[In recent years, Amnesty International has fo...</td>
      <td>Amnesty International made several recommendat...</td>
    </tr>
  </tbody>
</table>
</div>
    <div class="colab-df-buttons">

  <div class="colab-df-container">
    <button class="colab-df-convert" onclick="convertToInteractive('df-bfcf6794-3f12-4982-80a5-d145f24c16ac')"
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
        document.querySelector('#df-bfcf6794-3f12-4982-80a5-d145f24c16ac button.colab-df-convert');
      buttonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';

      async function convertToInteractive(key) {
        const element = document.querySelector('#df-bfcf6794-3f12-4982-80a5-d145f24c16ac');
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


<div id="df-ab91a2a7-65bf-4a35-9333-77adfd2a807b">
  <button class="colab-df-quickchart" onclick="quickchart('df-ab91a2a7-65bf-4a35-9333-77adfd2a807b')"
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
        document.querySelector('#df-ab91a2a7-65bf-4a35-9333-77adfd2a807b button');
      quickchartButtonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';
    })();
  </script>
</div>

  <div id="id_839f3be8-3a6c-4548-b789-5859e95545ea">
    <style>
      .colab-df-generate {
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

      .colab-df-generate:hover {
        background-color: #E2EBFA;
        box-shadow: 0px 1px 2px rgba(60, 64, 67, 0.3), 0px 1px 3px 1px rgba(60, 64, 67, 0.15);
        fill: #174EA6;
      }

      [theme=dark] .colab-df-generate {
        background-color: #3B4455;
        fill: #D2E3FC;
      }

      [theme=dark] .colab-df-generate:hover {
        background-color: #434B5C;
        box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
        filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.3));
        fill: #FFFFFF;
      }
    </style>
    <button class="colab-df-generate" onclick="generateWithVariable('amnesty_qa_df')"
            title="Generate code using this dataframe."
            style="display:none;">

  <svg xmlns="http://www.w3.org/2000/svg" height="24px"viewBox="0 0 24 24"
       width="24px">
    <path d="M7,19H8.4L18.45,9,17,7.55,7,17.6ZM5,21V16.75L18.45,3.32a2,2,0,0,1,2.83,0l1.4,1.43a1.91,1.91,0,0,1,.58,1.4,1.91,1.91,0,0,1-.58,1.4L9.25,21ZM18.45,9,17,7.55Zm-12,3A5.31,5.31,0,0,0,4.9,8.1,5.31,5.31,0,0,0,1,6.5,5.31,5.31,0,0,0,4.9,4.9,5.31,5.31,0,0,0,6.5,1,5.31,5.31,0,0,0,8.1,4.9,5.31,5.31,0,0,0,12,6.5,5.46,5.46,0,0,0,6.5,12Z"/>
  </svg>
    </button>
    <script>
      (() => {
      const buttonEl =
        document.querySelector('#id_839f3be8-3a6c-4548-b789-5859e95545ea button.colab-df-generate');
      buttonEl.style.display =
        google.colab.kernel.accessAllowed ? 'block' : 'none';

      buttonEl.onclick = () => {
        google.colab.notebook.generateWithVariable('amnesty_qa_df');
      }
      })();
    </script>
  </div>

    </div>
  </div>




### 3. Evaluation with UpTrain

This code demonstrates how to evaluate a dataset using UpTrain's `EvalLLM` class. An instance of `EvalLLM` is created using the OpenAI API key. The `evaluate` function assesses the `amnesty_qa_df` DataFrame against three evaluation criteria: context relevance, factual accuracy, and response completeness. The evaluation results are stored in a new DataFrame, which is then printed and optionally saved as a CSV file. Finally, the function is called in the main block to execute the evaluation and store the results. Refer a detailed version [here](https://langfuse.com/guides/cookbook/evaluation_with_uptrain)


```python
import os
import json
import pandas as pd
from uptrain import EvalLLM, Evals

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
eval_llm = EvalLLM(openai_api_key=OPENAI_API_KEY)

def evaluate():
    # Step 5: Evaluate data using UpTrain
    results = eval_llm.evaluate(
        data=amnesty_qa_df,
        checks=[Evals.CONTEXT_RELEVANCE, Evals.FACTUAL_ACCURACY, Evals.RESPONSE_COMPLETENESS]
    )

    # Convert the results to a DataFrame
    results_df = pd.DataFrame(results)

    # Print the DataFrame
    print(results_df)

    # Optionally, save the DataFrame to a CSV file
    results_df.to_csv('evaluation_results.csv', index=False)

    return results_df

# Call the function and store results in a DataFrame
if __name__ == "__main__":
    uptrain_df = evaluate()
```

    100%|██████████| 5/5 [00:01<00:00,  3.19it/s]
    100%|██████████| 5/5 [00:02<00:00,  2.01it/s]
    100%|██████████| 5/5 [00:06<00:00,  1.30s/it]
    100%|██████████| 5/5 [00:02<00:00,  2.25it/s]
    [32m2024-10-13 16:50:32.097[0m | [1mINFO    [0m | [36muptrain.framework.evalllm[0m:[36mevaluate[0m:[36m376[0m - [1mLocal server not running, start the server to log data and visualize in the dashboard![0m
    

                                                question  \
    0  What are the global implications of the USA Su...   
    1  Which companies are the main contributors to G...   
    2  Which private companies in the Americas are th...   
    3  What action did Amnesty International urge its...   
    4  What are the recommendations made by Amnesty I...   
    
                                            ground_truth  \
    0  The global implications of the USA Supreme Cou...   
    1  According to the Carbon Majors database, the m...   
    2  The largest private companies in the Americas ...   
    3  Amnesty International urged its supporters to ...   
    4  The recommendations made by Amnesty Internatio...   
    
                                                  answer  \
    0  The global implications of the USA Supreme Cou...   
    1  According to the Carbon Majors database, the m...   
    2  According to the Carbon Majors database, the l...   
    3  Amnesty International urged its supporters to ...   
    4  Amnesty International made several recommendat...   
    
                                                 context  \
    0  [- In 2022, the USA Supreme Court handed down ...   
    1  [In recent years, there has been increasing pr...   
    2  [The issue of greenhouse gas emissions has bec...   
    3  [In the case of the Ogoni 9, Amnesty Internati...   
    4  [In recent years, Amnesty International has fo...   
    
                                                response  score_context_relevance  \
    0  The global implications of the USA Supreme Cou...                      1.0   
    1  According to the Carbon Majors database, the m...                      1.0   
    2  According to the Carbon Majors database, the l...                      1.0   
    3  Amnesty International urged its supporters to ...                      1.0   
    4  Amnesty International made several recommendat...                      1.0   
    
                           explanation_context_relevance  score_factual_accuracy  \
    0  {\n    "Reasoning": "The extracted context con...                     1.0   
    1  {\n    "Reasoning": "The given context provide...                     0.6   
    2  {\n    "Reasoning": "The extracted context pro...                     0.4   
    3  {\n    "Reasoning": "The given context contain...                     0.8   
    4  {\n    "Reasoning": "The extracted context con...                     0.6   
    
                            explanation_factual_accuracy  \
    0  {\n    "Result": [\n        {\n            "Fa...   
    1  {\n    "Result": [\n        {\n            "Fa...   
    2  {\n    "Result": [\n        {\n            "Fa...   
    3  {\n    "Result": [\n        {\n            "Fa...   
    4  {\n    "Result": [\n        {\n            "Fa...   
    
       score_response_completeness  \
    0                          1.0   
    1                          1.0   
    2                          1.0   
    3                          1.0   
    4                          1.0   
    
                       explanation_response_completeness  
    0  {\n    "Reasoning": "The given response is com...  
    1  {\n    "Reasoning": "The given response is com...  
    2  {\n    "Reasoning": "The given response is com...  
    3  {\n    "Reasoning": "The given response is com...  
    4  {\n    "Reasoning": "The given response is com...  
    

### 4. Evaluation with Ragas

The `evaluate` function is called with the selected evaluation data and a list of metrics, including context precision, faithfulness, and answer relevancy. The results from the evaluation are then converted into a Pandas DataFrame for easier analysis. This approach enables users to assess the quality of model responses based on specific criteria. For more detailed information on evaluating RAG models with Ragas visit [here](https://langfuse.com/guides/cookbook/evaluation_of_rag_with_ragas).


```python
import json
from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,
    faithfulness,
    context_precision,
)

ragas_result = evaluate(
    amnesty_qa["eval"].select(range(5)),
    metrics=[
        context_precision,
        faithfulness,
        answer_relevancy,
    ],
)

ragas_df = ragas_result.to_pandas()
```

### 5. Setting Up Langfuse Client

This code snippet initializes a Langfuse client using the `Langfuse` class. The client is configured with a secret key, public key, and host URL, which are retrieved from the environment variables. This setup allows users to interact with the Langfuse API for logging and analyzing model evaluation metrics seamlessly.


```python
from langfuse import Langfuse
langfuse_client = Langfuse(
    secret_key=os.environ.get("LANGFUSE_SECRET_KEY"),
    public_key=os.environ.get("LANGFUSE_PUBLIC_KEY"),
    host = os.environ.get("LANGFUSE_HOST")
)
```

### 6. Logging Evaluation Scores to Langfuse

The functions `log_uptrain_scores_to_langfuse` and `log_ragas_scores_to_langfuse` log evaluation scores from the UpTrain and Ragas frameworks into Langfuse. Each function iterates through its respective DataFrame, extracting relevant score columns and logging them with `langfuse_client.score`, using a unique ID for each entry.

Scores in Langfuse are objects for storing evaluation metrics, linked to traces and optional observations. Each score can include attributes such as name, value, trace ID, and configuration ID to ensure they comply with a specified schema. This structured approach enables effective analysis of evaluation metrics within the Langfuse platform. 

#### Key Attributes of a Score Object:
- **name**: Name of the score (e.g., user_feedback).
- **value**: Numeric value of the score.
- **traceId**: ID of the related trace.
- **id**: Unique identifier for the score.

Using scores effectively allows for quick overviews of evaluations, segmentation of traces by quality, and detailed reporting across use cases. Score schemas can be defined to standardize metrics for consistency and comparability in analysis.


```python
def log_uptrain_scores_to_langfuse(uptrain_df):
    """Log evaluation scores to Langfuse."""
    score_columns = ['score_factual_accuracy', 'score_context_relevance', 'score_response_completeness']
    for index, row in uptrain_df.iterrows():
        for score_name in score_columns:
            score_value = row[score_name]
            langfuse_client.score(id=f"Uptrain_{index}_{score_name}", value=score_value, name=score_name)
```


```python
def log_ragas_scores_to_langfuse(ragas_df):
  score_columns = ['context_precision', 'faithfulness', 'answer_relevancy']

  for index, row in ragas_df.iterrows():
      for score_name in score_columns:
          score_value = row[score_name]
          langfuse_client.score(id=f"Ragas_{index}_{score_name}", value=score_value, name=score_name)
```


```python
log_ragas_scores_to_langfuse(ragas_df)
log_uptrain_scores_to_langfuse(uptrain_df)
```

### 7. Fetching Scores from Langfuse

The `fetch_scores_from_langfuse` function retrieves evaluation scores from Langfuse based on the specified score name. It utilizes the `fetch_scores` method from the Langfuse client to obtain a comprehensive list of scores that have been logged in the system. This function is particularly useful for users who want to analyze specific evaluation metrics associated with their models or applications.

By using the `fetch_scores` method, the function provides flexibility through various optional parameters that allow users to filter the retrieved scores according to their needs. For instance, users can specify pagination options such as the page number and the limit on the number of scores returned, making it easier to handle large datasets without overwhelming the interface.

In addition to pagination, the function supports filtering scores by criteria like user identifiers, timestamps, and score sources. This means users can fetch scores that were recorded by specific users or during a certain time frame, allowing for a more focused analysis. Users can also filter scores based on their values or specific configurations, ensuring that the retrieved data aligns with the evaluation metrics of interest.

The result of this function is a `FetchScoresResponse`, which includes not only the list of scores but also metadata about the scores retrieved. This allows users to quickly gain insights into the evaluation metrics relevant to their projects and make informed decisions based on the data. Overall, this function enhances the usability of Langfuse by simplifying the process of accessing and analyzing evaluation scores.


```python
def fetch_scores_from_langfuse(score_name):
    """Fetch scores from Langfuse based on score name."""
    # Fetch scores for the specified name from Langfuse
    scores_fetched = langfuse_client.fetch_scores(name=score_name)
    return scores_fetched
```


```python
score_columns = [ 'score_context_relevance', 'score_factual_accuracy', 'score_response_completeness', 'context_precision', 'faithfulness', 'answer_relevancy']

scores_df = pd.DataFrame(columns=score_columns)

for score_name in score_columns:
    fetch_scores = fetch_scores_from_langfuse(score_name)
    print(fetch_scores.data)
    scores_df[score_name] = [score.value for score in fetch_scores.data[::-1]]
```

    [Score_Numeric(value=1.0, id='Uptrain_4_score_context_relevance', trace_id='95ad7bdd-b93b-4905-a865-938f346871bd', name='score_context_relevance', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 177000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 177000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 177000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_3_score_context_relevance', trace_id='f9b43538-77b6-478f-a5d9-c2be3b4cdada', name='score_context_relevance', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 897000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 897000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 897000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_2_score_context_relevance', trace_id='02185905-be84-41d9-9b64-b02fb45704f3', name='score_context_relevance', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 614000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 614000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 614000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_1_score_context_relevance', trace_id='b68fc2e6-e6a0-489b-becc-5441d9f1dd4e', name='score_context_relevance', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 326000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 326000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 326000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_0_score_context_relevance', trace_id='75bd20ac-3a34-4fa0-b74a-0fb7a454bfa1', name='score_context_relevance', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 46000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 46000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 46000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8')]
    [Score_Numeric(value=0.6, id='Uptrain_4_score_factual_accuracy', trace_id='e5ad0a8e-3c20-4dc8-ba19-1f11f224ebbf', name='score_factual_accuracy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 84000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 84000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 84000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.8, id='Uptrain_3_score_factual_accuracy', trace_id='2ed536e7-a583-401c-b3e9-1227985875c1', name='score_factual_accuracy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 804000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 804000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 804000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.4, id='Uptrain_2_score_factual_accuracy', trace_id='8552536a-70ae-4678-a789-c0af61d3a436', name='score_factual_accuracy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 517000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 517000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 517000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.6, id='Uptrain_1_score_factual_accuracy', trace_id='812d7ae7-f2bf-4251-9784-9ee248b469d7', name='score_factual_accuracy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 231000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 231000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 231000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_0_score_factual_accuracy', trace_id='f4135b5b-d20a-4741-b777-186d37d1fa52', name='score_factual_accuracy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 23, 954000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 23, 954000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 23, 954000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8')]
    [Score_Numeric(value=1.0, id='Uptrain_4_score_response_completeness', trace_id='1a54b4e2-3e2c-4235-801b-b56153c8e293', name='score_response_completeness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 271000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 271000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 271000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_3_score_response_completeness', trace_id='ce78dce7-f4bd-45a4-b69c-f31fd6258565', name='score_response_completeness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 990000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 990000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 990000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_2_score_response_completeness', trace_id='103927f0-dd9f-4d94-95d6-a4a6fce3898d', name='score_response_completeness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 709000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 709000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 709000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_1_score_response_completeness', trace_id='6e7ae4f6-aca0-4152-b299-5b1ae06bd7e9', name='score_response_completeness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 423000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 423000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 423000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Uptrain_0_score_response_completeness', trace_id='3c100175-8e20-4d1f-ab1b-a7e4dc870cac', name='score_response_completeness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 138000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 138000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 138000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8')]
    [Score_Numeric(value=0.9999999999666667, id='Ragas_4_context_precision', trace_id='1441c394-fc54-42f3-a798-7ab1b338748c', name='context_precision', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 207000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 207000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 207000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.99999999995, id='Ragas_3_context_precision', trace_id='a91146c0-09d4-4039-828d-adf308d09dd8', name='context_precision', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 927000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 927000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 927000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.8333333332916666, id='Ragas_2_context_precision', trace_id='16bf0af8-b988-44d0-a9c5-35a0ffa69ffd', name='context_precision', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 643000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 643000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 643000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.9999999999666667, id='Ragas_1_context_precision', trace_id='976e6974-f6d7-4ff0-b961-5653ae58e9ef', name='context_precision', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 310000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 310000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 310000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.9999999999666667, id='Ragas_0_context_precision', trace_id='4e0edb60-c6b1-452d-ae58-ce7449dc3f47', name='context_precision', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 23, 798000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 23, 798000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 23, 798000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8')]
    [Score_Numeric(value=0.1428571428571428, id='Ragas_4_faithfulness', trace_id='8c3f995f-bc00-4935-90e5-069478987ce3', name='faithfulness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 300000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 300000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 300000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.2, id='Ragas_3_faithfulness', trace_id='424fddad-f617-491a-9816-d9642f33d0e6', name='faithfulness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 19000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 19000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 19000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.0, id='Ragas_2_faithfulness', trace_id='c7b7e4a1-ab80-4951-ae16-293265970dc3', name='faithfulness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 740000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 740000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 740000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.12, id='Ragas_1_faithfulness', trace_id='77a2d6ae-b840-454f-b4e3-52edb8909bcb', name='faithfulness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 456000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 456000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 456000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Ragas_0_faithfulness', trace_id='8f61a293-836f-4cc9-84f9-996c19c42620', name='faithfulness', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 23, 894000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 23, 894000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 23, 894000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8')]
    [Score_Numeric(value=0.9891308706741455, id='Ragas_4_answer_relevancy', trace_id='21a3c662-a494-4029-b95a-8fd25f90a8c6', name='answer_relevancy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 398000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 398000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 398000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.9795341682836177, id='Ragas_3_answer_relevancy', trace_id='f398dd78-ccdd-423c-9662-92ff548183e7', name='answer_relevancy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 25, 114000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 114000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 25, 114000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.9916994382653276, id='Ragas_2_answer_relevancy', trace_id='65d48c73-2fbd-4577-bec9-7a46858e0a6a', name='answer_relevancy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 834000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 834000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 834000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=0.9652149513821247, id='Ragas_1_answer_relevancy', trace_id='116c5ac3-7931-471b-83eb-da6c91725621', name='answer_relevancy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 550000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 550000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 550000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8'), Score_Numeric(value=1.0, id='Ragas_0_answer_relevancy', trace_id='e7642418-7f1f-4c4f-8480-06dd8c276fbd', name='answer_relevancy', source=<ScoreSource.API: 'API'>, observation_id=None, timestamp=datetime.datetime(2024, 10, 13, 16, 59, 24, 59000, tzinfo=datetime.timezone.utc), created_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 59000, tzinfo=datetime.timezone.utc), updated_at=datetime.datetime(2024, 10, 13, 16, 59, 24, 59000, tzinfo=datetime.timezone.utc), author_user_id=None, comment=None, config_id=None, data_type='NUMERIC', stringValue=None, trace={'userId': None}, projectId='cm1vkhmj40jxlhaue9mntmwk8')]
    

### 8. Creating a Correlation Heatmap

This section illustrates how to visualize the correlation between evaluation scores using a heatmap. The code calculates the correlation matrix for two sets of scores: UpTrain scores (`'score_context_relevance'`, `'score_factual_accuracy'`, and `'score_response_completeness'`) and RAGAS scores (`'context_precision'`, `'faithfulness'`, and `'answer_relevancy'`).

1. **Calculate the Correlation Matrix**: The `corr()` function computes correlation coefficients between specified score columns in the `scores_df` DataFrame, indicating the strength and direction of relationships.

2. **Create and Customize the Heatmap**: A heatmap is generated using Matplotlib and Seaborn, displaying correlation coefficients with colors ranging from blue (negative) to red (positive). The layout is adjusted for clarity.

This visualization helps identify patterns in the evaluation metrics, aiding in the analysis of `fetch_scores()` performance.


```python
import matplotlib.pyplot as plt
import seaborn as sns

corr_matrix = scores_df.corr()

# Create a heatmap of the correlation matrix
plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, vmin=-1, vmax=1, center=0, linewidths=.5, linecolor='white', cmap='crest')
plt.title('Correlation Matrix of Six Scores')
plt.tight_layout()
```


    
![png](/public/images/cookbook/example_usage_of_fetch_scores_files/example_usage_of_fetch_scores_23_0.png)
    


![%7B283F9496-4034-464B-9F93-DEA587D37A5B%7D.png](/public/images/cookbook/example_usage_of_fetch_scores_files/example_fetch_scores_langfuse.png)


```python

```
