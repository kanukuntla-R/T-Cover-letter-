import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployerInputPage from './pages/EmployerInputPage';
import EvaluationPage from './pages/EvaluationPage';
// import ThirdPage from './pages/ThirdPage'; // (Add this later)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EmployerInputPage />} />
        <Route path="/evaluate/:applicantId" element={<EvaluationPage />} />
        {/* <Route path="/results" element={<ThirdPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
 