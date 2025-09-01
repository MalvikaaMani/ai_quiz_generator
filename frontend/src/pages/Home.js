import React from "react"
import { useNavigate } from "react-router-dom";
import "../styles/Home.css"

export default function Home(){

    const navigate=useNavigate();

    const handleEducator = () => {
    navigate("/educator");
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    const code = e.target.sessionCode.value.trim();
    if (code) {
      navigate(`/student-lobby/${code}`);
    }
  };

    return(
        <div className="container">
            <header className="page--header">
                <h1 className="page--heading"> ⚡ Quizify AI ⚡</h1>
                <p className="page--text"> AI-powered real-time quizzes that make learning FUN 🎉✨</p>
            </header>

            <div className="home--actions">
                <button className="btn educator-btn" onClick={handleEducator}>Educator Dashboard🎓</button>

                <form className="form--action" onSubmit={handleJoinSession}>
                    <input type="text" placeholder="Join Session" name="sessionCode" className="session--input" />
                    <button type="submit" className="btn join-btn"> Join Session </button>
                </form>

            </div>

            <section className="how-it-works">
                <h2>✨ How It Works?</h2>
                <div className="steps">
                    <div className="step">👩‍🏫 Educator generates quiz in seconds</div>
                    <div className="step">🔑 Students join using session code</div>
                    <div className="step">🎯 Play, Learn, Compete, and Get Scores!</div>
                </div>
            </section>

            

        </div>
    );
}