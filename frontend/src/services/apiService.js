const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const apiService = {
  async analyzeAudio(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    
    const response = await fetch(`${API_BASE_URL}/analyze-audio`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  },
  
  async getExercises() {
    const response = await fetch(`${API_BASE_URL}/exercises`);
    return response.json();
  },
  
  async submitTest(testData) {
    const response = await fetch(`${API_BASE_URL}/submit-test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    return response.json();
  },
  
  async getFeedback(recordingId) {
    const response = await fetch(`${API_BASE_URL}/feedback/${recordingId}`);
    return response.json();
  }
}; 