import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EvaluationProvider } from './context/EvaluationContext'; // ✅ correct path

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <EvaluationProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </EvaluationProvider>
);
