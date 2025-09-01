from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.database import session_collection
from app.services.session_manager import SessionManager
import json

router = APIRouter()
manager = SessionManager()

@router.post("/start_quiz/{session_code}")
async def start_quiz(session_code: str):
    # check if session exists in DB
    session = await session_collection.find_one({"session_code": session_code})
    if not session:
        return {"error": "Session not found"}
    
    # update DB to mark quiz started
    await session_collection.update_one(
        {"session_code": session_code},
        {"$set": {"started": True}}
    )
    
    # notify all connected clients
    await manager.broadcast(session_code, json.dumps({"message": "quiz_started"}))
    return {"status": "Quiz started"}


@router.websocket("/ws/{session_code}")
async def websocket_endpoint(websocket: WebSocket, session_code: str):
    await manager.connect(session_code, websocket)
    
    # check if already started in DB
    # session = await session_collection.find_one({"session_code": session_code})
    # if session and session.get("started"):
    #     await websocket.send_text(json.dumps({"message": "quiz_started"}))
    
    try:
        while True:
            data = await websocket.receive_text()
            # just echo for now
            await websocket.send_text(json.dumps({"message": f"Echo: {data}"}))
    except WebSocketDisconnect:
        manager.disconnect(session_code, websocket)
        print(f"Client disconnected: {session_code}")
