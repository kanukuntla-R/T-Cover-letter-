import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import EmployerInputPage from './pages/EmployerInputPage';
import EvaluationPage from './pages/EvaluationPage';
import CandidatesPage from './pages/CandidatesPage';
// import ThirdPage from './pages/ThirdPage'; // (Add this later)

const App = () => (
  <>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10B981',
            secondary: 'white',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#EF4444',
            secondary: 'white',
          },
        },
      }}
    />
    <Router>
      <Routes>
        <Route path="/" element={<EmployerInputPage />} />
        <Route path="/review/:applicantId" element={<EvaluationPage />} />
        <Route path="/candidates" element={<CandidatesPage />} />
        {/* <Route path="/results" element={<ThirdPage />} /> */}
      </Routes>
    </Router>
  </>
);

export default App;
