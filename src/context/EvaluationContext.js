import { createContext, useContext, useState, useMemo } from 'react';

const EvaluationContext = createContext();

export const EvaluationProvider = ({ children }) => {
  const [evaluation, setEvaluation] = useState(null);
  
  const contextValue = useMemo(() => ({
    evaluation,
    setEvaluation
  }), [evaluation]);
  
  return (
    <EvaluationContext.Provider value={contextValue}>
      {children}
    </EvaluationContext.Provider>
  );
};

export const useEvaluation = () => useContext(EvaluationContext);
