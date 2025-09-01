// EducatorResults.js
import React, { useState } from "react";
import "../styles/EducatorResult.css";

export default function EducatorResults() {
  const [sessionCode, setSessionCode] = useState("");
  const [results, setResults] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    if (!sessionCode) {
      setError("⚠️ Please enter a session code.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);
    setScores({});

    try {
      // ✅ Fetch raw results (all student answers)
      const resResults = await fetch(`http://127.0.0.1:8000/results/${sessionCode}`);
      if (!resResults.ok) throw new Error("Failed to fetch results");
      const dataResults = await resResults.json();

      // ✅ Fetch aggregated scores
      const resScores = await fetch(`http://127.0.0.1:8000/results/${sessionCode}/scores`);
      if (!resScores.ok) throw new Error("Failed to fetch scores");
      const dataScores = await resScores.json();

      setResults(dataResults.results || []);
      setScores(dataScores.scores || {});
    } catch (err) {
      console.error("❌ Error fetching results:", err);
      setError("Could not load results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="results-container">
      <h1 className="results-title">📊 Quiz Results</h1>

      {/* Input field for session code */}
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter Session Code..."
          value={sessionCode}
          onChange={(e) => setSessionCode(e.target.value)}
          className="session-input"
        />
        <button onClick={fetchResults} className="fetch-btn">
          Fetch Results
        </button>
      </div>

      {/* Loading / Error */}
      {loading && <p className="loading">Loading results...</p>}
      {error && <p className="error">{error}</p>}

      {/* Aggregated Scores */}
      {Object.keys(scores).length > 0 && (
        <div className="scores-section">
          <h2 className="scores-section-header">🏆 Student Scores</h2>
          <table className="scores-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Correct</th>
                <th>Total</th>
                <th>Score %</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(scores).map(([student, score], idx) => (
                <tr key={idx}>
                  <td>{student}</td>
                  <td>{score.correct}</td>
                  <td>{score.total}</td>
                  <td>{((score.correct / score.total) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detailed Raw Results */}
      {results.length > 0 && (
        <div className="detailed-section">
          <h2 className="detailed-section-header"> 
           📖 Detailed Answers</h2>
          <table className="results-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Question</th>
                <th>Selected Answer</th>
                <th>Correct Answer</th>
                <th>✅ Correct?</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.student_name}</td>
                  <td>{r.question}</td>
                  <td>{r.selected_answer}</td>
                  <td>{r.correct_answer}</td>
                  <td>{r.selected_answer === r.correct_answer ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
