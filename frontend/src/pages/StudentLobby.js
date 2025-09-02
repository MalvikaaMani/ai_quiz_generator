import React, { useEffect, useRef, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";  // ✅ import useParams
import "../styles/StudentLobby.css";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL



export default function StudentLobby() {
  const { sessionCode } = useParams();   // ✅ get from URL params
  const navigate=useNavigate();
  const [status, setStatus] = useState("connecting");
  const wsRef = useRef(null);

  const wsProtocol = API_BASE_URL.startsWith("https") ? "wss" : "ws";
  const wsHost = API_BASE_URL.replace(/^https?:\/\//, "");
  const wsUrl = `${wsProtocol}://${wsHost}/ws/${encodeURIComponent(sessionCode)}`;
  useEffect(() => {
    console.log("StudentLobby mounted with sessionCode:", sessionCode);
    console.log("Connecting to:", wsUrl);

    if (!sessionCode) {
      setStatus("invalid");
      return;
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus("waiting");
    };

    ws.onmessage = (event) => {
      let msg = event.data;
      try {
        const parsed = JSON.parse(event.data);
        if (parsed && typeof parsed.message !== "undefined") {
          msg = parsed.message;
        }
      } catch {
        // keep raw message if not JSON
      }

      const normalized =
        typeof msg === "string" ? msg.trim().toLowerCase() : "";

      if (normalized === "quiz_started" || normalized === "started") {
        setStatus("started");
        setTimeout(() => {
          navigate(`/quiz/${encodeURIComponent(sessionCode)}`);
        }, 1200);
      } else if (normalized === "waiting") {
        setStatus("waiting");
      } else {
        setStatus(String(msg || "waiting"));
      }
    };

    ws.onclose = () => {
      setStatus("disconnected");
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {}
    };

    return () => {
      if (wsRef.current && wsRef.current.readyState <= 1) {
        wsRef.current.close();
      }
    };
    // eslint-disable-next-line
  }, [wsUrl, sessionCode]);

  const prettyStatus =
    status === "connecting"
      ? "Connecting…"
      : status === "waiting"
      ? "Waiting for the educator to start…"
      : status === "started"
      ? "🎉 Quiz started! Taking you in…"
      : status === "disconnected"
      ? "⚠️ Disconnected. Please refresh."
      : status === "invalid"
      ? "❌ Invalid session code."
      : status;

  return (
    <div className="lobby-container">
      <div className="float float-a" />
      <div className="float float-b" />
      <div className="float float-c" />

      <div className="lobby-card">
        <h1 className="lobby-title">🚀 Student Lobby</h1>

        <div className="session-code">
          Session Code: <b>{sessionCode || "N/A"}</b>
        </div>

        <div className="spinner" aria-hidden="true" />

        <p
          className={`lobby-status ${
            status === "started" ? "status-started" : "status-waiting"
          }`}
        >
          {prettyStatus}
        </p>

        {status !== "started" && status !== "invalid" && (
          <div className="tip-bubble">
            ⏳ You’ll auto-join when the quiz begins.
          </div>
        )}
      </div>
    </div>
  );
}
