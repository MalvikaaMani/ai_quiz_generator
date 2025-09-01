// StudentQuiz.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/StudentQuiz.css";
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function StudentQuiz() {
  const { sessionCode } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [studentName, setStudentName] = useState("");  // NEW
  const [nameSubmitted, setNameSubmitted] = useState(false); // NEW

  // Fetch quiz
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await fetch(`${API_BASE_URL}/quiz/${encodeURIComponent(sessionCode)}`);
        const data = await res.json();
        if (data && data.questions) {
            console.log("Fetched questions:", data.questions);
            setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      }
    }
    fetchQuiz();
  }, [sessionCode]);

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleSubmit = async () => {
    let tempScore = 0;

    // ✅ Loop through questions and send each answer
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const selected = answers[i] || "";

      if (selected.trim().toLowerCase() === q.answer?.trim().toLowerCase()) {
        tempScore++;
      }

      // ✅ Send each answer to backend
      await fetch(`${API_BASE_URL}/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_name: studentName,
          session_code: sessionCode,
          question: q.question,
          selected_answer: selected,
          correct_answer: q.answer,
        }),
      });
    }

    setScore(tempScore);
    setSubmitted(true);
  };

  if (!nameSubmitted) {
    return (
      <div className="quiz-container">
        <h1 className="welcome--text">Welcome to the Quiz 🎓</h1>
        <input
          type="text"
          placeholder="Enter your name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          className="name-input"
        />
        <button
          className="start-btn"
          disabled={!studentName.trim()}
          onClick={() => setNameSubmitted(true)}
        >
          Start Quiz 🚀
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">🎯 Quiz Time!</h1>
      <p className="session-tag">Session: {sessionCode}</p>
      <p className="student-tag">Student: {studentName}</p>

      {!submitted ? (
        <div className="quiz-questions">
          {Array.isArray(questions) && questions.map((q, i) => (
            <div key={i} className="question-card">
              <h2 className="question-text">
                Q{i + 1}. {q.question}
              </h2>
              <div className="options">
                {Array.isArray(q.options) && q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`option ${
                      answers[i] === opt ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleSelect(i, opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {questions.length > 0 && (
            <button className="submit-btn" onClick={handleSubmit}>
              🚀 Submit Quiz
            </button>
          )}
        </div>
      ) : (
        <div className="results-card">
          <h2 className="results-card-text">
            🎉 {studentName}, you scored {score} / {questions.length}
          </h2>
          <div className="feedback">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer;
              return (
                <div
                  key={i}
                  className={`feedback-item ${
                    correct ? "correct" : "incorrect"
                  }`}
                >
                  <p>
                    <b>Q{i + 1}:</b> {q.question}
                  </p>
                  <p>
                    Your answer: {answers[i] || "Not answered"} <br />
                    Correct answer: {q.answer}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}