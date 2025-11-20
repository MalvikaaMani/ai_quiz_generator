# app/services/gemini_service.py
import requests
import json
from app.config import GEMINI_API_KEY

API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent"


def generate_quiz_from_prompt(prompt: str, num_questions: int = 5, difficulty: str = "medium"):
    headers = {"Content-Type": "application/json"}
    params = {"key": GEMINI_API_KEY}

    # ✅ Ask Gemini to return STRICT JSON (no extra text)
    body = {
        "contents": [{
            "parts": [{
                "text": (
                    f"Generate {num_questions} multiple-choice questions on the topic: '{prompt}'. "
                    f"Difficulty: {difficulty}. "
                    "Return the output ONLY in valid JSON format as a list of objects, where each object has:\n"
                    "{\n"
                    "  'question': string,\n"
                    "  'options': [string, string, string, string],\n"
                    "  'answer': string\n"
                    "}\n"
                    "Do not include explanations, notes, or any text outside the JSON array."
                )
            }]
        }]
    }

    response = requests.post(API_URL, headers=headers, params=params, json=body)

    if response.status_code != 200:
        raise Exception(f"Gemini API error: {response.text}")

    data = response.json()
    text = data["candidates"][0]["content"]["parts"][0]["text"].strip()

    try:
        # ✅ Parse JSON safely
        questions = json.loads(text)
        return questions
    except Exception as e:
        # If Gemini returns extra text, fallback
        raise Exception(f"Failed to parse Gemini response as JSON. Raw response:\n{text}\nError: {str(e)}")
