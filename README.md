# AI Customer Support Chatbot
### Intelligent PDF Question Answering Powered by Retrieval-Augmented Generation (RAG)

An AI-powered customer support application that enables users to ask questions about PDF documents and receive context-aware answers using semantic search and Large Language Models (LLMs).

Built with **FastAPI, React, Sentence Transformers, ChromaDB, and Ollama**, the system transforms static documents into a searchable knowledge base, enabling efficient information retrieval through a conversational interface.

---

## Overview

The AI Customer Support Chatbot demonstrates how Retrieval-Augmented Generation (RAG) can be used to build document-grounded AI applications.

Instead of relying exclusively on a language model's pre-trained knowledge, the application retrieves relevant content from uploaded documents and uses that context to generate responses.

The project combines document processing, vector search, local LLM inference, REST API development, and a React-based user interface into a single full-stack application.

## Key Features

- **PDF Document Upload:** Upload PDF files to build a document-based knowledge base.
- **Automated Document Processing:** Extract PDF text and split it into manageable chunks.
- **Semantic Search:** Generate text embeddings and identify relevant document passages using ChromaDB.
- **Context-Aware AI Responses:** Retrieve relevant information and provide it to the language model for answer generation.
- **Local LLM Integration:** Use Ollama with the Llama 3.2 3B model for local inference.
- **Feedback Collection:** Allow users to submit feedback on chatbot responses.
- **Admin Authentication:** Provide an administrative login API.
- **Feedback Analytics APIs:** Retrieve feedback records and aggregate feedback statistics.
- **REST API Documentation:** Explore and test backend endpoints through FastAPI's interactive Swagger UI.

## System Architecture

The application follows a retrieval-augmented generation workflow.

```text
                 ┌──────────────────────┐
                 │     React Frontend    │
                 │  Chat & PDF Upload    │
                 └──────────┬───────────┘
                            │ HTTP Requests
                            ▼
                 ┌──────────────────────┐
                 │    FastAPI Backend    │
                 │   REST API Layer      │
                 └──────────┬───────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
      ┌──────────────────┐    ┌──────────────────┐
      │ PDF Processing    │    │ Feedback Storage │
      │ Text Extraction   │    │ SQLite           │
      │ Chunking          │    └──────────────────┘
      └─────────┬────────┘
                ▼
      ┌──────────────────┐
      │ Sentence         │
      │ Transformers     │
      │ Embeddings       │
      └─────────┬────────┘
                ▼
      ┌──────────────────┐
      │ ChromaDB         │
      │ Vector Search    │
      └─────────┬────────┘
                │ Relevant Context
                ▼
      ┌──────────────────┐
      │ Ollama           │
      │ Llama 3.2 3B     │
      └─────────┬────────┘
                ▼
      ┌──────────────────┐
      │ Generated Answer │
      └──────────────────┘
```

## How It Works

1. **Document ingestion:** An administrator uploads a PDF document.
2. **Text extraction:** The backend extracts readable text using PyPDF.
3. **Text chunking:** The extracted content is divided into smaller passages.
4. **Embedding generation:** Sentence Transformers converts text chunks into vector embeddings.
5. **Vector storage:** ChromaDB stores the embeddings for similarity-based retrieval.
6. **Question processing:** A user submits a question through the chat interface.
7. **Context retrieval:** The system searches the vector database for relevant passages.
8. **Answer generation:** The retrieved context is passed to the Llama 3.2 3B model through Ollama.
9. **Response delivery:** The generated answer is returned to the frontend.
10. **Feedback collection:** Users can submit feedback to help evaluate response quality.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| React | Frontend user interface |
| Vite | Frontend development and build tooling |
| Sentence Transformers | Text embedding generation |
| ChromaDB | Vector storage and semantic retrieval |
| Ollama | Local LLM runtime |
| Llama 3.2 3B | Language model for response generation |
| PyPDF | PDF text extraction |
| SQLAlchemy | Database access and ORM |
| SQLite | Feedback data storage |
| Git & GitHub | Version control and collaboration |

## Project Structure

```text
AI-Customer-Support-Chatbot/
├── Backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── rag/
│   ├── documents/
│   └── company_data.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

*Note: The structure above is a high-level overview. Additional files, configuration modules, and directories may exist in the repository.*

## Getting Started

### Prerequisites

Install the following before running the application:

- Python
- Node.js and npm
- Git
- Ollama
- Sufficient system memory and disk space for the embedding model and LLM

### 1. Clone the Repository

```bash
git clone https://github.com/tanvisharma154/AI-Customer-Support-Chatbot.git

cd AI-Customer-Support-Chatbot
```

### 2. Set Up the Backend

```bash
cd Backend

python -m venv .venv
```

Activate the virtual environment on Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the `Backend` directory if required by the application.

Add the configuration variables expected by your implementation. Keep secrets, credentials, and private configuration out of version control.

### 4. Configure Ollama

Install Ollama from the official website:

https://ollama.com/

Download the required model:

```bash
ollama pull llama3.2:3b
```

Ensure Ollama is running and the model is available before testing chatbot responses.

### 5. Start the Backend Server

From the `Backend` directory, run:

```bash
uvicorn main:app --reload
```

Backend URL:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

### 6. Start the Frontend

Open a separate terminal at the project root:

```bash
cd frontend

npm install

npm run dev
```

Open the local URL displayed by Vite, usually:

http://localhost:5173

**Important:** The frontend must be configured to send requests to the correct backend URL. Check the project's API configuration before testing.

## API Reference

The application exposes the following documented endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Root endpoint |
| POST | `/admin/login` | Admin login |
| POST | `/upload-pdf` | Upload a PDF document |
| POST | `/chat` | Submit a question to the chatbot |
| POST | `/feedback` | Submit feedback on a response |
| GET | `/admin/feedback` | Retrieve feedback records |
| GET | `/admin/feedback/stats` | Retrieve feedback statistics |

For request schemas, parameters, authentication requirements, and response formats, start the backend and visit `/docs`.

## Security and Reliability

Security and production readiness are important considerations for document-based AI applications.

Recommended safeguards include:

- Validate uploaded files and restrict accepted file types and sizes.
- Keep credentials and sensitive configuration in environment variables.
- Protect administrative endpoints with appropriate authentication and authorization.
- Avoid exposing internal errors, secrets,
