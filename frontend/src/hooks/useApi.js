import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const useApi = () => {
  const { setLoading, handleError, showNotification } = useApp();
  const [data, setData] = useState(null);

  const callApi = async (apiFunction, successMessage) => {
    setLoading(true);
    try {
      const result = await apiFunction();
      setData(result);
      if (successMessage) {
        showNotification(successMessage);
      }
      return result;
    } catch (error) {
      handleError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, callApi };
}; 