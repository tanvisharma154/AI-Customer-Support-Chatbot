
import os
import shutil
import uuid
from pathlib import Path

from database import Base, engine, SessionLocal
from models import Feedback

from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import ollama

from rag.rag_pipeline import index_pdf, retrieve_context
from rag.vector_store import collection


# =========================
# Database
# =========================

Base.metadata.create_all(bind=engine)


# =========================
# FastAPI
# =========================

app = FastAPI()


# =========================
# Automatically index default PDF
# =========================

@app.on_event("startup")
def startup_event():

    pdf_path = "documents/customer_support_policy.pdf"

    if os.path.exists(pdf_path):

        if collection.count() == 0:

            print("📄 Indexing default customer support PDF...")

            index_pdf(pdf_path)

            print("✅ Default PDF indexed successfully!")

        else:

            print("✅ Knowledge base already exists.")

    else:

        print("⚠️ Default PDF not found.")


# =========================
# React CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Request Models
# =========================

class ChatRequest(BaseModel):
    message: str


class FeedbackRequest(BaseModel):
    question: str
    answer: str
    rating: str


# =========================
# ADMIN LOGIN MODEL
# =========================

class AdminLoginRequest(BaseModel):
    username: str
    password: str


# =========================
# Home
# =========================

@app.get("/")
def home():

    return {
        "message": "AI Customer Support API is running"
    }


# =========================
# ADMIN LOGIN
# =========================

@app.post("/admin/login")
def admin_login(request: AdminLoginRequest):

    # Development credentials
    ADMIN_USERNAME = "admin"
    ADMIN_PASSWORD = "admin123"

    # Check credentials
    if (
        request.username == ADMIN_USERNAME
        and request.password == ADMIN_PASSWORD
    ):

        print("\n==============================")
        print("🔐 ADMIN LOGIN")
        print("Admin login successful")
        print("==============================\n")

        return {
            "success": True,
            "message": "Login successful"
        }

    # Invalid credentials
    print("\n==============================")
    print("❌ ADMIN LOGIN FAILED")
    print("==============================\n")

    raise HTTPException(
        status_code=401,
        detail="Invalid username or password"
    )


# =========================
# Upload PDF
# =========================

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    # -------------------------
    # Validate file
    # -------------------------

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    # -------------------------
    # Create documents folder
    # -------------------------

    documents_dir = Path("documents")

    documents_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    # -------------------------
    # Create safe unique filename
    # -------------------------

    original_name = Path(
        file.filename
    ).stem

    unique_name = (
        f"{original_name}_"
        f"{uuid.uuid4().hex[:8]}.pdf"
    )

    file_path = documents_dir / unique_name

    try:

        # -------------------------
        # Save uploaded PDF
        # -------------------------

        with open(
            file_path,
            "wb"
        ) as buffer:

            shutil.copyfileobj(
                file.file,
                buffer
            )

        print("\n==============================")
        print("📄 PDF UPLOAD")
        print(f"Original file: {file.filename}")
        print(f"Saved as: {file_path}")

        # -------------------------
        # Index PDF
        # -------------------------

        print("📚 Indexing PDF...")

        index_pdf(
            str(file_path)
        )

        print("✅ PDF indexed successfully!")
        print("==============================\n")

        return {
            "message": "PDF uploaded and indexed successfully",
            "filename": unique_name
        }

    except Exception as e:

        print("\n❌ PDF UPLOAD ERROR:")
        print(repr(e))
        print("==============================\n")

        # Delete incomplete file
        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )

    finally:

        await file.close()


# =========================
# Chat
# =========================

