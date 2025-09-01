# app/models.py
from pydantic import BaseModel
from typing import List, Optional

class QuizPrompt(BaseModel):
    prompt: str
    num_questions: int      # ✅ default value so it's optional
    difficulty: str  # ✅ default value so it's optional
    session_code:str

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str

class Quiz(BaseModel):
    id: Optional[str]
    educator: str
    topic: str
    difficulty: Optional[str] = "medium"   # ✅ store difficulty
    num_questions: Optional[int] = 5       # ✅ store number of questions
    questions: List[Question]

class Session(BaseModel):
    session_id: str
    quiz_id: str
    participants: List[str] = []

