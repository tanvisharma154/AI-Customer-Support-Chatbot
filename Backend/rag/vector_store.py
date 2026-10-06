import chromadb
import uuid

client = chromadb.PersistentClient(
    path="./chroma_db"
)

collection = client.get_or_create_collection(
    name="customer_support"
)


def add_documents(chunks, embeddings):
    ids = [
        str(uuid.uuid4())
        for _ in chunks
    ]

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings
    )


def search_documents(query_embedding, n_results=3):

    count = collection.count()

    if count == 0:
        return []

    n_results = min(n_results, count)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=n_results
    )

    return results["documents"][0]