import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleError = (error) => {
    console.error(error);
    setError(error.message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <AppContext.Provider 
      value={{ 
        loading, 
        setLoading, 
        error, 
        setError,
        notification,
        showNotification,
        handleError
      }}
    >
      {children}
    </AppContext.Provider>
  );
}; 