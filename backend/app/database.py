# app/database.py
# from pymongo import MongoClient
# from app.config import MONGO_URI, DB_NAME
# app/database.py
# from motor.motor_asyncio import AsyncIOMotorClient

# client = None
# db = None
# session_collection = None

# async def init_db():
#     global client, db, session_collection
#     client = AsyncIOMotorClient("mongodb://localhost:27017")  # change if remote MongoDB
#     db = client["quiz_db"]
#     session_collection = db["sessions"]


# client = MongoClient(MONGO_URI)
# db = client[DB_NAME]

# quiz_collection = db["quizzes"]
# session_collection = db["sessions"]

from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DB_NAME

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

quiz_collection = db["quizzes"]
session_collection = db["sessions"]
results_collection = db["results"]

