import { useApp } from '../context/AppContext';

export const useApi = () => {
  const { setLoading, setError } = useApp();

  const callApi = async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      return result;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { callApi };
}; 