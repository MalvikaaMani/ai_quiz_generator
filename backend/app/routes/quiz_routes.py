# app/routes/quiz_routes.py
from fastapi import APIRouter, HTTPException
from app.models import QuizPrompt, Quiz
from app.database import quiz_collection
from app.services.gemini_service import generate_quiz_from_prompt
from bson import ObjectId
from app.database import session_collection

router = APIRouter()

@router.post("/generate_quiz")
async def generate_quiz(prompt: QuizPrompt):
    # Call Gemini service with prompt, num_questions, and difficulty
    questions = generate_quiz_from_prompt(
        prompt.prompt,
        num_questions=prompt.num_questions,
        difficulty=prompt.difficulty
    )

    quiz_data = {
        "educator": "Educator1",
        "topic": prompt.prompt,
        "difficulty": prompt.difficulty,
        "num_questions": prompt.num_questions,
        "questions": questions  # ✅ should be structured list, not raw text
    }

    result = await quiz_collection.insert_one(quiz_data)
    quiz_data["id"] = str(result.inserted_id)  # Convert ObjectId to string
    
    await session_collection.update_one(
        {"session_code":prompt.session_code},
        {"$set":{"quiz":questions}}
    )

    return {"message": "Quiz created successfully", "quiz": quiz_data,"session_code":prompt.session_code}

@router.get("/quiz/{session_code}")
async def get_quiz(session_code: str):
    session = await session_collection.find_one({"session_code": session_code})
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Ensure quiz is generated
    if "quiz" not in session:
        raise HTTPException(status_code=404, detail="Quiz not generated yet")
    
    # return {"questions": session["quiz"]}
    return session["quiz"]
