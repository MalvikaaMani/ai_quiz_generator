// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";                 
import EducatorDashboard from "./pages/EducatorDashboard"; 
import StudentLobby from "./pages/StudentLobby"; 
import StudentQuiz from "./pages/StudentQuiz";
import EducatorResult from "./pages/EducatorResult";  // ✅ Import result page

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing page where students/educators choose */}
        <Route path="/" element={<Home />} />

        {/* Educator dashboard */}
        <Route path="/educator" element={<EducatorDashboard />} />

        {/* Educator result page */}
        <Route path="/results/:sessionCode" element={<EducatorResult />} />  {/* ✅ Added */}

        {/* Student lobby after entering session code */}
        <Route path="/student-lobby/:sessionCode" element={<StudentLobby />} />

        {/* Actual quiz page for students */}
        <Route path="/quiz/:sessionCode" element={<StudentQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
