# app/services/session_manager.py
from fastapi import WebSocket
from typing import Dict, List
from app.database import session_collection
import json

class SessionManager:
    def __init__(self):
        self.active_sessions: Dict[str, List[WebSocket]] = {}
        self.session_state: Dict[str, str] = {}

    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_sessions.setdefault(session_id, [])

        # Fetch or create session in DB
        session = await session_collection.find_one({"session_code": session_id})
        if not session:
            await session_collection.insert_one({"session_code": session_id, "started": False})
            self.session_state[session_id] = "waiting"
        else:
            self.session_state[session_id] = "started" if session.get("started") else "waiting"

        self.active_sessions[session_id].append(websocket)
        await websocket.send_text(json.dumps({"message": self.session_state[session_id]}))

    def disconnect(self, session_id: str, websocket: WebSocket):
        if session_id in self.active_sessions and websocket in self.active_sessions[session_id]:
            self.active_sessions[session_id].remove(websocket)
            if not self.active_sessions[session_id]:
                del self.active_sessions[session_id]
                del self.session_state[session_id]

    async def broadcast(self, session_id: str, message: str):
        if session_id in self.active_sessions:
            self.session_state[session_id] = message
            for ws in self.active_sessions[session_id]:
                await ws.send_text(message)
