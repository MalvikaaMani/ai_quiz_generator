// src/pages/EducatorDashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EducatorDashboard.css";

export default function EducatorDashboard() {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [quiz, setQuiz] = useState(null);
  const [sessionCode, setSessionCode] = useState(
    localStorage.getItem("sessionCode") || ""
  );
  const [quizStarted, setQuizStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);

  const navigate = useNavigate();

  // ✅ Generate random session code
  const generateSessionCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return Array.from({ length: 6 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  };

  // ✅ Generate quiz
  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuiz(null);

    try {
      const code = generateSessionCode();
      setSessionCode(code);
      localStorage.setItem("sessionCode", code);

      const response = await fetch("http://127.0.0.1:8000/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_code: code,
          topic,
          num_questions: parseInt(numQuestions),
          difficulty: difficulty.toLowerCase(),
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      console.log("Quiz data:", data);

      // ✅ Normalize quiz format
      if (data.quiz && Array.isArray(data.quiz.questions)) {
        setQuiz(data.quiz);
      } else if (data.questions) {
        setQuiz(data);
      } else {
        setQuiz({ questions: [] });
      }

      // ✅ Setup WebSocket
      const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${code}`);
      ws.onopen = () => {
        console.log("✅ Educator WebSocket connected");
        ws.send(JSON.stringify({ type: "educator_joined", sessionId: code }));
        setSocket(ws);
      };
      ws.onerror = (e) => {
        console.error("❌ WebSocket error:", e);
        alert("WebSocket connection failed. Please check backend.");
      };
      ws.onclose = () => {
        console.warn("⚠️ WebSocket closed.");
        setSocket(null);
      };
      ws.onmessage = (msg) => {
        console.log("📩 Message from server:", msg.data);
      };
    } catch (err) {
      console.error(err);
      setError("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Start quiz
  const handleStartQuiz = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/start_quiz/${sessionCode}`,
        { method: "POST" }
      );

      if (!response.ok) throw new Error("Failed to start quiz");

      const result = await response.json();
      console.log("Start quiz result:", result);

      setQuizStarted(true);
      alert("✅ Quiz Started! Students will be notified.");
    } catch (err) {
      console.error("Error starting quiz:", err);
      alert("❌ Could not start quiz.");
    }
  };

  // ✅ View results
  const handleViewResults = () => {
    if (sessionCode) {
      navigate(`/results/${sessionCode}`);
    } else {
      alert("⚠️ No session found. Please generate a quiz first.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Educator Dashboard 🎓</h1>

      {/* Quiz Input Form */}
      <form className="quiz-form" onSubmit={handleGenerateQuiz}>
        <input
          type="text"
          placeholder="Enter quiz topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Number of questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          min="1"
          max="20"
          required
        />
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy 😃</option>
          <option value="medium">Medium 🤓</option>
          <option value="hard">Hard 🧐</option>
        </select>

        <button type="submit" className="generate-btn" disabled={loading}>
          {loading ? "Generating..." : "Generate Quiz ⚡"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {/* Display Quiz */}
      {quiz && (
        <div className="quiz-preview">
          <h2>Generated Quiz</h2>
          <p>
            <b>Session Code:</b>{" "}
            <span className="session-code">{sessionCode}</span>
          </p>

          <ul>
            {quiz.questions.map((q, idx) => (
              <li key={idx} className="quiz-question">
                <strong>Q{idx + 1}:</strong> {q.question}
                <ul className="options">
                  {q.options.map((opt, i) => (
                    <li key={i}>{opt}</li>
                  ))}
                </ul>
                <p className="answer">✅ Correct Answer: {q.answer}</p>
              </li>
            ))}
          </ul>

          {!quizStarted ? (
            <button onClick={handleStartQuiz} className="start-btn">
              Start Quiz 🚀
            </button>
          ) : (
            <p className="quiz-started">✅ Quiz Started!</p>
          )}

          {/* View Results Button */}
          <button onClick={handleViewResults} className="results-btn">
            View Results 📊
          </button>
        </div>
      )}
    </div>
  );
}
