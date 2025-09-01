# app/config.py
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")  # No default, force user to set it
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # No default, force user to set it
DB_NAME = os.getenv("DB_NAME", "quiz_master_db")  # safe default