@app.post("/chat")
def chat(request: ChatRequest):

    try:

        # --------------------------------
        # 1. User question
        # --------------------------------

        print("\n==============================")
        print("USER QUESTION:")
        print(request.message)

        # --------------------------------
        # 2. Retrieve relevant context
        # --------------------------------

        context = retrieve_context(
            request.message
        )

        print("\nRETRIEVED CONTEXT:")
        print(context)

        # --------------------------------
        # 3. Create prompt for Ollama
        # --------------------------------

        prompt = f"""
You are a helpful customer support chatbot.

Answer the customer's question using ONLY
the provided company knowledge.

IMPORTANT:
- Use the provided knowledge when answering.
- Do not invent company policies.
- If the answer cannot be found in the knowledge,
  say exactly:

"I'm not sure about that. Please contact our support team."

Company Knowledge:
{context}

Customer Question:
{request.message}
"""

        # --------------------------------
        # 4. Send request to Ollama
        # --------------------------------

        response = ollama.chat(
            model="llama3.2:3b",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # --------------------------------
        # 5. Get Ollama response
        # --------------------------------

        answer = response["message"]["content"]

        print("\nOLLAMA RESPONSE:")
        print(answer)

        print("==============================\n")

        return {
            "reply": answer
        }

    # --------------------------------
    # Error handling
    # --------------------------------

    except Exception as e:

        print("\n❌ CHAT ERROR:")
        print(repr(e))

        print("==============================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Chat processing failed: {str(e)}"
        )


# =========================
# Submit Feedback
# =========================

@app.post("/feedback")
def submit_feedback(request: FeedbackRequest):

    # --------------------------------
    # Validate rating
    # --------------------------------

    if request.rating not in [
        "helpful",
        "not_helpful"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid feedback rating."
        )

    # --------------------------------
    # Create database session
    # --------------------------------

    db = SessionLocal()

    try:

        # --------------------------------
        # Create feedback object
        # --------------------------------

        feedback = Feedback(
            question=request.question,
            answer=request.answer,
            rating=request.rating
        )

        # --------------------------------
        # Save to database
        # --------------------------------

        db.add(feedback)

        db.commit()

        db.refresh(feedback)

        print("\n==============================")
        print("📝 FEEDBACK RECEIVED")
        print(f"Question: {request.question}")
        print(f"Rating: {request.rating}")
        print(f"Feedback ID: {feedback.id}")
        print("==============================\n")

        return {
            "message": "Feedback submitted successfully",
            "feedback_id": feedback.id
        }

    except Exception as e:

        db.rollback()

        print("\n❌ FEEDBACK ERROR:")
        print(repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Feedback submission failed: {str(e)}"
        )

    finally:

        db.close()


# ==========================================================
# ADMIN - GET ALL FEEDBACK
# ==========================================================

@app.get("/admin/feedback")
def get_all_feedback():

    db = SessionLocal()

    try:

        feedback_list = (
            db.query(Feedback)
            .order_by(Feedback.created_at.desc())
            .all()
        )

        return {
            "feedback": [
                {
                    "id": item.id,
                    "question": item.question,
                    "answer": item.answer,
                    "rating": item.rating,
                    "created_at": item.created_at
                }
                for item in feedback_list
            ]
        }

    except Exception as e:

        print("\n❌ GET FEEDBACK ERROR:")
        print(repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Unable to fetch feedback: {str(e)}"
        )

    finally:

        db.close()


# ==========================================================
# ADMIN - FEEDBACK STATISTICS
# ==========================================================

@app.get("/admin/feedback/stats")
def get_feedback_stats():

    db = SessionLocal()

    try:

        # Total feedback
        total = (
            db.query(Feedback)
            .count()
        )

        # Helpful feedback
        helpful = (
            db.query(Feedback)
            .filter(
                Feedback.rating == "helpful"
            )
            .count()
        )

        # Not helpful feedback
        not_helpful = (
            db.query(Feedback)
            .filter(
                Feedback.rating == "not_helpful"
            )
            .count()
        )

        # Satisfaction percentage
        satisfaction = (
            round(
                (helpful / total) * 100,
                2
            )
            if total > 0
            else 0
        )

        print("\n==============================")
        print("📊 FEEDBACK STATISTICS")
        print(f"Total: {total}")
        print(f"Helpful: {helpful}")
        print(f"Not Helpful: {not_helpful}")
        print(f"Satisfaction: {satisfaction}%")
        print("==============================\n")

        return {
            "total": total,
            "helpful": helpful,
            "not_helpful": not_helpful,
            "satisfaction": satisfaction
        }

    except Exception as e:

        print("\n❌ FEEDBACK STATS ERROR:")
        print(repr(e))

        raise HTTPException(
            status_code=500,
            detail=f"Unable to calculate feedback statistics: {str(e)}"
        )

    finally:

        db.close()
