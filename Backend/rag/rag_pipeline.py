import os

from dotenv import load_dotenv
from openai import OpenAI

from .pdf_loader import extract_text_from_pdf
from .chunker import create_chunks
from .embeddings import create_embeddings
from .vector_store import (
    add_documents,
    search_documents,
    collection
)

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def index_pdf(pdf_path: str):

    print("Reading PDF...")

    text = extract_text_from_pdf(pdf_path)

    if not text.strip():
        raise ValueError("PDF contains no readable text.")

    print("Creating chunks...")

    chunks = create_chunks(text)

    if not chunks:
        raise ValueError("No chunks created from PDF.")

    print(f"Created {len(chunks)} chunks")

    print("Creating local embeddings...")

    embeddings = create_embeddings(chunks)

    print("Saving to vector database...")

    add_documents(
        chunks,
        embeddings
    )

    print("PDF indexed successfully!")


def retrieve_context(question: str):

    if collection.count() == 0:
        return ""

    print("Creating query embedding...")

    # Local embedding instead of OpenAI
    query_embedding = create_embeddings([question])[0]

    documents = search_documents(
        query_embedding,
        n_results=3
    )

    return "\n\n".join(documents)