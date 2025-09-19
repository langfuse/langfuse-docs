# Langfuse Integration with MariaDB Vector Store Documentation

## Overview
This document describes a Python script (`main.py`) that integrates Langfuse for tracing with a MariaDB vector store using LangChain and Sentence Transformers. The script demonstrates how to:
- Initialize a Sentence Transformer model for embeddings.
- Set up Langfuse for tracing application logic.
- Configure a MariaDB vector store.
- Add documents to the vector store and perform a similarity search.
- Log results to Langfuse for observability.

## Prerequisites
To run the script, ensure the following are installed and configured:
- **Python 3.8+**
- **Dependencies**:
  - `langfuse`
  - `langchain-mariadb`
  - `langchain-community`
  - `sentence-transformers`
  - `python-dotenv`
- **MariaDB**: A running MariaDB instance with a database named `langchain`.
- **Environment Variables**:
  - Create a `.env` file in the project root with the following:
    ```
    LANGFUSE_PUBLIC_KEY=<your-langfuse-public-key>
    LANGFUSE_SECRET_KEY=<your-langfuse-secret-key>
    MARIADB_USER=<your-mariadb-username>
    MARIADB_PASSWORD=<your-mariadb-password>
    ```
- **Langfuse Account**: Sign up at [Langfuse](https://cloud.langfuse.com) to obtain `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY`.

## Installation
1. Clone the repository or copy the script to your local environment.
2. Install the required Python packages:
   ```bash
   pip install langfuse langchain-mariadb langchain-community sentence-transformers python-dotenv
   ```
3. Set up the `.env` file with your credentials.
4. Ensure MariaDB is running and accessible at `localhost` with the database `langchain` created.

## Code Structure
The script (`main.py`) is structured as follows:

### 1. Importing Dependencies
```python
import os
from langfuse import get_client
from langchain_mariadb import MariaDBStore
from sentence_transformers import SentenceTransformer
from langchain_core.documents import Document
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv
```
- `os` and `dotenv`: Load environment variables.
- `langfuse`: Provides the Langfuse SDK for tracing.
- `langchain_mariadb`: MariaDB vector store integration with LangChain.
- `sentence_transformers` and `langchain_community`: Generate embeddings using the `all-MiniLM-L6-v2` model.
- `langchain_core.documents`: Defines the `Document` class for text storage.

### 2. Loading Environment Variables
```python
load_dotenv()
```
Loads environment variables from the `.env` file for secure access to credentials.

### 3. Initializing the Sentence Transformer Model
```python
model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
```
- Uses the `all-MiniLM-L6-v2` model to generate 384-dimensional embeddings for text documents.
- The model is lightweight and optimized for semantic text similarity.

### 4. Setting Up Langfuse
```python
os.environ["LANGFUSE_PUBLIC_KEY"] = os.getenv("LANGFUSE_PUBLIC_KEY")
os.environ["LANGFUSE_SECRET_KEY"] = os.getenv("LANGFUSE_SECRET_KEY")
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com"
langfuse = get_client()
if langfuse.auth_check():
    print("Langfuse client is authenticated and ready!")
else:
    print("Authentication failed. Check your credentials.")
```
- Configures Langfuse with public and secret keys from environment variables.
- Sets the Langfuse host to the cloud instance.
- Verifies authentication with Langfuse.

### 5. Configuring the MariaDB Vector Store
```python
url = f"mariadb+mariadbconnector://{os.getenv('MARIADB_USER')}:{os.getenv('MARIADB_PASSWORD')}@localhost/langchain"
vectorstore = MariaDBStore(
    embeddings=model,
    embedding_length=384,
    datasource=url,
    collection_name="my_docs",
)
```
- Constructs a MariaDB connection string using environment variables.
- Initializes a `MariaDBStore` instance with:
  - The Sentence Transformer model for embeddings.
  - Embedding length of 384 (specific to `all-MiniLM-L6-v2`).
  - Connection to the `langchain` database.
  - A collection named `my_docs` for storing documents.

### 6. Application Logic with Langfuse Tracing
```python
with langfuse.start_as_current_span(name="mariadb-trace") as span:
    vectorstore.add_documents(
        [
            Document(page_content="The sun is a star."),
            Document(page_content="The moon is a natural satellite.")
        ]
    )
    results = vectorstore.similarity_search("Tell me about celestial bodies.")
    span.update_trace(
        metadata={"query": "Tell me about celestial bodies."}
    )
    print(f"Search results: {results}")
```
- Starts a Langfuse trace named `mariadb-trace`.
- Adds two sample documents to the vector store.
- Performs a similarity search with the query "Tell me about celestial bodies."
- Logs the query metadata to the Langfuse trace.
- Prints the search results.

### 7. Flushing Langfuse Data
```python
langfuse.flush()
```
Ensures all trace data is sent to the Langfuse server.

## Usage
1. Ensure MariaDB is running and the `langchain` database exists.
2. Populate the `.env` file with your Langfuse and MariaDB credentials.
3. Run the script:
   ```bash
   python main.py
   ```
4. Expected output:
   - Confirmation of Langfuse authentication.
   - Search results from the MariaDB vector store, e.g.:
     ```
     Langfuse client is authenticated and ready!
     Search results: [Document(page_content='The sun is a star.'), Document(page_content='The moon is a natural satellite.')]
     ```
5. Check the Langfuse dashboard (`https://cloud.langfuse.com`) for trace details under the `mariadb-trace` span.

## Notes
- **Embedding Model**: The `all-MiniLM-L6-v2` model is used for its balance of performance and efficiency. Other models can be used by changing the `model_name` parameter, but ensure the `embedding_length` matches the model's output dimension.
- **MariaDB**: Ensure the database user has appropriate permissions to create and modify tables in the `langchain` database.
- **Langfuse**: Traces are logged to the Langfuse cloud instance. Ensure your credentials are valid to avoid authentication errors.
- **Error Handling**: The script includes basic authentication checks for Langfuse. Additional error handling (e.g., for MariaDB connection failures) can be added as needed.

## Troubleshooting
- **Langfuse Authentication Failure**:
  - Verify `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` in the `.env` file.
  - Ensure the Langfuse host URL is correct.
- **MariaDB Connection Issues**:
  - Check that MariaDB is running and accessible at `localhost`.
  - Confirm the `MARIADB_USER` and `MARIADB_PASSWORD` are correct.
  - Ensure the `langchain` database exists.
- **No Search Results**:
  - Verify that documents were added successfully to the vector store.
  - Ensure the query is relevant to the stored documents.

## Future Improvements
- Add error handling for MariaDB connections and query failures.
- Support dynamic document ingestion from external sources.
- Enhance Langfuse tracing with additional metadata (e.g., search latency, result count).
- Allow configuration of the Sentence Transformer model via command-line arguments.

## License
This script is provided under the MIT License. See the repository's `LICENSE` file for details.