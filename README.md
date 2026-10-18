# AI Customer Support Chatbot

An AI-powered customer support chatbot that uses Retrieval-Augmented Generation (RAG) to answer questions based on information available in uploaded PDF documents.

The application combines a FastAPI backend, React frontend, semantic search, and a language model to provide document-based responses through a chat interface.

## Features

- **PDF Document Upload:** Upload PDF documents to create a searchable knowledge base.
- **Document Processing:** Extract text from PDFs and divide it into smaller chunks.
- **Semantic Search:** Generate text embeddings and retrieve relevant document content.
- **RAG-Based Question Answering:** Use retrieved context to generate responses to user questions.
- **AI Integration:** Use Ollama with the Llama 3.2 3B model for local response generation.
- **Feedback System:** Allow users to submit feedback on chatbot responses.
- **Admin Authentication:** Provide an admin login endpoint.
- **Feedback Dashboard APIs:** Retrieve feedback records and feedback statistics.

## Tech Stack

| Technology | Usage |
|---|---|
| Python | Backend programming |
| FastAPI | REST API development |
| React | Frontend development |
| Vite | Frontend tooling |
| Sentence Transformers | Text embedding generation |
| ChromaDB | Vector storage and similarity search |
| Ollama | Local language model runtime |
| Llama 3.2 3B | Language model |
| PyPDF | PDF text extraction |
| SQLAlchemy | Database access |
| SQLite | Feedback data storage |
| Git and GitHub | Version control |

## How It Works

1. An administrator uploads a PDF document.
2. The backend extracts text from the document.
3. The text is split into smaller chunks.
4. Sentence Transformers generates embeddings for the chunks.
5. ChromaDB stores the vectors for similarity search.
6. A user submits a question through the chatbot interface.
7. The application retrieves relevant chunks from the knowledge base.
8. The retrieved context is provided to the language model.
9. The model generates a response based on the available context.
10. Users can submit feedback on the generated responses.

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
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

*Note: This is a simplified overview. The exact files and folders may vary.*

## Prerequisites

Before running the project, install:

- Python
- Node.js and npm
- Git
- Ollama

## Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tanvisharma154/AI-Customer-Support-Chatbot.git
cd AI-Customer-Support-Chatbot
```

### 2. Configure the Backend

```bash
cd Backend
python -m venv .venv
```

Activate the virtual environment on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file inside the `Backend` directory and add the environment variables required by the application.

Do not commit secrets, passwords, or environment files to version control.

### 4. Set Up the Language Model

Install Ollama and download the model:

```bash
ollama pull llama3.2:3b
```

Make sure Ollama is running before testing AI responses.

### 5. Start the Backend

From the `Backend` directory:

```bash
uvicorn main:app --reload
```

The backend will normally be available at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 6. Start the Frontend

Open a separate terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

## API Endpoints

The following endpoints are part of the application:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Root endpoint |
| POST | `/admin/login` | Admin login |
| POST | `/upload-pdf` | Upload a PDF document |
| POST | `/chat` | Submit a chatbot question |
| POST | `/feedback` | Submit feedback |
| GET | `/admin/feedback` | Retrieve feedback records |
| GET | `/admin/feedback/stats` | Retrieve feedback statistics |

For request parameters and response formats, run the backend and open the FastAPI Swagger documentation.

## Security Notes

- Keep credentials and secrets out of source control.
- Validate uploaded documents before processing.
- Use secure authentication and environment-based configuration.
- Replace development credentials before making the application publicly accessible.
- Configure persistent storage before relying on uploaded files or stored feedback in production.

## Deployment Status

Deployment to a cloud hosting platform requires additional configuration for the frontend API URL, the language model, and persistent storage.

The local Ollama instance is not automatically accessible to a cloud-hosted backend. A cloud deployment must use a suitable hosted inference service or another securely accessible model runtime.

## Future Improvements

- Deploy the frontend and backend to cloud hosting.
- Configure persistent storage for documents and vector data.
- Improve source citations in generated answers.
- Add stronger authentication and access controls.
- Add automated tests for API endpoints and document processing.

## Author

**Tanvi Sharma**

GitHub: [tanvisharma154](https://github.com/tanvisharma154)

---

This project was built to explore document processing, semantic search, RAG pipelines, LLM integration, and full-stack application development.
