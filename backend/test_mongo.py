import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGO_URI, DB_NAME

async def test_connection():
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]

    print("Connected to DB:", db.name)

    # List collections
    collections = await db.list_collection_names()
    print("Collections:", collections)

    # Print documents in quizzes collection
    if "quizzes" in collections:
        quizzes = db.quizzes
        docs = await quizzes.find().to_list(length=10)  # get up to 10 quizzes
        print("Quizzes:", docs)

    # Print documents in sessions collection
    if "sessions" in collections:
        sessions = db.sessions
        docs = await sessions.find().to_list(length=10)
        print("Sessions:", docs)

if __name__ == "__main__":
    asyncio.run(test_connection())
