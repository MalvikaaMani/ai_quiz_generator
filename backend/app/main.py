# main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import google.generativeai as genai
import json
import re
import logging
from app.database import quiz_collection,session_collection,results_collection
from app.config import GEMINI_API_KEY
from app.routes import session_routes
from app.routes import quiz_routes

# Set up logging
logging.basicConfig(level=logging.INFO)

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(model_name="gemini-2.5-flash-preview-05-20")

class QuizRequest(BaseModel):
    session_code: str
    topic: str
    num_questions: int
    
class AnswerSubmission(BaseModel):
    session_code: str
    student_name: str
    question: str
    selected_answer: str
    correct_answer: str

# FastAPI app
app = FastAPI()
app.include_router(session_routes.router)
app.include_router(quiz_routes.router)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Quiz Generator API is running!"}

@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    try:
        logging.info("Received request to generate quiz.")

        prompt = (
            "You are a quiz generation expert. "
            "Output must be ONLY valid JSON. "
            "The JSON object must look like this:\n\n"
            "{\n"
            '  "questions": [\n'
            "    {\n"
            '      "question": "string",\n'
            '      "options": ["opt1", "opt2", "opt3", "opt4"],\n'
            '      "answer": "correct_option"\n'
            "    }\n"
            "  ]\n"
            "}\n\n"
            f"Generate exactly {request.num_questions} multiple-choice questions "
            f"on the topic '{request.topic}'."
        )

        logging.info("Calling Gemini API...")
        response = model.generate_content(
            contents=[{"role": "user", "parts": [{"text": prompt}]}],
            generation_config={"response_mime_type": "application/json"},
        )
        logging.info("API call successful. Processing response.")

        # Extract text safely
        response_text = response.candidates[0].content.parts[0].text.strip()
        logging.info(f"Raw response: {response_text[:200]}...")

        # Extract JSON (grab first {...} block)
        json_match = re.search(r"\{.*\}", response_text, re.DOTALL)
        if not json_match:
            raise ValueError("No JSON found in Gemini response.")
        
        json_string = json_match.group(0)

        # Parse JSON
        quiz_data = json.loads(json_string)
        
        from app.database import session_collection
        await session_collection.update_one(
            {"session_code":request.session_code},
            {"$set":{"quiz":quiz_data,"started":False}},
            upsert=True
        )

        return {"session_code":request.session_code,"quiz":quiz_data}
        # return quiz_data

    except Exception as e:
        logging.error(f"Error while generating quiz: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/submit-answer")
async def submit_answer(submission: AnswerSubmission):
    """Store student answers in MongoDB"""
    try:
        doc = submission.dict()
        await results_collection.insert_one(doc)
        return {"message": "Answer submitted successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/results/{session_code}")
async def get_results(session_code: str):
    try:
        cursor = results_collection.find({"session_code": session_code})
        results = []
        async for doc in cursor:
            results.append({
                "student_name": doc.get("student_name", "Unknown"),
                "question": doc.get("question"),
                "selected_answer": doc.get("selected_answer"),
                "correct_answer": doc.get("correct_answer"),
            })
        return {"results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/results/{session_code}/scores")
async def get_scores(session_code: str):
    try:
        cursor = results_collection.find({"session_code": session_code})
        scores = {}
        async for doc in cursor:
            student = doc.get("student_name", "Unknown")
            if student not in scores:
                scores[student] = {"correct": 0, "total": 0}
            scores[student]["total"] += 1
            if doc.get("selected_answer") == doc.get("correct_answer"):
                scores[student]["correct"] += 1

        return {"scores": scores}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

