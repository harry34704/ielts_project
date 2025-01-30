const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const api = {
  async submitSpeaking(data) {
    try {
      const response = await fetch(`${API_URL}/api/speaking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Speaking submission error:', error);
      throw error;
    }
  },

  async submitWriting(data) {
    try {
      const response = await fetch(`${API_URL}/api/writing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });
      return await response.json();
    } catch (error) {
      console.error('Writing submission error:', error);
      throw error;
    }
  }
}; 