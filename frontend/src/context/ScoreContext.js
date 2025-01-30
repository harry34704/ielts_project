import React, { createContext, useState, useContext } from 'react';

const ScoreContext = createContext();

export const ScoreProvider = ({ children }) => {
  const [scores, setScores] = useState({
    reading: [],
    writing: [],
    speaking: []
  });

  const addScore = (type, score) => {
    setScores(prevScores => ({
      ...prevScores,
      [type]: [...prevScores[type], { score, date: new Date() }]
    }));
  };

  const clearScores = () => {
    setScores({
      reading: [],
      writing: [],
      speaking: []
    });
  };

  return (
    <ScoreContext.Provider value={{ scores, addScore, clearScores }}>
      {children}
    </ScoreContext.Provider>
  );
};

export const useScore = () => {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScore must be used within a ScoreProvider');
  }
  return context;
};

export default ScoreContext; 