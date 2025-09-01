import requests

url = "http://127.0.0.1:8000/generate-quiz"
data = {
    "prompt": "History quiz",
    "num_questions": 4,
    "difficulty": "Medium"
}

response = requests.post(url, json=data)
print(response.json())
